export const posturl = 'cgi-bin/cgi_huayi.cgi';
///**下载系统日志 */
//export const downlog = '/cgi-bin/cgi_stream.cgi?streamid=1'
///**备份配置文件 */
//export const bakconfig = '/cgi-bin/cgi_stream.cgi?streamid=2'
///**恢复系统配置文件 */
//export const resetconfig = '/cgi-bin/cgi_stream.cgi?streamid=3'
///**系统升级 */
//export const upgrade = 'cgi-bin/cgi_stream.cgi?streamid=4'//&keep_setting=1/0
///**模块升级 */
//export const modalupgrade = 'cgi-bin/cgi_stream.cgi?streamid=5'//&keep_setting=1/0

export const smsurl = 'cgi-bin/cgi_modem.cgi';

export const sms_HYID = { 
    /**获取首页状态  */
    get_overview_info:0,
    // /**获取外网配置  */
    // get_wan_config:1,
    // /**设置以太网上网参数  */
    // set_eth_wan_config:2,   
    //4G300-H002-HY07产品特有替换接口
    /**获取无线WAN+4G  */
    cgi_get_wan_or_wan4g_config :1,
    /**设置无线WAN+4G  */
    cgi_set_wan_or_wan4g_config :2,
   
    /**获取新信息状态  */
    get_new_sms_state :3,
    /**获取短信概览信息  */
    get_breaf_sms_info :4,
    /**获取短信会话  */
    get_sms_session_by_number :5,
    /**删除短信会话  */
    delete_sms_session_by_sid :6,
    /**删除短信  */
    delete_sms_by_cid :7,
    /**发送短信  */
    send_sms_messages :8,
    
    /**获取模块pin码状态  */
    get_module_pin_state :9,
    /**PIN 解锁sim卡  */
    sim_lock_set_pin :10,
    /**获取pin码clck状态  */
    get_sim_clck :11,
    /**设置pin码clck状态  */
    set_pin_clck :12,
    /**修改模块pin码  */
    change_module_pin_code :13,
	

    /**获取模块APN配置  */
    get_module_apn_config :14,
    /**设置模块APN配置  */
    set_module_apn_config :15,

    /**获取4G信号值  */
    cgi_get_4g_signal :16,

    /**测试数据结构  */
    cgi_get_no_data: 17,
    //注意18、19在newui_mtk3.6中对应17、18
    /**获取卡槽运营商信息  */
    get_card:18,
    /**设置卡槽运营商信息  */
    set_card :19,
}

export const HYID = {
    /**获取登陆前配置*/   
    get_pre_login_config:0,
    /**重启系统 */
    restart:2,
    /**获取语言配置*/
    get_language_config:3,
    /**设置语言配置*/
    set_language_config:4,
    /**登陆认证 */
    do_login_auth:5,
    /**退出 */
    do_huayi_logout:6,
    /**获取密码状态*/
    get_passwd_state:7,
    /**修改管理员密码 */
    change_admin_password:8,
    /**获取快速设置配置 */
    get_quick_setting_config:9,
    /**设置快速设置配置 */
    set_quick_setting_config:10,
    /**设置以太网上网参数  */
    set_eth_wan_config:11,
    /**获取静态路由配置 */
    get_static_router_config:12,
    /**设置静态路由配置 */
    set_static_router_config:13,
    /**获取远程管理配置  */
    get_remote_manage_config:14,
    /**设置远程管理配置  */
    set_remote_manage_config:15,
    /**获取mac过滤配置  */
    get_mac_filter_config:16,
    /**设置mac过滤配置  */
    set_mac_filter_config:17,
    /**获取URL过滤配置  */
    get_url_filter_config:18,
    /**设置URL过滤配置  */
    set_url_filter_config:19,
    /**获取IP/PORT过滤配置  */
    get_ip_port_filter_config:20,
    /**恢复出厂设置 */
    reset:21,    
    /**下载系统日志 */
    downlog : '/cgi-bin/cgi_stream.cgi?streamid=1',
    /**备份配置文件 */
    bakconfig : '/cgi-bin/cgi_stream.cgi?streamid=2',
    /**恢复系统配置文件 */
    resetconfig : '/cgi-bin/cgi_stream.cgi?streamid=3',
    /**系统升级 */
    set_system_upgrade : 'cgi-bin/cgi_stream.cgi?streamid=4&keep_setting=',//&keep_setting=1/0
    /**模块升级 */
    uploade_5g_module_upgrade_file : 'cgi-bin/cgi_stream.cgi?streamid=5',//&keep_setting=1/0
    /*清除模块升级文件*/
    clean_module_upgrade_file : 'cgi-bin/cgi_stream.cgi?streamid=6',
    /**获取升级信息 */
    get_upgrade_info:22,
    /**获取当前用户信息 */
    get_current_user_info:23,
    /**获取lan侧ARP列表 */
    get_lan_arp_list:24,
    /**获取以太网统计  */
    get_network_info:25,
    /**获取dhcp服务配置 */
    get_dhcps_server_config:26,
    /**设置DHCP服务器配置 */
    set_dhcps_server_config:27,
    /**获取内网配置 */
    get_lan_config:28,
    /**设置内网配置 */
    set_lan_config:29,
    /**获取外网配置  */
    get_wan_config:30,
    /**获取DHCP检测结果  */
    get_dhcp_detect_result:31,
    /**开始DHCP检测  */
    do_dhcp_detect:32,
    /**停止DHCP检测  */
    stop_dhcp_detect:33,
    /**获取ntp配置  */
    get_ntp_config:34,
    /**设置ntp配置  */
    set_ntp_config:35,
    /**使用浏览器时间  */
    use_browser_time:36,
    /**获取系统日志配置  */
    get_syslog_config:37,
    /**设置系统日志配置  */
    set_syslog_config:38,
    /**显示系统日志  */
    display_syslog:39,
    /**清除系统日志  */
    clean_syslog:40,
    /**获取定时重启配置  */
    get_sche_reboot_config:41,
    /**设置定时重启配置  */
    set_sche_reboot_config:42,
    /**获取硬件NAT配置  */
    get_hwnat_config :43,
    /**设置硬件NAT配置  */
    set_hwnat_config :44,
    /**获取系统信息  */
    get_system_info :45, 
    /**获取在线列表  */
    get_allstalist :46,
    /**获取QOS  */
    get_qos:47,
    /**设置QOS  */
    set_qos:48,
    /**获取无线基础配置  */
    get_wireless_basic_config:49,
    /**设置无线基础配置  */
    set_wireless_basic_config:50,
    /**设置IP/PORT过滤配置  */
    set_ip_port_filter_config:51,
    /**获取dmz配置  */
    get_dmz_config:52,
    /**设置dmz配置  */
    set_dmz_config:53,
    /**获取端口映射配置  */
    get_port_forward_config:54,
    /**设置端口映射配置  */
    set_port_forward_config:55,
    /**获取UPNPD配置  */
    get_upnpd_config:56,
    /**设置UPNPD配置  */
    set_upnpd_config:57,
    /**获取wanping配置  */
    get_wan_ping_config:58,
    /**设置wanping配置  */
    set_wan_ping_config:59,
    /**获取ACL列表  */
    get_acl_list :60,
    /**阻止上网  */
    add_acl_list :61,
    /**从acl列表里解除上网  */
    delete_acl_list :62,
    /**获取DDNS配置  */
    get_ddns_config:63,
    /**设置DDNS配置  */
    set_ddns_config:64,
    /**获取ping测试结果  */
    get_ping_detect_result:65,
    /**开始ping测试  */
    do_ping_detect:66,
    /**停止ping测试  */
    stop_ping_detect:67,
    /**获取路由跟踪测试结果  */
    get_tracert_detect_result:68,
    /**开始路由测试  */
    do_tracert_detect:69,
    /**停止路由测试  */
    stop_tracert_detect:70,
    /**获取首页状态  */
    get_overview_info:71,
    /**获取无线高级配置  */
    get_wireless_adv_cfg:83,
    /**设置无线高级配置  */
    set_wireless_adv_cfg:84,
    /**重新检测wan口类型 */
    do_wan_proto_detect:85,
    /**扫描请求 */
    set_wireless_scan:86,
    /**获取扫描状态 */
    get_wireless_scan_status:87,
    /**获取扫描结果 */
    get_wireless_scan_list:88,
    /**获取AP中的LAN信息 */
    get_lan_info:89,
    /**设置AP中的LAN信息 */
    set_lan_info:90,
    /**获取状态信息 */
    get_status_info:91,

    /**基础页cgi */
    /**获取基础首页显示 */
    get_basic_all_info:92, 
    /**获取基础页状态信息显示 */
    get_basic_status_info:93,
    /**设置基础设置WIFI信息 */
    set_basic_wifi:94,
    /**获取无线ACL配置  */
    get_wireless_acl_cfg:95,
    /**设置无线ACL配置  */
    set_wireless_alc_cfg:96,
    /**获取用户页无线客户端列表  */
    get_user_wireless_client:97,
    /**获取无线多ssid配置  */
    get_mulssid_cfg:98,
    /**设置无线多ssid配置  */
    set_mulssid_cfg:99,
    /**获取无线vlan配置  */
    get_vlan_cfg:100,
    /**设置无线多vlan配置  */
    set_vlan_cfg:101,
    /**获取系统模式 */
    get_system_mode:102,
    /**模式切换下发 */
    set_sysmode_D3:103,
    /**获取网关数据 */
    get_gateway_mode_config:104,
    /**获取用户页无线基础设置  */
    get_user_wireless_base:105,
    /**设置用户页无线基础设置  */
    set_user_wireless_base:106,
    /**获取首页系统状态  */
    get_home_system_info:107,
    /**获取首页网络信息  */
    get_home_network_info:108,
    /**获取wifi调度配置  */
    get_wifi_sche_config:109,
    /**设置wifi调度配置  */
    set_wifi_sche_config:110,

    /**获取瘦AP信息 */
    get_thinap:111,
    /**设置瘦AP信息 */
    set_thinap:112,
    /**设置第一次登陆 */
    set_first_boot: 185,
    /**获取快速设置网络策略配置 */
    get_quick_prior_config:187,
    /**设置快速设置网络策略配置 */
    set_quick_prior_config: 188,
}

export default {}