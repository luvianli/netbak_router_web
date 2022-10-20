import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './style.less'
import {Icon } from 'antd'

class Table extends Component {
    static defaultProps = {
        selectKey:true,
  };
    constructor(props){
        super(props)        
        this.state={
            all:0
        }
        this.indexArr=[]
        if(props.dataSource.length>0){
            for(var i =0;i<props.dataSource.length;i++){
              this.indexArr[i]=false
            }
        }
    }
  componentWillReceiveProps(nextProps){
    if(this.props.dataSource!== nextProps.dataSource){
      if(nextProps.dataSource.length>0){
        this.indexArr=[]
        for(var i =0;i<nextProps.dataSource.length;i++){
          this.indexArr.push(false)
        }
      }
    }
  }

  onChange=(index)=>{
    this.indexArr[index]= !this.indexArr[index]
    this.setState({
      all:this.indexArr.indexOf(false)//-1为全选上了
    })
  }
  
  selectAll=(e)=>{
    for(var i = 0;i<this.indexArr.length;i++){
      this.indexArr[i]= e.target.checked
    }
    this.setState({
      all:e.target.checked?-1:0
    })
  }
  /**返回选择的序号数组 */
  deleteSelect=()=>{
    let arr = []
    this.indexArr.map((item,index)=>{
      if(item===true){
            arr.push(index)
            this.indexArr[index]=false//同时清除当前勾选状态
      }
      return true
    })
    this.setState({
      all:0
    })
    this.props.handleDelRule(arr)
  }
  render() {
  const { dataSource,columns,selectKey,showSave} = this.props;
  let indexArr = this.indexArr
    return (
        <div className="table-box">
          {this.props.title?
          <div className='table-header'>
            {this.props.title}
            {this.props.showAdd?
            <div className='table-add' onClick={this.props.opration}><Icon type="plus" /></div>
              :null}
            </div>:null}
            <div className="table-father" style={this.props.tableFatherCss}>
            <table>
                <thead className='theader'>
                    <tr>
                    {selectKey===true?
                        <tr><input type="checkbox" checked={this.state.all===-1} onChange={this.selectAll}/></tr>:null
                    }{columns.map((item,index)=>{                        
                        return( 
                            <td key={item.key}>{item.title}</td>
                        )})
                    }
                    </tr>
                </thead>

                <tbody className={showSave===true?'tbody-save':'tbody'}>
                {dataSource.length>0?
                dataSource.map((rule,rindex)=>{
                return( 
                    <tr key={`tb-${rindex}`} >
                    {selectKey===true?
                        <td><input type="checkbox" checked={indexArr[rindex]} 
                        onChange={()=>this.onChange(rindex)}/></td>:null
                    }
                        {columns.map((item,cindex)=>{
                            if(item.render) return item.render(rindex,rule)             
                            return( 
                                <td key={`tb-${cindex}`}>{rule[item.dataIndex]}</td>
                            )})
                        }
                    </tr>
                )}):showSave===true?null:<tr><td></td></tr>}
                </tbody>
            </table>
            </div>
            {
              showSave===true?<>
                <table><tbody><tr><td>
                  <button className='table-save' onClick={this.props.handleTableSave}>{window.__('Apply')}</button>
                </td></tr></tbody></table>
              <div className='table-footer-save'></div></>
            :<div className='table-footer'></div>
            }
        </div>
    )
    }
}


Table.propTypes = {
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array.isRequired,
    selectKey:PropTypes.bool,//是否显示多选
    handleDelRule:PropTypes.func,
    handleTableSave:PropTypes.func,
    showAdd:PropTypes.bool,
    showSave:PropTypes.bool,
};
  
 
Table.defaultProps = {
  dataSource: [],
  selectKey:false,
  showAdd:false,
  showSave:false,
  opration:function(){return;},
  handleTableSave:function(){return;}

};
export default Table