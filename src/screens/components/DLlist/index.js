import React from 'react';
import './index.less';

export default function Footer(props){
const renderList = (data) => {
    return data.map((item,index)=>{
        return(
            <dl key={index}>
                <dt>{item.key}</dt>
                <dd><pre className="pre-msg">{item.value}</pre></dd>
            </dl>
        )
    })
}
  return(
    <div className={`dllist ${props.className}`} >
        {
            renderList(props.data || [])
        }
    </div>
  )
}
