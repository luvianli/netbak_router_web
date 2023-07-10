import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,Progress,FormRadioCheck} from '@/screens/components';
import {axios,HYID ,posturl,smsurl,sms_HYID,deepCopy,handleRedir} from '@/share';
import {message,Radio,Checkbox} from 'antd';
import ReactValidator from '@/share/validator/index.js';
import './index.less';

export default class LAN extends Component {
  state={
    result:{},
    result_src:{},
    showProgress:false,
    locktime:0,
		card_info:[],
		cardItem: 0,
		cardItem_src: 0,
		cardMiss: true,//true:所有卡都不能正常使用,false：有可以正常使用的卡
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData();
  }
  
  getData = () => {
    axios.post({
      data:{
        HYID:sms_HYID.get_card
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
				let cardItem;
				let arr = res.huayi_r.card_info
				let cardMiss = true
				for(var i=0;i<arr.length;i++){
					if(arr[i].card===res.huayi_r.card&&arr[i].operator===res.huayi_r.operator){
						cardItem = i
					}
					if(arr[i].iccid){
						cardMiss = false
					}
				}	
        this.setState({     
          result:deepCopy(res.huayi_r),
          result_src: deepCopy(res.huayi_r),
					card_info: arr,
					cardItem,
					cardItem_src: cardItem,
					cardMiss
        })
      }
    })
  };  
  setData=(values)=>{ 
    axios.post({
      data:{
        HYID:sms_HYID.set_card,
        ...values,
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({
          redir:res.reconnection,
          redir_ip:res.reconnection_addr,
          showProgress:res.progresstime!==0,
          locktime:res.progresstime
        })
      }
    })
  }
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.setState({
      showProgress:false,
    })
		message.success(window.__('Success'));
    this.getData();
  }
  
  handleSave=()=>{
    let cardItem = this.state.cardItem;
    let cardItem_src = this.state.cardItem_src;
    let lock = this.state.result.lock;
    let lock_src = this.state.result_src.lock;
    let values = {}
		if(this.state.cardMiss){
			message.error(window.__('Invalid Or Missing SIM Card!'))
			return false;
		}
		if(cardItem===cardItem_src&&lock===lock_src){
			message.success(window.__('Data Up to Date'));
			return false;
		}else{
			values = {
				card: this.state.card_info[cardItem].card,
        lock
			}
			this.setData(values)
		}
  }

	changeOp=(operator)=>{
		if(operator===1){
			return window.__('CT')
		}else if(operator===2){
			return window.__('UNICOM')
		}else{
			return window.__('CMCC')
		}
	}
	renderCard=(arr)=>{
		const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
		return arr.map((item,index)=>{
			return(
				<Radio value={index} style={radioStyle} key={index} disabled={!item.iccid}>{window.__('Internal card')}-{this.changeOp(item.operator)}</Radio>
			)
		})
	}

	handleChange = name => event => {
		this.setState({ [name]:event.target.value });
  };
  changeLock=(event)=>{
    let {result} = this.state;
    result.lock = event.target.checked? 1:0
    this.setState({ result })
  }

  render(){
    const {result:{card,operator,lock},card_info,cardItem} = this.state;
    return (
      <div>
        <div style={{height:20}}></div>
        <PageText 
          title={window.__('Operator Switching')}
					msg={window.__("Note: It takes a certain time for the device to switch to the network. If the blue light is always on, the network can be used normally!")}
          showHelp={false}
          helpmsg={window.__("Note: It takes a certain time for the device to switch to the network. If the blue light is always on, the network can be used normally!")}
					/>
					<FormGroup lable={window.__('Currently Used Card')}>
            <label style={{fontSize:14}}>
							{card===card_info.length?<span>{window.__('External card')}-{this.changeOp(operator)}</span>
							:<span>{window.__('Internal card')}-{this.changeOp(operator)}</span>
							}
						</label>
        	</FormGroup>
					<div className='verticle-top'>
						<FormGroup lable={window.__('Internet Type')}>
							<Radio.Group onChange={this.handleChange('cardItem')} value={cardItem}>
								{this.renderCard(card_info)}
							</Radio.Group>
						</FormGroup>
            <FormRadioCheck>
              <Checkbox checked={lock===1?true:0} onChange={this.changeLock}>
                {window.__('Lock Current Operator')}
              </Checkbox>
            </FormRadioCheck>					
					</div>
          
          <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
        
          <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>

        <div style={{height:88}}></div>
      </div>
    );
  }
}


  