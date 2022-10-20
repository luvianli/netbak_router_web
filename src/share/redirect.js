/**跳转到登陆页
 * 例如
 * 1 修改密码
 * 2 退出
 */
 import {clearCookie} from '@/share/cookies';

export function logout(){
    sessionStorage.clear()
    window.location.hash="#/Login"
}

export const handleRedir = (redir=false,redir_ip='')=>{
    /**redir为false,不跳转， 为true跳转到redir_ip */
    if(redir===false){        
        window.location.reload(true);   
        return;  
    }
    if(redir===true && redir_ip===''){ 
        clearCookie('PSW')   
        return false;  
    }
    else{
        clearCookie('PSW') 
        // localStorage.setItem("status", 4001);
        //清除登陆信息
        sessionStorage.clear() 
        window.location.href='http://'+redir_ip+'/index.html';
        return;
    }
}

export default {}