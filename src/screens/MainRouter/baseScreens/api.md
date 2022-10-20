
    /**基础页cgi */
    /**获取基础首页显示 */
    get_basic_all_info:92,
    /**获取基础页状态信息显示 */
    get_basic_status_info:93,
    /**获取系统模式 */
    get_system_mode:102,

    /**设置基础设置WIFI信息 */
    set_basic_wifi:94,
	
	

### 获取基础设置WIFI信息

request

```
{
	"HYID":79
}
```

response

```
{
	"result":	{
		"ssid_24g":	"lq123456",
		"key_24g":	"12345678",
		"encryption_24g":	1,
		"ssid_58g":	"HUAYI-5.8G",
		"key_58g":	"",
		"encryption_58g":	0
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"locktime":	0
}
```

### 设置基础设置WIFI信息

request

```

{
	"HYID":91,
	"ssid_24g":	"lq123456",
	"key_24g":	"12345678",
	"encryption_24g":	1,
	"ssid_58g":	"HUAYI-5.8G",
	"key_58g":	"12345678",
	"encryption_58g":	0
}

```
response

```

{
	"huayierrtype":	"success",
	"errcode":	2000,
	"locktime":	0
}
```

### 获取基础状态页显示

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
		"status":	{
			"product_name":	"LV-AC17",
			"fw_version":	143,
			"sys_mode":	0,
			"rep_status":	0,
			"sta_num":	1
		},
		"lan":	{
			"macaddr":	"02:88:00:88:12:12",
			"ipaddr":	"192.168.7.1",
			"netmask":	"255.255.255.0",
			"gateway":	"0.0.0.0"
		},
		"wifi":	{
			"ssid_24g":	"lq123456",
			"key_24g":	"12345678",
			"encryption_24g":	1,
			"ssid_58g":	"HUAYI-5.8G",
			"key_58g":	"66666666",
			"encryption_58g":	0
		}
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"locktime":	0
}
```

### 获取基础设置STATUS信息
request

```

{
	"HYID":90
}

```
response

```

{
	"result":	{
		"product_name":	"LV-AC17",
		"fw_version":	143,
		"buildtime":	"2019-12-27 16:10:40",
		"company_website":	"www.huayi.com",
		"time_of_day":	"2020-04-02 20:34:39",
		"uptime":	346,
		"cpu_rt_usage":	1,
		"mem_rt_usage":	60,
		"flash_usage":	100,
		"sys_mode":	1,
		"rep_status":	0,
		"sta_num":	1
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"locktime":	0
}

```
