import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
// import { errorCodeType } from '@/api/helper/error-code-type'

// 创建axios实例 进行基本参数配置
const service = axios.create({
  // 默认请求地址，根据环境的不同可在.env 文件中进行修改
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 设置接口访问超时时间

  timeout: 3000000, // request timeout
  // 跨域时候允许携带凭证
  withCredentials: true,
})

//  request interceptor 接口请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    /**
     * 用户登录之后获取服务端返回的token,后面每次请求都在请求头中带上token进行JWT校验
     * token 存储在本地储存中（storage）、pinia
     */
    const userStore = useUserStore()
    const token: string = userStore.token
    // 自定义请求头
    // if (token) {
    //   config.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJWMS4wIiwic3ViIjoiTUVTIiwiaXNzIjoiM0lST0JPVElDUyIsImlhdCI6MTcwNTU2MjQ0MiwiYXVkIjoiVVNFUiIsImlkIjoxLCJ0ZW5hbnRJZCI6IjAiLCJ1c2VybmFtZSI6ImFkbWluIiwibmlja25hbWUiOiLotoXnuqfnrqHnkIblkZgiLCJyb2xlcyI6WzFdfQ.ytOAZslBCiCMuJHAbEhN5IlLkbG9MwtIyrHEzZSNUGy_lwqLnMLhFrfCl0XSS5wG94BjX41YVt5dhRMDAHuOgQ'
    // }
    config.headers['Authorization'] =
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJWMS4wIiwic3ViIjoiTUVTIiwiaXNzIjoiM0lST0JPVElDUyIsImlhdCI6MTcwNjUxOTYyOCwiYXVkIjoiVVNFUiIsImlkIjoiMSIsImNvbXBhbnlJZCI6IjE2OTEzMjYxMzE1MDMyNTE0NTYiLCJjb21wYW55VHlwZSI6ZmFsc2UsImNvbXBhbnlDb2RlIjoiZnV5b25nIiwiZGVwdElkIjoiMTc0NTA1MDE4MTM4MTMyODg5NiIsInN1cHBlckFkbWluIjp0cnVlLCJ1c2VybmFtZSI6IjEwMDAwIiwibmlja25hbWUiOiLotoXnuqfnrqHnkIblkZgiLCJyb2xlcyI6WyIxIl19.va33RIDUmD4dQW8qqdY-jh8tjSHe-CKV8MyuQ9AKgbxn0rwAW9gM-R6ZuxFBsxUTWi7BFsJ5euGVTCqtCa335g'
    return config
  },
  (error: AxiosError) => {
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(error)
  },
)

//  response interceptor 接口响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回res，当然你也可以只返回res.data
    // 系统如果有自定义code也可以在这里处理
    // return res?.data
    // 2xx 范围内的状态码都会触发该函数。
    const data = response.data
    if (Object.prototype.toString.call(data) === '[object Blob]' || Object.prototype.toString.call(data) === '[object ArrayBuffer]') {
      return data
    }
    if (data.code === 200 || data.code === 0) {
      return data
    } else {
      // 统一错误处理
      showErrMessage(data.msg || data.message)
      return data
    }
  },
  (error: AxiosError) => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围,传入响应码，匹配响应码对应信息
      // showErrMessage(errorCodeType(response.status))
      showErrMessage(response)
      return Promise.reject(response.data)
    } else {
      ElMessage.warning('网络连接异常,请稍后再试!')
    }
    return Promise.reject(error)
  },
)

/**
 * @description 显示错误消息
 * err 错误信息
 * type 消息类型
 * duration 消息持续时间
 */
function showErrMessage(err: any, type: any = 'error', duration = 3000) {
  ElMessage({
    message: err || '服务端异常',
    type: type,
    duration: duration,
  })
}

export default service
