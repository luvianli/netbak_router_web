import React ,{Component}from 'react';
import {axios,smsurl,sms_HYID} from '@/share';
import {Modal} from '@/screens/components';
import * as echarts from 'echarts/core';
import { GridComponent,LegendComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import './index.less'
import strong from '@/img/strong.png'
import medium from '@/img/medium.png'
import weak from '@/img/weak.png'
import ready from '@/img/ready.gif'
import {Button} from 'antd';

echarts.use([GridComponent, BarChart, CanvasRenderer,LegendComponent,]);

class Signal extends Component {
  
  state={
	  signal: 0,
	  list:[],
		ssid_2g:'',
		pwd_2g:'',
		ssid_5g:'',
		pwd_5g:'',
		detect: true,
		visible: false,
		score: 0,
		loadding: true
  }
  componentDidMount(){
	// this.getData()
		this.intervalId = setInterval(() => {
		if(this.state.list.length<6){
			this.getData()			
		}else{
			clearInterval(this.intervalId)
			this.stopDetect()
		}
		  }, 2000);
  }
  componentWillUnmount(){
		clearInterval(this.intervalId)
  }
  getData =()=>{
		axios.post({
				data:{
					HYID:sms_HYID.cgi_get_4g_signal
				},
				url:smsurl
			}).then((res)=>{
				console.log("cgi_get_4g_signal",res)
				if(res.errcode===2000){
					this.state.list.unshift(res.huayi_r.signal)
					this.setState({
						loadding:false,
						ssid_2g:res.huayi_r.ssid_2g,
						pwd_2g:res.huayi_r.pwd_2g,
						ssid_5g:res.huayi_r.ssid_5g,
						pwd_5g:res.huayi_r.pwd_5g,
					})
					this.makeChart()
				}
			})
  }
  makeChart =()=>{
		var chartDom = document.getElementById('main');
		var myChart = echarts.init(chartDom);
		var option;
		option = {
			color:['#268082'],
			xAxis: {
				type: 'category',
				data: [window.__('current'), window.__('after 2s'), window.__('after 4s'), window.__('after 6s'), window.__('after 8s'), window.__('after 10s')],
				axisLabel: { interval: 0, rotate: 0 }
			},
			yAxis: {
				type: 'value',
				internal: 25,
				max: 100,
				min: 0
			},
			legend: {},
			series: [
				{
					name: window.__('4G Signal'),
					data: this.state.list,
					type: 'bar',
					barWidth: 20
				}
			]
		};
		option && myChart.setOption(option);
  }
	stopDetect=()=>{
		setTimeout(() => {
			this.setState({detect:false,visible:true})
		  }, 500);
		clearInterval(this.intervalId)
		var score = 0
		this.state.list.every((item)=>{
			return score = score + item			
		})
		score = Math.round(score/this.state.list.length)
		this.setState({score})
	}
	handleCloseModal=()=>{
    this.setState({
      visible:false,
    })
  }
  handleToHome=()=>{
	window.location.hash="#/Home"
  }
	
  render(){
	const {ssid_2g,pwd_2g,ssid_5g,pwd_5g,detect,visible,score,loadding} = this.state
	return (
		<div className='signal'>
			{loadding?
				<div className='ready'>
					<img src={ready} alt=''/>
					<div>{window.__('Ready to test...')}</div>
	  		</div>
				:<>
					<div>
						{ssid_5g?<>
							<div className='item'>{window.__('2.4G SSID')}:&nbsp;{ssid_2g}</div>
										<div className='item'>{window.__('2.4G Password')}:&nbsp;{pwd_2g}</div>
						</>:<>
							<div className='item'>{window.__('SSID')}:&nbsp;{ssid_2g}</div>
							<div className='item'>{window.__('Password')}:&nbsp;{pwd_2g}</div>
						</>}
						{ssid_5g&&<>
							<div className='item'>{window.__('5.8G SSID')}:&nbsp;{ssid_5g}</div>
										<div className='item'>{window.__('5.8G Password')}:&nbsp;{pwd_5g}</div> 
						</>}    
					</div>
					<div style={{marginTop: 10}}>{window.__('Adjustable mobile routing position to detect SIM signal quality in different areas')}</div>
					<div id="main" style={{width: 400,height:300}}></div>
					{detect&&
						<div>
							<div className='detect'>{window.__('Detecting...')}</div>
							<div className='item'>{window.__('The detection takes about 10s, please be patient')}</div>
							<button className='modal-confirm-btn'
								onClick={this.stopDetect}>{window.__('Cancel Detection')}</button>
						</div>
					}
					<button className='modal-confirm-btn'
								onClick={this.handleToHome}>{window.__('Return')}</button>
					<Modal
						style={{width:650,}}
						visible={visible}
					>       
						<div className='test'>{window.__('Test Results')}</div>
							<div className='test'>{window.__('current')}<span>{score}</span>{window.__('points')}</div>
							<div>
								{20<=score?<img src={strong} alt=""/>:10<=score?<img src={medium} alt=""/>:<img src={weak} alt=""/>}
								{40<=score?<img src={strong} alt=""/>:30<=score?<img src={medium} alt=""/>:<img src={weak} alt=""/>}
								{60<=score?<img src={strong} alt=""/>:50<=score?<img src={medium} alt=""/>:<img src={weak} alt=""/>}
								{80<=score?<img src={strong} alt=""/>:70<=score?<img src={medium} alt=""/>:<img src={weak} alt=""/>}
								{score===100?<img src={strong} alt=""/>:90<=score?<img src={medium} alt=""/>:<img src={weak} alt=""/>}
							</div>

					<button className='modal-confirm-btn'
					onClick={this.handleCloseModal}>{window.__('OK')}</button>
				</Modal>
				</>
			}
		</div>
	);
}
}

export default Signal

  