import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Card, Button,Icon,Table, message,Modal,Form, Input } from 'antd';
import {reqCategoryList, reqAddCategory,reqUpdateCategory} from '../../api/index'
import { PAGE_SIZE } from '../../config';
import {createSaveCategoryAction} from '../../redux/action_creators/category_action'

class Category extends Component {

  state={
    categoryList:[],
    visible: false,
    operType:'',
    isLoading:true,
    modalCurrentValue:'',
    modalCurrentId:'',
  }

  componentDidMount(){
    this.getCategoryList()
  }


  getCategoryList = async ()=>{
    let result= await reqCategoryList()
    this.setState({isLoading:false})
    const {status, data, msg} = result
    if (status===0) {
      this.setState({categoryList:data.reverse()})
      this.props.saveCategory(data)
    }
    else message.error(msg,1)
  }

  showAdd = () => {
    this.setState({
      modalCurrentValue:'',
      operType:'add',
      visible: true,
    });
  };

  showUpdate = (item) => {
    const {_id,name}=item
    this.setState({
      modalCurrentValue:name,
      modalCurrentId:_id,
      operType:'update',
      visible: true,
    });
  };

  toAdd = async (values)=>{
    let result = await reqAddCategory(values)
    const {status,data,msg} = result
    if (status===0) {
      message.success('新增商品分类成功')
      let categoryList= [...this.state.categoryList]
      categoryList.unshift(data)
      this.setState({categoryList})
      this.setState({visible: false});
      this.props.form.resetFields();
    }
    if (status===1) message.error(msg,1)
  }

  toUpdate = async (categoryObj)=>{
    let result = await reqUpdateCategory(categoryObj)
    const {status,msg} = result
    if (status===0) {
      message.success('更新商品分类成功',1)
      this.getCategoryList()
      this.setState({visible: false});
      this.props.form.resetFields();
    }
    if (status===1) message.error(msg,1)
  }

  handleOk = () => {
    const {operType,modalCurrentId}=this.state
    this.props.form.validateFields( (err, values) =>  {
      if (err) {
        message.warning('表单输入有误，请检查',1)
        return
      }
      if (operType==='add') this.toAdd(values)
      if (operType==='update') {
        const categoryId=modalCurrentId
        const categoryName=values.categoryName
        const categoryObj={categoryId,categoryName}
        this.toUpdate(categoryObj)
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields()
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.state.categoryList
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        key: '操作',
        render:(item)=>{return <Button type='link' onClick={()=>{this.showUpdate(item)}}>修改分类</Button>},
        width:'25%',
        align:'center'
      },
    ];

    return (
      <div>
        <Card extra={<Button type='primary' onClick={this.showAdd}><Icon type="plus-circle" />More</Button>}  >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered={true}
            rowkey="_id"
            pagination={{pageSize:PAGE_SIZE,showQuickJumper:true}}
            loading={this.state.isLoading}
          />
        </Card>
        <Modal
          title= {this.state.operType==='add'?'增加分类':'修改分类'} 
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('categoryName', {
                initialValue:this.state.modalCurrentValue,
                rules: [
                    { required: true, message: '分类名必须输入' },
                ],
              })(
                <Input
                  placeholder="请输入分类名"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default connect(
  state=>({}),
  {
    saveCategory:createSaveCategoryAction,
  }
)(Form.create()(Category))