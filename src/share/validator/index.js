import React from 'react'

const utils = {
  testRegex: (value, regex) => value.toString().match(regex),
  rules: {
    required: {//必填
      message: 'The :attribute field is required',
      rule: val => utils.testRegex(val, /.+/),
    },
    no:{//空
      message: 'The :attribute field is not required',
      rule: val => utils.testRegex(val, /^$/),
    },
    reg: {
      message: 'The :attribute reg is not match the value',
      rule: (val, options) =>{/*console.log(new RegExp(options[0]));*/ return utils.testRegex(val,new RegExp(options[0]))}, 
    },
    range:{//范围
      message: 'The :attribute range is not match the value',
      rule: (val, options) => {
        if(val.length===0) return true;//可以为空

        var r = /(^[1-9]([0-9]*)$|^[0-9]$)/
        if(!r.test(val)) return false; //第一个字符不能为0

        let arr = options[0].split("-")
        let min = Number(arr[0]);
        let max = Number(arr[1]);
        let value = Number(val);
        return value >= min && value <= max
      },
      messageReplace: (message, options) => message.replace(':rang', options[0]),
    },
    max: {//最大值
      message: 'The :attribute may not be greater than :max characters',
      rule: (val, options) => {
        var len = 0;  
        for (var i=0; i<val.length; i++) { 
            //console.log(val,val[i],val.charCodeAt(i)) 
            if (val.charCodeAt(i)>127) {  
                 len += 3;  
             } else {  
                 len ++;  
             }  
         }         
        return len <= options[0]
      },
      messageReplace: (message, options) => message.replace(':max', options[0]),
    },
    min: {//最小值
      message: 'The :attribute may not be greater than :mix characters',
      rule: (val, options) => {
        var len = 0;  
        for (var i=0; i<val.length; i++) { 
            //console.log(val,val[i],val.charCodeAt(i)) 
            if (val.charCodeAt(i)>127) {  
                 len += 3;  
             } else {  
                 len ++;  
             }  
         }         
        return len >= options[0]
      },
      messageReplace: (message, options) => message.replace(':min', options[0]),
    },
    ipmask:{
      message: 'The :attribute may be 192.168.8.8/24;192.168.0.1/16;192.168.8.1/24',
      rule: (val, options) => {
        if(!val){
          return true;
        }
        let formotReg = /^[\d.;\/]+$/;
        let IPReg = /^$|^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/i;
        if(!formotReg.test(val)){
          return false
        }
        let ipmaskArr = val.split(';');
        for(let i = 0;i < ipmaskArr.length; i++){
          if(ipmaskArr[i]){
            let tmp = ipmaskArr[i].split("/");
            if(tmp.length > 2 || !IPReg.test(tmp[0]) || !tmp[1]){
              return false;
            }
            if(tmp[1].length < 3 && parseInt(tmp[1]) >= 1 && parseInt(tmp[1]) <= 32){
              continue;
            }else{
              return false;
            }
          }
        }
        return true;
      }
    },
    isIPv6: {//IPv6格式
      message: 'The IPv6 format is error',
      rule: (val) => {
        var patrn=/^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i;   
        var r=patrn.exec(val)
        function cLength(str){    
          var reg = /([0-9a-f]{1,4}:)|(:[0-9a-f]{1,4})/gi;            
          var temp = str.replace(reg,' ');            
          return temp.length;           
        }
        if(val==""){
          return true
        } 
        if(r){
          return true;
        }
        if(val=="::"){
          return true;
        }
        //F:F:F::1:1 F:F:F:F:F::1 F::F:F:F:F:1格式
        patrn=/^(([0-9a-f]{1,4}:){0,6})((:[0-9a-f]{1,4}){0,6})$/i; 
        r=patrn.exec(val);
        if(r){    
          var c=cLength(val);
          if(c<=7 && c>0){
            return true;
          }
        }                
        //F:F:10F::
        patrn=/^([0-9a-f]{1,4}:){1,7}:$/i; 
        r=patrn.exec(val);
        if(r){
          return true;
        }
        //::F:F:10F
        patrn=/^:(:[0-9a-f]{1,4}){1,7}$/i; 
        r=patrn.exec(val);
        if(r){
          return true;
        }
        //F:0:0:0:0:0:10.0.0.1格式
        patrn=/^([0-9a-f]{1,4}:){6}(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i; 
        r=patrn.exec(val);
        if(r){
          if(r[2]<=255 && r[3]<=255 &&r[4]<=255 && r[5]<=255 )
          return true;
        }
        //F::10.0.0.1格式
        patrn=/^([0-9a-f]{1,4}:){1,5}:(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i; 
        r=patrn.exec(val);
        if(r){
          if(r[2]<=255 && r[3]<=255 &&r[4]<=255 && r[5]<=255 )
            return true;
        }
        //::10.0.0.1格式
        patrn=/^::(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i; 
        r=patrn.exec(val);
        if(r){
          if(r[1]<=255 && r[2]<=255 &&r[3]<=255 && r[4]<=255)
            return true;
        }
        return false;
      },
    },
    url: {//url地址
      message: 'The :attribute must be a valid url', 
      rule: (val) => utils.testRegex(val,/^(?=^.{3,255}$)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+((\/)*([a-zA-Z0-9][-a-zA-Z0-9]{0,62})?)+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/)
    },
    accepted: {
      message: 'The :attribute must be a accepted', 
      rule: (val) => val === true  
    },
    mac:{//mac地址格式
      message: 'The :attribute must be a valid mac format', 
      //rule: (val) => utils.testRegex(val,/^([0-9A-F]{2})(([/\s:][0-9A-F]{2}){5})$/)  
      rule: (val) => utils.testRegex(val,/^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/i)  
    },
    netmask:{//子网掩码格式
      message: 'The :attribute must be a valid mac format', 
      rule: (val) => utils.testRegex(val,/^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(255|254|252|248|240|224|192|128|0))$/i)                              
    },
    gateway:{//网关格式
      message: 'The :attribute must be a valid mac format', //（1~255）.（0~255）.（0~255）.（0~255）
      rule: (val) => utils.testRegex(val,/^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/i)
    },
    char:{/**只能为数字或字母 ,可以为空*/
      message: 'The :attribute must be number or letter', 
      rule: (val) => { if(!val) return true; return utils.testRegex(val,/^[A-Za-z0-9]+$/)}
    },
    /*password:{
      message: 'The :只允许输入数字、英文字母和英文符号(不能输入\' \" ` \\)', 
      rule: (val) => utils.testRegex(val,/^[a-z A-Z0-9-_!@#$%^&*()-=_+/<>;?,./:~{}|\[\]]+$/)
    },*/
    password:{
      message: 'The :attribute must be a valid password format', 
      rule: (val) => utils.testRegex(val,/^$|^[\u0020-\u007f]+$/)
    },
    ascii:{/**仅支持ascii */
      message: 'The :attribute only support ascii', 
      rule: (val) => utils.testRegex(val,/^$|^[\u0020-\u007f]+$/)
    },
    /*ssid:{
      message: 'The :只能为汉字、数字、字母、下划线、横杠、空格', 
      rule: (val) => utils.testRegex(val,/^[a-z A-Z0-9-_\u4e00-\u9fa5]+$/)
    }
    ssid:{
      message: 'The :只允许输入数字、英文字母、英文符号和中文(不能输入\' \" ` \\)', 
      rule: (val) => utils.testRegex(val,/^[a-z A-Z0-9-_!@#$%^&*()-=_+/<>;?,./:~{}|\[\]\u4e00-\u9fa5]+$/)
    },*/
    ssid:{
      message: 'The :every thing', 
      rule: (val) => utils.testRegex(val,/(.*)/)
    },  
    houtais:{
      message: 'The: every thing', 
      rule: (val) => true
    },
    special:{
      message: 'The :Cannot have space!', 
      rule: (val) => utils.testRegex(val,/^[^\/\\\'#]+$/)
    },
    /*houtais:{
      message: 'The :只允许输入数字、英文字母、英文符号和中文(不能输入\' \" ` \\)', 
      rule: (val) => utils.testRegex(val,/^$|^[a-z A-Z0-9-_!@#$%^&*()-=_+/<>;?,./:~{}|\[\]\u4e00-\u9fa5]+$/)
    },*/
    notcn:{
      message: 'The :can not be chinese', 
      rule: (val) => utils.testRegex(val,/^[^\u4e00-\u9fa5]+$/)
    },
    vlanid:{
      message: 'The :vlanid 3-4094 or 0！', 
      rule: (val) => utils.testRegex(val,/^$|^(0|[3-9]|[1-9]\d|[1-9]\d\d|[1-3]\d\d\d|40[0-8]\d|409[0-4])$/)
    },
    /**下面是支持为空的格式 ， 如果不为空请用required，如 required&&ip*/
    smsnumber:{
      message: 'The :只允许输入数字和分号;', 
      rule: (val) => utils.testRegex(val,/^[0-9]+$/)
    },
    ip:{
      message: 'The :attribute must be a valid ip format', //（1~255）.（0~255）.（0~255）.（0~255）
      rule: (val) => utils.testRegex(val,/^$|^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/i)      
    },
    apnname:{      
      message: 'The: 名称不得包含下列字符： " & \' < >', 
      rule: (val) => utils.testRegex(val,/^[^"&'<>`\\]+$/)
    },
    apnusername:{      
      message: 'The :只允许输入数字、英文字母和英文符号(不能输入\' \" ` \\)', 
      rule: (val) => utils.testRegex(val,/^$|^[a-z A-Z0-9-_!@#$%^&*()-=_+/<>;?,./:~{}|\[\]]+$/)
      //rule: (val) => utils.testRegex(val,/^$|[a-z A-Z0-9,\/\\:\*\?\"\'<>\|%;]$/)
    },
    PINCode:{
      message: 'The :PIN code must be 4 or 8 digits',
      rule: (val) => utils.testRegex(val,/^[0-9]{4,8}$/)
    },
    hostname:{
      message: 'The :只允许输入数字和字母;', 
      rule: (val) => utils.testRegex(val,/^$|^[0-9A-Za-z]+$/)
    },
    acsUrl:{
      message: 'The :只能以http或https开头;', 
      rule: (val) => utils.testRegex(val,/(http|https):\/\/([\w.]+\/?)\S*/)
    },
    day:{
      message: 'The :只允许输入正整数，可以等于0',
      rule: (val) => utils.testRegex(val,/^(0|[1-9][0-9]*)$/)
    },
  },
}

export default class ReactValidator {
  constructor() {
    this.fields = []
    this.rules = utils.rules
    this.showMessage = false
  }

  hideMessages() {
    this.showMessage = false
  }

  showMessages() {
    this.showMessage = true
  }

  allValid() {
    for (var key in this.fields) {
      //console.log(key,this.fields,this.fields.hasOwnProperty(key),this.fields[key])
      if (this.fields.hasOwnProperty(key) && this.fields[key] === false) {
        console.warn(`field ${key} result not match rule`)
        return false
      }
    }
    return true
  }
  //use : this.validator.someValid(['va0ssid'])
  someValid(keyarr) {
    for(var i=0;i<keyarr.length;i++){
      if (keyarr[i] in this.fields) {
        //console.log(key,this.fields,this.fields.hasOwnProperty(key),this.fields[key])
        if (this.fields.hasOwnProperty(keyarr[i]) && this.fields[keyarr[i]] === false) {
          console.warn(`field ${keyarr[i]} result not match rule`)
          return false
        }
      }
    }
    return true
  }
  message(field, value, testString, customClass, customErrors = {}) {
    this.fields[field] = true
    /**为了添加自定义的过滤表达式，所以将参数的‘|’换成‘&&’ 使用时请注意 */
    let tests = testString.split('&&')
    //let tests = testString.split('|')
    let rule, options, message
    for (let i = 0; i < tests.length; i++) {
      value = this.filterEmptyValue(value)
      rule = this.getRule(tests[i])
      options = this.getOptions(tests[i])
      if (!this.isValid(value, rule, options)) {
        this.fields[field] = false
        if (this.showMessage) {
          message =
            customErrors[rule] ||
            customErrors.default ||
            this.rules[rule].message.replace(':attribute', field)

          if (
            options.length > 0 &&
            this.rules[rule].hasOwnProperty('messageReplace')
          ) {
            let replaceMessage = this.rules[rule].messageReplace(
              message,
              options,
            )
            return this.createErrorEle(replaceMessage, customClass)
          }

          return this.createErrorEle(message, customClass)
        }
      }
    }
  }

  createErrorEle(message, customClass) {
    return React.createElement(
      'div',
      { className: customClass || 'error-message' },
      message,
    )
  }

  filterEmptyValue(value) {
    return value === undefined || value === null ? '' : value
  }

  getRule(rule) {
    return rule.split(':')[0]
  }

  getOptions(rule) {
    let parts = rule.split(':')
    //return parts.length > 1 ? parts[1].split(',') : []
    return parts.length > 1 ? parts[1].split('&&') : []
  }
  isValid(value, rule, options) {
    try {
      return this.rules[rule].rule(value, options)
    }catch(e){
      console.error(`not find your setting rule ${rule}, Please read doc in https://github.com/febobo/react-validator`)
    }
  }
}
