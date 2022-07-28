import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout } from 'antd';
import {createDeleteUserInfoAction} from '../../redux/action_creators/login_action'
import Header from './header/header'
import './css/admin.less'
import Home from '../../components/home/home'
import LeftNav from './left_nav/left_nav'
import Bar from '../bar/bar';
import Line from '../line/line';
import Pie from '../pie/pie';
import User from '../user/user';
import Role from '../role/role';
import Product from '../product/product';
import Detail from '../product/detail';
import AddUpdate from '../product/add_update';
import Category from '../category/category';

const { Footer, Sider, Content } = Layout;
class Admin extends Component {

  logout = ()=>{
    this.props.deleteUserInfo()
  }

  render() {
    const {isLogin}=this.props.userInfo

    if(isLogin){
      return (
        <Layout className='admin'>
          <Sider className='sider'>
            <LeftNav></LeftNav>
          </Sider>
          <Layout>
            <Header className='header'>Header</Header>
            <Content className='content'>
              <Switch>
                <Route path='/admin/home' component={Home}></Route>
                <Route path='/admin/prod_about/category' component={Category}></Route>
                <Route path='/admin/prod_about/product' component={Product} exact></Route>
                <Route path='/admin/prod_about/product/detail/:id' component={Detail}></Route>
                <Route path='/admin/prod_about/product/add_update' component={AddUpdate} exact></Route>
                <Route path='/admin/prod_about/product/add_update/:id' component={AddUpdate}></Route>
                <Route path='/admin/user' component={User}></Route>
                <Route path='/admin/role' component={Role}></Route>
                <Route path='/admin/charts/bar' component={Bar}></Route>
                <Route path='/admin/charts/line' component={Line}></Route>
                <Route path='/admin/charts/pie' component={Pie}></Route>
                <Redirect to='/admin/home' />
              </Switch>
            </Content>
            <Footer className='footer'>推荐使用谷歌浏览器</Footer>
          </Layout>
        </Layout>
      )
    }
    else{ 
      return <Redirect to='/login' />
    }
  }
}

export default connect(
  state=>({userInfo:state.userInfo}),
  {
    deleteUserInfo:createDeleteUserInfoAction
  }
)(Admin)