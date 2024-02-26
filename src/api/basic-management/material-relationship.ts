import request from '@/api/request'
import { BACK } from '@/api/request-prefix'

// 获取物料列表
export function GetMaterialList(query) {
  return request({
    url: `${BACK}/base/base-material/common/page`,
    method: 'get',
    params: query,
  })
}

// 导出物料列表
export function ExportDerivedMaterial() {
  return request({
    url: `${BACK}/base/base-material/export`,
    method: 'post',
  })
}

// 级联获取物料列表
export function GetCascadeMaterialList(query) {
  return request({
    url: `${BACK}/prodline/material/cascade-material-list`,
    method: 'get',
    params: query,
  })
}

// 新增/编辑物料列表
export function UpdateMaterialList(data) {
  return request({
    url: `${BACK}/base/standard-work-hour/add-or-edit`,
    method: 'post',
    data: data,
  })
}

// // 单个删除
// export function reqDelSingleStandardWorkHour(query) {
//     return fetch({
//       url: mes + '/base/standard-work-hour/common',
//       method: 'delete',
//       params: query
//     })
//   }

//   // 多个删除
//   export function reqDelMultiStandardWorkHour(query) {
//     return fetch({
//       url: mes + '/base/standard-work-hour/common/del-batch',
//       method: 'put',
//       data: query
//     })
//   }

//   // 锐创标准工时统计表导出
//   export function reqExportStandardWorkHourStatisticsExport(query) {
//     return fetch({
//       url: mes + '/base/standard-work-hour/statistics-export',
//       method: 'post',
//       params: query,
//     })
//   }

//   // 锐创成品标准工时导出
//   export function reqExportStandardWorkHourFinishedProductExport(query) {
//     return fetch({
//       url: mes + '/base/standard-work-hour/finished-product-export',
//       method: 'post',
//       params: query,
//     })
//   }
