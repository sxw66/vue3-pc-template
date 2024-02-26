import request from '@/api/request'
import { BACK } from '@/api/request-prefix'

// 获取标准工时列表
export function GetStandardHoursList(query) {
  return request({
    url: `${BACK}/base/standard-work-hour/common/page`,
    method: 'get',
    params: query,
  })
}
// 锐创标准工时统计表导出
export function ExportNormalHours(query) {
  return request({
    url: `${BACK}/base/standard-work-hour/statistics-export`,
    method: 'post',
    params: query,
  })
}
// 锐创成品标准工时表导出
export function ExportFinishedNormalHours(query) {
  return request({
    url: `${BACK}/base/base-material/finished-product-export`,
    method: 'post',
    params: query,
  })
}

// 删除工时列表
export function DeletionTime(query) {
  return request({
    url: `${BACK}/base/standard-work-hour/common`,
    method: 'delete',
    params: query,
  })
}

// 工时导入
export function importTask(params: any) {
  return request({
    url: `${BACK}/base/standard-work-hour/import-file`,
    method: 'post',
    headers: {
      contentType: 'multipart/form-data',
    },
    params,
  })
}
