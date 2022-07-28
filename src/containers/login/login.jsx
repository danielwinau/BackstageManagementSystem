import React, { Component } from 'react'
import {reqLogin} from '../../api'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSaveUserInfoAction } from '../../redux/action_creators/login_action';
import { Form, Icon, Input, Button, message} from 'antd';
import  './css/login.less'
import logo from '../../static/imgs/logo.png'


class Login extends Component {

handleSubmit = event => {
  event.preventDefault();
  this.props.form.validateFields( async (err, values) =>  {
    const {username, password} = values
    if (!err) {
      let result= await reqLogin(username, password)
      const {status, data, msg}=result
      if (status===0) {
        //console.log(data) 
        this.props.saveUserInfo(data)
        this.props.history.replace('/admin')
      }
      else{
        message.warning(msg,1)
      }
    } else{
      message.error('please check your input')
    }
  });
};

  
render() {
const { getFieldDecorator } = this.props.form;
const {isLogin}=this.props;
if(isLogin){
  return <Redirect to='/admin/home' />
}
return (
<div className='login' >
  <header>
    <img src={logo} alt="logo" />
    <h1>商品管理系统</h1>
  </header>
  <section>
    <h1>用户登录</h1>
    <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
                { required: true, message: 'Please input your username!' },
                { min: 4, message: 'At least 4 characters' },
                { max: 12, message: 'Please less than 12' },
                { pattern: /^\w+$/, message: 'letter number _' }
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
                { required: true, message: 'Please input your Password!' },
                { min: 4, message: 'At least 4 characters' },
                { max: 12, message: 'Please less than 12' },
                { pattern: /^\w+$/, message: 'letter number _' }
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
  </section>
</div>
)
}
}

export default connect(
  state=>({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo:createSaveUserInfoAction,
  }
)(Form.create( )(Login))
