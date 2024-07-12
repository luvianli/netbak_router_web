import React from 'react';
import { message } from "antd";

export let deepCopy = (obj) => {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}


/**判断是否已经存在此端口段,list必须有port1，port2字段*/
export function portRangeisExist(list, startport, endport) {
    startport = Number(startport)
    endport = Number(endport)
    if (list === '' || list.length === 0) {
        return true
    } else {
        return list.every(item => {
            let itemfrom = Number(item.port1)
            let itemto = Number(item.port2)
            if ((startport >= itemfrom && startport <= itemto) ||
                (endport >= itemfrom && endport <= itemto) ||
                (startport <= itemfrom && endport >= itemto)) {
                message.error(window.__('Port Ranage Conflict!'));
                //message.error(`与端口段${itemfrom}-${itemto}冲突！`)
                return false;
            }
            return true
        })
    }
}

/**判断是否已经存在此IP段，list 必须有 ipstart，ipend字段    */
export function ipRangeisExist(list, startip, endip) {
    let intstartip = ipToNumber(startip)
    let intendip = ipToNumber(endip)
    let flag = true;
    if (intstartip > intendip) {
        message.error(window.__("Start IP Cannot Be Greater Than End IP!"))
        return false
    }
    if (list === '' || list.length === 0) {
        return true
    } else {
        return list.every(item => {
            let itemstartip = ipToNumber(item.ip_start)
            let itemendip = ipToNumber(item.ip_end)
            if ((intstartip >= itemstartip && intstartip <= itemendip) ||
                (intendip >= itemstartip && intendip <= itemendip) ||
                (intstartip <= itemstartip && intendip >= itemendip)) {
                message.error(window.__("IP Ranage Conflict!"))
                return false;
            }
            return true
        })
    }
}
//255.255.255.255/24;255.255.255.255/24;255.255.255.255/24;
export function IPstrToArr(str) {
    if (!str) {
        return [];
    }
    let arr = str.split(';');
    let tmpArr = [];
    for (let i = 0; i < arr.length; i++) {
        let tempObj = {};
        if (!arr[i]) {
            continue;
        }
        let tmp = arr[i].split('/');
        tempObj.target = tmp[0];
        tempObj.netmask = bitToNetmask(tmp[1]);
        tmpArr.push(tempObj)
    }
    return tmpArr;
}
export function netmaskToBit(mask) {
    //将子网掩码转为二进制，并得出二进制中1的个数就是
    if (!mask) {
        return "";
    }
    let maskNum = ipToNumber(mask);
    for (var i = 0; i < 32; i++) {
        if ((maskNum & (1 << i)) != 0) {
            break;
        }
    }
    return 32 - i;
}

export function NumberToIP(number) {
    let str = "";
    str += number >>> 24;
    str += '.';
    str += (number & 0x00FFFFFF) >>> 16;
    str += '.';
    str += (number & 0x0000FFFF) >>> 8;
    str += '.';
    str += (number & 0x000000FF);
    return str;
}
export function ipToNumber(ip) {
    var num = 0;
    if (ip === "") {
        return num;
    }
    var aNum = ip.split(".");
    if (aNum.length !== 4) {
        return num;
    }
    let multi = [256 * 256 * 256, 256 * 256, 256, 1];
    //let multi = [1,256,256*256,256*256*256];
    for (let i = 0; i < 4; i++) {
        num += Number(aNum[i]) * multi[i];
    }
    return num;
}
export function ipPoolRange(minip, maxip, startip, endip) {
    if (!minip || !maxip || !startip || !endip) {
        message.error('获取数据错误：minip/maxip不正确！')
        return false
    }
    let intminip = ipToNumber(minip)
    let intmaxip = ipToNumber(maxip)
    let intstartip = ipToNumber(startip)
    let intendip = ipToNumber(endip)
    if (intstartip > intendip) {
        message.error(window.__("Start IP Cannot Be Greater Than End IP!"))
        return false
    }
    if (intminip <= intstartip &&
        intstartip <= intendip &&
        intendip <= intmaxip) {
        return true
    }
    else {
        message.error(window.__('IP Ranage Conflict!'))
        //message.error(`IP范围只能为${minip}-${maxip}`)
        return false
    }
}
export function bitToNetmask(bit) {
    let srcNum = 0xFFFFFFFF;//ipToNumber("255.255.255.255");
    let mask = 32 - parseInt(bit);
    srcNum <<= mask;
    return NumberToIP(srcNum)

}

/**计算流量 B K M G  参数传递总流量Bytes*/
export function totalTrafficByte(value) {
    let tem = 0;
    if (value < 1024) {
        return `${value}Byte`
    } else if (value < (1024 * 1024)) {
        tem = (value / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}KByte`
    } else if (value < (1024 * 1024 * 1024)) {
        tem = (value / 1024 / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}MByte`
    } else if (value < (1024 * 1024 * 1024 * 1024)) {
        tem = (value / 1024 / 1024 / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}GByte`
    } else/* if(value < (1024*1024*1024*1024*1024))*/ {
        tem = (value / 1024 / 1024 / 1024 / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}TByte`
    }

}
/**计算速率 bps Kbps Mbps Gbps 参数传递速率bps*/
export function totalTrafficbps(value) {
    let tem = 0;
    if (value < 1024) {
        return `${value}bps`
    } else if (value < (1024 * 1024)) {
        tem = (value / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}Kbps`
    } else if (value < (1024 * 1024 * 1024)) {
        tem = (value / 1024 / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}Mbps`
    } else if (value < (1024 * 1024 * 1024 * 1024)) {
        tem = (value / 1024 / 1024 / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}Gbps`
    } else/* if(value < (1024*1024*1024*1024*1024))*/ {
        tem = (value / 1024 / 1024 / 1024 / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}Tbps`
    }
}

/**计算容量 KB MB GB TB ,value: KB*/
export function transCapacity(value) {
    let tem = 0;
    if (value < 1024) {
        return `${value}KB`
    } else if (value < (1024 * 1024)) {
        tem = (value / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}MB`
    } else if (value < (1024 * 1024 * 1024)) {
        tem = (value / 1024 / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}GB`
    } else/* if(value < (1024*1024*1024*1024*1024))*/ {
        tem = (value / 1024 / 1024 / 1024).toFixed(4)
        tem = tem.substring(0, tem.lastIndexOf('.') + 2)
        return `${tem}TB`
    }
}

/**运行时间转换 参数传入秒*/
export function transSecond(seconds) {
    let text = parseInt(seconds);
    let secondTime = parseInt(seconds);// 秒
    let minuteTime = 0;// 分
    let hourTime = 0;// 小时
    let dayTime = 0;//天
    if (text < 60) {
        secondTime = text <= 0 ? 0 : secondTime;
    }
    else if (text >= 60 && text < 3600) {//如果秒数大于1分钟，小于1小时，
        minuteTime = parseInt(text / 60);
        secondTime = parseInt(text % 60);
    }
    else if (text >= 3600 && text < 86400) {//如果秒数大于1小时，小于1天
        secondTime = parseInt(text % 60)
        minuteTime = parseInt(text / 60);
        hourTime = parseInt(minuteTime / 60);
        minuteTime = parseInt(minuteTime % 60);
    }
    else {
        secondTime = parseInt(text % 60)
        minuteTime = parseInt(text / 60);
        hourTime = parseInt(minuteTime / 60);
        dayTime = parseInt(hourTime / 24);
        hourTime = parseInt(hourTime % 24);
        minuteTime = parseInt(minuteTime % 60);
    }
    return {
        secondTime: secondTime,
        minuteTime: minuteTime,
        hourTime: hourTime,
        dayTime: dayTime,
    }
}

/**运行时间转换 参数传入秒*/
export function secondsToFormatTime_H(seconds) {
    let timeObj = transSecond(seconds);
    let { dayTime, hourTime, minuteTime, secondTime } = timeObj;
    if (dayTime == 0 && hourTime == 0 && minuteTime == 0) {
        return <span >{secondTime + window.__('Sec')}</span>
    }
    if (dayTime == 0 && hourTime == 0 && minuteTime != 0) {
        return <span >{minuteTime + window.__('Min') + secondTime + window.__('Sec')}</span>
    }
    if (dayTime == 0 && hourTime != 0) {
        return <span >{hourTime}{window.__('Hour') + minuteTime + window.__('Min') + secondTime + window.__('Sec')}</span>
    }
    if (dayTime != 0) {
        return <span >{dayTime + window.__('Day') + hourTime + window.__('Hour') + minuteTime + window.__('Min') + secondTime + window.__('Sec')}</span>
    }
}

/**将URL域名部分转为小写，其他部分不变 */
export function urldomainToLowercase(url) {
    let url_src = url;
    let prefix = url_src.indexOf("://");
    let new_url, sub1, sub2, index = 0;
    if (prefix !== -1) {
        index = url_src.indexOf("/", prefix + 3);
    } else {
        index = url_src.indexOf("/");
    }
    if (index === -1) {
        return url_src.toLowerCase()
    } else {
        sub1 = url_src.substring(0, index);
        sub2 = url_src.substring(index);
        new_url = sub1.toLowerCase() + sub2;
        return new_url;
    }
}

/**Deep compare objects*/
export function deepCompare(x, y) {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.     
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof (x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}