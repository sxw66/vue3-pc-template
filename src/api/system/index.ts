import request from '@/api/request'
import { TRANSITION_API } from '@/api/request-prefix'

// /*
//   2024/1/19
//   API触发器列表接口
// */
// API触发器-分页查询接口触发器
export function pageinterfaceList(data) {
  return request({
    url: `${TRANSITION_API}/apiTrigger/page`,
    method: 'post',
    data,
  })
}
// API触发器-根据ID删除接口触发器
export function delinterface(query) {
  return request({
    url: `${TRANSITION_API}/apiTrigger/delete`,
    method: 'delete',
    params: query,
  })
}

// // 查询api接口绑定的触发器，不分页
// export function queryApiTrigger(query) {
//   return fetch({
//     url: mesTransitionApi + '/apiTrigger/apiInfo/trigger',
//     method: 'post',
//     params: query
//   })
// }
// // 新增接口触发器
// export function addinterface(query) {
//   return fetch({
//     url: mesTransitionApi + '/apiTrigger/add',
//     method: 'post',
//     data: query
//   })
// }

// // 更新触发器接口信息
// export function updateinterface(query) {
// 	return fetch({
// 		url: mesTransitionApi + '/apiTrigger/edit',
// 		method: 'put',
// 		data: query
// 	})
// }

// /*
//   2024/1/19
//   API系统管理列表接口
// */

// API系统管理-分页查询API系统管理
export function pageApiInfoList(data) {
  return request({
    url: `${TRANSITION_API}/apiInfo/page`,
    method: 'post',
    data,
  })
}

// API系统管理-根据ID删除API触发器
export function delApiInfo(query) {
  return request({
    url: `${TRANSITION_API}/apiInfo/delete`,
    method: 'delete',
    params: query,
  })
}
