//BOM清单类型 0=未知，1=ERP系统，2=用户自建
export const bomTypeMap = {
  0: '未知',
  1: 'ERP系统',
  2: '用户自建',
}
// 加工渠道类型 1-外购 2-自制 3-委外 5-虚拟
export const channelMap = {
  1: '外购',
  2: '自制',
  3: '委外',
  5: '虚拟',
}

// bom清单表头
export const inventoryColumns: any[] = [
  {
    type: 'index',
    label: '序号',
    align: 'center',
    width: '80px',
    fixed: 'left',
  },
  {
    name: 'bomName',
    label: 'BOM名称',
    align: 'center',
    search: true,
    valueType: 'input',
    span: 24,
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    name: 'templateBom',
    label: '模板BOM',
    align: 'center',
    // width: '420px',
    slot: true,
  },
  {
    name: 'createTime',
    label: '创建时间',
    align: 'center',
    width: '120px',
    slot: true,
    sortable: true,
  },
  {
    name: 'operator',
    label: '操作',
    align: 'center',
    slot: false,
    fixed: 'right',
    width: 320,
    options: [
      {
        type: 'primary',
        name: 'setting',
        label: '继续配置',
        link: true,
        icon: 'Setting',
        // size: 'small',
        hasPermission: ['PAYROLLFILEUPDATE'],
      },
      {
        type: 'danger',
        name: 'delete',
        link: true,
        label: '删除BOM',
        icon: 'Delete',
        // size: 'small',
        hasPermission: ['PAYROLLFILEOPERATE'],
      },
      {
        type: 'success',
        name: 'download',
        label: '导出BOM',
        link: true,
        icon: 'Download',
        // size: 'small',
        hasPermission: ['PAYROLLFILEOPERATE'],
      },
    ],
  },
]

// 成品BOM表头
export const updateColumns: any[] = [
  {
    name: 'bomName',
    label: 'BOM清单',
    align: 'center',
    width: '100px',
  },
  {
    name: 'productType',
    label: '业务线',
    align: 'center',
  },
  {
    name: 'materialCode',
    label: '物料编码',
    minWidth: '100px',
    align: 'center',
  },
  {
    name: 'projectName',
    label: '项目名称',
    minWidth: '100px',
    align: 'center',
  },
  {
    name: 'bomType',
    label: '类型',
    align: 'center',
    slot: true,
  },
  {
    name: 'custom',
    label: '客户',
    align: 'center',
  },
  {
    name: 'platform',
    label: '平台',
    align: 'center',
  },
  {
    name: 'operator',
    label: '操作',
    align: 'center',
    slot: false,
    fixed: 'right',
    width: 100,
    options: [
      {
        type: 'primary',
        name: 'select',
        label: '选择模板',
        link: false,
        size: 'small',
        hasPermission: ['PAYROLLFILEUPDATE'],
      },
    ],
  },
]

// BOM配单表头
export const templateColumns: any[] = [
  {
    type: 'index',
    label: '序号',
    align: 'center',
    width: '60px',
    fixed: 'left',
  },
  {
    name: 'bomLevel',
    label: 'BOM层级',
    width: '100px',
    align: 'center',
  },
  {
    name: 'materialName',
    label: '物料名称',
    minWidth: '100px',
    align: 'center',
  },
  {
    name: 'materialCode',
    label: '物料编码',
    minWidth: '100px',
    align: 'center',
  },
  {
    name: 'model',
    label: '物料属性',
    minWidth: '100px',
    align: 'center',
  },
  {
    name: 'materialSource',
    label: '加工渠道',
    width: '100px',
    slot: true,
    align: 'center',
  },
  {
    name: 'processPrice',
    label: '加工费',
    align: 'center',
  },
  {
    name: 'num',
    label: '数量',
    width: '60px',
    align: 'center',
  },
  {
    name: 'price',
    label: '单价',
    align: 'center',
  },
  {
    name: 'noPrice',
    label: '单价(不含税)',
    width: '120px',
    align: 'center',
  },
  {
    name: 'total',
    label: '小计',
    align: 'center',
  },
  // {
  //   name: 'supplier',
  //   label: '供应商',
  //   align: 'center',
  // },
  {
    name: 'operator',
    label: '操作',
    align: 'center',
    slot: false,
    fixed: 'right',
    width: 220,
    options: [
      {
        type: 'primary',
        name: 'update-component',
        label: '更换组件',
        link: false,
        icon: 'Refresh',
        size: 'small',
        hasPermission: ['PAYROLLFILEUPDATE'],
      },
      {
        type: 'danger',
        name: 'delete-component',
        link: false,
        label: '移除组件',
        icon: 'Delete',
        size: 'small',
        hasPermission: ['PAYROLLFILEOPERATE'],
      },
    ],
  },
]
// 无报价物料表头
export const noPriceColumns: any[] = [
  {
    type: 'index',
    label: '序号',
    align: 'center',
    width: '60px',
    fixed: 'left',
  },
  {
    name: 'materialName',
    label: '物料名称',
    align: 'center',
  },
  {
    name: 'materialCode',
    label: '物料编码',
    align: 'center',
  },
  {
    name: 'model',
    label: '物料属性',
    align: 'center',
  },
  {
    name: 'materialSource',
    label: '加工渠道',
    width: '100px',
    slot: true,
    align: 'center',
  },
  {
    name: 'num',
    label: '数量',
    width: '100px',
    align: 'center',
  },
]
// 组件表头
export const componentColumns: any[] = [
  {
    type: 'index',
    label: '序号',
    align: 'center',
    width: '60px',
    fixed: 'left',
  },
  {
    name: 'materialName',
    label: '物料名称',
    minWidth: '100px',
    align: 'center',
  },
  {
    name: 'materialCode',
    label: '物料编码',
    minWidth: '100px',
    align: 'center',
  },
  {
    name: 'model',
    label: '物料属性',
    minWidth: '100px',
    align: 'center',
  },
  {
    name: 'materialSource',
    label: '加工渠道',
    width: '100px',
    slot: true,
    align: 'center',
  },
  {
    name: 'processPrice',
    label: '加工费',
    align: 'center',
  },
  {
    name: 'num',
    label: '数量',
    width: '60px',
    align: 'center',
  },
  {
    name: 'price',
    label: '单价',
    align: 'center',
  },
  {
    name: 'noPrice',
    label: '单价(不含税)',
    width: '120px',
    align: 'center',
  },
  {
    name: 'total',
    label: '小计',
    align: 'center',
  },
  // {
  //   name: 'supplier',
  //   label: '供应商',
  //   align: 'center',
  // },
  {
    name: 'operator',
    label: '操作',
    align: 'center',
    slot: false,
    fixed: 'right',
    width: 100,
    options: [
      {
        type: 'primary',
        name: 'select',
        label: '选择',
        link: false,
        size: 'small',
        hasPermission: ['PAYROLLFILEUPDATE'],
      },
    ],
  },
]
