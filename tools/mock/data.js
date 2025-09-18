function setcookie(){    
    //window is not defined
    // window.document.cookie='SESSION_ID=1'; 
}
module.exports = function (data) {
    switch(data.HYID){
        case 4001:
            return {
                "huayierrtype":	"permission deny",
                "errcode":	4006,
                "progresstime":	0
            }
        case 4009:
            return {
                "huayierrtype":	"dulicate data",
                "errcode":	4009,
                "progresstime":	0
            }
        case 0:
            return {
                "huayi_r":	{
                    "company_name":	"HUAYI",
                    "company_domain":	"www.huayi.com",
                    "sysmode":1,
                    "logo_info":2,
                    "randomname":3000,//prdy大于1594为真表示有密码，小于1594为假表示没有密码
                    "first_boot":1,
                    "company_info": "Copyright &copy; 2021 HUAYI All rights reserved"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 2: //restart
            return {
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	10,
                "reconnection_addr":"192.168.99.188:3001",
                "reconnection": true
            } 
        case 3: //get_language_config
            return {
                "huayi_r":	{
                    "support_language":	["cn", "en"],
                    "current_language":	"cn"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        /**登陆页面 login */
        case 5:
            if((data.username==='admin')&&(data.password==='admin'))
                return {
                    "huayierrtype": "success",
                    "errcode": 2000,
                    "progresstime": 0
                }
            else return{
                "errcode": 2000,
                "huayierrtype":'unauthorized',
                "progresstime": 0
            }            
        case 7: //get_passwd_state
            return {
                "huayi_r": {
                    "randomname": 5000
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }          
        case 8: //change_admin_password
            return {
                "reconnection":	true,
                "reconnection_addr":	"192.168.88.1",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }  
            
         /**获取快速设置配置 */
         case 9://get_quick_setting_config
            return {
                "huayi_r":	{
                    "wan_type":	"mobile",//rep4g,rep,mobile
                    "ssid_config":	{
                        "ssid_2g":	"HUAYI-2.4G",
                        "encry_2g":	0,
                        "passphrase_2g":	"",
                        "ssid_5g":	"HUAYI-5.8G",
                        "encry_5g":	0,
                        "passphrase_5g":	"",
                    },
                    "sysmode":1,
                    "link":	1,
                    "speed":	10,
                    "wan_proto":	0,
                    "proto": "dhcp",
                    "ip_addr": "",
                    "subnet_mask": "",
                    "gateway": "",
                    "dns_arr": [""],
                    "usr": "",
                    "pwd": "",
                    "ac": "",
                    "service": "",
                    "host_name": "HUAYI",
                    "first_boot":1,
                    "auth_type":    "0",
                    "apn_name":    "3gnet",
                    "apn_usr":    " ",
                    "apn_pwd":    " ",
                    "use_apn":    1,
                    "proto_4g":    "dhcp",
                    "detect_ip": "192.168.88.1",
                    "detect_time": 300
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }  
            
        case 10: 
            return {
                "reconnection":	true,
                //"reconnection_addr":	"192.168.88.1",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	10
            }
        case 12://get_static_router_config
            return{
                "huayi_r":	{
                    "static_router_arr":	[{
                            "interface":	"lan",
                            "target":	"192.168.7.99",
                            "gateway":	"192.168.7.1",
                            "subnet_mask":	"255.255.255.0",
                            "metric":	1,
                            "com":	"aaaaa"
                        }, {
                            "interface":	"wan",
                            "target":	"192.168.5.99",
                            "gateway":	"192.168.5.1",
                            "netmask":	"255.255.255.0",
                            "metric":	1,
                            "com":	"bbbbb"
                        }],
                    "interface_arr":	[{
                            "index":	0,
                            "interface":	"lan"
                        }, {
                            "index":	1,
                            "interface":	"wan"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 14://get_remote_manage_config
            return {
                "huayi_r":	{
                    "remote_admin":	false,
                    "port":	8087,
                    "ip_addr":'0.0.0.0'
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 15://set_remote_manage_config
            return {
                "reconnection": true,
				"reconnection_addr":"192.168.88.1",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	10
            }    
        case 16://get_mac_filter_config
            return{
                "huayi_r":	{
                    "mac_filter":	true,
                    "macfilter_arr":	[{
                            "mac_addr":	"00:19:be:20:03:5b",
                            "com":	"macfilter_test"
                        }, {
                            "mac_addr":	"00:19:be:20:03:44",
                            "com":	"macfilter_test2"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 18://get_url_filter_config
            return {    
                "huayi_r":   
                {        
                    "url_filter":   0,        //0:关闭 1：开启黑名单2：开启白名单
                    "urlfilter_arr":   [{                
                        "urlfilter_url":  "www.baidu3.com"            
                    }, 
                    {                
                        "urlfilter_url":  "www.axilspot3.com"            
                    }]    
                },    
                "huayierrtype":   "success",   
                 "errcode": 2000,    
                 "progresstime": 0
                }
        case 20://get_ip_port_filter_config
            return {
                "huayi_r":	{
                    "ip_port_filter":	0,//0:关闭 1：开启黑名单2：开启白名单
                    "ipportfilter_arr":	[{
                            "src_addr":	"192.168.7.3",
                            "proto":	0,
                            "start_port":	1,
                            "end_port":	555,
                            "com":	"123123"
                        }, {
                            "src_addr":	"192.168.7.7",
                            "proto":	1,
                            "start_port":	13,
                            "end_port":	5555,
                            "com":	"444"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 22:
            return {
                "huayi_r":	{
                    "pro_model": "zn183",
                    "release_time": "2019-11-25 19:33:05",
                    "fw_version": "A2_FC_V0.9",
                    "module_version": "RXLG1H.00.10.201908300238",
                    "cloudup_sta": 0,
                    "cloudup_fw": "A2_FC_V01",
                    "cloudup_module": "RXLG1H.00.10.201908300238",
                    "maxsize": "8000000",
                    "maxsize_tip": "8M"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 21:
            return{
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 15,
                "reconnection": true,
                "reconnection_addr":"192.168.99.188:3001"
            }
        case 23: // get_current_user_info
            return {
                "huayi_r":	{
                    "usr_ip":	"192.168.90.26",
                    "usr_mac":	"00:e0:4c:69:00:52"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }          
        case 24: // get_lan_arp_list
            return {
                "huayi_r":	{
                    "arp_arr":	[
                        {
                            "index":	0,
                            "ip_addr":	"192.168.88.99",
                            "mac_addr":	"00:e0:4c:69:00:52"
                        },{
                            "index":1,
                            "ip_addr":"192.168.1.2",
                            "mac_addr":"94:88:5e:00:01"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 25: // get_network_info
            return {
                "huayi_r":	{
                    "wan_infos":	{
                        "mac_addr":	"E4:63:01:18:84:90",
                        "link":	1,
                        "mtu_num":	1500,
                        "ip_addr":	"192.168.90.13",
                        "subnet_mask":	"255.255.255.0",
                        "gateway":	"192.168.90.1",
                        "dns_server_addr":	["192.168.90.1", "8.8.8.8"],
                        "tx_bps":	105,
                        "rx_bps":	150,
                        "rx_bytes":	1236271,
                        "tx_bytes":	84964,
                        "iccid": "8986112125403015233334445522371",
                        "net_type": "Wired",//"Wired":有线，"4G","WISP"
                    },
                    "lan_infos":	{
                        "mac_addr":	"E4:63:01:18:84:74",
                        "ip_addr":	"192.168.88.1",
                        "subnet_mask":	"255.255.255.0",
                        "client_sum":	"1"
                    }
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 26://get_dhcps_server_config
            return{
                "huayi_r":	{
                    "dhcp_enable":	true,
                    "min_ip":	"192.168.7.1",
                    "max_ip":	"192.168.7.254",
                    "start_ip":	"192.168.7.100",
                    "end_ip":	"192.168.7.249",
                    "lease_time":	7200,
                    "static_dhcp_arr":	[{
                            "ip_addr":	"192.168.1.1",
                            "mac_addr":	"00:19:20:03:ef",
                            "name":	"aaaa",
                            "lease_time":	3600
                        }, {
                            "ip_addr":	"192.168.1.2",
                            "mac_addr":	"00:19:be:20:03:ea",
                            "name":	"bbbb",
                            "lease_time":	3600
                        }, {
                            "ip_addr":	"192.168.1.3",
                            "mac_addr":	"00:19:be:20:03:eb",
                            "name":	"cccc",
                            "lease_time":	7200
                        }, {
                            "ip_addr":	"192.168.1.4",
                            "mac_addr":	"00:19:be:20:03:ec",
                            "name":	"cccc",
                            "lease_time":	7200
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 28://get_lan_config
            return {
                "huayi_r":	{
                    "ip_addr":	"192.168.88.1",
                    "subnet_mask":	"255.255.255.0"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 30://get_wan_config
            return{
                "huayi_r":   {
                    "proto":   "dhcp",//dhcp,static,ppoe,l2tp,pptp
                    "wan_mtu": 1500,
                    "mac_addr": "98:F9:C7:56:66:AD",
                    "dns_arr": ["192.168.91.1", "114.114.114.114"],
                    "gateway": "192.168.91.1",
                    "ip_addr": "192.168.91.5",
                    "subnet_mask": "255.255.255.0",//子网掩码
                    "ac":"",
                    "hct_proto":"dhcp",//当选择pptp或者l2tp时，这个字段表示WAN口协议（dhcp||static）
                    "pwd":"admin",
                    "service": "",
                    "usr":"admin",
                    "vpnservice":"192.168.91.1",//VPN服务器IP
                    "vpnusr":"vpnadmin",
                    "vpnpwd":"vpnadmin",
                    "xl2tpd_enable":false,//在协议为l2tp时，才有这个字段
                    "ac":   "",
                    "host_name":   "HUAYI",
                    "def_mac_addr":   "98:F9:C7:56:66:AD",
                    "ppp_mtu":   1492,
                    "link":   1 
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 31://get_dhcp_detect_result
            return {
                "huayi_r":	{
                    "ping_detct":	2,
                    "action_arr":	[{
                            "ip_addr":	"192.168.0.253",
                            "mac_addr":	"F4:28:53:00:32:C4"
                        },{
                            "ip_addr":	"192.168.0.253",
                            "mac_addr":	"F4:28:53:00:32:C4"
                        },{
                            "ip_addr":	"192.168.0.253",
                            "mac_addr":	"F4:28:53:00:32:C4"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 33://stop_dhcp_detect
            return {
                "huayi_r":	{
                    "link":	1,
                    "wan_proto":	2,
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 34://get_ntp_config
            return{
                "huayi_r":	{
                    "ntp_server_arr":	["cn.ntp.org.cn", "hk.ntp.org.cn", "us.ntp.org.cn"],
                    "ntp_admin":	true,
                    "time_zone":	"CST-8",
                    "time_day":	1568986085
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 37://get_syslog_config
            return{
                "huayi_r":	{
                    "syslog_admin":	true//false,
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 39://display_syslog
            return{
                "huayi_r":	{
                    "log_content":	"日志内容"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 41://get_sche_reboot_config
            return{
                "huayi_r":	{
                    "sche_mode":	2,
                    "rectime":	2,
                    "weeks":	255,
                    "hour":	2,
                    "minute":	2,
                    "remaining":	7320,
                    "time_day":	1568986085
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 43://get_hwnat_config 
            return{
                "huayi_r":	{
                    "nat_admin":	false
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 45://get_system_info 
            return{
                "huayi_r":	{
                    "product_name":	"HCT 5G CPE",
                    "product_sn":	"12345678",
                    "product_model":	"zn183",
                    "imei":	"",
                    "imsi":	"",
                    "phone_number":	"",
                    "hardware_version":	"",
                    "software_version":	"15.05.1",
                    "webui_version":	"",
                    "lan_mac":	"00:0C:43:68:20:AA",
                    "ip_address":	"0.0.0.0",
                    "mobile_network":	"CHN-UNICOM",
                    "mobile_type":	"4G",
                    "signal":	-20,
                    "band":"15"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 46://get_allstalist 
            return {
                "huayi_r" : {
                    "staline_arr":	[{
                            "ip_addr":"192.168.88.125",
                            "mac_addr":	"00:19:be:20:03:5b",
                            "host_name":"desktop_dev"
                        }, {
                            "ip_addr":"192.168.88.124",
                            "mac_addr":	"23:19:be:20:03:5e",
                            "host_name":"my_dev"
                        }]
                },
                "reconnection":	"false",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 47://get_qos
            return {
                "huayi_r":	{
                    "qos_admin":	"1",
                    "can_hwnat":0,
                    "totalUpBw":	20,
                    "totalDwBw":	20,
                    "iplimit_arr":	[{
                            "ip_start":	"192.168.0.69",
                            "ip_end":	"192.168.0.79",
                            "upBandwidth":	3,
                            "dwBandwidth":	4,
                            "com":	"wawewaqwdas"
                        }, {
                            "ip_start":	"192.168.0.89",
                            "ip_end":	"192.168.0.99",
                            "upBandwidth":	3,
                            "dwBandwidth":	4,
                            "com":	"cdsgfdgtdbg"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
    


        case 48:
            return {
                "reconnection":	"false",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 49://get_wireless_basic_config
            return{
                "huayi_r":	{
                    "wifi_admin":	1,
                    "band_steering": 0,
                    "hwmode":  14,
                    "band":  2,
                    "channel":  11,
                    "hidden": 0,
                    "tx_power": 100,
                    "noforward": 1,
                    "max_num": 32,
                    "ssid":"     wif      i2.4G  ",
                    "encryp":0,
                    "key":"12345678",
                    "auth_mode": "WPA2-Enterprise",//disable,WPAPSK,WPA2PSK,WPAPSKWPA2PSK,WPA2-Enterprise,WPA3-Enterprise
                    "cipher_mode": "TKIPAES",
                    // Enterprise Authentication fields
                    "auth_server": "192.168.1.100",
                    "auth_port": "1812",
                    "auth_secret": "radius_secret_key"
                },
                "huayierrtype":"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 52://get_dmz_config
            return {
                "huayi_r":	{
                    "dmz_admin":	false,
                    "dest_addr":	"192.168.90.26"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 54://get_port_forward_config
            return {
                "huayi_r":	{
                    "port_admin":	false,
                    "port_forward_arr":	[{
                            "ip_addr":	"192.168.7.98",
                            "proto":	0,
                            "in_port":	123,
                            "ex_port":	333,
                            "com":	"asgfqergqe"
                        }, {
                            "ip_addr":	"192.168.7.97",
                            "proto":	0,
                            "in_port":	123,
                            "ex_port":	333,
                            "com":	"asgfqergqe"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 56://get_upnpd_config
            return {
                "huayi_r":	{
                    "upnp_admin":	false,
                    "upnp_arr":	[
                   {
                        "proto":"UDP",
                        "name":"HCDN",
                        "ip_addr":"	192.168.5.17",
                        "in_port":"38052",
                        "ex_port":"38052"
                   }
                    ]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 58://get_wan_ping_config
            return {
                "huayi_r":	{
                    "wanping_admin":	false
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 60://get_acl_list 
            return {
                "huayi_r" : {
                    "acl_arr":	[{
                            "acl_addr":	"00:19:be:20:03:5b"
                        }, {
                            "acl_addr":	"23:19:be:20:03:5e"
                        }]
                },
                "reconnection":	"false",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 61:
            return{
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 63://get_ddns_config
            return{
                "huayi_r":	{
                    "ddns_admin":	true,
                    "server_addr":	"3322.org",
                    "domain_name":	"19901002yun.f3322.org",
                    "usrname":	"yun19901002",
                    "pwd":	"43291717yun",
                    "ddns_addr":	"192.168.5.112",
                    "ddns_state":	1
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }

        case 65://get_ping_detect_huayi_r
            return {
                "huayi_r":	{
                    "ping_detct":	1,
                    "action_content":	"PING 192.168.7.98 (192.168.7.98) from 192.168.7.1: 56 data bytes\n64 bytes from 192.168.7.98: seq=0 ttl=128 time=0.844 ms\n64 bytes from 192.168.7.98: seq=1 ttl=128 time=0.643 ms\n64 bytes from 192.168.7.98: seq=2 ttl=128 time=0.591 ms\n64 bytes from 192.168.7.98: seq=3 ttl=128 time=0.644 ms\n�n"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 68://get_tracert_detect_result
            return{
                "huayi_r":	{
                    "tracert_detect":	2,
                    "action_content":	"traceroute to 192.168.7.98 (192.168.7.98), 20 hops max, 38 byte packets\n 1  192.168.7.98 (192.168.7.98)  0.581 ms  0.476 ms  0.359 ms\n"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
                
        case 71://get_overview_info
            return{
                "huayi_r":	{
                    "wan_up":	0,
                    "link_status": 0,
                    "network_linktime":	23223,
                    "rx_bps":	9833,
                    "tx_bps":	337136,
                    "total_rx_bytes":	9833,
                    "total_tx_bytes":	337136,
                    "wifi_2g":	1,
                    "wifi_5g":	1,
                    "client_sum":	30
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 83:// get_wireless_adv_cfg
            return{
                "huayi_r":	{
                    "bgprotect_mode": 0,//频段   BG保护模式 （参数值有0，1，2）
                    "beacon":  100,//信标帧间隔  （20-1024，默认值100)
                    "dtim":  1,    //DTIM  （1-255，默认值1）
                    "rts_thres":  11, //RTS阈值（1-2347，默认值2347)
                    "frag_thres": 2345, //分片阈值  （256-2346，默认值2346）
                    "tx_burst": 100,//TX Burst （参数值0，1）（1开启，0关闭）
                    "tx_preamble": 1, //前导帧类型 （参数值0，1，2）
                    "wmm": 1 //WIFI多媒体（WMM）（0关闭，1开启）
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        /**重新检测wan口类型 */
        case 85:
            return{
                "huayi_r":	{
                    "link": 1,
                    "speed": 1000,
                    "wan_proto": 2
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        
        /**#### 获取扫描状态*/
        case 87: //get_wireless_scan_status
            return {
                "huayi_r":	{
                    "scan_status":	2,
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        /**#### 获取扫描结果*/
        case 88: //get_wireless_scan_list
            return {
                "huayi_r":	{
                    "scan_24G_arr":	[{
                            "index":	11,
                            "bssid":	"14:4D:67:40:27:88",
                            "ssid":	"2019",
                            "channel":	11,
                            "signal":	95,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"TKIPAES"
                        }, {
                            "index":	12,
                            "bssid":	"D8:32:14:55:CE:E8",
                            "ssid":	"532",
                            "channel":	9,
                            "signal":	65,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"AES"
                        }, {
                            "index":	13,
                            "bssid":	"B0:95:8E:DE:5E:33",
                            "ssid":	"JFZS1",
                            "channel":	11,
                            "signal":	51,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"AES"
                        }, {
                            "index":	14,
                            "bssid":	"BC:54:FC:CC:1E:06",
                            "ssid":	"TONY_24",
                            "channel":	6,
                            "signal":	23,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"AES"
                        }, {
                            "index":	15,
                            "bssid":	"DC:A3:33:A3:4A:9C",
                            "ssid":	"ChinaNet-mSGa",
                            "channel":	6,
                            "signal":	3,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"TKIPAES"
                        }, {
                            "index":	16,
                            "bssid":	"90:86:9B:3C:D4:D8",
                            "ssid":	"ChinaNet-fv2J",
                            "channel":	7,
                            "signal":	65,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"TKIPAES"
                        }, {
                            "index":	17,
                            "bssid":	"B0:AC:D2:10:05:56",
                            "ssid":	"AirFlyTest",
                            "channel":	11,
                            "signal":	45,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"TKIPAES"
                        }, {
                            "index":	18,
                            "bssid":	"24:31:54:1D:28:0D",
                            "ssid":	"nknow",
                            "channel":	11,
                            "signal":	34,
                            "auth_mode":	"WPA2-PSK",
                            "encryption":	"AES"
                        }, {
                            "index":	19,
                            "bssid":	"6C:19:8F:09:0F:B0",
                            "ssid":	"dlink-0FB0",
                            "channel":	1,
                            "signal":	85,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"TKIPAES"
                        }, {
                            "index":	20,
                            "bssid":	"24:31:54:1D:28:09",
                            "ssid":	"nknow",
                            "channel":	11,
                            "signal":	95,
                            "auth_mode":	"WPA2-PSK",
                            "encryption":	"AES"
                        }, {
                            "index":	21,
                            "bssid":	"48:A0:F8:20:50:2D",
                            "ssid":	"ChinaNet-nXL4",
                            "channel":	13,
                            "signal":	15,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"AES"
                        }, {
                            "index":	22,
                            "bssid":	"2A:6C:07:41:EC:31",
                            "ssid":	"AirFly_Guest",
                            "channel":	2,
                            "signal":	69,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"TKIPAES"
                        }, {
                            "index":	23,
                            "bssid":	"1C:60:DE:A7:21:E4",
                            "ssid":	"MYX529",
                            "channel":	13,
                            "signal":	10,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"AES"
                        }, {
                            "index":	24,
                            "bssid":	"B4:0F:3B:42:73:31",
                            "ssid":	"QFTEK",
                            "channel":	7,
                            "signal":	81,
                            "auth_mode":	"WPAWPA2-PSK",
                            "encryption":	"AES"
                        }, {
                            "index":	25,
                            "bssid":	"00:E0:25:00:00:02",
                            "ssid":	"wifi_000002",
                            "channel":	1,
                            "signal":	64,
                            "auth_mode":	"NONE",
                            "encryption":	"(null)"
                        }, {
                            "index":	26,
                            "bssid":	"10:16:88:1E:92:9B",
                            "ssid":	"000Superwifi Network 5.8G-2.4G-EXT",
                            "channel":	1,
                            "signal":	32,
                            "auth_mode":	"NONE",
                            "encryption":	"(null)"
                        }, {
                            "index":	27,
                            "bssid":	"00:19:BE:29:06:52",
                            "ssid":	"000Superwifi Network 0 2.4G",
                            "channel":	1,
                            "signal":	75,
                            "auth_mode":	"NONE",
                            "encryption":	"(null)"
                        }, {
                            "index":	28,
                            "bssid":	"10:16:88:25:32:C3",
                            "ssid":	"HUAYI_2G1",
                            "channel":	6,
                            "signal":	59,
                            "auth_mode":	"NONE",
                            "encryption":	"(null)"
                        }],
                        "scan_58G_arr":	[{
                                "index":	0,
                                "bssid":	"D8:32:14:55:CE:E2",
                                "ssid":	"532-5.8G",
                                "channel":	36,
                                "signal":	35,
                                "auth_mode":	"WPAWPA2-PSK",
                                "encryption":	"AES"
                            }, {
                                "index":	1,
                                "bssid":	"88:F8:72:AA:7D:89",
                                "ssid":	"HUAWEI_H112_7D84_5.8G",
                                "channel":	36,
                                "signal":	88,
                                "auth_mode":	"WPA2-PSK",
                                "encryption":	"AES"
                            }, {
                                "index":	2,
                                "bssid":	"BC:54:FC:CC:1E:08",
                                "ssid":	"TONY_5.8G",
                                "channel":	161,
                                "signal":	2,
                                "auth_mode":	"WPAWPA2-PSK",
                                "encryption":	"AES"
                            }, {
                                "index":	3,
                                "bssid":	"10:16:88:58:38:67",
                                "ssid":	"HUAYI_2G",
                                "channel":	52,
                                "signal":	65,
                                "auth_mode":	"WPAWPA2-PSK",
                                "encryption":	"TKIPAES"
                            }, {
                                "index":	4,
                                "bssid":	"B0:95:8E:DE:5E:35",
                                "ssid":	"JFZS2",
                                "channel":	157,
                                "signal":	30,
                                "auth_mode":	"WPAWPA2-PSK",
                                "encryption":	"AES"
                            }, {
                                "index":	5,
                                "bssid":	"10:16:88:25:32:C7",
                                "ssid":	"HUAYI_2G",
                                "channel":	52,
                                "signal":	26,
                                "auth_mode":	"WPAWPA2-PSK",
                                "encryption":	"TKIPAES"
                            }, {
                                "index":	6,
                                "bssid":	"04:95:E6:5A:66:45",
                                "ssid":	"Shenbuo-5.8G",
                                "channel":	153,
                                "signal":	65,
                                "auth_mode":	"WPAWPA2-PSK",
                                "encryption":	"TKIPAES"
                            }, {
                                "index":	7,
                                "bssid":	"00:19:BE:29:06:53",
                                "ssid":	"000Superwifi Network 5.8G",
                                "channel":	161,
                                "signal":	88,
                                "auth_mode":	"NONE",
                                "encryption":	"(null)"
                            }, {
                                "index":	8,
                                "bssid":	"10:16:88:1E:92:9F",
                                "ssid":	"000Superwifi Network 5.8G-5.8G-EXT",
                                "channel":	161,
                                "signal":	52,
                                "auth_mode":	"NONE",
                                "encryption":	"(null)"
                            }, {
                                "index":	9,
                                "bssid":	"00:E0:25:00:00:06",
                                "ssid":	"wifi_5.8G_000006",
                                "channel":	149,
                                "signal":	56,
                                "auth_mode":	"NONE",
                                "encryption":	"(null)"
                            }, {
                                "index":	10,
                                "bssid":	"E4:63:01:18:84:A7",
                                "ssid":	"MT7615E-5.8G",
                                "channel":	149,
                                "signal":	93,
                                "auth_mode":	"NONE",
                                "encryption":	"(null)"
                            }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        
        
        case 89:
            return{
                "huayi_r": {
                  "proto": "static",
                  "ip_addr": "192.168.0.253",
                  "subnet_mask": "255.255.255.0",
                  "gateway": "192.168.0.1",
                  'host_name':'Host Name',
                  "dns_arr":[
                      "192.168.3.5",
                      "192.168.3.5",
                  ],
                  /*"pridns": "114.114.114.114",
                  "secdns": "8.8.4.4"*/
                },
                "errcode": 2000,
                "huayierrtype": "success",
                "progresstime": 0
              }
        case 91:  
            return{
                "huayi_r": {
                    "sysmode":  1,
                    "network_up": 0,
                    "network_linktime": 0,
                    "total_rx_bytes": 944348,
                    "total_tx_bytes": 1715671,
                    "rx_bps": 41,
                    "tx_bps": 108,
                    "wifi_2g": 0,
                    "client_sum": 2
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 92:
            return {
                "huayi_r":	{
                    "status_info":	{
                        "pro_name":	"LV-AC17",
                        "fw_version":	143,
                        "sys_mode":	1,
                        "rep_status":	0,
                        "sta_num":	1
                    },
                    "lan_info":	{
                        "mac_addr":	"02:88:00:88:12:12",
                        "ip_addr":	"192.168.7.1",
                        "subnet_mask":	"255.255.255.0",
                        "gateway":	"0.0.0.0"
                    },
                    "wifi_info":	{
                        "ssid_24g":	"lq123456",
                        "key_24g":	"12345678",
                        "encryption_24g":	1,
                        "ssid_58g":	"12345678901234567890123456789012",
                        "key_58g":	"66666666",
                        "encryption_58g":	0
                    },
                    "quick_info":{
                        "ap_mode":1,
                        "net_link":1,
                        "net_mode":"dhcp"
                    }
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 93:
            return {
                "huayi_r":	{
                    "enable": 1,
                    "press_time":30,

                    /**这部分是基础设置的90 */
                    "pro_name":	"LV-AC17",
                    "fw_version":	143,
                    "release_time":	"2019-12-27 16:10:40",
                    "company_domain":	"www.huayi.com",
                    "time_day":	"2020-04-02 20:34:39",
                    "uptime":	346,
                    "cpu_usage":	1,
                    "mem_usage":	60,
                    "flash_usage":	100,
                    "sys_mode":	1,
                    "rep_status":	0,
                    "sta_num":	1
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        /**获取无线ACL配置 */
        case 95:// get_wireless_acl_cfg
            return{
                "huayi_r":	{
                    "wifi_admin":	1,
                    "macfilter_arr":	[{
                        "mac_addr":	"00:11:22:33:44:55"
                    }, {
                        "mac_addr":	"0a:11:22:33:44:55"
                    }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        /**获取用户页无线客户端 */
        case 97: //get_user_wireless_client
            return{
                "huayi_r": {
                "wireless_clients_arr": [
                    {
                    "index": 1,
                    "bssid": "14:4D:67:40:27:88",
                    "stauptime": "20",
                    },
                    {
                    "index": 2,
                    "bssid": "D8:32:14:55:CE:E8",        
                    "stauptime": "20", 
                    },]
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 98:// get_mulssid_cfg
            return{
                "huayi_r":	{
                    "noforward":	0,
                    "vap_list":	[{
                            "enable":	1,
                            "ssid":	"vap1",
                            "encryptype":1,
                            "key":"12345678"
                        }, {
                            "enable":	1,
                            "ssid":	"vap2",
                            "encryptype":1,
                            "key":"12345678"
                        }, {
                            "enable":	1,
                            "ssid":	"vap3",
                            "encryptype":1,
                            "key":"12345678"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }

        case 100://get_vlan_cfg
            return {
                "huayi_r":	{
                    "vlan_list":	[{
                            "vlan_id":	3,
                            "vap_list":	[0,1],
                            "lan_list":	[0]
                        }, {
                            "vlan_id":	30,
                            "vap_list":	[2],
                            "lan_list":	[1]
                        },{
                            "vlan_id":	300,
                            "vap_list":	[3],
                            "lan_list":	[]
                        }, 
                        {
                            "vlan_id":	0,
                            "vap_list":	[],
                            "lan_list":	[]
                        }],

                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        /**#### 获取无线扫描列表*/
        case 102: //get_system_mode
            return{
                "huayi_r":	{
                    "sysmode":	1,
                    "ssid_24g":	"HUAYI-2.4G",
                    "key_24g":	"12345678",
                    "encryption_24g":	0,
                    "ssid_58g":	"HUAYI-2.4G",
                    "key_58g":	"12345678",
                    "encryption_58g":	0,
                    "authmode_24g": "disable",
                    "cipher_24g": "AES",
                    "authmode_58g": "disable",//WPAPSK
                    "cipher_58g": "AES",
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	30
            } 
        /**获取快速设置配置 */
        case 104:
            return{
                "huayi_r":	{
                    "ssid_info":	{
                        "ssid_24g":	"HUAYI-2.4G",
                        "key_24g":	"",
                        "encryption_24g":	0,
                    },
                    "link":	1,
                    "wan_proto":	2,
                    "host_name":	"a"
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        // return{
        //     "huayi_r":	{
        //         "ssid_config":{
        //         "ssid_24g": "wifi_5g",
        //         "encryption_24g": 0,
        //         "key_24g"		: "12345678",
        //         "ssid_58g": "wifi_5g",
        //         "encryption_58g": 1,
        //         "key_58g"		: "12345678",
        //         },
        //         "link":	1,
        //         "wan_proto":	2,
        //         "hostname":	"Huayi",
        //         "dns":[
        //             "192.168.3.5",
        //             "192.168.3.5",
        //         ],
        //         /*'dnspri': "192.168.3.5",
        //         'dnssec': "192.168.3.5",*/
        //         'gateway': "192.168.3.5",
        //         'ipaddr': "192.168.3.5",
        //         'netmask': "255.255.255.0",
        //         "username":	"adminsd",
        //         "password":	"admin123",
        //         'service':''
        //     },
        //     "huayierrtype":	"success",
        //     "errcode":	2000,
        //     "progresstime":	0
        // }   
           
        /**获取用户页无线设置 */
        case 105:
            return{
                "huayi_r": {
                    "channel": 1,
                    "ssid_24g": "HUAYI-2.4G",
                    "key_24g": "12345678",
                    "encryption_24g": 1,
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
            
        /**获取首页系统状态 */
        case 107: //get_home_system_info
            return{
                "huayi_r":	{
                    "pro_name":	"         G1                 01            ", //产品名称
                    "fw_version":	"VER104",// 软件版本
                    "build_time":	"2019-03-08 03:53:17",  //发布时间
                    "company_domain":	"www.baidu.com",  //官网地址
                    "time_day":	1552003729,  //当前时间
                    "uptime":	14900, //运行时间
                    "cpu_usage":	1, //cpu利用率%
                    "mem_usage":	35,// 内存利用率%
                    "webui_version":	"V3.0",
                    "domain":'huayi.com',
                    "IMEI": "12312312312312312",
                    "device_umber": "32323232"

                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        
        /**获取首页无线状态 */
        case 108: //get_home_network_info
            return{
                "huayi_r":	{
                    "sys_mode":	1,
                    // "rep_info":	{
                    //     "ssid":	"NC-LINK_e33340",
                    //     "bssid":	"98:F9:C7:E3:33:40",
                    //     "rep_status":	0
                    // },
                    "port_arr":	[{
                            "port":	"WAN",
                            "link":	1,
                            "speed":	100
                        }, {
                            "port":	"LAN4",
                            "link":	1,
                            "speed":	100
                        },{
                            "port":	"LAN3",
                            "link":	1,
                            "speed":	100
                        },{
                            "port":	"LAN2",
                            "link":	1,
                            "speed":	100
                        }, {
                            "port":	"LAN1",
                            "link":	0,
                            "speed":	0
                        }],
                    // "network_arr":	[{
                    //         "network_mode":	"lan",
                    //         "mac_addr":	"02:88:00:88:12:12",
                    //         "ip_addr":	"192.168.7.1",
                    //         "subnet_mask":	"255.255.255.0"
                    //     }, {
                    //         "network_mode":	"wan",
                    //         "link":	1,
                    //         "mac_addr":	"02:88:00:88:12:13",
                    //         "ip_addr":	"192.168.90.241",
                    //         "subnet_mask":	"255.255.255.0",
                    //         "gateway":	"192.168.90.1",
                    //         "dns_pre":	"192.168.90.1",
                    //         "dns_sec":	"192.168.90.1",
                    //         "tx_bps":	64,
                    //         "rx_bps":	96,
                    //         "tx_bytes":	1670,
                    //         "rx_bytes":	1274
                    //     }],
                    "network_arr":	[{
                        "network_mode":	"lan",
                        "mac_addr":	"02:88:00:88:12:12",
                        "ip_addr":	"0.0.0.0",
                        "subnet_mask":	"255.255.255.0"
                    }],
                    "wireless_arr": [{
                        "section": "0",
                        "status": 1,
                        "band": 9,
                        "auth_mode": "WPAWPA2PSK",
                        "auto_channel": 0,
                        "ssid": "HUAYI-2.4G",
                        "channel": 6,
                        "bssid": "00:E0:19:00:00:2D",
                        "client_sum": 0
                    }, {
                        "section": "1",
                        "status": 1,
                        "band": 9,
                        "auth_mode": "WPAWPA2PSK",
                        "auto_channel": 0,
                        "ssid": "HUAYI-5.8G",
                        "channel": 157,
                        "bssid": "00:0C:43:26:60:AA",
                        "client_sum": 0
                    }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            } 
        case 109:
            return {
                "huayi_r":	{
                    "enabled":	true,
                    "weeks":	255,
                    "start_hour":	14,
                    "start_minute":	2,
                    "end_hour":	14,
                    "end_minute":	2,
                    "remaining_time":	84180,
                    "time_of_day":	1585809594
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
                
        case 111:
            return {
                "huayi_r": {
                    "apmode": 1,
                    "wtpname": "Unknow",
                    "acipaddr": "0.0.0.0",
                    "capclistatus": 0,
                    "runtime": 0
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
               }
        case 111:
            return {	
                "reconnection":"false",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        
        case 112:
            return {
                "huayi_r":    {
                    "module_ready":"true",//flase未插入，true 已插入
                    "sim_state":    1,
                    "last_times":    3
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 113:
            return{
                "huayi_r":	{
                    "time_zone":    "CST-8",
                    "link":    1,
                    "wan_proto":    0,
                    "proto": "pppoe",
                    "ipaddr": "",
                    "netmask": "",
                    "gateway": "",
                    "dns": [""],
                    "username": "",
                    "password": "",
                    "ac": "",
                    "service": "",
                    "hostname": "HUAYI",
                    "lan_ipaddr": "192.168.7.1",
                    "lan_netmask": "255.255.255.0",
                    "ssid": "HUAYI-2.4G",
                    "encryption": 1,
                    "passphrase": "12345678",
                    "first_boot":1
                },
                    "huayierrtype":	"success",
                    "errcode":	2000,
                    "progresstime":	0
            }
        case 114:
            return{
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 5,
                "reconnection": false,
                "reconnection_addr":""
            }
        // case 114:
        //     return {
        //         "huayi_r":    {
        //             "sim_clck":    true,
        //             "last_times":    3
        //         },
        //         "huayierrtype":    "success",
        //         "errcode":    2000,
        //         "progresstime":    0
        //     }
        case 115:
            return{
                "huayi_r" : {
                    "enable_2g": false,
                    "ssid_2g": "TP-Link_Guest_22DD",
                    "hide_2g": false,
                    "enable_5g": false,
                    "ssid_5g": "TP-Link_Guest_22DD",
                    "hide_5g": false,
                    "encry": 0,
                    "passphrase": "",
                    "visible": false,
                    "access": false,
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        // case 115:
        //     return {
        //         "huayierrtype":    "success",
        //         "errcode":    2000,
        //         "progresstime":    0
        //     }
        case 116:
            return{
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 5
            }
        // case 116:
        //     return {
        //         "huayierrtype":    "success",
        //         "errcode":    2000,
        //         "progresstime":    0
        //     }
        case 117://get_internet_status
            return{
                "huayi_r": {
                    "mac_addr": "21:23:21:11:11:32",
                    "ip_addr":"192.168.2.2",
                    "wan_up": 0, //0未连接  1已连接
                    "mtu": 1450,
                    "netmask":"192.168.2.2",
                    "dns": ["192.168.2.2", "192.168.2.2"],
                    "rx_bps": 1,
                    "tx_bps": 1,
                    "ip6addr":  "2002:1234::9/64",
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 118://get_device_info
            return{
                "huayi_r": {
                    "router_info":{
                      "product_model": "Archer AX1500",
                      "mac_addr": "00-0A-EB-11-22-DD",
                      "IPV4_addr": "192.168.0.1",
                      "IPV6_addr": "FE80::20A:EBFF:FE11:22DD/64",
                    },
                    "port_info": [
                        {
                          "port_name": "WAN",
                          "link": 1,  // 0 显示灰色  1有颜色（通过speed判断）
                          "speed": 1000  // 100 黄色   1000绿色  
                        },
                        {
                          "port_name": "LAN4",
                          "link": 1,
                          "speed": 1000
                        },
                        {
                          "port_name": "LAN3",
                          "link": 1,
                          "speed": 100
                        },
                        {
                          "port_name": "LAN2",
                          "link": 1,
                          "speed": 100
                        },
                        {
                          "port_name": "LAN1",
                          "link": 0,
                          "speed": 0
                        }
                    ],
                    "wireless_2g":{
                        "enable": false,
                        "ssid": "TP-Link_22DD",
                        "key": "tplinkpassword",
                        "channel": 10,
                    },
                    "wireless_5g": {
                        "enable": false,
                        "ssid": "TP-Link_22DD",
                        "key": "tplinkpassword",
                        "channel": 36,
                    },
                    "guest_2g":{
                        "enable": true,
                        "ssid": "TP-Link_22DD",
                        "key": "1111111",
                    },
                    "guest_5g": {
                        "enable": false,
                        "ssid": "TP-Link_22DD",
                        "key": "22222222",
                    },
                    "performance":{
                        "cpu_rt_usage": 31,
                        "mem_rt_usage": 38,
                    }
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 119://set_optimize
            return{
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 120://get_home_devices
            return{
                "huayi_r": {
                    "connected_list":[
                        {
                            "name":"LINK",
                            "realtime_rate_up":"1",
                            "realtime_rate_down":"2",
                            "type":"0",//0 有线  1 2.4G无线  2  5G无线
                            "TX_Rate":"",
                            "RX_Rate":"",
                            "uptime":"111", //返回秒数  转换成时间格式   3秒 或 4分3秒 3时9分2秒
                            "block": false,
                            "mac_addr": "00-0A-EB-11-22-14",
			                "ip_addr": "192.168.0.197",
                        },
                        {
                            "name":"LINK",
                            "realtime_rate_up":"3",
                            "realtime_rate_down":"4",
                            "type":"1",//0 有线  1 2.4G无线  2  5G无线
                            "TX_Rate":"111",
                            "RX_Rate":"222",
                            "uptime":"111", //返回秒数  转换成时间格式   3秒 或 4分3秒 3时9分2秒
                            "block": true,
                            "mac_addr": "00-0A-EB-11-22-15",
			                "ip_addr": "192.168.0.197",
                        },{
                            "name":	"PCMICRO-I48MG4E",
                            "realtime_rate_up":	"0",
                            "realtime_rate_down":	"0",
                            "TX_Rate":	"1809615",
                            "RX_Rate":	"22577858",
                            "type":	2,
                            "uptime":	1019,
                            "block":	true,
                            "mac_addr":	"60:67:20:E5:38:5C",
                            "ip_addr":	"192.168.90.61"
                        }, {
                            "name":	"vivo-X23-Magic-color",
                            "realtime_rate_up":	"1758",
                            "realtime_rate_down":	"4009",
                            "TX_Rate":	"18816586",
                            "RX_Rate":	"54010483",
                            "type":	2,
                            "uptime":	952,
                            "block":	true,
                            "mac_addr":	"B4:0F:B3:97:75:F5",
                            "ip_addr":	"192.168.90.96"
                        }, {
                            "name":	"HUAWEI_P30-3541321825a9dd",
                            "realtime_rate_up":	"0",
                            "realtime_rate_down":	"0",
                            "TX_Rate":	"779894",
                            "RX_Rate":	"1459144",
                            "type":	2,
                            "uptime":	121,
                            "block":	true,
                            "mac_addr":	"2C:78:0E:7F:10:3C",
                            "ip_addr":	"192.168.90.199"
                        }, {
                            "name":	"DESKTOP-DOGG731",
                            "realtime_rate_up":	"4306",
                            "realtime_rate_down":	"55900",
                            "TX_Rate":	"9558184",
                            "RX_Rate":	"24450768",
                            "uptime":	3633,
                            "type":	0,
                            "block":	true,
                            "mac_addr":	"E0:D5:5E:F8:A5:01",
                            "ip_addr":	"192.168.90.138"
                        }, {
                            "name":	"*",
                            "realtime_rate_up":	"0",
                            "realtime_rate_down":	"0",
                            "TX_Rate":	"2433740",
                            "RX_Rate":	"792576",
                            "uptime":	20787,
                            "type":	0,
                            "block":	true,
                            "mac_addr":	"F8:4D:FC:F9:29:8F",
                            "ip_addr":	"192.168.90.246"
                        }, {
                            "name":	"DESKTOP-HAHB1TG",
                            "realtime_rate_up":	"138",
                            "realtime_rate_down":	"393",
                            "TX_Rate":	"13833313",
                            "RX_Rate":	"153403097",
                            "uptime":	20786,
                            "type":	0,
                            "block":	true,
                            "mac_addr":	"50:3E:AA:E6:8B:5C",
                            "ip_addr":	"192.168.90.48"
                        },
                    ]                
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 125:
            return{
                "huayi_r" : {
                    "enable":	true, //true
                    "pinenable":true, //true
                    "wifienable":1, //0 表示2g和5g wifi都关闭，1表示有wifi开启
                    "pincode": 12345678  
                },
                "reconnection":	"false",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 129:
            return{
                "huayi_r": {
                    "pinenable" : true, //true
                    "pincode" : 96895859  //8位
                },
                "reconnection":	"false",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 131:
            return{
                "huayi_r" : {
                    "wpsstatus": 36 //"fail"
                },
                "reconnection":	"false",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 154:
            return{
                "huayi_r" : {
                    "mode": 0,//0:router,1:AP
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 155:
            return{
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 156:
            return{
                "huayi_r":    {
                    "ssid_config":    {
                        "ssid_2g_enable":false,//2G无线开关
                        "ssid_5g_enable":true,
                        "ssid_2g":    "HUAYI-2.4G",
                        "encry_2g":    0,
                        "passphrase_2g":    "",
                        "hide_2g": false,
                        "ssid_5g":    "HUAYI-5.8G",
                        "encry_5g":    0,
                        "passphrase_5g":    "",
                        "hide_5g": false,
                    },
                    "guest":    {
                        "enable_2g": false,
                        "ssid_2g": "TP-Link_Guest_22DD",
                        "hide_2g": false,
                        "enable_5g": false,
                        "ssid_5g": "TP-Link_Guest_22DD",
                        "hide_5g": false,
                        "encry": 0,
                        "passphrase": "",
                        "visible": false,
                        "access": false,
                    },
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 157:
            return{
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 5
            }
            
        /**获取pptp服务器配置 */
        case 158:
            return {
                "huayi_r":    {
                    "pptpd_enable":    true,
                    "pptpd_startip":    "172.1.1.10",
                    "pptpd_endip":    "172.1.1.20",
                    "server_ip":    "192.168.91.1",
                    "mppe":    0,
                    "dns_enable":    false,
                    "primary_dns":    "",
                    "secondary_dns":    "",
                    "mtu":    1482,
                    "mru":    1482,
                    "xl2tpd_startip":    "172.1.1.30",
                    "xl2tpd_endip":    "172.1.1.40",
                    "proto":    "dhcp"
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
             /**获取pptp服务器配置 */
        case 159:
            return {
                "huayi_r":    {
                    "pptpd_enable":    true,
                    "pptpd_start_addr":    "172.1.1.10",
                    "pptpd_end_addr":    "172.1.1.20",
                    "server_addr":    "192.168.91.1",
                    "mppe":    0,
                    "dns_enable":    false,
                    "primary_dns":    "",
                    "secondary_dns":    "",
                    "mtu":    1482,
                    "mru":    1482,
                    "xl2tpd_start_addr":    "172.1.1.30",
                    "xl2tpd_end_addr":    "172.1.1.40",
                    "proto":    "dhcp"
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 160:
            return {
                "huayi_r":    {
                    "xl2tpd_enable":    true,
                    "xl2tp_enable":    false,
                    "xl2tpd_startip":    "172.1.1.30",
                    "xl2tpd_endip":    "172.1.1.40",
                    "server_ip":    "192.168.91.1",
                    "ipsec_enable":    false,
                    "ipsec_key":    "",
                    "dns_enable":    false,
                    "primary_dns":    "",
                    "secondary_dns":    "",
                    "mtu":    1400,
                    "mru":    1400,
                    "proto":    "dhcp",
                    "pptpd_startip":    "172.1.1.10",
                    "pptpd_endip":    "172.1.1.20"
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 162:
            return {
                "huayi_r":    {
                    "pptp_enable":    true,
                    "username":    "123456",
                    "password":    "123456",
                    "server_ip":    "192.168.91.1",
                    "mppe":    1,
                    "route_type":    0,
                    "pptp_status":    0,
                    "pptp_ip":    "unknown command",
                    "pptp_static_router_list":[
                        {"netmask": "255.255.255.0","target": "192.168.92.1"},
                        {"netmask": "255.255.255.0","target": "192.168.95.1"}]
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 164:
            return {
                "huayi_r": {
                    "xl2tp_enable": true,
                    "xl2tp_ip":'0.0.0.0',
                    "xl2tpd_enable": false,
                    "server_ip": "192.168.30.1",
                    "username":"abc",
                    "password":"abc",
                    "route_type":0,
                    "xl2tp_status":0,
                    "xl2tp_static_router_list":[{"netmask": "255.255.255.0","target": "192.168.92.1"},
                    {"netmask": "255.255.255.0","target": "192.168.92.1"},
                    {"netmask": "255.255.255.0","target": "192.168.92.1"},
                    {"netmask": "255.255.255.0","target": "192.168.92.1"},
                    {"netmask": "255.255.255.0","target": "192.168.92.1"},{"netmask": "255.255.255.0","target": "192.168.95.1"}]
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 166:
            return {
                "huayi_r": {
                    "vpnUser_list":[
                    {
                        "authenticate":'all',
                        "username":"1",
                        "password":'1234556',
                        "remoteip":"192.168.7.1",
                        "route":[
                            {"netmask": "255.255.255.255","target": "192.168.92.1"},
                            {"netmask": "255.255.0.0","target": "192.168.95.1"}
                        ],
                        "desc":'babababa'
                    },
                    {
                        "authenticate":'pppoe',
                        "username":"2",
                        "password":'1234556',
                        "remoteip":"192.168.6.1",
                        "route":[
                            {"netmask": "255.255.255.0","target": "192.168.92.1"},
                            {"netmask": "255.255.255.0","target": "192.168.95.1"}
                        ],
                        "desc":'babababa'
                    },
                    {
                        "authenticate":'pptp',
                        "username":"3",
                        "password":'1234556',
                        "remoteip":"192.168.1.1",
                        "route":[
                            {"netmask": "255.255.255.0","target": "192.168.92.1"},
                            {"netmask": "255.255.255.0","target": "192.168.95.1"}
                        ],
                        "desc":'babababa'
                    },{
                        "authenticate":"xl2tp",
                        "username":"4",
                        "password":'1234556',
                        "remoteip":"192.168.2.1",
                        "route":[
                            {"netmask": "255.255.255.0","target": "192.168.92.1"},
                            {"netmask": "255.255.255.0","target": "192.168.95.1"}
                        ],
                        "desc":'babababa'
                    }],
                    "vpn_type_list":[{
                        "id":1,
                        "authenticate":'all'
                    },{
                        "id":2,
                        "authenticate":'pptp'
                    },{
                        "id":3,
                        "authenticate":'xl2tp'
                    },{
                        "id":4,
                        "authenticate":'pppoe'
                    },{
                        "id":5,
                        "authenticate":'xpptp'
                    }],
                    "pptpd_startip":    "172.1.1.10",
                    "pptpd_endip":    "172.1.1.20",
                    "xl2tpd_startip":    "172.1.1.30",
                    "xl2tpd_endip":    "172.1.1.40",
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 168:
            return {
                "huayi_r": {
                    "user_list":[
                        {   
                            "pid":"3",
                            "account":"a",
                            "account_type":"xl2tpd",
                            "ip":"192.168.1.1",
                            "device_ip":"192.168.7.12",
                            "jointime":1559185212 ,
                        },
                        {   
                            "pid":"1",
                            "account_type":"pptpd",
                            "account":"b",
                            "ip":"192.168.2.2",
                            "device_ip":"192.168.7.12",
                            "jointime":1559185212 ,
                        },
                        {   
                            "pid":"2",
                            "account":"c",
                            "account_type":"xl2tpd",
                            "ip":"192.168.3.2",
                            "device_ip":"192.168.7.12",
                            "jointime":1559185212 
                        }
                    ]
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 169:
            return{
                "huayi_r" : {
                    "enable":    0, //0 功能开关
                    "wan6_type" : {
                        // "proto":"", //dhcpv6 pppoe static
                        // "ip6addr":"2002:22:33:44::1",  //ipv6格式 
                        // "ip6gw":"2002:22:33:44::1", //ipv6格式
                        // "prefixlen": "64",
                    },
                    "lan" : {
                        "assigned_type":"dhcpv6", // dhcpv6  , slaac  ,dhcpv6+slaac
                        "address_prefix":"", //最长4段21个字符，  2001:DB10:2001:2001::
                        "ip6addr":"3333::1",//ipv6格式   可以修改
                        "release_time":86400,    //范围：
                        "ip6dns1":"", //ipv6格式
                        "ip6dns2":"", //ipv6格式
                    },
                },
                "reconnection":    "false",
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 170:
            return{
                "reconnection":    "false",
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    20
            }
        case 172:
            return{
                "huayi_r":    {
                    "igmp_proxy":    1,
                    "igmp_snooping":    1,
                    "igmp_version":     2,
                    "wifi_multicast_forword": 1
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 173:
            return{
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 174:
            return{
                "huayi_r":    {
                    "portal_mode":    0,//{0表示 No Authentication,1表示Local Password}
                    "portal_timeout":    1507,//单位分钟
                    "portal_enable": true,
                    "portal_redirect_enable":    false,
                    "portal_redirect":    "http://www.baidu.com",
                    "auth_passwd":"123",
                    "auth_time": 3000,//单位s
                    "portal_name":["a.png","b.png"]
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 175:
            return{
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 10
            }
        case 176: 
            return{
                "huayi_r": {
                    "ftp_enable": true,
                    "is_usb":true,
                    "ftp_list": [
                        {
                            "drive": "/dev/sda",
                            "capacity": 1024,
                            "unused":1024,
                            "path": "ftp://192.168.7.1/mnt"
                        },
                        {
                            "drive": "/dev/sda",
                            "capacity": 1024,
                            "unused":1024,
                            "path": "ftp://192.168.7.1/mnt"
                        },
                        {
                            "drive": "/dev/sda",
                            "capacity": 1024,
                            "unused":1024,
                            "path": "ftp://192.168.7.1/mnt"
                        }
                    ]
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 177:
            return{
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    10
            }
        case 178:
            return{
                "huayi_r": {
                    "printer_enable": true,
                },
                "huayierrtype": "success",
                "errcode": 2000,
                "progresstime": 0
            }
        case 179:
            return{
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    10
            }
        case 180:
            return{
                    "huayi_r":    {
                        "enable":    1,
                        "port":    7547,
                        "iface":    "eth1",
                        "auth":    "Basic",
                        "cpe_uname":    "easycwmp",
                        "cpe_passwd":    "easycwmp",
                        "url":    "http://192.168.1.3:80/acs",
                        "acs_uname":    "admin",
                        "acs_passwd":    "admin",
                        "heart_beat":    1,
                        "interval":    1800,
                        "serial":    "FFFFFF123456",
                        "link_stat": 0,
                    },
                    "huayierrtype":    "success",
                    "errcode":    2000,
                    "progresstime":    0
            }
        case 181:
            return{
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    10
            }
        case 183:
            return{
                "huayi_r":    {
                    "fix_dhcp_admin":    true,
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            } 
        case 189:
            return{
                "huayi_r":    {
                    "hbp":    1,
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            } 
        case 187:
            return{
                "huayi_r":{
                      "enable": true,
                      "option": 1,//0:表单提交；1：配置文件上传
                      "host_name": "Host Name",
                      "usr":"1",
                      "pwd":"12345678",
                      "port":7547,
                      "status":2,//0:失败；1：成功；2：未连接
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 193:
            return{
                "huayi_r":{
                      "enable": true,
                      "option": 1,//0:表单提交；1：配置文件上传
                      "host_name": "Host Name",
                      "usr":"1",
                      "pwd":"12345678",
                      "port":7547,
                      "status":2,//0:失败；1：成功；2：未连接
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        default:
            return{
                "reconnection":	true,
                //"reconnection_addr":	"192.168.88.1",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	10
            }
    }
  };
  