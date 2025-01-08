module.exports = function (data) {
    switch(data.HYID){ 
        case 0:
            // return{
            //     "huayi_r":    {
            //         "wan_mode":    "wired",
            //         "wan_up":    0,
            //         "wan_uptime":    15,
            //         "sim_state":    0,
            //         "mobile_network":    "CHN-CT",
            //         "mobile_type":    "",
            //         "signal":    0,
            //         "client_sum":    "1",
            //         "tx_bps":    5,
            //         "rx_bps":    7,
            //         "rx_bytes":    828,
            //         "tx_bytes":    4380,
            //         "wifi_2g":1,
            //         "wifi_5g":1
            //     },
            //     "huayierrtype":    "success",
            //     "errcode":    2000,
            //     "progresstime":    0
            // }
            return{
                "huayi_r":    {
                    "wan_mode":    "prior",
                    "wan_up":    1,
                    "wan_uptime":    335,
                    "sim_state":    1,
                    "mobile_network":    "CHN-UNICOM",
                    "mobile_type":    "4G",
                    "signal":    -100,
                    "client_sum":    "1",
                    "tx_bps":    2,
                    "rx_bps":    4,
                    "rx_bytes":    8503,
                    "tx_bytes":    37162,
                    "wifi_2g":1,
                    "wifi_5g":1,
                    "signal_4g":"90",
                    "band":"3"
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
            // return{
            //     "huayi_r":    {
            //         "wan_mode":    "mobile",
            //         "wan_up":    0,
            //         "wan_uptime":    335,
            //         "sim_state":    2,
            //         "mobile_network":    "CHN-UNICOM",
            //         "mobile_type":    "4G",
            //         "signal":    -20,
            //         "client_sum":    "1",
            //         "tx_bps":    2,
            //         "rx_bps":    4,
            //         "rx_bytes":    8503,
            //         "tx_bytes":    37162,
            //         "wifi_2g":1,
            //         "wifi_5g":1
            //     },
            //     "huayierrtype":    "success",
            //     "errcode":    2000,
            //     "progresstime":    0
            // }
        /**获取无线WAN+4G  */
        case 1://cgi_get_wan_or_wan4g_config
            return{
                "huayi_r": {
                    "wan_mode":"wired",  //wired表示有线，mobile表示4G，prior表示有线优先，rep4g表示无线WAN+4G, rep表示无线WAN
                    "auth_type":    "0",
                    "apn_name":    "3gnet",
                    "apn_usr":    " ",
                    "apn_pwd":    " ",
                    "use_apn":    0,
                    "detect_ip":'192.168.90.13',
                    "detect_time":300,
                    "def_mac_addr":'00:19:be:20:03:5c',
                    "mac_addr":'00:19:be:20:03:5B',
                    'cc_mtu':1500,
                    "band":1
                  },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }            
        case 3:
            return{
                "huayi_r":	{
                    "messages_unread":	13
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }          
        case 4:
            return{
                "huayi_r":	{
                    "huayi_sms":	[{
                            "message_id":	"11",
                            "phone_num":	"18603033815",
                            "message_content":	"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            "message_count":	"5",
                            "final_time":	"2019-10-22 14:50:06",
                            "messages_unread":	"5",
                            "c_message_sid":	"5"
                        }, {
                            "message_id":	"12",
                            "phone_num":	"18816763134",
                            "message_content":	"asdf123456",
                            "message_count":	"1",
                            "final_time":	"2019-10-22 14:49:24",
                            "messages_unread":	"1",
                            "c_message_sid":	"1"
                        }, {
                            "message_id":	"1",
                            "phone_num":	"18665802506",
                            "message_content":	"电加热器",
                            "message_count":	"21",
                            "final_time":	"2019-10-22 14:49:03",
                            "messages_unread":	"21",
                            "c_message_sid":	"21"
                        }, {
                            "message_id":	"13",
                            "phone_num":	"13697313271",
                            "message_content":	"shshd2337一二",
                            "message_count":	"3",
                            "final_time":	"2019-10-22 14:48:47",
                            "messages_unread":	"3",
                            "c_message_sid":	"3"
                        }, {
                            "message_id":	"10",
                            "phone_num":	"18320870073",
                            "message_content":	"hdhdujd4545486心想事成",
                            "message_count":	"6",
                            "final_time":	"2019-10-22 14:48:03",
                            "messages_unread":	"6",
                            "c_message_sid":	"5"
                        }, {
                            "message_id":	"8",
                            "phone_num":	"106929395555",
                            "message_content":	"【招商银行】尊敬的罗海*先生，恭喜您获得领奖资格，华为手机及打车券限时派发，速戳 cmbt.cn/kxc 链接[回@5TD退订短信]",
                            "message_count":	"2",
                            "final_time":	"2019-10-21 12:53:31",
                            "messages_unread":	"2",
                            "c_message_sid":	"2"
                        }, {
                            "message_id":	"7",
                            "phone_num":	"106903409551186",
                            "message_content":	"【平安银行】华为Mate 30 8GB+128GB 新品手机，平安信用卡分24期月供仅179.13元，回复MT13订购。退订回TD。",
                            "message_count":	"3",
                            "final_time":	"2019-10-21 12:17:29",
                            "messages_unread":	"3",
                            "c_message_sid":	"3"
                        }, {
                            "message_id":	"9",
                            "phone_num":	"106920309551186",
                            "message_content":	"平安银行温馨提醒，您的账单日已临近。10月16日前回复DDFQ0285，可申请将未出账单中967.27元分3期还，每",
                            "message_count":	"2",
                            "final_time":	"2019-10-12 19:40:53",
                            "messages_unread":	"2",
                            "c_message_sid":	"1"
                        }, {
                            "message_id":	"6",
                            "phone_num":	"1065502407599214",
                            "message_content":	"【ranvoo旗舰店】亲，您拍的（苹果手机壳）急需您评价（内容我编辑给您），麻烦加店铺微信 18025396141，返您10元微",
                            "message_count":	"2",
                            "final_time":	"2019-10-10 12:00:08",
                            "messages_unread":	"2",
                            "c_message_sid":	"1"
                        }, {
                            "message_id":	"5",
                            "phone_num":	"1065500097025159",
                            "message_content":	"【陌陌科技】你有3个好友最近活跃，快来问问彼此过得如何http://dwz.cn/8X47KCCe 退订TD",
                            "message_count":	"1",
                            "final_time":	"2019-09-26 17:35:12",
                            "messages_unread":	"1",
                            "c_message_sid":	"1"
                        }, {
                            "message_id":	"4",
                            "phone_num":	"955396286083",
                            "message_content":	"180元优惠券礼包开抢啦！南航官方渠道购票最高可享100元优惠！戳：m.csair.com/b/?LGKMkgHvQr 立即领取！-【南航】",
                            "message_count":	"1",
                            "final_time":	"2019-09-26 14:36:22",
                            "messages_unread":	"1",
                            "c_message_sid":	"1"
                        }, {
                            "message_id":	"3",
                            "phone_num":	"1069285552030542",
                            "message_content":	"【多面】多面-视频招聘App来啦！刷视频，招人才，更高效。百万求职者已加入多面等你来选，点击下载： y0.cn/Ab 抢理想人才。T退订",
                            "message_count":	"1",
                            "final_time":	"2019-09-26 13:21:41",
                            "messages_unread":	"1",
                            "c_message_sid":	"1"
                        }, {
                            "message_id":	"2",
                            "phone_num":	"10655810010",
                            "message_content":	"办理王卡业务！一年365天全年无休，一天24小时随时待命，给您最贴心的伺候！微信内搜索“王卡助手”公众号，关注并点击“开通”-“",
                            "message_count":	"1",
                            "final_time":	"2018-04-13 11:06:46",
                            "messages_unread":	"1",
                            "c_message_sid":	"1"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 5:
            return {
                "huayi_r":	{
                    "sms_session":	[{
                            "c_messages_sid":	"3",
                            "message_content":	"办理王卡业务！一年365天全年无休，一天24小时随时待命，给您最贴心的伺候！微信内搜索“王卡助手”公众号，关注并点击“开通”-“",
                            "receive_time":	"2019-10-14 10:36:26",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"4",
                            "message_content":	"办理王卡业务！一年365天全年无休，一天24小时随时待命，给您最贴心的伺候！微信内搜索“王卡助手”公众号，关注并点击“开通”-“",
                            "receive_time":	"2019-10-21 10:47:50",
                            "sms_src":	"1"
                        }, {
                            "c_messages_sid":	"5",
                            "message_content":	"办理王卡业务！一年365天全年无休，一天24小时随时待命，给您最贴心的伺候！微信内搜索“王卡助手”公众号，关注并点击“开通”-“",
                            "receive_time":	"2019-10-21 10:48:04",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"1",
                            "message_content":	"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            "receive_time":	"2019-10-21 11:05:41",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"2",
                            "message_content":	"办理王卡业务！一年365天全年无休，一天24小时随时待命，给您最贴心的伺候！微信内搜索“王卡助手”公众号，关注并点击“开通”-“",
                            "receive_time":	"2019-10-21 11:06:30",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"6",
                            "message_content":	"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            "receive_time":	"2019-10-21 11:06:31",
                            "sms_src":	"1"
                        }, {
                            "c_messages_sid":	"7",
                            "message_content":	"333333",
                            "receive_time":	"2019-10-21 11:06:33",
                            "sms_src":	"1"
                        }, {
                            "c_messages_sid":	"8",
                            "message_content":	"办理王卡业务！一年365天全年无休，一天24小时随时待命，给您最贴心的伺候！微信内搜索“王卡助手”公众号，关注并点击“开通”-“",
                            "receive_time":	"2019-10-21 11:06:35",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"9",
                            "message_content":	"555555",
                            "receive_time":	"2019-10-21 11:06:36",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"10",
                            "message_content":	"666666",
                            "receive_time":	"2019-10-21 11:06:38",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"11",
                            "message_content":	"777777",
                            "receive_time":	"2019-10-21 11:06:40",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"12",
                            "message_content":	"888888",
                            "receive_time":	"2019-10-21 11:06:42",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"13",
                            "message_content":	"999999",
                            "receive_time":	"2019-10-21 11:06:44",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"14",
                            "message_content":	"00000000",
                            "receive_time":	"2019-10-21 11:06:46",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"15",
                            "message_content":	"222",
                            "receive_time":	"2019-10-21 11:14:09",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"16",
                            "message_content":	"333",
                            "receive_time":	"2019-10-21 11:14:10",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"17",
                            "message_content":	"888",
                            "receive_time":	"2019-10-21 11:22:12",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"18",
                            "message_content":	"999",
                            "receive_time":	"2019-10-21 11:22:13",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"19",
                            "message_content":	"123",
                            "receive_time":	"2019-10-22 14:48:53",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"20",
                            "message_content":	"ABC",
                            "receive_time":	"2019-10-22 14:48:56",
                            "sms_src":	"0"
                        }, {
                            "c_messages_sid":	"21",
                            "message_content":	"电加热器",
                            "receive_time":	"2019-10-22 14:49:03",
                            "sms_src":	"0"
                        }]
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
        case 8:
            return {
                "huayi_r":	{
                    "send_count":	3,
                    "success_count":	5,
                    "fail_count":	3,
                    "sim_state":0   ,//状态值 0表示SIM卡异常  1表示SIM卡正常  2表示SIM卡锁住
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }
            
        case 9:
            return{
                "huayi_r":	{
                    "module_ready":	true,
                    "sim_state":	1,//0 SIM无效，1 SIM正常,2 SIM锁定 ，3PUK锁定
                    "last_times":	3//剩余次数
                },
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	0
            }

        case 10:
            // return{
            //     "last_times":	2,
            //     "huayierrtype":	"permission deny",
            //     "errcode":	4011,
            //     "progresstime":	0
            // }
            return{
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime": 15
            }
                
        case 11:
                return{
                    "huayi_r":	{
                        "sim_clck":	false,
                        "last_times":	2,
                    },
                    "huayierrtype":	"success",
                    "errcode":	2000,
                    "progresstime":	0
                }
                // return{
                //     "huayi_r":    {
                //         "sim_clck":    false,
                //         "last_times":    3
                //     },
                //     "huayierrtype":    "success",
                //     "errcode":    2000,
                //     "progresstime":    0
                // }
        case 12:
                return{
                    "huayierrtype":    "success",
                    "errcode":    2000,
                    "progresstime":    10
                }
        case 13:
            // return{
            //     "last_times":    2,
            //     "huayierrtype":    "pin code error",
            //     "errcode":    4011,
            //     "progresstime":    0
            // }
            return{
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    15
            }
            
        case 14://get_module_apn_config
            return{
                "huayi_r":    {
                    "wan_mode":"wired",//mobile
                    "module_ready":    true,
                    "sim_state":    1,
                    "auth_type":    "0",
                    "apn_name":    "3gnet",
                    "apn_usr":    " ",
                    "apn_pwd":    " ",
                    "use_apn":    1
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
            return{
                "huayi_r":    {
                    "module_ready":    false,
                    "sim_state": 0,
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 15:
            return{                
                "reconnection":	false,
                "reconnection_addr":	"",
                "huayierrtype":	"success",
                "errcode":	2000,
                "progresstime":	15
            }
        case 16:
            return{
                "huayi_r": {
                    "signal":100,
                    "ssid_2g":"huayi_2.4G",
                    "pwd_2g":"123456",
                    "ssid_5g":"huayi_5.8G",
                    "pwd_5g":"123456"
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 17:
            return{
                "huayi_r": {},
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
        case 18:
            return{
                "huayi_r": {
                    "card":1,//   1表示卡槽1；2：表示卡槽2；3: 表示卡槽3；4：表示卡槽4。 从小到大顺序，最后一个卡槽一定是拔插卡
                    "operator":2, //   1表示电信；2表示联通；3表示移动
                    "lock": 1,
                    "card_info":[
                        {
                            "card":1,
                            "operator":2,
                            "iccid":"8213131313"    //表此卡可以切，值为空时代表卡不可切,切卡按钮至灰
                        },{
                            "card":2,
                            "operator":3,
                            "iccid":""    //表此卡可以切，值为空时代表卡不可切,切卡按钮至灰
                        },{
                            "card":3,
                            "operator":1,
                            "iccid":"sdadadadas"    //表此卡可以切，值为空时代表卡不可切,切卡按钮至灰
                        },
                        // {
                        //     "card":4,
                        //     "operator":2,
                        //     "iccid":"89861122219044576047"    //表此卡可以切，值为空时代表卡不可切,切卡按钮至灰
                        // }
                    ]
                },
                "huayierrtype":    "success",
                "errcode":    2000,
                "progresstime":    0
            }
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
        case 91:
        case 100:
        case 101:
            return {	
                "reconnection":"false",
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
  