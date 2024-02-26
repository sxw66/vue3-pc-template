import request from '@/api/request'
import { FINANCE_CENTER } from '@/api/request-prefix'

// 新增BOM清单筛选条件查询
export function searchList(data) {
  return request({
    url: `${FINANCE_CENTER}/tMaterial/queryPageByDto`,
    method: 'post',
    data,
  })
}

// 新建bom
export function bomCreate(data) {
  return request({
    url: `${FINANCE_CENTER}/bom/createBom`,
    method: 'post',
    data,
  })
}

// 删除bom
export function bomDelete(data) {
  return request({
    url: `${FINANCE_CENTER}/bom/deleteBomByBomNumber?bomNumber=${data.bomNumber}`,
    method: 'post',
  })
}

// 修改bom名称
export function bomNameUpdate(data) {
  return request({
    url: `${FINANCE_CENTER}/bom/updateBomByBomNumber`,
    method: 'post',
    data,
  })
}

// 导出bom
export function bomExport(data) {
  return request({
    url: `${FINANCE_CENTER}/bomRelation/outputBomExecel`,
    method: 'get',
    responseType: 'blob',
    params: {
      ...data,
    },
  })
}
// 获取BOM清单列表
export function bomInventoryList(data) {
  return request({
    url: `${FINANCE_CENTER}/bom/bomInventoryList`,
    method: 'post',
    data,
  })
}

// 查询全部客户
export function customerList() {
  return request({
    url: `${FINANCE_CENTER}/bomAttribute/customer`,
    method: 'get',
  })
}

// 查询全部平台
export function platformList() {
  return request({
    url: `${FINANCE_CENTER}/bomAttribute/platform`,
    method: 'get',
  })
}

// 获取BOM模板列表
export function bomTemplateList(data) {
  return request({
    url: `${FINANCE_CENTER}/bom/bomTemplateList`,
    method: 'post',
    data,
  })
}

// 继续配置Bom,查询bom列表及子物料详情信息
export function bomPartsList(data) {
  return request({
    url: `${FINANCE_CENTER}/bom/bomQuery`,
    method: 'get',
    params: {
      ...data,
    },
  })
}

// 查看BOM总价
export function lookBomSpend(data) {
  return request({
    url: `${FINANCE_CENTER}/bom/lookBomSpend?bomNumber=${data.bomNumber}`,
    method: 'post',
  })
}

//查询全部组件分类下拉信息
export function componentList(data) {
  return request({
    url: `${FINANCE_CENTER}/componentType/queryComponentTypeList`,
    method: 'get',
    params: {
      ...data,
    },
  })
}

//根据条件查询物料信息数据
export function materialList(data) {
  return request({
    url: `${FINANCE_CENTER}/tMaterial/queryMaterialList`,
    method: 'post',
    data,
  })
}

// 添加组件
export function addComponent(data) {
  return request({
    url: `${FINANCE_CENTER}/bomRelation/addComponent`,
    method: 'post',
    data,
  })
}

// 删除组件
export function removeComponent(data) {
  return request({
    url: `${FINANCE_CENTER}/bomRelation/removeComponent`,
    method: 'post',
    data,
  })
}

// 更换组件
export function updateComponent(data) {
  return request({
    url: `${FINANCE_CENTER}/bomRelation/updateComponent`,
    method: 'post',
    data,
  })
}
