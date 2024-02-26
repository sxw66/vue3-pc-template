import { Base64 } from 'js-base64'
import request from '@/api/request'
const manmesPermission = '/mes-permission'

const Authorization = Base64.encode('web:3irobotics')

// 登录
export function loginRegister(data) {
  return request({
    url: `${manmesPermission}/admin/webLogin`,
    headers: { Authorization: 'Basic ' + Authorization },
    method: 'post',
    data,
  })
}

// 获取getInfo
export function getUserInfo() {
  return request({
    url: `${manmesPermission}/admin/webUserDetail`,
    method: 'get',
  })
}

// 登陆页面获取公司列表
export function getCompaniesList() {
  return request({
    url: `${manmesPermission}/omsCompany/queryCompanyListOnLogin`,
    method: 'get',
  })
}
