获取时：发送radio_id，获取对应的无线客户端；

组件使用时，参数有radio_id, 并添加一个是否显示操作的标志 show_action
如果是首页时 不能操作，show_action= false, 如果是无线ACL扫描时，show_action = true;

radio_id 传值有2种方法：一种是父组件调用，一种是直接点击扫描接口，2种传值不一样。

request:  
{ 
    HYID:74,
    "radio_id":0/1, //NC-WR27单频没有此参数，其他该参数 0 表示 2.4G，1表示5.8G， +
}

response:
{
  "result": {
    "wireless_clients_list": [
      {
        "idx": 1,
        "bssid": "14:4D:67:40:27:88",
        "bandwidth": "20"
      },
      {
        "idx": 2,
        "bssid": "D8:32:14:55:CE:E8",
        "bandwidth": "20"
      }
    ]
  },
  "huayierrtype": "success",
  "errcode": 2000,
  "locktime": 0
}