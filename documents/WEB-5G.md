### JSON格式

+ 错误返回值格式

JSON

~~~
{
  "errcode": 2000,
  "huayierrtype": "xxx",
}
~~~



+ 正确返回值格式示例

JSON

~~~
{
  "errcode": 2000,
  "huayierrtype": "success",
  "progresstime": 0
  "result":
   {
        "connect_type":	"pppoe",
        "user":	"huayi_pppoe",
        "passwd":	"pppoe_password",
        "dnsmode":	"0",
        "dns1":	"10.2.2.1",
        "mtu":	"1492",
   }
}
~~~

+ 前端发送JSON格式

~~~
{
	HYID : "0"
	action："get_wan_config"
	xxx:"xxx"
｝
~~~



### JSON返回码详解

| 字段     | 字段值         | 描述                |
| -------- | -------------- | ------------------- |
| errcode | 见errcode码表 | 返回码，正确为2000  |
| huayierrtype   | success        | 错误信息            |
| progresstime | 0              | 倒计时间，0为不倒时 |
|          |                |                     |
|          |                |                     |
|          |                |                     |
|          |                |                     |
|          |                |                     |
|          |                |                     |







### 返回错误码列表

| errcode | 信息描述           | 详细描述           |
| -------- | ------------------ | ------------------ |
| 2000     | success            | 正确默认返回2000   |
| 4001     | unauthorized       | 登录失败           |
| 4002     | format error       | 数据不是json根式   |
| 4003     | HYID field miss    | json数据中缺少HYID |
| 4004     | illegal HYID       | 非法的HYID         |
| 4005     | required data miss | 必须的数据缺少     |
| 4006     | permission deny    | 权限被禁止         |
| 4007     | server failure     | 服务器故障         |
| 4008     | file format error  | 上传文件错误       |
| 4009     | dulicate data      | 重复的数据         |
| 4010     | data content error | 数据内容错误       |
| 4011     | pin code error     | pin码错误          |



### action与HYID

| action                 | HYID       | 描述               | 前端路径 |
| ---------------------- | ---------- | ------------------ | -------- |
| get_pre_login_config   | 0          | 获取登录前配置     |          |
| set_language_config    | 1          | 设置语言配置       |          |
| do_login_auth          | 2          | 登录认证           |          |
| change_admin_password  | 8          | 修改管理员密码     |          |
| use_browser_time       | 4          | 使用浏览器时间     |          |
| get_syslog_config      | 5          | 获取系统日志配置   |          |
| set_syslog_config      | 6          | 设置系统日志配置   |          |
| display_syslog         | 7          | 显示系统日志       |          |
| clean_syslog           | 8          | 清除系统日志       |          |
| download_syslog        | streamid=1 | 下载系统日志       |          |
| get_sche_reboot        | 9          | 获取定时重启配置   |          |
| set_sche_reboot        | 10         | 设置定时重启配置   |          |
| set_system_reboot      | 11         | 重启系统           |          |
| set_system_factory     | 12         | 恢复出厂设置       |          |
| backup_system_config   | streamid=2 | 备份配置文件       |          |
| restore_system_config  | streamid=3 | 恢复配置文件       |          |
| get_upgrade_info       | 13         | 获取升级信息       |          |
| cloud_upgrade_check    | 14         | 云升级检测         |          |
| cloud_check_status     | 15         | 获取云升级检测结果 |          |
| set_system_upgrade     | streamid=4 | 本地升级           |          |
| get_curren_user_info   | 16         | 获取当前用户信息   |          |
| get_multiwan_config    | 17         | 获取多wan配置      |          |
| set_multiwan_config    | 18         | 设置多wan配置      |          |
| get_lan_config         | 19         | 获取lan口配置      |          |
| set_lan_config         | 20         | 设置lan口配置      |          |
| get_dhcp_server_config | 21         | 获取dhcp服务器配置 |          |
| set_dhcp_server_config | 22         | 设置dhcp服务器配置 |          |
| get_arp_list           | 23         | 获取arp列表        |          |
| get_arpbind_config     | 24         | 获取arp绑定配置    |          |
| set_arpbind_config     | 25         | 设置arp绑定配置    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |
|                        |            |                    |          |



### streamid 与 action

| action                | streamid                                    | 描述                     |
| --------------------- | ------------------------------------------- | ------------------------ |
| download_syslog       | /cgi_stream.cgi?streamid=1                  | 下载系统日志             |
| backup_system_config  | /cgi_stream.cgi?streamid=2                  | 备份配置文件             |
| restore_system_config | /cgi_stream.cgi?streamid=3                  | 恢复配置                 |
| set_system_upgrade    | /cgi_stream.cgi?streamid=4&keep_setting=1/0 | 本地升级。勾选1，不勾选0 |
| set_model_upgrade     | /cgi_stream.cgi?streamid=5                  |                          |
|                       |                                             |                          |
|                       |                                             |                          |



### 跳转与倒计时

lock_time 为页面倒计时时间，如果为0 不做处理

redir 字段为是否跳转字段，false为不用做跳转，true为需要跳转

reconnection_addr 为需要跳转到的ip



### 详细接口列表

#### 获取登录前配置

request

~~~
{
	HYID : 0
	action："get_pre_login_config"
｝
~~~

response

~~~
{
	"result":	{
		"same_pwd": true,
		"support_language":	["cn", "en"],
		"web_title":	"HCT CPE",
		"language":	"cn"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

#### 设置语言

request

~~~
{
	"HYID":1,
	"action":"set_language_config",
	"language":"en",
}
~~~

response

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"huayierrtype":	"dulicate data",
	"errcode":	4009,
	"progresstime":	0
}

切换语言时，如果提交的语言类型与后台一致，会返回数据重复（4009）
~~~

#### 登录认证

request

~~~
{
	HYID : 2
	action："do_login_auth"
	"username":"admin",
    "password":"admin"
｝
~~~

response

~~~
{
    errcode: "2000/4001"
    huayierrtype: "success/unauthorized"
    first_boot: "1/0"
}
first_boot: 1，此时跳转至设置向导页 ，0 跳转至系统状态页，该字段保留，防止后面修改
~~~



#### 修改密码

request

~~~
{
	"HYID":3,
	"action":"chanage_admin_password",
	"prepassword":"admin",
	"newpassword":"admin1"
}
~~~



response

~~~
{
	"redir":	true,
	"reconnection_addr":	"192.168.88.1",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

{
	"huayierrtype":	"permission deny",
	"errcode":	4006,
	"progresstime":	0,
	"redir": false
}
~~~

密码长度限制 5~32长度

#### 重启系统

request

 ~~~
{
	"HYID":4
}
 ~~~

response

~~~
{
	"redir":	true,
	"reconnection_addr":	"192.168.88.1",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	60
}
~~~

重启之前需要添加确认按钮，确认才发请求（参照网关）

#### 恢复出厂设置

request

~~~
{
	"HYID":5
}
~~~

response

~~~
{
	"redir":	true,
	"reconnection_addr":	"192.168.88.1",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	120
}
~~~

恢复出厂之前需要添加确认按钮，确认才发请求（参照网关）

建议：系统将重启并恢复出厂设置，确认执行操作吗

#### 下载系统日志

request

 ~~~
{
	/cgi-bin/cgi_stream.cgi?streamid=1
}
 ~~~

response

~~~
直接返回文件file: $(product)-$(date).log
~~~

#### 备份配置文件

request

~~~
{
	/cgi-bin/cgi_stream.cgi?streamid=2
}
~~~

response

~~~
直接返回文件file: backup-$(product)-$(date).tar.gz
~~~



#### 恢复系统配置文件

request

~~~
{
/cgi-bin/cgi_stream.cgi?streamid=3
+file upload
}
~~~

response

~~~
{
	"redir":	true,
	"reconnection_addr":	"192.168.88.1",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	120
}
~~~

上传之前需要确认，取消不发请求

提示语需要告知用户：请确认上传的配置文件中的地址，系统将默认跳转到默认IP地址



#### 获取升级信息

get_upgrade_info

request

```
{
	"HYID":6,
}
```

```
{
	"result":	{
		"product_model":	"zn183",
		"fw_version":	15,
		"buildtime":	"2019-09-13 15:51:11"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
update
{
	"result":	{
		"product_model":	"zn183",
		"buildtime":	"2019-11-25 19:33:05",
		"fw_version":	"A2_FC_V0.9",
		"module_version":	"RXLG1H.00.10.201908300238",
		"cloudup_status":	0,
		"cloudup_firmware":	"",
		"cloudup_module":	""
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
检测更新的接口HYID 112
```

cloudup_status 为0，即可以进行云升级

cloudup_status 为1，正在进行固件升级

cloudup_status 为2，正在进行模块升级

#### 系统升级 

set_system_upgrade

request

~~~
{
	cgi-bin/cgi_stream.cgi?streamid=4&keep_setting=1/0
}
~~~

response

~~~
{
	"redir":	true,
	"reconnection_addr":	"192.168.88.1",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	120

~~~

系统升级，返回值可能有  2000，4007 ，4008

#### 上传模块升级文件

uploade_5g_module_upgrade_file

request

~~~
{
	cgi-bin/cgi_stream.cgi?streamid=5
}
~~~

response

~~~
{
	"redir":	false,
	"file_state":	{
		"file_list":	[{
				"state":	true,
				"filename":	"abl.elf",
				"path":	"/tmp/abl.elf"
			}, {
				"state":	true,
				"filename":	"aop.mbn",
				"path":	"/tmp/aop.mbn"
			}, {
				"state":	true,
				"filename":	"devcfg.mbn",
				"path":	"/tmp/devcfg.mbn"
			}, {
				"state":	false,
				"filename":	"hyp.mbn",
				"path":	"/tmp/hyp.mbn"
			}, {
				"state":	false,
				"filename":	"multi_image.mbn",
				"path":	"/tmp/multi_image.mbn"
			}, {
				"state":	false,
				"filename":	"NON-HLOS.ubi",
				"path":	"/tmp/NON-HLOS.ubi"
			}, {
				"state":	false,
				"filename":	"sbl1.mbn",
				"path":	"/tmp/sbl1.mbn"
			}, {
				"state":	false,
				"filename":	"sdxprairie-boot.img",
				"path":	"/tmp/sdxprairie-boot.img"
			}, {
				"state":	false,
				"filename":	"sdxprairie-recoveryfs.ubi",
				"path":	"/tmp/sdxprairie-recoveryfs.ubi"
			}, {
				"state":	false,
				"filename":	"sdxprairie-sysfs.ubi",
				"path":	"/tmp/sdxprairie-sysfs.ubi"
			}, {
				"state":	false,
				"filename":	"sec.elf",
				"path":	"/tmp/sec.elf"
			}, {
				"state":	false,
				"filename":	"tools.fv",
				"path":	"/tmp/tools.fv"
			}, {
				"state":	false,
				"filename":	"tz.mbn",
				"path":	"/tmp/tz.mbn"
			}, {
				"state":	false,
				"filename":	"uefi.elf",
				"path":	"/tmp/uefi.elf"
			}, {
				"state":	false,
				"filename":	"xbl_cfg.elf",
				"path":	"/tmp/xbl_cfg.elf"
			}]
	},
	"huayierrtype":	"required data miss",
	"errcode":	4005,
	"progresstime":	0
}
{
	"redir":	false,
	"file_state":	{
		"file_list":	[{
				"state":	true,
				"filename":	"abl.elf",
				"path":	"/tmp/abl.elf"
			}, {
				"state":	true,
				"filename":	"aop.mbn",
				"path":	"/tmp/aop.mbn"
			}, {
				"state":	true,
				"filename":	"devcfg.mbn",
				"path":	"/tmp/devcfg.mbn"
			}, {
				"state":	true,
				"filename":	"hyp.mbn",
				"path":	"/tmp/hyp.mbn"
			}, {
				"state":	true,
				"filename":	"multi_image.mbn",
				"path":	"/tmp/multi_image.mbn"
			}, {
				"state":	true,
				"filename":	"NON-HLOS.ubi",
				"path":	"/tmp/NON-HLOS.ubi"
			}, {
				"state":	true,
				"filename":	"sbl1.mbn",
				"path":	"/tmp/sbl1.mbn"
			}, {
				"state":	true,
				"filename":	"sdxprairie-boot.img",
				"path":	"/tmp/sdxprairie-boot.img"
			}, {
				"state":	true,
				"filename":	"sdxprairie-recoveryfs.ubi",
				"path":	"/tmp/sdxprairie-recoveryfs.ubi"
			}, {
				"state":	true,
				"filename":	"sdxprairie-sysfs.ubi",
				"path":	"/tmp/sdxprairie-sysfs.ubi"
			}, {
				"state":	true,
				"filename":	"sec.elf",
				"path":	"/tmp/sec.elf"
			}, {
				"state":	true,
				"filename":	"tools.fv",
				"path":	"/tmp/tools.fv"
			}, {
				"state":	true,
				"filename":	"tz.mbn",
				"path":	"/tmp/tz.mbn"
			}, {
				"state":	true,
				"filename":	"uefi.elf",
				"path":	"/tmp/uefi.elf"
			}, {
				"state":	true,
				"filename":	"xbl_cfg.elf",
				"path":	"/tmp/xbl_cfg.elf"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

上传模块升级的文件时，可能会返回  文件格式错误（4008）  服务器故障（4007），这两种情况下，没有列表返回，但是一般不会出现这种情况

上传文件15个时，返回成功（2000），此时页面可以显示升级的按钮，升级按钮必须只有2000时才显示

文件缺少时，返回 required data miss（4005）

这两种情况下，都会返回文件的状态列表，state 为false的文件表示没有上传

HYID =12的接口，变更为set_module_upgrade (设置模块升级)，注意跳转的问题，



#### 获取当前用户信息

get_current_user_info

request

~~~
{
	"HYID":7
}
~~~

response

~~~
{
	"result":	{
		"user_ip":	"192.168.88.99",
		"user_mac":	"00:e0:4c:69:00:52"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~



#### 获取lan侧ARP列表

get_lan_arp_list

request

~~~
{
	"HYID":8
}
~~~

response

~~~
{
	"result":	{
		"arp_list":	[{
				"idx":	0,
				"ip":	"192.168.88.99",
				"mac":	"00:e0:4c:69:00:52"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

HYID 6 HYID7 两个接口为功能性接口，

获取当前用户接口，在mac克隆，dmz主机等接口需要

获取lan侧ARP列表，在扫描时需要



#### 获取以太网统计 

get_network_info

request

~~~
{
	"HYID":9
}
~~~

response

~~~
{
	"result":	{
		"wan_info":	{
			"mac_address":	"E4:63:01:18:84:90",
			"link":	1,
			"mtu":	1500,
			"ip_address":	"192.168.90.13",
			"netmask":	"255.255.255.0",
			"gateway":	"192.168.90.1",
			"dns_server":	["192.168.90.1", "8.8.8.8"],
			"tx_bps":	105,
			"rx_bps":	150,
			"rx_bytes":	1236271,
			"tx_bytes":	84964
		},
		"lan_info":	{
			"mac_address":	"E4:63:01:18:84:74",
			"ip_address":	"192.168.88.1",
			"netmask":	"255.255.255.0",
			"client_num":	"1"
		}
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

need to fix 





#### 获取外网配置 

get_wan_config

request

~~~
{
	"HYID":10
}
~~~

response

~~~
{
	"result":	{
		"wan_type":	wired/mobile,
        "proto":	"dhcp",
        "ipaddr":	"",
        "netmask":	"",
        "gateway":	"",
        "dns":	[""],
        "username":	"",
        "password":	"",
        "ac":	"",
        "service":	"",
        "hostname":	"CPE",
        "macaddr":	"E4:63:01:18:84:90",
        "def_macaddr":	"",
        "ppp_mtu":	1492,
        "cc_mtu":	1500,
        "link":	0
		},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"wan_type":	wired,
        "proto":	"static",
        "ipaddr":	"192.168.90.13",
        "netmask":	"255.255.255.0",
        "gateway":	"192.168.90.1",
        "dns":	["192.168.90.1", "8.8.8.8"],
        "username":	"",
        "password":	"",
        "ac":	"",
        "service":	"",
        "hostname":	"CPE",
        "macaddr":	"E4:63:01:18:84:90",
        "def_macaddr":	"",
        "ppp_mtu":	1492,
        "cc_mtu":	1500,
        "link":	0
		},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

{
	"result":	{
		"wan_type":	wired,
        "proto":	"pppoe",
        "ipaddr":	"192.168.90.13",
        "netmask":	"255.255.255.0",
        "gateway":	"192.168.90.1",
        "dns":	["192.168.90.1", "8.8.8.8"],
        "username":	"pppoe@gd.com",
        "password":	"password@gd.com",
        "ac":	"",
        "service":	"",
        "hostname":	"CPE",
        "macaddr":	"E4:63:01:18:84:90",
        "def_macaddr":	"",
        "ppp_mtu":	1492,
        "cc_mtu":	1500,
        "link":	0
		
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0

~~~

wan_type :上网方式， wired  有线上网 

​									  mobile，数据流量

proto ：static ，dhcp，pppoe三种模式

mtu ，pppoe模式使用ppp_mtu ,其他两个模式使用cc_mtu

mac地址需要大写

当wan_type 是mobile时，只能是DHCP模式



#### 设置以太网上网参数 

set_eth_wan_config

request

~~~
{
	"HYID":11,
	"wan_type":"wired",
	"proto":"static",
	"ipaddr":"192.168.90.13",
	"netmask":"255.255.255.0",
	"gateway":"192.168.90.1",
	"dns":["192.168.90.1","114.114.114.114"],
	"macaddr":"E4:63:01:18:84:AA",
	"cc_mtu":1500
}
static 模式下，dns地址至少要有一个
{
	"HYID":11,
	"wan_type":"0",
	"proto":"dhcp",
	"cc_mtu":1500,
	"hostname":"hello",
	"macaddr":"E4:63:01:18:84:AA"
}
dhcp 模式 hostname可以为空
{
	"HYID":11,
	"wan_type":"mobile",
	"proto":"pppoe",
	"ppp_mtu":1492,
	"ac":"",
	"service":"",
	"macaddr":"E4:63:01:18:84:AA",
	"username":"pppoe@gd.com",
	"password":"password@gd.com"
}
pppoe模式下，ac service参照网关
以上为三个模式下必须提交的字段，value可以为空
~~~

注意mtu值的处理，ppp_mtu为576-1492  cc_mtu的位576-1500，pppoe模式下使用ppp_mtu,其他模式下使用cc_mtu,

mac地址需要大写，ip子网掩码的校验参照网关

mac克隆的功能逻辑参照网关

response

~~~
{
	"redir":	false,
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	20
}
{
	"huayierrtype":	"required data miss",
	"errcode":	4005,
	"progresstime":	0
}
{
	"huayierrtype":	"data content error",
	"errcode":	4010,
	"progresstime":	0
}
~~~



#### 设置模块升级

set_module_upgrade 

request

~~~
{
	"HYID":12


~~~

response

~~~
{
	"redir":	true,
	"reconnection_addr":	"192.168.88.1",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	60
}
~~~



#### 获取内网配置

get_lan_config

request

```
{
	"HYID":13
}
```

response

```
{
	"result":	{
		"ipaddr":	"192.168.88.1",
		"netmask":	"255.255.255.0"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 设置内网配置

set_lan_config

request

```
{
	"HYID":14,
	"ipaddr":"192.168.7.1",
	"netmask":"255.255.255.0"
}
```

response

```
{
	"reconnection_addr":	"192.168.7.1",
	"redir":	true,
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	20
}
{
	"redir":	false,
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	20
}
修改ip，无论掩码有没有修改，redir 为true，倒计时结束跳转到reconnection_addr的登录页面
没有修改ip，修改掩码，redir为false，倒计时结束不跳转
```



#### 获取dhcp服务配置

get_dhcps_server_config

request

```
{
	"HYID":15
}
```

response

```
{
	"result":	{
		"enable":	false,
		"minip":	"192.168.7.1",
		"maxip":	"192.168.7.254",
		"startip":	"192.168.7.100",
		"endip":	"192.168.7.249",
		"leasetime":	7200,
		"static_dhcp":	[{
				"ip":	"192.168.1.1",
				"mac":	"00:19:20:03:ef",
				"name":	"aaaa",
				"leasetime":	3600
			}, {
				"ip":	"192.168.1.2",
				"mac":	"00:19:be:20:03:ee",
				"name":	"bbbb",
				"leasetime":	3600
			}, {
				"ip":	"192.168.1.3",
				"mac":	"00:19:be:20:03:ee",
				"name":	"cccc",
				"leasetime":	7200
			}, {
				"ip":	"192.168.1.3",
				"mac":	"00:19:be:20:03:ee",
				"name":	"cccc",
				"leasetime":	7200
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 设置DHCP服务器配置

set_dhcp_server_config

request

```
{
		"enable":	false,
		"startip":	"192.168.7.100",
		"endip":	"192.168.7.249",
		"leasetime":	7200,
		"static_dhcp":	[{
				"ip":	"192.168.1.1",
				"mac":	"00:19:20:03:ef",
				"name":	"aaaa",
				"leasetime":	3600
			},
			{
			"ip":"192.168.1.2",
			"mac":"00:19:be:20:03:ee",
			"name":"bbbb",
			"leasetim":"7200"
			},{
			"ip":"192.168.1.3",
			"mac":"00:19:be:20:03:ee",
			"name":"cccc",
			"leasetime":"7200"
			},{
			"ip":"192.168.1.3",
			"mac":"00:19:be:20:03:ee",
			"name":"cccc",
			"leasetime":"7200"
			}],
		"HYID":16
}
```

设置时租约栏默认值86400，租约范围为60-86400s，需要用到get_lan_arp_list (HYID=7）

response

```
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

内网配置，dhcp，除了调整倒计时跳转，其他逻辑与网关相同

静态dhcp添加规则：IP地址与mac不能重复



#### 获取静态路由配置

get_static_router_config

request

```
{		
		"HYID":17
}
```

response

```
{
	"result":	{
		"static_router_list":	[{
				"interface":	"lan",
				"target":	"192.168.7.99",
				"gateway":	"192.168.7.99",
				"netmask":	"255.255.255.0",
				"metric":	1
				"comment":	"aaaaa"
			}, {
				"interface":	"wan",
				"target":	"192.168.5.99",
				"gateway":	"192.168.5.99",
				"netmask":	"255.255.255.0",
				"metric":	1,
				"comment":	"bbbbb"
			}],
		"interface_list":	[{
				"id":	0,
				"interface":	"lan"
			}, {
				"id":	1,
				"interface":	"wan"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 设置静态路由配置

set_static_router_config

request

```
{		
		"HYID":18,
		"static_router_list":	[{
				"interface":	"lan",
				"target":	"192.168.7.99",
				"gateway":	"192.168.7.99",
				"netmask":	"255.255.255.255",
				"metric":	1,
				"comment":	"aaaaa"
			}, {
				"interface":	"wan",
				"target":	"192.168.5.99",
				"gateway":	"192.168.5.99",
				"netmask":	"255.255.255.255",
				"metric":	1,
				"comment":	"bbbbbb"
			}]
}
```

response

```
{
	"redir":	false,
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	20
}
```

interface 要传小写的lan wan  的值，显示为大写

metric 字段显示在页面为   路由度量（metric）  范围0-255

target netmask gateway均为ip地址格式

此页面没有开关，需要倒计时，不需要跳转



#### 获取远程管理配置

get_remote_manage_config

request

```
{
		"HYID":19
}
```

response

```
{
	"result":	{
		"remote_enable":	true,
		"port":	8087
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

注意：multi_wan只提供接口选择，当前使用的接口由 wanid 决定

port 限制 80 -65535



#### 设置远程管理配置

set_remote_manage_config

request

```
{
		"HYID":20,
		"remote_enable":	true,
		"port":	8081
}
{		
		"HYID":20,
		"port":8081,
		"remote_enable":false
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

注意与网关对比没有wanid选项



#### 获取mac过滤配置

get_mac_filter_config

request

```
{		
		"HYID":21
}
```

response

```
{
	"result":	{
		"mac_filter":	true,
		"macfilter_list":	[{
				"mac_addr":	"00:19:be:20:03:5b",
				"desc":	"macfilter_test"
			}, {
				"mac_addr":	"00:19:be:20:03:44",
				"desc":	"macfilter_test2"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 设置mac过滤配置

set_mac_filter_config

request

```
{		
		"HYID":22,
		"mac_filter":	true,
		"macfilter_list":	[{
				"mac_addr":	"00:19:be:20:03:5b",
				"desc":	"macfilter_test"
			}, {
				"mac_addr":	"00:19:be:20:03:44",
				"desc":	"macfilter_test2"
			}]
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

MAC地址需要大写



#### 获取URL过滤配置

get_url_filter_config

request

```
{		
		"HYID":23,
}
```

response

```
{
	"result":	{
		"url_filter":	true,
		"urlfilter_list":	[{
				"url":	"www.baidu3.com"
			}, {
				"url":	"www.axilspot3.com"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置URL过滤配置

set_url_filter_config

request

```
{		
		"HYID":24,
		"url_filter":	true,
		"urlfilter_list":	[{
				"url":	"www.baidu3.com"
			}, {
				"url":	"www.axilspot3.com"
			}]
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

url过滤的规则至少为2个字符，限制中文，其他不限制



#### 获取IP/PORT过滤配置

get_ip_port_filter_config

request

```
{		
		"HYID":25,
}
```

response

```
{
	"result":	{
		"ip_port_filter":	true,
		"ipportfilter_list":	[{
				"src_ip":	"192.168.7.3",
				"proto":	0,
				"port_start":	1,
				"port_end":	555,
				"desc":	"123123"
			}, {
				"src_ip":	"192.168.7.7",
				"proto":	1,
				"port_start":	13,
				"port_end":	5555,
				"desc":	"444"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

proto 定义： 0  TCP+UDP

​						1  TCP

​						2  UDP

#### 设置IP/PORT过滤配置

set_ip_port_filter_config

request

```
{		
		"HYID":26,
		"ip_port_filter":	true,
		"ipportfilter_list":	[{
				"src_ip":	"192.168.7.3",
				"proto":	0,
				"port_start":	1,
				"port_end":	555,
				"desc":	"123123"
			},
			{
				"src_ip":	"192.168.7.7",
				"proto":	1,
				"port_start":	13,
				"port_end":	5555,
				"desc":	"444"
			}]
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

ip端口过滤，起始端口要小于结束端口，如果ip地址相同，范围不能重复

#### 获取dmz配置

get_dmz_config

request

```
{		
		"HYID":27
}
```

response

```
{
	"result":	{
		"dmz_enable":	false,
		"dest_ip":	""
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

调用 HYID = 6显示当前电脑ip

与网关对比没有wanid

#### 设置dmz配置

set_dmz_config

request

```
{
	"HYID":28,
    "dmz_enable":	true,
    "dest_ip":	"192.168.7.99"
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



#### 获取端口映射配置

get_port_forward_config

request

```
{
	"HYID":29,
}
```

response

```
{
	"result":	{
		"port_forward":	false,
		"port_forward_list":	[{
				"ip_addr":	"192.168.7.98",
				"proto":	0,
				"internal_port":	123,
				"external_port":	333,
				"desc":	"asgfqergqe"
			}, {
				"ip_addr":	"192.168.7.97",
				"proto":	0,
				"internal_port":	123,
				"external_port":	333,
				"desc":	"asgfqergqe"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 设置端口映射配置

set_port_forward_config

request

```
{
	"HYID":30,
	"port_forward": false,
	"port_forward_list":[
		{
			"ip_addr":"192.168.7.98",
			"proto": 0,
			"internal_port":123,
			"external_port":333,
			"desc":"asgfqergqe"
		},
		{
			"ip_addr":"192.168.7.97",
			"proto": 0,
			"internal_port":123,
			"external_port":333,
			"desc":"asgfqergqe"
		}]
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

端口映射的规则：如果IP地址相同，内部端口外部端口不能重复，不管ip是否相同，外部端口不能重复

#### 获取UPNPD配置

get_upnpd_config

request

```
{
	"HYID":31,
}
```

response

```
{
	"result":	{
		"enable_upnp":	false,
		"upnp_list":	[
	   ｛
			"proto":"UDP"
            "name":"HCDN",
            "ip":"	192.168.5.17",
            "iport":"38052",
            "eport":"38052"
		｝
		]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 设置UPNPD配置

set_upnpd_config

request

```
{
	"HYID":32,
	"enable_upnp":	true,
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



#### 获取DDNS配置

get_ddns_config

request

```
{
	"HYID":33
}
```

response

```
{
	"result":	{
		"ddns_enable":	false,
		"provider":	"3322.org",
		"domain_name":	"19901002yun.f3322.org",
		"username":	"yun19901002",
		"password":	"43291717yun",
		"ddns_ip":	"192.168.5.112",
		"ddns_state":	1
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

ddns_state:   0 未连接， 1 成功  2，失败

仅当ddns_state 为1 时，显示ddns_ip



provider:服务商

下拉菜单

显示www.3322.org    值  3322.org   注册域名 http://www.pubyun.com/accounts/signup/

显示www.oray.com	值为 oray.com  注册域名https://console.oray.com/passport/register.html

显示dyndns   值dyndns.org      注册域名 https://dyn.com/dns/

显示no-ip 值 no-ip.com 主册域名   https://www.no-ip.com/newUser.php/



#### 设置DDNS配置

set_ddns_config

request

```
{
	"HYID":34,
	"ddns_enable":	false,
	"provider":	"3322.org",
	"domain_name":	"19901002yun.f3322.org",
	"username":	"yun19901002",
	"password":	"43291717yun"
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

 password采用密码隐藏控件，限制长度最长50

功能参照网关实现



#### 获取wanping配置

get_wan_ping_config

request

```
{
	"HYID":35
}
```

response

```
{
	"result":	{
		"wanping_en":	false
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 设置wanping配置

request

```
{
	"HYID":36,
	"wanping_en":true
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

对比网关没有多wan



#### 获取ping测试结果

get_ping_detect_result

request

~~~
{
		"HYID":37
}
~~~

response

~~~
{
	"result":	{
		"ping_detct":	0,
		"action_result":	""
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"ping_detct":	1,
		"action_result":	"PING 192.168.7.98 (192.168.7.98) from 192.168.7.1: 56 data bytes\n64 bytes from 192.168.7.98: seq=0 ttl=128 time=0.844 ms\n64 bytes from 192.168.7.98: seq=1 ttl=128 time=0.643 ms\n64 bytes from 192.168.7.98: seq=2 ttl=128 time=0.591 ms\n64 bytes from 192.168.7.98: seq=3 ttl=128 time=0.644 ms\n�n"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

#### 开始ping测试

do_ping_detect

request

~~~
{
		"HYID":38,
		"dest_host":"192.168.7.98",  单个域名长度不能超过64个字符
		"start_host":"192.168.7.1",  单个域名长度不能超过64个字符
		"ping_counter": 100         1-100 default 10
}
~~~

response

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

#### 停止ping测试

stop_ping_detect

request

~~~
{
		"HYID":39
}
~~~

response

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~



#### 获取路由跟踪测试结果

get_tracert_detect_result

request

```
{
		"HYID":40
}
```

response

```
{
	"result":	{
		"tracert_detct":	0,
		"action_result":	""
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"tracert_detect":	2,
		"action_result":	"traceroute to 192.168.7.98 (192.168.7.98), 20 hops max, 38 byte packets\n 1  192.168.7.98 (192.168.7.98)  0.581 ms  0.476 ms  0.359 ms\n"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 开始路由测试

do_tracert_detect

request

```
{
		"HYID":41,
		"dest_host":"192.168.7.98",  单个域名长度不能超过64个字符
		"max_hops": 20,    1-20 default 20
		"time_out": 10		1-10 default 10
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

#### 停止路由测试

request

```
{
		"HYID":42
}
```

response

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~



#### 获取DHCP检测结果

get_dhcp_detect_result

request

```
{
		"HYID":43
}
```

response

```
{
	"result":	{
		"ping_detct":	0,
		"action_result":	[]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

{
	"result":	{
		"ping_detct":	2,
		"action_result":	[{
				"ip":	"192.168.0.253",
				"mac":	"F4:28:53:00:32:C4"
			}]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

{
	"result":	{
		"ping_detct":	1,
		"action_result":	[]
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 开始DHCP检测

do_dhcp_detect

request

```
{
		"HYID":44
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

#### 停止DHCP检测

stop_dhcp_detect

request

```
{
		"HYID":45
}
```



#### 获取无线简易配置

request

```
{
	"HYID":46,
	"action":"get_wifi_easyconf"
}
```

response
```
{
	"result" : {
		"enable5gpro":false,  //true
		"enable2gwifi":false, //true
		"ssid2g":{
			"ssid":"xxxx",
			"authmode": "psk2",
			"key" : "12345678",
			"hidden":0
		},
		"enable5gwifi":1,
		"ssid5g":{
			"ssid":"xxxx",
			"authmode": "psk-mixed",
			"key": "12345678",
			"hidden":0
		}
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
	
	说明： 1、无线分为不加密和加密2种模式，不加密的时候authmode字段为none，key为空
       2、加密情况下又分2种：1、psk2对应页面显示的WPA2-PSK；2、psk-mixed对应页面显示的WPA/WPA2-PSK
}
```

#### 设置无线简易配置

request
```
 {
	"HYID":47,
	"action":"set_wifi_easyconf",
	"enable5gpro":false, //true
	"enable2gwifi":false, //true
	"ssid2g":{
		"ssid":	"xxx",
		"authmode" : "psk2",
		"key" : "12345678"，
		"hidden":0
	},
	"enable5gwifi":false, //true
	"ssid5g":{
		"ssid":	"xxx",
		"authmode" : "psk2",
		"key" : "12345678",
		"hidden":0
	}
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	30
}
```

#### 获取无线信号模式

request
```
{
	"HYID":48,
	"action":"get_wifi_signalmode"
}
```

response
```
{
	"result" : {
		"wifisigmode":	3
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置无线信号模式

request
```
{
	"HYID":49,
	"action":"set_wifi_signalmode",
	"wifisigmode": 2
}
说明：3对应页面显示的睡眠；2对应的页面的标准；1对应的页面的穿墙
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	30
}
```

#### 获取无线高级配置

request
```
{
	"HYID":50,
	"action":"get_wifi_advance"
}
```

response
```
{
	"result" : {
		"maxstanum2g":	32,
		"htbw2g": 1,
		"channel2g":13,
		"maxstanum5g":32,
		"htbw5g":3,
		"channel5g":149,
		"enable2g":0, //2g是否开启，1表示开启，0表示关闭
		"enable5g":1   //5g是否开启，1表示开启，0表示关闭
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置无线高级配置

request
```
{
	"HYID":51,
	"action":"set_wifi_advance",
	"maxstanum2g":	32,
	"htbw2g": 1,
	"channel2g":13,
	"maxstanum5g":32,
	"htbw5g":3,
	"channel5g":149
}
说明：1、无线信道的自动值均为0,2G和5G都是如此；
      2、2G的频宽，默认值是1，对应页面显示的是自动。值为0时表示20MHz
	  3、5G的频宽，5G频宽页面上只显示自动、40MHz、80MHz、默认值是2，对应页面的自动。2对应自动和80MHz(2个都在页面上显示出来)，5对应的是40MHz
	  4、maxstanum的范围是1-32
```

response
```
{
	"result" : {
		"maxstanum2g":	32
		"htbw2g": 1
		"channel2g":13
		"maxstanum5g":32
		"htbw5g":3
		"channel5g":149
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	30
}
```

#### 获取无线MAC地址过滤开关
request
```
{
	"HYID":52,
	"action":"get_wifi_macfilter"
}
```

response
```
{
	"result" : {
		"enable":	1,
		"wifienable":0 //0 表示2g和5g wifi都关闭，1表示有wifi开启
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置无线MAC地址过滤开关
request
```
{
	"HYID":53,
	"action":"set_wifi_macfilter",
	"enable":0
}
说明：0表示关闭，1表示允许（即白名单），2表示禁止（即黑名单）
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	30
}
```

#### 获取无线MAC地址过滤列表
request
```
{
	"HYID":54,
	"action":"get_wifi_macfilterlist"
}
```

response
```
{
	"result" : {
		"macfilter_list":	[{
				"mac_addr":	"00:19:be:20:03:5b"
			}, {
				"mac_addr":	"00:19:be:20:03:44"
			}]
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 增加无线MAC地址过滤
request
```
{
	"HYID":55,
	"action":"add_wifi_macfilterlist",
	"macfilter_list":	[{
				"mac_addr":	"00:19:be:20:03:5b"
			}, {
				"mac_addr":	"00:19:be:20:03:44"
			}]	
}

{
	"HYID":55,
	"action":"add_wifi_macfilterlist",
	"macfilter_list":	[]	
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	30
}
```

#### 获取无线客户端MAC地址列表
request
```
{
	"HYID":56,
	"action":"get_wifi_stamaclist"
}
```

response
```
{
	"result" : {
		"wifista_list":	[{
				"mac_addr":	"00:19:be:20:03:5b"
			}, {
				"mac_addr":	"00:19:be:20:03:44"
			}]
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 获取无线WPS功能开关
request
```
{
	"HYID":57,
	"action":"get_wifi_wps_pbc"
}
```

response
```
{
	"result" : {
		"enable":	false, //true
		"pinenable":false, //true
		"wifienable":0 //0 表示2g和5g wifi都关闭，1表示有wifi开启
		"pincode": 12345678  
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置无线WPS功能开关
request
```
{
	"HYID":58,
	"action":"set_wifi_wps"，
	"enable":	1
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置无线WPS的PBC连接功能
request
```
{
	"HYID":59,
	"action":"set_wifi_wps_pbc"
	"enable":0 //0表示取消，1表示连接
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置无线WPS的输入终端pin码连接
request
```
{
	"HYID":60,
	"action":"set_wifi_wpsstapin"，
	"stapin" : 12327857,   //8位	
	“enable”：0 //0表示取消，1表示连接
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 获取无线WPS的本地pin码
request
```
{
	"HYID":61,
	"action":"get_wifi_wpspin"
}
```

response
```
{
	"result": {
		"pinenable" : false, //true
		"pincode" : 12312387  //8位
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 恢复无线WPS的初始pin码
request
```
{
	"HYID":62,
	"action":"set_wifi_wps_firstpin"
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	5
}
```

#### 生成无线WPS的随机pin码
request
```
{
	"HYID":63,
	"action":"set_wifi_wps_randompin"
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	5
}
```

#### 获取无线访客网络开关

request
```
{
	"HYID":64,
	"action":"get_wifi_guestenable"
}
```

response
```
{
	"result" : {
		"enable": false,
		"wifienable":0 //0 表示2g和5g wifi都关闭，1表示有wifi开启
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置无线访客网络开关

request
```
{
	"HYID":65,
	"action":"set_wifi_guestenable",
	"enable": false
}
说明：false是关闭，true是开启
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	30
}
```

#### 获取无线访客网络配置

request
```
{
	"HYID":66,
	"action":"get_wifi_guest"
}
```

response
```
{
	"result" : {
		"enable":	false,
		"ssid": "xxxx",
		"authmode": "none",
		"wifienable":0 //0 表示2g和5g wifi都关闭，1表示有wifi开启
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

{
	"result" : {
		"enable":	false,
		"ssid": "xxxx",
		"authmode": "pisk-mixed",
		"key": "12345678"
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置无线访客网络配置

request
```
{
	"HYID":67,
	"action":"set_wifi_guest",
	”enable“：false，
	"ssid": "xxxx",
	"authmode": "pisk-mixed",
	"key": "12345678"
}

{
	"HYID":67,
	"action":"set_wifi_guest",
	"ssid": "xxxx",
	"authmode": "none",
	"key":""
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	30
}
```
#### 获取无线访客剩余时间

request
```
//暂时不做
{
	"HYID":68,
	"action":"get_wifi_guesttime"
}
说明：访客网络开启时长设置为不限时的时候，访客剩余时间页面隐藏不显示，否则倒计时剩余时间。
```

response
```
{
	"result" : {
		"time": "",
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 延长无线访客30分钟

request
```
//暂时不做
{
	"HYID":69,
	"action":"set_wifi_guesttime",
	"time": 30
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	30
}
```

#### 获取无线wps状态

request
```
{
	"HYID":70,
	"action":"get_wifi_wpsstatus"
}
```

response
```
{
	"result" : {
		"wpsstatus": 34 //0或2表示失败，34表示成功，35表示超时，36表示连接中
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 获取ntp配置

get_ntp_config

request

~~~
{
		"HYID":71
}
~~~

response

~~~
{
	"result":	{
		"ntp_server":	["cn.ntp.org.cn", "hk.ntp.org.cn", "us.ntp.org.cn"],
		"ntp_enable":	true,
		"time_zone":	"CST-8",
		"time_of_day":	1568624192
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~



#### 设置ntp配置

set_ntp_config

request

~~~
{
	"HYID":72,
	"ntp_enable": true/false
	"ntp_server":[ 
			"pool.ntp.org",
			"cn.pool.ntp.org",
			"europe.pool.ntp.org"
	],
	"time_zone": "CST-8"
}
~~~

response

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

time_zone的值把网关的复制过来



#### 使用浏览器时间

use_browser_time

request

```
{
	"HYID":73,
	"browser_time":"2019-01-15 09:21:27"
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



#### 获取系统日志配置

get_syslog_config

request

```
{
	"HYID":74
}
```

response

```
{
	"result":	{
		"syslog_enable":	true/false,
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 设置系统日志配置

set_syslog_config

request

```
{
	"HYID":75,
	"syslog_enable": true/false
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

与网关对比没有log_size 字段



#### 显示系统日志

display_syslog

request

```
{
	"HYID":76
}
```

response

```
{
	"result":	{
		"syslog":	"日志内容"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 清除系统日志

clean_syslog

request

```
{
	"HYID":77
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



#### 获取定时重启配置

get_sche_reboot_config

request

```
{
	"HYID":78
}
```

response

```
{
	"result":	{
		"sche_reboot_mode":	0,
		"rectime":	0,
		"weeks":	0,
		"hour":	0,
		"minute":	0,
		"remaining_time":	"0 day 0 hour 0 minute",
		"time_of_day":	1548628666
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"sche_reboot_mode":	1,
		"rectime":	100,
		"weeks":	0,
		"hour":	0,
		"minute":	0,
		"remaining_time":	"0 day 0 hour 1 minute 36 seconds",
		"time_of_day":	1548628726
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"sche_reboot_mode":	2,
		"rectime":	0,
		"weeks":	124,
		"hour":	4,
		"minute":	53,
		"remaining_time":	"0 day 0 hour 14 minute",
		"time_of_day":	1548628752
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

sche_reboot_mode：0 关闭   1：倒计时  需要rectime ，页面显示为小时跟分钟，换算成秒数传给后台,最大不超过24小时，最小不低于10分钟， 600 ~ 86400  s

2： 指定时间重启   需要配置weeks，周日到周六，为每一位对应一位的二进制数，周日为1，周一为2，周二4，周三8 ，周四 16，周五 32，周六 64 ，全选为127，可以组合，全不选不能提交

，hour/minute是指定时间的时钟，如12点38分 hour为12  minute为38  ，

新增time_of_day，与ntp页面当前时间处理一致，当选择非关闭时显示在页面，

新增remain_time,将字符串显示在页面，为剩余多少时间系统将重启



#### 设置定时重启配置

set_sche_reboot_config

request

```
{
	"sche_reboot_mode":	2,
	"rectime":	1800,
	"weeks":	255,
	"hour":	23,
	"minute":	15,
	"HYID":"79"
}
{
	"sche_reboot_mode":	1,
	"rectime":	3600,
	"HYID":"84"
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

定时重启功能与网关一直



#### 检测wan口类型

do_wan_proto_detect 

request

```
{
	"HYID":85,
	"action":"do_wan_proto_detect"，
}
```

response

```
{
	"result":	{
		"link":	1,
		"wan_proto":	2,
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置无线WPS本地pin码开关
request
```
{
	"HYID":86,
	"action":"set_wifi_wps_ownpin"，
	"enable": 1
}
```

response
```
{
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	5
}
```



#### 获取模块升级信息

get_module_upgrade_info

request

~~~
{
	"HYID": 87
}
~~~

response

~~~
{
	"result":	{
		"module_ready":	false,
		"module_version":	""
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

需要先判断module_ready 是否为true ，为false显示  模块初始化中，请稍后再试（Module initialization, please try again later），为true显示版本号，并显示升级控件



#### 获取系统信息

get_system_info

request

~~~
{
	"HYID":"88"
}
~~~

response

~~~
{
	"result":	{
		"product_name":	"HCT 5G CPE",
		"module_sn":	"12345678",
		"product_model":	"zn183",
		
		"imei":	"",
		"imsi":	"",
		"hardware_version":	"",
		"software_version":	"15.05.1",
		"webui_version":	"",
		"lan_mac":	"00:0C:43:68:20:AA",
		"ip_address":	"0.0.0.0"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"product_name":	"HCT 5G CPE",
		"product_sn":	"OK",
		"product_model":	"zn183",
		"mobile_network":	"CHN-UNICOM",
		"mobile_type":	"4G",
		"signal":	-20,
		"imei":	"004400152520000",
		"imsi":	"460012984217018",
		"software_version":	"A2_FC_V0.1",
		"webui_version":	"WEBA2_FC_V0.1",
		"lan_mac":	"E4:63:01:18:84:AC",
		"ip_address":	"192.168.90.122"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

该页面需要判断，如果返回的值为 “”（为空）时，需要显示unknown（未知）

如果对比huawei的设备，多了product_model（产品信号），去掉了ipv6的ip地址

新增3个字段，首页已经用到

Mobile Network 移动网络: 中文需要匹配

CHN-CT 中国电信

CHINA MOBILE CMCC 中国移动

CHN-UNICOM  中国联通

其他不管，英文不用翻译

Mobile Type 网络类型：2G 3G 4G 5G,为空显示未知（unknown）

信号（Signal）：-20 dBm，为0显示未知



#### 获取硬件NAT配置

get_hwnat_config

request

```
{
	"HYID":89
}
```

response

```
{
	"result":	{
		"enabled":	false
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置硬件NAT配置

set_hwnat_config

request

```
{
		"HYID":90,
		"enabled":true
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

后台默认值为开启状态，需要显示

开启硬件NAT时，用户上网数据通过硬件转发，统计功能和防火墙高级功能不生效

When hardware NAT is enabled, the user's Internet data is forwarded through the hardware. The statistics function and firewall advanced functions do not take effect.



#### 获取在线列表

request
```
{
	"HYID":91,
	"action":"get_allstalist"
}
```

response
```
{
	"result" : {
		"staline_list":	[{
				"ip":"192.168.88.125",
				"mac":	"00:19:be:20:03:5b",
				"hostname":"desktop_dev"
			}, {
				"ip":"192.168.88.124",
				"mac":	"23:19:be:20:03:5e",
				"hostname":"my_dev"
			}]
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 获取ACL列表

request
```
{
	"HYID":60,
	"action":"get_acl_list"
}
```

response
```
{
	"result" : {
		"acl_list":	[{
				"acl_mac":	"00:19:be:20:03:5b"
			}, {
				"acl_mac":	"23:19:be:20:03:5e"
			}]
	},
	"redir":	"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 阻止上网

request

```
{		
		"HYID":93,
		"action":"add_acl_list",
		"acl_mac":"00:19:be:20:03:5b"
}
```

response

```
{	
	"redir":"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 从acl列表里解除上网

request

```
{		
		"HYID":94,
		"action":"delete_acl_list",
		"acl_mac":"00:19:be:20:03:5b"
}
```

response

```
{	
	"redir":"false",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```



#### 首页信息

get_overview_info

request 

```
{
	"HYID":"95"
}
```

response

```
{
	"result":	{
		"wan_type":	"wired",
		"wan_up":	1,
		"wan_uptime":	15,
		"sim_state":	0,
		"mobile_network":	"",
		"mobile_type":	"",
		"signal":	0,
		"client_num":	"1",
		"tx_bps":	5,
		"rx_bps":	7,
		"rx_bytes":	828,
		"tx_bytes":	4380，
		"wifi_2g":1,
		"wifi_5g":1
		
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
{
	"result":	{
		"wan_type":	"mobile",
		"wan_up":	0,
		"wan_uptime":	335,
		"sim_state":	1,
		"mobile_network":	"CHN-UNICOM",
		"mobile_type":	"4G",
		"signal":	-20,
		"client_num":	"1",
		"tx_bps":	2,
		"rx_bps":	4,
		"rx_bytes":	8503,
		"tx_bytes":	37162,
		"wifi_2g":1,
		"wifi_5g":1
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

{
	"result":	{
		"wan_type":	"mobile",
		"wan_up":	0,
		"wan_uptime":	335,
		"sim_state":	2,
		"mobile_network":	"CHN-UNICOM",
		"mobile_type":	"4G",
		"signal":	-20,
		"client_num":	"1",
		"tx_bps":	2,
		"rx_bps":	4,
		"rx_bytes":	8503,
		"tx_bytes":	37162,
		"wifi_2g":1,
		"wifi_5g":1
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

wan_type: wired 有线  mobile 移动上网

wan_up: 0 表示不能上网  



mobile_network:表示运营商，中英文翻译支持三种，其他的不支持翻译，直接显示后台返回的值

CHN-CT 中国电信

CHINA MOBILE CMCC 中国移动

CHN-UNICOM  中国联通

mobile_type:是3G 4G 5G标志



sim_state: 0 ERROR (NO SIM)

​				   1 READY(OK)

​				   2 SIM LOCK()



#### 获取模块pin码状态

get_module_pin_state

request

```
{
	"HYID":96
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

~~~
{
	"HYID":97,
	"sim_clck":true,
	"pin_code":”1234”
}
{
	"HYID":97,
	"sim_clck":false,
	"pin_code":"1234"
}
~~~

response

~~~
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
~~~

pin_code字段要用字符串传给我，比如0000，是“0000”，



#### 获取pin码clck状态

get_sim_clck

request

~~~
{
		"HYID":98
}
~~~

response

~~~
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
~~~



#### 设置pin码clck状态

set_pin_clck

request

~~~
{
		"HYID":99,
		"sim_clck":true,
		"pin_code":"1234"
}
~~~

response

~~~
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
~~~



#### 修改模块pin码

change_module_pin_code

request

```
{
	"HYID":100,
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



#### 获取模块网络配置

get_module_network_config

request

```
{
	"HYID": 101
}
```

response

```
{
	"result":	{
		"support_5g":	true,
		"module_ready":	true,
		"sim_state":	1
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

注意先判断module_ready 再判断sim状态



#### 设置模块网络配置

set_module_network_config

request

```
{
	"HYID":102,
	"support_5g":false
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



#### 获取模块APN配置

get_module_apn_config

request

```
{
	"HYID": 103
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
	"HYID":104,
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

~~~
{
	"HYID":105
} 
~~~

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

删除时，use_apn不需要发送到后台，一定是使用默认的apn才可以删除用户增加的apn

默认的apn不能编辑跟修改，所以新增的apn跟修改新增的apn，或者修改使用的apn，都是调用104接口

apn设置，是有一个默认的apn，不用传给后台

设置删除可能会返回 4007，提示设置不成功，请重试



#### 获取新信息状态

get_new_sms_state

request

~~~
{
	"HYID":3
} 
~~~

response

~~~
{
	"result":	{
		"messages_unread":	13
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

update interface
{
	"result":	{
		"messages_unread":	13,
		"cloudup_status":0
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

{
	"result":	{
		"messages_unread":	13,
		"cloudup_status":1/2
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}

{
	"result":	{
		"messages_unread":	0,
		"cloudup_status":	3 //判断时使用大于2
	},
	"redir":	true,
	"reconnection_addr":	"192.168.88.1",
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	120
}
~~~

messages_unread 为0表示没有信息，大于0表示有短信未读

此接口用于右上角图标提醒，没有延迟，及时返回



#### 获取短信概览信息

get_breaf_sms_info

request

~~~
{
	"HYID":107
} 
~~~

response

~~~
{
	"result":	{
		"breaf_sms":	[{
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
~~~

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

~~~
{
	"HYID":108,
	"number":"18665802506"
} 
~~~

response

~~~
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
~~~

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

~~~
{
	"HYID":109,
	"sid":"11;12"
} 
{
	"HYID":109,
	"sid":"13"
} 
~~~

response

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~



此接口用于删除一个号码所有短信，需要的参数为HYID 107中获取的sid，多选时用分号隔开

只能在最外层页面删除会话，动作成功后发送 107更新页面数据



#### 删除短信

delete_sms_by_cid

request

~~~
{
	"HYID":110,
	"number":"18665802506",
	"c_sid":"13"
} 
~~~

response

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

进入回话页面可以删除短信，多选时用分号隔开，全选时，短信全部删除，再用此号码发送108会返回 空的列表，回到外层会话列表后获取数据会更新，不用特意考虑全选删除的情况



#### 发送短信

send_sms_messages

request

~~~
{
	"HYID":111,
	"number":"10086;10010;",
	"sms_msg":"hello world"
} 
~~~

response

~~~
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
~~~



短信的转发，回复，新建短信发送，都调用此接口

多个号码用分号隔开，短信内容限制

没有中文或中文字符时140字节，

有中文或者中文字符时70字节，

返回值只有2000，但是会返回

send_count ，发送的短信条数

success_count 发送成功的条数

fail_count 失败的条数

只有短信发送的接口，不能及时返回，页面需要等待，后台返回后提示按照count 提示



#### 检测云升级

request

~~~
{
	"HYID":"112"
}
~~~

response

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

检测更新之后五秒获取结果，直接调用HYID = 6的接口

#### 开始固件云升级

request

~~~
{
	"HYID":"113"
}
~~~

response

~~~
{
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

#### 开始模块云升级

request

```
{
	"HYID":"114"
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

开始以上两种云升级任意一种，两个升级都不能使用。

注意开始升级之后，HYID=6中的cloudup_status变化



