import axios from 'axios'
import qs from 'querystring'
import store from '../redux/store'
import {createDeleteUserInfoAction} from '../redux/action_creators/login_action'
import {message} from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const instance = axios.create({
    timeout: 4000,
  });

instance.interceptors.request.use(config=>{
    NProgress.start()
    const {token}=store.getState().userInfo
    if (token) config.headers.Authorization = 'atguigu_'+token

    const {method, data}=config
    if(method.toLowerCase==='post'){
        if (data instanceof Object) {
           config.data = qs.stringify(data)
        }
    }
    return config;
  }, error=> {
    return Promise.reject(error);
  });

instance.interceptors.response.use( response => {
    NProgress.done()
    return response.data;
  },  error => {
    NProgress.done()
    if (error.response.status===401) {
    //if (error) {
      console.log(error);
      message.error('something wrong please login agin',1)
      store.dispatch(createDeleteUserInfoAction())
    } else { message.error(error.message,1)
    }
  
    return new Promise( ()=>{} );
  });

export default instance