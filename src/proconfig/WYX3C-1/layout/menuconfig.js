
//let lang = localStorage.getItem("language")==null?'en':localStorage.getItem("language")
//let __ = require(`@/share/lang/${lang}/lang.js`)

export default class Menu{
    static menulist(option){
    return [
    {
        title:  ('Home'),
        icon:'&#xe612;',
        key: '/Home',
        type:'',
    },{
        title:  ('Network Setting'),
        icon:'&#xe624;',
        key: '/Network',
        type:'',
        children:[
            {
                title:  ('WAN Setting'),
                key: '/Network/Ethernet',
                type:'',
                children:[
                    // {
                    //     title:   ('Internet Connection'),
                    //     key: '/Network/Ethernet/APN',
                    //     type:'',
                    // },
                    // {
                    //     title:   ('WAN Setting'),
                    //     key: '/Network/Ethernet/Settings',
                    //     type:'',
                    // },
                    {
                        title:   ('WAN Setting'),
                        key: '/Network/Ethernet/WANPrior',
                        type:'',
                    },
                    {
                        title:  ('WAN Status'),
                        key: '/Network/Ethernet/Status',
                        type:'',
                    }
                ]
            },
            {
                title:  ('LAN Setting'),
                key: '/Network/LAN',
                type:'',
                children:[
                    {
                        title:  ('LAN Setting'),
                        key: '/Network/LAN/LAN',
                        type:'',
                    },
                    {
                        title:  ('LAN Status'),
                        key: '/Network/LAN/LanStatus',
                        type:'',
                    },
                    {
                        title:  ('DHCP Setting'),
                        key: '/Network/LAN/DHCP',
                        type:'',
                    },
                ]
            },
            // {
            //     title:  ('Operator Switching'),
            //     key: '/Network/Operator',
            //     type:'',
            // },
        ]
    },
    {
        title:  ('Wireless Setting'),
        icon:'&#xe60a;',
        key: '/WiFi',
        type:'',
        children:[
            {
                title:   ('2.4G Wireless Setting'),
                key: '/WiFi/2G',
                type:'',
                children:[
                    {
                        title:  ('Basic Setting'),
                        key: '/WiFi/2G/Base',
                        type:'',
                    },
                    {
                        title:  ('Advanced Setting'),
                        key: '/WiFi/2G/Advanced',
                        type:'',
                    },
                    {
                        title:  ('Wireless ACL'),
                        key: '/WiFi/2G/ACL',
                        type:'',
                    },
                ]
                /*children:option.enable2g===1?[
                    {
                        title:  ('Basic Setting'),
                        key: '/WiFi/2G/Base',
                        type:'',
                    },
                    {
                        title:  ('Advanced Setting'),
                        key: '/WiFi/2G/Advanced',
                        type:'',
                    },
                    {
                        title:  ('Wireless ACL'),
                        key: '/WiFi/2G/ACL',
                        type:'',
                    },
                ]:[
                    {
                        title:  ('Basic Setting'),
                        key: '/WiFi/2G/Base',
                        type:'',
                    }
                ]*/
            },
            /*{
                title:   ('5.8G Wireless Setting'),
                key: '/WiFi/5G',
                type:'',
                children:option.enable5g===1?[
                    {
                        title:  ('Basic Setting'),
                        key: '/WiFi/5G/Base',
                        type:'',
                    },
                    {
                        title:  ('Advanced Setting'),
                        key: '/WiFi/5G/Advanced',
                        type:'',
                    },
                    {
                        title:  ('Wireless ACL'),
                        key: '/WiFi/5G/ACL',
                        type:'',
                    },
                ]:[
                    {
                        title:  ('Basic Setting'),
                        key: '/WiFi/5G/Base',
                        type:'',
                    },
                ]
            },*/
        ]
    },
    {
        title:  ('Home Devices'),
        icon:'&#xe61a;',
        key: '/Devices',
        type:'',
    },
    // {
    //     title:  ('QoS Setting'),
    //     icon:'&#xe61a;',
    //     key: '/QoS',
    //     type:'',
    //     children: [
    //         {
    //             title:  ('QoS Setting'),
    //             key: '/QoS/1',
    //             type:'',
    //         },
    //     ]
    // },
    // {
    //     title:  ('SMS Conversation'),
    //     icon:'&#xe61a;',
    //     key: '/SMS',
    //     type:'',
    //     children: [
    //         {
    //             title:  ('SMS Conversation'),
    //             key: '/SMS/Conversation',
    //             type:'',
    //         },
    //     ]
    // },
    {
        title: ('Advanced Setting'),
        icon:'&#xe66d;',
        key: '/Advanced',
        type:'',
        children: [
            {
                title:  ('Route'),
                key: '/Advanced/Router',
                type:'',
                children:[
                    {
                        title:  ('Static Router'),
                        key: '/Advanced/Router/Static',
                        type:'',
                    },
                    /*{
                        title:  ('DDNS'),
                        key: '/Advanced/Router/DDNS',
                        type:'',
                    },*/
                ]
            },
            {
                title:  ('Firewall'),
                key: '/Advanced/Security',
                type:'',
                children:[
                    /*{
                        title:  ('Hardward NAT'),
                        key: '/Advanced/Security/HardwareNAT',
                        type:'',
                    },*/
                    {
                        title:  ('Remote Management'),
                        key: '/Advanced/Security/Remote',
                        type:'',
                    },
                    {
                        title:  ('MAC Filter'),
                        key: '/Advanced/Security/MAC',
                        type:'',
                    },
                    {
                        title:  ('URL Filter'),
                        key: '/Advanced/Security/Domain',
                        type:'',
                    },
                    {
                        title:  ('IP/Port Filter'),
                        key: '/Advanced/Security/IP',
                        type:'',
                    },
                    // {
                    //     title:  ('DMZ Setting'),
                    //     key: '/Advanced/Security/DMZ',
                    //     type:'',
                    // },
                    // {
                    //     title:  ('Port Mapping'),
                    //     key: '/Advanced/Security/PortForward',
                    //     type:'',
                    // },
                    {
                        title:  ('UPNP Setting'),
                        key: '/Advanced/Security/UPnP',
                        type:'',
                    },
                    {
                        title:  ('Wan Ping Setting'),
                        key: '/Advanced/Security/Special',
                        type:'',
                    },
                ]
            },
            {
                title:  ('System Management'),
                key: '/Advanced/System',
                type:'',
                children:[
                    {
                        title:  ('Device Information'),
                        key: '/Advanced/System/Device',
                        type:'',
                    },
                    {
                        title:  ('Firmware Upgrade'),
                        key: '/Advanced/System/Upgrade',
                        type:'',
                    },
                    {
                        title:  ('Reset'),
                        key: '/Advanced/System/Reset',
                        type:'',
                    },
                    {
                        title:  ('System Configuration'),
                        key: '/Advanced/System/System',
                        type:'',
                    },
                    {
                        title:  ('Reboot'),
                        key: '/Advanced/System/Restart',
                        type:'',
                    },
                    {
                        title:  ('Schedule Reboot'),
                        key: '/Advanced/System/ScheReboot',
                        type:'',
                    },
                    // {
                    //     title:  ('DDNS'),
                    //     key: '/Advanced/System/DDNS',
                    //     type:'',
                    // },
                    {
                        title:  ('NTP Setting'),
                        key: '/Advanced/System/Time',
                        type:'',
                    },
                    {
                        title:  ('System Log'),
                        key: '/Advanced/System/Log',
                        type:'',
                    },
                    {
                        title:  ('Admin Setting'),
                        key: '/Advanced/System/Modify',
                        type:'',
                    },
                    // {
                    //     title:  ('SIM Card Lock'),
                    //     key: '/Advanced/System/PINCode',
                    //     type:'',
                    // },
                    // {
                    //     title:  ('Modify PIN Code'),
                    //     key: '/Advanced/System/PINModify',
                    //     type:'',
                    // },
                ]
            },
            {
                title: ('System Tools'),
                icon:'&#xe66d;',
                key: '/Advanced/Tool',
                type:'',
                children: [
                    {
                        title:  ('Ping Detect'),
                        key: '/Advanced/Tool/Ping',
                        type:'',
                    },
                    {
                        title:  ('Traceroute'),
                        key: '/Advanced/Tool/Tracert',
                        type:'',
                    },
                    {
                        title:  ('DHCP Detect'),
                        key: '/Advanced/Tool/DHCPTest',
                        type:'',
                    },
                ]
            },
        ]
    },
    
    ]
    }
}