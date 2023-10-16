import React from 'react'
import {HashRouter ,Redirect, Route , Switch } from 'react-router-dom';


import  WifiBase2g from '@/screens/MainRouter/screens/WIFI/2G/Base_simple';
import  WifiAdvanced2g from '@/screens/MainRouter/screens/WIFI/2G/Advance';
import  WifiACL2g from '@/screens/MainRouter/screens/WIFI/2G/ACL';

//import  WifiBase5g from '@/screens/MainRouter/screens/WIFI/5G/Base';
//import  WifiAdvanced5g from '@/screens/MainRouter/screens/WIFI/5G/Advance';
//import  WifiACL5g from '@/screens/MainRouter/screens/WIFI/5G/ACL';

import  WANping from '@/screens/MainRouter/screens/Advanced/Firewall/WANping';
import  DMZ from '@/screens/MainRouter/screens/Advanced/Firewall/DMZ';
import  URL from '@/screens/MainRouter/screens/Advanced/Firewall/URL';
import  Remote from '@/screens/MainRouter/screens/Advanced/Firewall/Remote';
//import  HardwareNAT from '@/screens/MainRouter/screens/Advanced/Firewall/HardwareNAT';
import  IPFilter from '@/screens/MainRouter/screens/Advanced/Firewall/IPFilter';
import  MACFilter from '@/screens/MainRouter/screens/Advanced/Firewall/MACFilter';
import  PortForward from '@/screens/MainRouter/screens/Advanced/Firewall/PortForward';
import  UPNP from '@/screens/MainRouter/screens/Advanced/Firewall/UPNP';

import  StaticRoutes from '@/screens/MainRouter/screens/Advanced/Router/StaticRoutes';
import  DDNS from '@/screens/MainRouter/screens/Advanced/Router/DDNS';

import  LAN from '@/screens/MainRouter/screens/Network/LAN';
// import  WAN from '@/screens/MainRouter/screens/Network/WAN';
import  DHCP from '@/screens/MainRouter/screens/Network/DHCP';
import  EthStatus from '@/screens/MainRouter/screens/Network/EthStatus';
import  LanStatus from '@/screens/MainRouter/screens/Network/LanStatus';
import  Operator from '@/screens/4G300-H002-HY07/Operator';

import  DeviceInformation from '@/screens/MainRouter/screens/Advanced/System/DeviceInformation';
import  Upgrade from '@/screens/MainRouter/screens/Advanced/System/Upgrade';
import  ScheReboot from '@/screens/MainRouter/screens/Advanced/System/ScheReboot';
import  Password from '@/screens/MainRouter/screens/Advanced/System/Password';
import  Reset from '@/screens/MainRouter/screens/Advanced/System/Reset';
import  Restart from '@/screens/MainRouter/screens/Advanced/System/Restart';
import  SystemLog from '@/screens/MainRouter/screens/Advanced/System/SystemLog';
import  SystemSettings from '@/screens/MainRouter/screens/Advanced/System/SystemSettings';
import  TimeSettings from '@/screens/MainRouter/screens/Advanced/System/TimeSettings';

import  PingTest from '@/screens/MainRouter/screens/Advanced/Tool/PingTest';
import  TracertRoute from '@/screens/MainRouter/screens/Advanced/Tool/TracertRoute';
import  DHCPTest from '@/screens/MainRouter/screens/Advanced/Tool/DHCPTest';

import  Devices from '@/screens/MainRouter/screens/Devices';

import  QoS from '@/screens/MainRouter/screens/QoS';
// import  SMSConversation from '@/screens/4G300-H002-HY07/SMSConversation';
// import  MobileNetwork from '@/screens/MainRouter/screens/Network/MobileNetwork';
// import  PINCode from '@/screens/MainRouter/screens/Advanced/System/PINCode';
// import  PINModify from '@/screens/MainRouter/screens/Advanced/System/PINModify';
import  Home from '@/screens/4G300-H002-HY07/Home';

import  WANPrior from '@/screens/MainRouter/screens/Network/WANPrior';



export default class IRouter extends React.Component {

  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
              <Switch>
                <Route  path="/Home"  component={Home}/>

                {/* <Route  path="/SMS/Conversation"  component={SMSConversation}/> */}
                {/* <Route  path="/Advanced/System/PINCode"  component={PINCode}/>
                <Route  path="/Advanced/System/PINModify"  component={PINModify}/> */}

                {/* <Route  path="/Network/Ethernet/APN"  component={MobileNetwork}/> */}
                
                <Route  path="/Network/LAN/LAN"  component={LAN}/>
                <Route  path="/Network/LAN/DHCP"  component={DHCP}/>
                {/* <Route  path="/Network/Ethernet/Settings"  component={WAN}/> */}
                <Route  path="/Network/Ethernet/Status"  component={EthStatus}/>
                <Route  path="/Network/Ethernet/WANPrior"  component={WANPrior}/>
                <Route  path="/Network/LAN/LanStatus"  component={LanStatus}/>
                <Route  path="/Network/Operator"  component={Operator}/>
                
                <Route  path="/WiFi/2G/Base"  component={WifiBase2g}/>
                <Route  path="/WiFi/2G/Advanced"  component={WifiAdvanced2g}/>
                <Route  path="/WiFi/2G/ACL"  component={WifiACL2g}/>
                {/*<Route  path="/WiFi/5G/Base"  component={WifiBase5g}/>
                <Route  path="/WiFi/5G/Advanced"  component={WifiAdvanced5g}/>
                <Route  path="/WiFi/5G/ACL"  component={WifiACL5g}/>
                 
                <Route  path="/Advanced/Security/HardwareNAT"  component={HardwareNAT}/>*/}
                <Route  path="/Advanced/Security/Remote"  component={Remote}/>
                <Route  path="/Advanced/Security/MAC"  component={MACFilter}/>
                <Route  path="/Advanced/Security/IP"  component={IPFilter}/>
                <Route  path="/Advanced/Security/Special"  component={WANping}/>
                <Route  path="/Advanced/Security/DMZ"  component={DMZ}/>
                <Route  path="/Advanced/Security/UPnP"  component={UPNP}/>
                <Route  path="/Advanced/Security/PortForward"  component={PortForward}/>
                <Route  path="/Advanced/Security/Domain"  component={URL}/>

                <Route  path="/Advanced/System/DDNS"  component={DDNS}/>
                <Route  path="/Advanced/Router/Static"  component={StaticRoutes}/>

                <Route  path="/Advanced/System/Restart"  component={Restart}/>
                <Route  path="/Advanced/System/Reset"  component={Reset}/>
                <Route  path="/Advanced/System/Modify"  component={Password}/>
                 
                <Route  path="/Advanced/System/Device"  component={DeviceInformation}/>
                <Route  path="/Advanced/System/ScheReboot"  component={ScheReboot}/>
                <Route  path="/Advanced/System/Upgrade"  component={Upgrade}/>
                <Route  path="/Advanced/System/Time"  component={TimeSettings}/>
                <Route  path="/Advanced/System/System"  component={SystemSettings}/>
                <Route  path="/Advanced/System/Log"  component={SystemLog}/>
                 
                <Route  path="/Advanced/Tool/Ping"  component={PingTest}/>
                <Route  path="/Advanced/Tool/Tracert"  component={TracertRoute}/>
                <Route  path="/Advanced/Tool/DHCPTest"  component={DHCPTest}/>
                
                <Route  path="/Devices"  component={Devices}/>
                <Route  path="/QoS/1"  component={QoS}/>
                             
                {/* <Redirect to="/Login" /> */}
                <Redirect to="/wizard" />
                
              </Switch>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}
