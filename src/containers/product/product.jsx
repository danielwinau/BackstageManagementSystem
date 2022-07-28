import React, { Component } from 'react'
import { connect} from 'react-redux';
import {createSaveProductAction} from '../../redux/action_creators/product_action'
import { Button, Card,Icon,Select,Input,Table,message } from 'antd';
import {reqProductList,reqUpdateProdStatus,reqSearchProduct} from '../../api'
import { PAGE_SIZE } from '../../config';

const { Option } = Select;

class Product extends Component {

  state={
    productList:[],
    current:1,
    total:'',
    keyWord:'',
    searchType:'productName',
  }

  componentDidMount(){
    this.getProductList()
  }

  getProductList =async(number=1)=>{
    let result
    const {searchType,keyWord} = this.state
    if (this.isSearch) result= await reqSearchProduct(number,PAGE_SIZE,searchType,keyWord)
    else result = await reqProductList(number,PAGE_SIZE)
    const {status, data} =result
    if (status===0) {
      this.setState({
        total:data.total,
        productList:data.list,
        current:data.pageNum,
      })
      this.props.saveProduct(data.list)
    }else{
      message.error('获取商品列表失败',1)
    }
  }

  updateProdStatus = async ({_id,status})=>{
    status = status===1?2:1
    const result= await reqUpdateProdStatus(_id,status)
    let productList=[...this.state.productList]
    if (result.status===0) {
      message.success('更新商品状态成功',1)
      productList = productList.map(item=>{
        if (item._id===_id) {
          item.status=status          
        }
        return item
      })
      this.setState({productList})
    } else {
      message.error('更新商品状态失败',1)
    }
  }

  search = async ()=>{
    this.isSearch=true
    this.getProductList()
  }

  render() {

    const dataSource = this.state.productList;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        width:'20%',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        align:'center',
        width:'10%',
        key: 'price',
        render: price=>'￥'+price
      },
      {
        title: '状态',
        //dataIndex: 'status',
        align:'center',
        width:'10%',
        key: 'status',
        render: item=>{return(
          <div>
            <Button 
              type={item.status===1?'danger':'primary'}
              onClick={ ()=>{this.updateProdStatus(item)} }
            >
              {item.status===1?'下架':'上架'}</Button>
            <br />
            <span>{item.status===1?'在售':'已停售'}</span>
          </div>
        )}
      },
      {
        title: '操作',
        //dataIndex: 'opera',
        align:'center',
        width:'10%',
        key: 'opera',
        render: (item)=>{return(
          <div>
            <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}} >详情</Button>
            <br />
            <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}} >修改</Button>
          </div>
        )}
      },
    ];

    return (
      <Card
        title={
          <div>
            <Select defaultValue="productName" onChange={value=>{this.setState({searchType:value})}} >
              <Option value="productName">按名称搜索</Option>
              <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input
              placeholder="请输入搜索关键字"
              style={{margin:'0px 10px',width:'20%'}}
              allowClear
              onChange={event=>{this.setState({keyWord:event.target.value})}}
            />
            <Button type='primary' onClick={this.search} ><Icon type="search" />搜索</Button>
          </div>
        }
        extra={<Button type='primary' onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}} ><Icon type="plus" />添加商品</Button>}
      >

        <Table
          dataSource={dataSource} 
          columns={columns} 
          bordered
          rowKey='_id'
          pagination={{
            total:this.state.total,
            pageSize:PAGE_SIZE,
            current:this.state.current,
            onChange:this.getProductList,
          }}
        />
      </Card>
    )
  }
}

export default connect(
  state=>({}),
  {saveProduct:createSaveProductAction}
)(Product)