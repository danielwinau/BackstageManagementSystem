import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Button, Card, Icon, Form, Input, Select, message} from 'antd'
import { reqCategoryList,reqAddProduct, reqProdById,reqUpdateProduct } from '../../api'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'


const {Item} = Form
const {Option} = Select


class AddUpdate extends Component {

  state={
    categoryList:[],
    operaType:'add',
    categoryId:'',
    name:'',
    desc:'',
    price:'',
    detail:'',
    imgs:[],
    _id:'',
  }

  getCategoryList= async ()=>{
    let result= await reqCategoryList()
    const {status,data,msg}=result
    if (status===0) this.setState({categoryList:data})
    else message.error(msg,1)
  }

  getProductList = async (id)=>{
    let result= await reqProdById(id)
    const {status,data,msg}=result
    if (status===0) {
      this.setState({...data})
      this.refs.pictureWall.setFileList(data.imgs)
      this.refs.richTextEditor.setRichText(data.detail)
    }
  }

  componentDidMount(){
    const {categoryList, productList}=this.props
    const {id}=this.props.match.params
    console.log(id);
    if (categoryList.length) this.setState({categoryList})
    else this.getCategoryList()
    if(id) {
      this.setState({operaType:'update'})
      if (productList.length) {
        let result=productList.find( item=>item._id===id )
        if(result){
          this.setState({...result})
          this.refs.pictureWall.setFileList(result.imgs)
          this.refs.richTextEditor.setRichText(result.detail)
        }
      }
      else this.getProductList(id)
    }
  }

  handleSubmit = (event)=>{
    event.preventDefault()
    let imgs=this.refs.pictureWall.getImgArr()
    let detail=this.refs.richTextEditor.getRichText()
    this.props.form.validateFields( async (err, values) =>  {
      if(err) return
      const {operaType,_id}=this.state
      let result
      if (operaType==='add') result= await reqAddProduct({...values,imgs,detail })
      else result= await reqUpdateProduct({...values,imgs,detail,_id})
      const {status,data,msg}=result
      if (status===0) {
        message.success('商品操作成功')
        this.props.history.replace('/admin/prod_about/product')
      }
      else message.error(msg)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {operaType}=this.state
    return (
      <Card title={
        <div>
          <Button type="link" onClick={this.props.history.goBack}>
            <Icon type="arrow-left"/>
            <span>返回</span>
          </Button>
          <span>{operaType==='update'?'商品修改':'商品添加'}</span>
        </div>}
      >
        <Form
          onSubmit={this.handleSubmit}
          labelCol={{md:2}}
          wrapperCol={{md:7}}
        >
          <Item label="商品名称">
            {getFieldDecorator('name', {
              initialValue:this.state.name||'',
              rules: [{ required: true, message: 'Please input your 商品名称!' }],
            })(
              <Input
                placeholder="商品名称"
              />,
            )}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator('desc', {
              initialValue:this.state.desc||'',
              rules: [{ required: true, message: 'Please input your 商品描述!' }],
            })(
              <Input
                placeholder="商品描述"
              />,
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator('price', {
              initialValue:this.state.price||'',
              rules: [{ required: true, message: 'Please input your 商品价格!' }],
            })(
              <Input
                placeholder="商品价格"
                addonAfter="元"
                prefix="￥"
                type="number"
              />,
            )}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator('categoryId', {
              initialValue:this.state.categoryId||'',
              rules: [{ required: true, message: 'Please input your 商品分类!' }],
            })(
              <Select>
                  <Option value="">请选择分类</Option>
                  {
                    this.state.categoryList.map(item=>{
                      return <Option key={item._id} value={item._id}>{item.name}</Option>
                    } )
                  }
              </Select>
            )}
          </Item>
          <Item label="商品图片" wrapperCol={{md:12}}>
            <PicturesWall ref="pictureWall" />
          </Item>
          <Item label="商品详情" wrapperCol={{md:12}}>
            <RichTextEditor ref="richTextEditor" />
          </Item>
          <Button type='primary' htmlType='submit'  >提交</Button>
        </Form>

      </Card>
    )
  }
}

export default connect(
  state=>({
    categoryList:state.categoryList,
    productList:state.productList,
  }),
  {}
)(Form.create()(AddUpdate))