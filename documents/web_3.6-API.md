### Post路径变化

post 的HYID 改为 cgi_modem.cgi

### 短信模块

#### 获取新信息状态

get_new_sms_state

request

```
{
	"HYID":3
} 
```

response

```
{
	"result":	{
		"messages_unread":	13
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

messages_unread 为0表示没有信息，大于0表示有短信未读

此接口用于右上角图标提醒，没有延迟，及时返回



#### 获取短信概览信息

get_breaf_sms_info

request

```
{
	"HYID":1
} 
```

response

```
{
	"result":	{
		"huayi_sms":	[{
				"sid":	"11",
				"number":	"18603033815",
				"sms_msg":	"hjsjsjjs靠靠靠靠靠靠看看男男女女老老少少Jjjnjjkwkejj",
				"sms_count":	"5",
				"last_time":	"2019-10-22 14:50:06",
				"unread_count":	"5",
				"c_sid":	"5"
			}, {
				"sid":	"12",
				"number":	"18816763134",
				"sms_msg":	"asdf123456",
				"sms_count":	"1",
				"last_time":	"2019-10-22 14:49:24",
				"unread_count":	"1",
				"c_sid":	"1"
			}, {
				"sid":	"1",
				"number":	"18665802506",
				"sms_msg":	"电加热器",
				"sms_count":	"21",
				"last_time":	"2019-10-22 14:49:03",
				"unread_count":	"21",
				"c_sid":	"21"
			}, {
				"sid":	"13",
				"number":	"13697313271",
				"sms_msg":	"shshd2337一二",
				"sms_count":	"3",
				"last_time":	"2019-10-22 14:48:47",
				"unread_count":	"3",
				"c_sid":	"3"
			}, {
				"sid":	"10",
				"number":	"18320870073",
				"sms_msg":	"hdhdujd4545486心想事成",
				"sms_count":	"6",
				"last_time":	"2019-10-22 14:48:03",
				"unread_count":	"6",
				"c_sid":	"5"
			}, {
				"sid":	"8",
				"number":	"106929395555",
				"sms_msg":	"【招商银行】尊敬的罗海*先生，恭喜您获得领奖资格，华为手机及打车券限时派发，速戳 cmbt.cn/kxc 链接[回@5TD退订短信]",
				"sms_count":	"2",
				"last_time":	"2019-10-21 12:53:31",
				"unread_count":	"2",
				"c_sid":	"2"
			}, {
				"sid":	"7",
				"number":	"106903409551186",
				"sms_msg":	"【平安银行】华为Mate 30 8GB+128GB 新品手机，平安信用卡分24期月供仅179.13元，回复MT13订购。退订回TD。",
				"sms_count":	"3",
				"last_time":	"2019-10-21 12:17:29",
				"unread_count":	"3",
				"c_sid":	"3"
			}, {
				"sid":	"9",
				"number":	"106920309551186",
				"sms_msg":	"平安银行温馨提醒，您的账单日已临近。10月16日前回复DDFQ0285，可申请将未出账单中967.27元分3期还，每",
				"sms_count":	"2",
				"last_time":	"2019-10-12 19:40:53",
				"unread_count":	"2",
				"c_sid":	"1"
			}, {
				"sid":	"6",
				"number":	"1065502407599214",
				"sms_msg":	"【ranvoo旗舰店】亲，您拍的（苹果手机壳）急需您评价（内容我编辑给您），麻烦加店铺微信 18025396141，返您10元微",
				"sms_count":	"2",
				"last_time":	"2019-10-10 12:00:08",
				"unread_count":	"2",
				"c_sid":	"1"
			}, {
				"sid":	"5",
				"number":	"1065500097025159",
				"sms_msg":	"【陌陌科技】你有3个好友最近活跃，快来问问彼此过得如何http://dwz.cn/8X47KCCe 退订TD",
				"sms_count":	"1",
				"last_time":	"2019-09-26 17:35:12",
				"unread_count":	"1",
				"c_sid":	"1"
			}, {
				"sid":	"4",
				"number":	"955396286083",
				"sms_msg":	"180元优惠券礼包开抢啦！南航官方渠道购票最高可享100元优惠！戳：m.csair.com/b/?LGKMkgHvQr 立即领取！-【南航】",
				"sms_count":	"1",
				"last_time":	"2019-09-26 14:36:22",
				"unread_count":	"1",
				"c_sid":	"1"
			}, {
				"sid":	"3",
				"number":	"1069285552030542",
				"sms_msg":	"【多面】多面-视频招聘App来啦！刷视频，招人才，更高效。百万求职者已加入多面等你来选，点击下载： y0.cn/Ab 抢理想人才。T退订",
				"sms_count":	"1",
				"last_time":	"2019-09-26 13:21:41",
				"unread_count":	"1",
				"c_sid":	"1"
			}, {
				"sid":	"2",
				"number":	"10655810010",
				"sms_msg":	"办理王卡业务！一年365天全年无休，一天24小时随时待命，给您最贴心的伺候！微信内搜索“王卡助手”公众号，关注并点击“开通”-“",
				"sms_count":	"1",
				"last_time":	"2018-04-13 11:06:46",
				"unread_count":	"1",
				"c_sid":	"1"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

sid 为号码对应的id，唯一，如果删除整条号码的所有短信，需要传给后台，

number 为电话号码

sms_msg:为预览的短信内容，为该号码下最新的一条信息

sms_count:为该号码有多少条短信

last_time：为最新的一条短信的时间

unread_count:为未读信息条目数，大于0表示有未读信息

c_sid:表示显示的这条信息的子id

已经按时间排列顺序，最新的在最顶部



#### 获取短信会话

get_sms_session_by_number

request

```
{
	"HYID":2,
	"number":"18665802506"
} 
```

response

```
{
	"result":	{
		"sms_session":	[{
				"c_sid":	"3",
				"sms_msg":	"111",
				"re_time":	"2019-10-14 10:36:26",
				"sms_src":	"0"
			}, {
				"c_sid":	"4",
				"sms_msg":	"111111111",
				"re_time":	"2019-10-21 10:47:50",
				"sms_src":	"0"
			}, {
				"c_sid":	"5",
				"sms_msg":	"12345678",
				"re_time":	"2019-10-21 10:48:04",
				"sms_src":	"0"
			}, {
				"c_sid":	"1",
				"sms_msg":	"pix-link",
				"re_time":	"2019-10-21 11:05:41",
				"sms_src":	"0"
			}, {
				"c_sid":	"2",
				"sms_msg":	"111111",
				"re_time":	"2019-10-21 11:06:30",
				"sms_src":	"0"
			}, {
				"c_sid":	"6",
				"sms_msg":	"222222",
				"re_time":	"2019-10-21 11:06:31",
				"sms_src":	"0"
			}, {
				"c_sid":	"7",
				"sms_msg":	"333333",
				"re_time":	"2019-10-21 11:06:33",
				"sms_src":	"0"
			}, {
				"c_sid":	"8",
				"sms_msg":	"444444",
				"re_time":	"2019-10-21 11:06:35",
				"sms_src":	"0"
			}, {
				"c_sid":	"9",
				"sms_msg":	"555555",
				"re_time":	"2019-10-21 11:06:36",
				"sms_src":	"0"
			}, {
				"c_sid":	"10",
				"sms_msg":	"666666",
				"re_time":	"2019-10-21 11:06:38",
				"sms_src":	"0"
			}, {
				"c_sid":	"11",
				"sms_msg":	"777777",
				"re_time":	"2019-10-21 11:06:40",
				"sms_src":	"0"
			}, {
				"c_sid":	"12",
				"sms_msg":	"888888",
				"re_time":	"2019-10-21 11:06:42",
				"sms_src":	"0"
			}, {
				"c_sid":	"13",
				"sms_msg":	"999999",
				"re_time":	"2019-10-21 11:06:44",
				"sms_src":	"0"
			}, {
				"c_sid":	"14",
				"sms_msg":	"00000000",
				"re_time":	"2019-10-21 11:06:46",
				"sms_src":	"0"
			}, {
				"c_sid":	"15",
				"sms_msg":	"222",
				"re_time":	"2019-10-21 11:14:09",
				"sms_src":	"0"
			}, {
				"c_sid":	"16",
				"sms_msg":	"333",
				"re_time":	"2019-10-21 11:14:10",
				"sms_src":	"0"
			}, {
				"c_sid":	"17",
				"sms_msg":	"888",
				"re_time":	"2019-10-21 11:22:12",
				"sms_src":	"0"
			}, {
				"c_sid":	"18",
				"sms_msg":	"999",
				"re_time":	"2019-10-21 11:22:13",
				"sms_src":	"0"
			}, {
				"c_sid":	"19",
				"sms_msg":	"123",
				"re_time":	"2019-10-22 14:48:53",
				"sms_src":	"0"
			}, {
				"c_sid":	"20",
				"sms_msg":	"ABC",
				"re_time":	"2019-10-22 14:48:56",
				"sms_src":	"0"
			}, {
				"c_sid":	"21",
				"sms_msg":	"电加热器",
				"re_time":	"2019-10-22 14:49:03",
				"sms_src":	"0"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

已经按时间排列，最新的在最底部

c_sid 为短信的id，因为短信的内容可以重复，删除时需要将电话号码跟此id发送后台，多选删除时用分号隔开

因为发送短信的时候多个号码用分号隔开，此处统一用分号

sms_msg:为短信的内容

re_time:为短信的时间

sms_src:为短信的来源，0为接收到的短信，显示在左侧，1为自己发送的短信，显示右侧

获取了某个号码的短信回话后，该号码的unread_count（未读）字段会被置0



#### 删除短信会话

delete_sms_session_by_sid

request

```
{
	"HYID":3,
	"sid":"11;12"
} 
{
	"HYID":109,
	"sid":"13"
} 
```

response

```
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



此接口用于删除一个号码所有短信，需要的参数为HYID 107中获取的sid，多选时用分号隔开

只能在最外层页面删除会话，动作成功后发送 107更新页面数据



#### 删除短信

delete_sms_by_cid

request

```
{
	"HYID":4,
	"number":"18665802506",
	"c_sid":"13"
} 
```

response

```
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

进入回话页面可以删除短信，多选时用分号隔开，全选时，短信全部删除，再用此号码发送108会返回 空的列表，回到外层会话列表后获取数据会更新，不用特意考虑全选删除的情况



#### 发送短信

send_sms_messages

request

```
{
	"HYID":5,
	"number":"10086;10010;",
	"sms_msg":"hello world"
} 
```

response

```
{
	"result":	{
		"send_count":	3,
		"success_count":	0,
		"fail_count":	3
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



短信的转发，回复，新建短信发送，都调用此接口

多个号码用分号隔开，短信内容限制

没有中文或中文字符时140字节，

有中文或者中文字符时70字节，

返回值只有2000，但是会返回

send_count ，发送的短信条数

success_count 发送成功的条数

fail_count 失败的条数

只有短信发送的接口，不能及时返回，页面需要等待，后台返回后提示按照count 提示







### PIN码管理

#### 获取模块pin码状态

get_module_pin_state

request

```
{
	"HYID":6
}
```

response

```
{
	"result":	{
		"module_ready":	true,
		"sim_state":	1,
		"last_times":	3
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"module_ready":	true,
		"sim_state":	0,
		"last_times":	3
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"module_ready":	true,
		"sim_state":	2,
		"last_times":	3
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

last_times 表示剩余次数，sim_state 为0 1 2 3四种

当sim_state返回0时显示 sim卡无效或sim卡未插入

1 为正常，这是显示包含页面

2为锁定，显示解锁页面

3为PUK 锁定，提示用户需要去营业厅办理解锁

#### PIN 解锁sim卡

sim_lock_set_pin

request

```
{
	"HYID":7,
	"sim_clck":true,
	"pin_code":”1234”
}
{
	"HYID":97,
	"sim_clck":false,
	"pin_code":"1234"
}
```

response

```
{
	"last_times":	1,
	"huayierrtype":	"pin code error",
	"errcode":	4011,
	"progresstime":	0
}
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

pin_code字段要用字符串传给我，比如0000，是“0000”，



#### 获取pin码clck状态

get_sim_clck

request

```
{
		"HYID":8
}
```

response

```
{
	"result":	{
		"sim_clck":	true,
		"last_times":	3
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"sim_clck":	false,
		"last_times":	3
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 设置pin码clck状态

set_pin_clck

request

```
{
		"HYID":9,
		"sim_clck":true,
		"pin_code":"1234"
}
```

response

```
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"last_times":	2,
	"huayierrtype":	"pin code error",
	"errcode":	4011,
	"progresstime":	0
}
```



#### 修改模块pin码

change_module_pin_code

request

```
{
	"HYID":10,
	"old_pin_code":"1234"
	"new_pin_code":"12345"
}
```

response

```
{
	"last_times":	2,
	"huayierrtype":	"pin code error",
	"errcode":	4011,
	"progresstime":	0
}
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



### 移动网络设置

#### 获取模块APN配置

get_module_apn_config

request

```
{
	"HYID": 11
}
```

response

```
{
	"result":	{
		"module_ready":	false,
		"sim_state": 0,
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

{
	"result":	{
		"module_ready":	true,
		"sim_state":	1,
		"default_apn":	{
			"auth_type":	" 0",
			"apn_name":	" 3GNET",
			"ip_type":	" IPV4V6",
			"username":	" ",
			"password":	" "
		},
		"use_apn":	0
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"module_ready":	true,
		"sim_state":	1,
		"default_apn":	{
			"auth_type":	" 0",
			"apn_name":	" 3GNET",
			"ip_type":	" IPV4V6",
			"username":	" ",
			"password":	" "
		},
		"user_apn":	{
			"auth_type":	" 0",
			"apn_name":	" 3GNET",
			"ip_type":	" IPV4V6",
			"username":	" ",
			"password":	" "
		},
		"use_apn":	0
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

获取参数时，module_ready 不为true或者sim_state 不等于1，则没有后面的参数，保持跟其他与模块相同的逻辑判断

auth_type 值为 0 ： NONE  1:PAP  2:CHAP

use_apn 为0时表示使用默认的apn

use_apn 为1时表示使用用户设置的apn

这里只需要添加一个apn的设置，就是use_apn 里面的内容

get/set 时需要等待	

#### 设置模块APN配置

set_module_apn_config

request

```
{
	"HYID":12,
	"use_apn":0,
	"auth_type":	"0",
	"apn_name":	"3GNET",
	"ip_type":	"IPV4V6",
	"username":	"",
	"password":	""
} 
```

response

```
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 删除模块APN配置

```
{
	"HYID":13
} 
```

```
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

删除时，use_apn不需要发送到后台，一定是使用默认的apn才可以删除用户增加的apn

默认的apn不能编辑跟修改，所以新增的apn跟修改新增的apn，或者修改使用的apn，都是调用104接口

apn设置，是有一个默认的apn，不用传给后台

设置删除可能会返回 4007，提示设置不成功，请重试



