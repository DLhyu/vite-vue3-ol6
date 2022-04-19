/*
 * @Description: 
 * @Author: huyong
 * @Date: 2021-09-17 14:52:54
 * @LastEditTime: 2022-01-05 18:09:40
 * @LastEditors:  
 */
import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import qs from 'qs'
let loadinginstace
// let baseUrlTemp = location.origin
// if (baseUrlTemp.includes('localhost')) {
//   baseUrlTemp = process.env.BASE_URL_HTTPS
// }
// console.log('页面地址==', baseUrlTemp)
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VITE_BASE_API, // api 的 base_url
  // baseURL: '/api',
  timeout: 50000, // 请求超时时间
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    if (config.method === 'get' || config.method === 'post') {
      // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    loadinginstace = ElLoading.service({
      fullscreen: true,
      text: 'Loading',
      lock: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0,0,0,0.1)'
    })
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    loadinginstace.close()
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    if (response.status === 200) {
      const res = response.data
      if (res.code === '0' || res.code === 0) {
        return response.data
      } else {
        if (res.code === '401' || res.code === 401) {
          location.href = '/login'
        } else {
          res.message &&
          ElMessage({
              message: res.message,
              type: 'error',
              duration: 3 * 1000
            })
          return response.data
        }
      }
    }
  },
  error => {
    loadinginstace.close()
    var message = (error.response && error.response.data.message) || ''
    switch ((error.response && error.response.status) || 302) {
      case 400:
        break
      case 401:
        // message = "登录已超时，请重新登录"
        // if (!window.tipLock) {
        // window.tipLock = true
        // toLogin(error.response.data.loginUrl)
        // }
        location.href = error.response.data.loginUrl
        break
      case 403:
        message = '未授权请求'
        break
      case 404:
        message = '请求的资源不存在'
        break
      case 500:
        message = '服务器内部错误'
        break
      case 302:
        message = '请重新登录'
        // toLogin(error.response.data.loginUrl)
        // location.replace(error.response.data.loginUrl)
        break
    }
    ElMessage({
      message: message || '未知错误',
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
