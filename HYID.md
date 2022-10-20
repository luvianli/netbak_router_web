##  HYID,errcode, progresstime为数字类型

## 注意：接口类型区分数字或字符串类型，例如 2 为数字类型，"2"为字符串类型

--------------------------

#### 注意前后台需要严格区分数字与字符串，json中数字类型为：“aaaaa”：1024，字符串类型为：“aaaaa”：“1024”，



JSON返回码详解

| 字段     | 字段值         | 描述                                    |
| -------- | -------------- | --------------------------------------- |
| errcode | 见errcode码表 | 返回码，正确为2000;登陆认证超时返回4001 |
| huayierrtype   | success        | 错误信息                                |
| progresstime | 0              | 倒计时间，0为不倒时                     |
|          |                |                                         |
|          |                |                                         |
|          |                |                                         |
|          |                |                                         |
|          |                |                                         |
|          |                |                                         |

### 返回错误码列表

| errcode | 信息描述           | 详细描述                                                     |
| -------- | ------------------ | ------------------------------------------------------------ |
| 2000     | success            | 正确默认返回2000                                             |
| 4001     | unauthorized       | 未授权的请求，前端统一跳转到登录页，仅用于cookie的校验       |
| 4002     | format error       | 数据不是json根式                                             |
| 4003     | HYID field miss    | json数据中缺少HYID                                           |
| 4004     | illegal HYID       | 非法的HYID                                                   |
| 4005     | required data miss | 必须的数据缺少                                               |
| 4006     | permission deny    | 权限被禁止，用于修改密码，登录时密码错误，注意与4001区分，此响应仅提示，不跳转 |
| 4007     | server failure     | 服务器故障                                                   |
| 4008     | file format error  | 上传文件错误                                                 |
| 4009     | dulicate data      | 重复的数据                                                   |
| 4010     | data content error | 数据内容错误                                                 |
|          |                    |                                                              |



### action与HYID

| action               | HYID | 描述           | 备注             |      |      |
| -------------------- | ---- | -------------- | ---------------- | ---- | ---- |
| get_pre_login_config | 0    | 获取登录前配置 | 无需登录         |      |      |
| set_pre_login_config | 1    | 设置登录前配置 | 无需登陆（预留） |      |      |
| get_language_config  | 2    | 获取语言配置   | 无需登陆         |      |      |
| set_language_config  | 3    | 设置语言配置   | 无需登陆         |      |      |
| do_login_auth        | 4    | 登录认证       |                  |      |      |
| do_huayi_logout      | 6    | 登出           | 需要cookie       |      |      |
|                      |      |                | 需要cookie       |      |      |
|                      |      |                | 需要cookie       |      |      |
|                      |      |                | 需要cookie       |      |      |





### 详细接口列表

#### 获取登录前配置

get_pre_login_config

request

```
{
	HYID : 0
｝
```

response

```
{
	"result":	{
		"web_title":	"HUAYI",
		"company_website":	"www.huayi.com",
		"need_authorized": 1, //需要登陆为1，没有登陆为0
		"first_boot": 1, //首次进入为1
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
```

#### 设置登录前配置    (预留)

set_pre_login_config

request

~~~
{
	"HYID":1
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



#### 获取语言配置

get_language_config

request

~~~
{
	"HYID":2
}
~~~

response

~~~
{
	"result":	{
		"support_language":	["cn", "en"],
		"language":	"cn"
	},
	"huayierrtype":	"success",
	"errcode":	2000,
	"progresstime":	0
}
~~~

#### 设置语言配置

set_language_config

request

~~~
{
	"HYID":3,
	"language":"en"
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
~~~



#### 登录认证

do_login_auth

request

```
{
	HYID : 4,
	username:"admin",
    password:"admin" //密码需要加密
｝
```

response

>first_boot:   返回数字类型
>
>​		    1 为第一次返回，此时跳转至设置向导页
>
>​		    0 跳转至系统状态页
>
>如果没有设置向导页，此接口保留，first_boot默认值为0

```
认证成功
{
    errcode: 2000,
    huayierrtype: "success",
    first_boot: 0,
    progresstime:0
}
认证失败
{
	"huayierrtype":	"permission deny",
	"errcode":	4006,
	"progresstime":	0
}
```

#### 退出登录

do_logout_clean

request

```
{
	HYID : 5
｝
```

response

```
{
    errcode: 2000,
    huayierrtype: "success",
    progresstime:0
   
}
```

