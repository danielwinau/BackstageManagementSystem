import myAxios from './myAxios'
import jsonp from 'jsonp'
import { message } from 'antd'
import { BASE_URL, WEATHER_AK, CITY } from '../config'

export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`,{username, password})
export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`)
//export const reqWeather = () => myAxios.get(`http://api.map.baidu.com/telematics/v3/weather?location=${CITY}&output=json&ak=${WEATHER_AK}`)
export const reqWeather = ()=>{
    return new Promise((resolve, reject)=>{
        jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${CITY}&output=json&ak=${WEATHER_AK}`, (err,data)=>{
            if (err) {
                message.error('free weather api not working')
                return new Promise(()=>{})
            }else{
                const {dayPictureUrl,temprature,weather} = data.result[0].weather_data[0]
                const weatherObj = {dayPictureUrl,temprature,weather}
                return resolve(weatherObj)
            }
        })
    })
}
export const reqAddCategory = ({categoryName}) => myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName})
export const reqUpdateCategory = ({categoryId,categoryName}) => myAxios.post(`${BASE_URL}/manage/category/update`,{categoryId,categoryName})
export const reqProductList = (pageNum,pageSize) => myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})
export const reqUpdateProdStatus = (productId, status) => myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})
export const reqSearchProduct = (pageNum,pageSize,searchType, keyWord) => myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]:keyWord}})
export const reqProdById = (productId) => myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})
export const reqDeletePicture = (name) => myAxios.post(`${BASE_URL}/manage/img/delete`,{name})
export const reqAddProduct = (productObj) => myAxios.post(`${BASE_URL}/manage/product/add`,{...productObj})
export const reqUpdateProduct = (productObj) => myAxios.post(`${BASE_URL}/manage/product/update`,{...productObj})
export const reqRoleList = () => myAxios.get(`${BASE_URL}/manage/role/list`)
export const reqAddRole = ({roleName}) => myAxios.post(`${BASE_URL}/manage/role/add`,{roleName})
//给角色授权
export const reqAuthRole = (roleObj) => myAxios.post(`${BASE_URL}/manage/role/update`,{...roleObj,auth_time:Date.now()})

export const reqUserList = ()=> myAxios.get(`${BASE_URL}/manage/user/list`)
//添加用户
export const reqAddUser = (userObj) => myAxios.post(`${BASE_URL}/manage/user/add`,{...userObj})
