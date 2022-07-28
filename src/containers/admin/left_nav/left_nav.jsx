import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import { connect } from 'react-redux';
import {createSaveTitleAction} from '../../../redux/action_creators/menu_action'
import { Menu, Icon} from 'antd';
import logo from '../../../static/imgs/logo.png'
import  '../left_nav/left_nav.less'
import menuList from '../../../config/menu_config'
//import Item from 'antd/lib/list/Item';

const { SubMenu } = Menu;

class LeftNav extends Component {


hasAuth = (item)=>{
    const {menus,username}=this.props
    if(username==='admin') return true
    else if(!item.children) return menus.find( item2 => item2===item.key  )
    else return item.children.some( item3 => { return menus.indexof(item3.key) !==-1  }   )
}

createMenu = (target)=>{
    return target.map( (item)=>{
        if( this.hasAuth(item) ){
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} onClick={()=>{this.props.saveTitle(item.title)}} >
                    <Link to={item.path}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </Link>
                    </Menu.Item>
                )
            }else{
                return (
                    <SubMenu
                    key={item.key}
                    title={
                    <span>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </span>
                    }
                    >
                    { this.createMenu(item.children) }
                    </SubMenu>
                )
            }
        }
    } )
}

render() {
    let {pathname} = this.props.location
    return (
        <div>
            <header className='nav-header'>
                <img src={logo} alt="logo" />
                <h1>TB STORE</h1>
            </header>
            <Menu
            defaultSelectedKeys={pathname.indexOf('product') !== -1?'product':pathname.split('/').reverse()[0]}
            defaultOpenKeys={pathname.split('/').splice(2)}
            mode="inline"
            theme="dark"
            >
                {
                    this.createMenu(menuList)
                }
            </Menu>
        </div>
    )
  }
}

export default connect(
    state=>({
        menus:state.userInfo.user.role.menus,
        username:state.userInfo.user.username,
    }),
    {saveTitle:createSaveTitleAction}
)(withRouter(LeftNav))
