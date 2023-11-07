import axios from 'axios'
import { message,Modal } from 'antd'
export default class Axios{
    static post(options){
        let baseApi = '';
        return new Promise((resolve,reject)=>{
            axios({
                baseApi,
                url:options.url,
                method:'post',
                timeout:20000,// 如果请求时间超过 `timeout` 的值，则请求会被中断
                data: options.data
            }).then((response)=>{
                if(response.status === 200){
                    //let res = response.data;
                    switch(response.data.errcode){
                        case 2000:
                        case '2000':
                            resolve(response.data);
                            break;
                        case 4001:      
                            localStorage.setItem("status", 4001);
                            window.location.hash="#/Login";
                            break;                            
                        case 4002:
                            Modal.error({
                              title: window.__('Data format error'),
                              okText:window.__('OK')
                            });
                            break;                                    
                        case 4003:
                            Modal.error({
                              title: window.__('HYID filed miss'),
                              okText:window.__('OK')
                            });
                            break;                                    
                        case 4004:
                            Modal.error({
                              title: window.__('illegal HYID'),
                              okText:window.__('OK')
                            });
                            break;                                    
                        case 4005:
                            Modal.error({
                              title: window.__('required data miss'),
                              okText:window.__('OK')
                            });
                            break;                                    
                        case 4006:
                            message.error(window.__('Please Enter The Correct Password!'));
                            break;                                     
                        case 4007:
                            /*Modal.error({
                              title: window.__('server failure'),
                              okText:window.__('OK')
                            });*/
                            console.error('server failure')
                            resolve(response.data);
                            break;                                    
                        case 4008:
                            Modal.error({
                                title: window.__('File Format Error!'),
                                okText:window.__('OK')
                              });
                            resolve(response.data);
                            break;
                        case 4009:
                            Modal.error({
                              title: window.__('dulicate data'),
                              okText:window.__('OK')
                            });
                            break;
                        case 4010:
                            Modal.error({
                              title: window.__('data content error'),
                              okText:window.__('OK')
                            });
                            break;
                        case 4011:
                            Modal.warning({
                                title: window.__('Login Restricted, Please Try Again Later!'),
                                okText:window.__('OK')
                            });
                            break;
                        default:                            
                            resolve(response.data);
                            break;
                    }
                }else{
                    reject(response.data);
                }
            }).catch(function (error) {
								if (error.response) {// 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
									console.log(error.response.data);
									console.log(error.response.status);
									console.log(error.response.headers);
								}else if (error.request) { // 请求已经成功发起，但没有收到响应
									const key = "0"//key是为了页面有多个请求时，只出现一个提示
									setTimeout(() => {                                        
									    message.error({content:window.__('Request Timeout!'),key});
									}, 1000*20);
                                    setTimeout(() => {
                                        localStorage.setItem("status", 4001);
										window.location.hash="#/Login"
									}, 1000*22);
								}else {// 发送请求时出了点问题
									console.log('Error', error.message);
									window.location.hash="#/Login"
								}
                // console.error('数据请求错误')
                // message.error(window.__('Data request error'))
            })
        })
    }

}

