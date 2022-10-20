import {home1} from './home1Page.js'
import {reset1} from './reset1_page.js'
import {schedule} from './schedule.js'
import {network} from './network.js'
import {wifi} from './wifi.js'
import {menu} from './menu.js'
import {qos} from './qos.js'
import {dhcp} from './dhcp.js'
import {tools} from './tools.js'
import {password} from './password.js'
import {ntp} from './ntp.js'
import {firewall} from './firewall.js'
import {staticRouter} from './staticRouter.js'
import {prodev} from './prodev.js'
import {login} from './login.js'
import {vlan} from './vlan.js'
import {ddns} from './ddns.js'
import {sms} from './sms.js'
import {ACHome} from './ACHome.js'
import {wps} from './wps'
import {IPv6} from './IPv6.js'
import {vpn} from './vpn.js'
import {portal} from './portal.js'
import {signal} from './signal.js'

const lang_cn = {
	'Start IP Cannot Be Greater Than End IP!':'起始IP不能大于结束IP!',
	'Port Ranage Conflict!':'端口范围冲突!',
	'IP Ranage Conflict!':'IP范围冲突!',
	'Day': '天',
	'Hour':'时',
	'Min':'分',
	'Sec':'秒',	
	'Rebooting...Please Do Not Shut Down The Device,Completed After ':'重启中...请不要关闭设备,完成还需',
	'Resetting...Please Do Not Shut Down The Device,Completed After ':'重置中...请不要关闭设备,完成还需',
	'Upgrading...Please Do Not Shut Down The Device,Completed After ':'升级中...请不要关闭设备,完成还需',
	'Configuring...Please Do Not Shut Down The Device,Completed After ':'配置中...请不要关闭设备,完成还需',
	'Restoring...Please Do Not Shut Down The Device,Completed After ':'恢复中...请不要关闭设备,完成还需',
	'Data format error':'数据格式错误',
	'HYID filed miss':'HYID丢失',
	'illegal HYID':'非法HYID',
	'required data miss':'缺失数据',
	'Please Enter The Correct Password!':'请输入正确密码!',
	'server failure':'服务器错误',
	'File Format Error!':'文件格式错误!',
	'dulicate data':'数据重复',
	'data content error':'数据内容错误',
	'Login Restricted, Please Try Again Later!':'登录受限，请稍后再试!',
	'Confirm To Reboot?':'确认要重启？',
	'Confirm To Reset?':'确认要恢复出厂设置？',
	'At Most 10 Rules!':'最多只能添加10项!',
	'At Most 32 rules!':'最多只能添加32项!',
	'This IP Already Exists!':'此IP地址已存在!',
	'This MAC Already Exists!':'此MAC地址已存在!',
	'This URL Already Exists!':'此URL已存在!',
	'External Port Has Exits!':'外部端口已存在!',
	'Internal Port Has Exits!':'内部端口已存在!',
	'Start Port Cannot Be Greater Than End Port!':'起始端口不能大于结束端口!',
	'Comment':'描述',
	'Comment At Most 16 Characters!':'描述不能大于16个字符!',
	'Refresh Success':'刷新成功',
	'Index':'序号',
	'OK': "确定",
	'Apply':'应用',
	'Help':'页面帮助',
	'Cancel':'取消',
	'Allow':'允许',
	'Deny':'禁止',
	'Scan':'扫描',
	'Action':'操作',
	'ON':'开',
	'OFF':'关',
	'Enable':'开启',
	'Disable':'关闭',
	'Refresh':'刷新',
	'Select':'选择',
	'Data Up to Date':'数据没有修改',
	'Unknown':'未知',
	'Name':'名称',
	'Scan List':'扫描列表',
	'Clear':'清除',
	'Port':'端口',
	'Loadding...':'加载中...',
	'Signal':'信号',
	'devices':'台',
	'My Device':'我的设备',
	'Internet':'因特网',
	'Network Uptime':'网络连接时间',
	'Scanning...':'扫描中...',
	'Rescan':'重新扫描',
	'Online':'在线',
	'Offline':'离线',
	'Thin AP':'瘦AP',
	'Fat AP':'胖AP',
	'FAT':'胖AP',
	'FIT':'瘦AP',
	'AC IP Address':'AC IP地址',
	'Thin AP Status':'瘦AP状态',
	'Thin AP Online Time':'瘦AP在线时间',
	'AP Name':'AP名称',
	'Network Type':'网络连接类型',
	'Network Status':'网络连接状态',
	'Quick Setting':'快速设置',
	'Logout':'退出',
	'Invalid Or Missing SIM Card!': '未插入 SIM 卡或者 SIM 卡无效!',	
	'Enter Correct SIM Card PIN Code!': '请输入 SIM 卡 PIN 码!',
	'No Internet':'未连接互联网',
	'Set The Same Admin Password':'设置相同的登陆密码',
	'Encryption': '加密',
	'Change Mode': '模式切换',
	'Router Mode': '路由模式',
	'Wizard':'快速设置',
	'Wireless Settings': '无线设置',
	'Wireless Setting': '无线设置',
	'Personalize settings for each band or enable Smart Connect to configure the same settings for all bands.': '个性化每个频段的设置或启用智能连接为所有频段配置相同的设置。',
	'Success! Please Reconnect To Network!':'设置成功！请重新连接无线上网！',
	'Wireless SSID After Relay:':'中继无线网络名称:',
	'Wireless Passowrd After Relay:':"中继无线网络密码:",
	'Delete': "删除",
	'After reconnecting to the network, launch the browser and enter': '重新连接网络后，启动浏览器并在地址中输入',
	'in the address': '',
	'USB Service':'USB服务',
	'FTP Service':'FTP服务',
	'Printer Service':'打印机服务' ,
	'Drive':'盘符',
	'Capacity':'容量',
	'Path':'路径',
	'Unused': '未使用',
	'FTP Service List': 'FTP服务列表',
	'U Disk Or Hard Disk Is Not Inserted!':'未插入u盘或者硬盘！',
	'Wireless Multi SSID':'无线多SSID',
	'Enable AP Isolation':'启用AP隔离',
	'Online List':'在线列表',
	'ACL List':'ACL列表',
	'Network Quick Setting':'网络快速设置',
	'WLAN Quick Setting':'无线快速设置',
	'Port Speed:':'速率为：',
	'Skip':'跳 过',
	'Next':'下一步',
	'Previous':'上一步',
	'Complete':'完 成',
	'Gateway Mode':'网关模式',
	'AP Mode':'AP模式',
	'Repeater Mode':'中继模式',
	'WISP Mode':'WISP模式',
	'Propose Mode:':'推荐模式：',
	'Redetect':'重新检测',
	'Cable Unplugged':'网线未连接',
	'Gateway Address': '网关地址',
	'System Log Enable':'系统日志开关',
	'Save Log':'保存日志',
	'Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\':'只允许输入数字、英文字母、英文符号和中文(不能输入\' \" ` \\)',
	'You can track the informations of AP Fat/Fit mode.':'本页面用于显示AP 胖/瘦 模式状态。',
	'URL Keywords At Most 63 Characters!':'URL关键字不能大于63个字符!',
	'Range 1-100Mbps':'只能为1-100Mbps',
	'Uplink Bandwidth Range Is 1-100Mbps!':'上传带宽只能为1-100Mbps!',
	'Downlink Bandwidth Range Is 1-100Mbps!':'下载带宽只能为1-100Mbps!',
	'Request Timeout!':'请求超时!',	
}

Object.assign(lang_cn, home1,reset1,schedule,network,wifi,menu,qos,dhcp,tools,
	password,ntp,firewall,staticRouter,prodev,login,vlan,ddns,sms,ACHome,wps,IPv6,vpn,portal,signal);
	
export function __(text){
	if(text in lang_cn)
		return lang_cn[text]
	else return text
}

export default {}