#### 获取wifi调度配置

get_wifi_sche_config

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
	"locktime":	0
}
```



#### 设置wifi调度配置

set_wifi_sche_config

request

```
{
	"HYID":97
    "enabled":	true,
    "weeks":	255,
    "start_hour":	14,
    "start_minute":	2,
    "end_hour":	14,
    "end_minute":	2,
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

说明：此接口为实现在某一时间段内将wifi关闭

参考定时重启(指定时间)，此处需指定两个时间，由时跟分组成，即start_hour +start_minute为开始时间，end_hour+end_minute为结束时间

hour取值0-23  minute 0-59

提交后台需要判断

```c
if(start_hour > end_hour)
{
    return false;
}
if((start_hour==end_hour)&&(start_minute >= end_minute))
{
	return false;
```

开始时间要早于结束时间Start time is earlier than end time

关闭无线 xx：xx  ~  yy：yy

Radio off at ：xx：xx  ~ yy：yy

