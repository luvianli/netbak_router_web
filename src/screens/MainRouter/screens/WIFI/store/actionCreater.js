import * as ACTIONTYPE from './actionType'

export const sendWirelessEnable =(radio_id,enable)=>{
    switch(radio_id){
        case 0:
         return({
            type:ACTIONTYPE.ENABLE2G,
            enable2g:enable
         })   
         case 1:
          return({
             type:ACTIONTYPE.ENABLE5G,
             enable5g:enable
          })   
    }
}