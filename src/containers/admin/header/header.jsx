import React, { Component } from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom';
import { createDeleteUserInfoAction } from '../../../redux/action_creators/login_action';
import {Button, Icon} from 'antd'
import screenfull from 'screenfull';
import dayjs from 'dayjs'
import { reqWeather } from '../../../api';
import './header.less'
import menuList from '../../../config/menu_config'

class Header extends Component {

  state = {
    isFull:false,
    date:dayjs().format('YYYY-MM-DD HH:mm:ss'),
    weatherInfo:{},
    title:''
  }


  componentDidMount(){
    screenfull.on('change', () => {
      const isFull = !this.state.isFull
      this.setState({isFull})
    });
    this.timer=setInterval(()=>{
      this.setState({date:dayjs().format('YYYY-MM-DD HH:mm:ss')})
    },1000);
    this.getWeather()
    this.getTitle()
  }

  componentWillUnmount(){
    clearInterval(this.timer)
  }

  getWeather = async ()=>{
    const weather= await reqWeather()
    this.setState({weatherInfo:weather})
  }


  fullScreen = ()=>{
    screenfull.toggle();
  }

  logout = ()=>{
    this.props.deleteUser()
  }


  // ()=>{}
  getTitle = ()=>{
    let {pathname}=this.props.location
    let pathKey=pathname.split('/').reverse()[0]
    if(pathname.indexOf('product') !== -1) pathKey='product'
    let title=''
    menuList.forEach((item)=>{
      if (item.children instanceof Array) {
        let tmp = item.children.find((citem)=>{
          return citem.key===pathKey  
        })
        if (tmp) {title=tmp.title}
      }else{
        if (pathKey===item.key) {title=item.title}
      }
    })
    this.setState({title})
  }



  render() {
    const {isFull,weatherInfo}=this.state
    return (
      <header className='header'>
          <div className='header-top'>
            <Button size='small' onClick={this.fullScreen}>
              <Icon type={isFull?'fullscreen-exit':'fullscreen'} />
            </Button>
            <span className='username'>welcome, {this.props.userInfo.user.username}</span>
            <Button type='link' onClick={this.logout}>logout</Button>
          </div>
          <div className='header-bottom'>
            <div className='header-bottom-left'>
              {this.props.title||this.state.title}
            </div>
            <div className='header-bottom-right'>
              {this.state.date}
              {/* 
              <img src={weatherInfo.dayPictureUrl} alt="weatherforcast"/>
              {weatherInfo.weather}-{weatherInfo.temprature}
              */}
            </div>
          </div>
      </header>
    )
  }
}

export default connect(
  state=>({
    userInfo:state.userInfo,
    title:state.title
  }),
  {deleteUser:createDeleteUserInfoAction}
  )(withRouter(Header))
  



