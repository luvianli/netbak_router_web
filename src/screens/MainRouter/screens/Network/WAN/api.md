## 网关模式接口返回
### dhcp返回
{
 "result": {
        "proto": "dhcp",
        "ipaddr": "",
        "netmask": "",
        "gateway": "",
        "dns": [""],
        "username": "",
        "password": "",
        "ac": "",
        "service": "",
        "hostname": "CPE",
  },   
 "huayierrtype": "success",
 "errcode": 2000,
 "locktime": 0
}
### static返回
{
 "result": {
        "proto": "static",
        "ipaddr": "192.168.90.13",
        "netmask": "255.255.255.0",
        "gateway": "192.168.90.1",
        "dns": ["192.168.90.1", "8.8.8.8"],
        "username": "",
        "password": "",
        "ac": "",
        "service": "",
        "hostname": "CPE",
  },
 "huayierrtype": "success",
 "errcode": 2000,
 "locktime": 0
}
### pppoe返回
{
 "result": {
        "proto": "pppoe",
        "ipaddr": "192.168.90.13",
        "netmask": "255.255.255.0",
        "gateway": "192.168.90.1",
        "dns": ["192.168.90.1", "8.8.8.8"],
        "username": "pppoe@gd.com",
        "password": "password@gd.com",
        "service": "",
        "hostname": "CPE",
  
 },
 "huayierrtype": "success",
 "errcode": 2000,
 "locktime": 0