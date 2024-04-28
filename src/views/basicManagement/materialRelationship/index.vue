<template>
  <!-- 物料关系 -->
  <BasePropTable
    class="material-relationship-list"
    :loading="tableInfo.loading"
    :columns="tableInfo.columnList"
    :data="tableInfo.list"
    :current-page="tableParams.pageNum"
    :page-size="tableParams.pageSize"
    :total="tableParams.total"
    :search-button-list="FormButtonList"
    @size-change="handleSizeChange"
    @current-page-change="handlePageChange"
    @form-operation="handleFormBtnSearch"
  >
    <!--  <template #header> </template> -->
    <template #parentMaterialName="{ row }">
      <el-tag :title="row.parentMaterialNo">
        {{ materialNameFilter(row.parentMaterialNo, parentMaterialNoList) }}
      </el-tag>
    </template>
    <template #materialName="{ row }">
      <el-tag :title="row.materialNo">
        {{ materialNameFilter(row.materialNo, childMaterialNoList) }}
      </el-tag>
    </template>
    <template #materialProperty="{ row }">
      <el-tag :title="row.materialProperty">
        {{ materialPropertyFilter(row.materialProperty, materialPropertyList) }}
      </el-tag>
    </template>
    <template #materialWorkstation="{ row }">
      <el-tag :title="row.materialWorkstation">
        {{ materialPropertyFilter(row.materialWorkstation, materialWorkstationList) }}
      </el-tag>
    </template>
    <template #created="{ row }">
      {{ parseTime(row.created, '{y}-{m}-{d} {h}:{i}:{s}') }}
    </template>
    <template #modified="{ row }">
      {{ parseTime(row.modified, '{y}-{m}-{d} {h}:{i}:{s}') }}
    </template>
  </BasePropTable>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { parseTime } from '@/utils/index'
  import { GetMaterialList, GetCascadeMaterialList, ExportDerivedMaterial } from '@/api/basic-management/material-relationship'

  // 物料关系表格组件
  const BasePropTable = defineAsyncComponent(() => import('@/components/base-table/index.vue'))

  // 表单操作按钮
  const FormButtonList = ref([
    { type: '', text: '重置' },
    { type: 'primary', text: '查询' },
    { type: 'warning', text: '导出' },
  ])
  // 表单请求参数
  const formParams = reactive<any>({
    materialNo: null,
    parentMaterialNo: null,
  })
  // 表格请求参数
  const tableParams = ref<any>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  })
  // 表格列参数
  const tableInfo = reactive<any>({
    loading: false,
    columnList: [
      {
        name: 'parentMaterialNo',
        label: '父物料编号',
        search: true,
        valueType: 'input',
        width: 160,
      },
      {
        name: 'materialNo',
        label: '子物料编号',
        search: true,
        valueType: 'input',
        width: 160,
      },
      {
        name: 'parentMaterialName',
        label: '父物料名称',
        slot: true,
        width: 350,
      },
      {
        name: 'materialName',
        label: '子物料名称',
        width: 150,
        slot: true,
      },

      {
        name: 'materialProperty',
        label: '物料属性',
        slot: true,
      },
      {
        name: 'materialWorkstation',
        label: '物料工位',
        slot: true,
      },
      // {
      //   name: 'sheetName',
      //   label: 'sheet页名称',
      //   width: 120,
      // },
      {
        name: 'materialDescr',
        label: '物料说明',
      },
      {
        name: 'created',
        label: '创建时间',
        slot: true,
        width: 170,
      },
      {
        name: 'modified',
        label: '修改时间',
        slot: true,
        width: 140,
      },
    ],
    list: [],
  })
  // 父物料列表数据
  const parentMaterialNoList = ref([])
  // 子物料列表数据
  const childMaterialNoList = ref([])
  // 物料属性列表数据
  const materialPropertyList = ref([
    { id: 1, name: '委外加工' },
    { id: 2, name: '虚拟件' },
    { id: 3, name: '外购' },
  ])
  // 物料工位列表数据
  const materialWorkstationList = ref([
    { id: 1, name: '超声车间' },
    { id: 2, name: '充电座组件' },
    { id: 3, name: '雷达车间' },
    { id: 4, name: '贴片车间' },
    { id: 5, name: '装配车间' },
    { id: 6, name: '组件车间' },
  ])

  // 公共过滤方法
  const filterItem = (value, list, filterKey, outputKey) => {
    const obj = list.find((item) => item[filterKey] === value)
    return obj ? obj[outputKey] : value
  }
  // 过滤出父物料名称
  const materialNameFilter = (materialNo, materialAllList) => {
    return filterItem(materialNo, materialAllList, 'materialNo', 'materialName')
  }
  // 过滤出物料属性--过滤出物料工位
  const materialPropertyFilter = (materialProperty, materialPropertyList) => {
    return filterItem(materialProperty, materialPropertyList, 'id', 'name')
  }

  // 分页（每页条数）
  const handleSizeChange = (sizes: number) => {
    tableParams.value.pageNum = 1
    tableParams.value.pageSize = sizes
    getTableData()
  }
  // 分页（当前页码）
  const handlePageChange = (page: number) => {
    tableParams.value.pageNum = page
    getTableData()
  }

  // 表单搜索参数
  const handleFormBtnSearch = (obj, btnType) => {
    formParams.materialNo = obj.materialNo
    formParams.parentMaterialNo = obj.parentMaterialNo
    // 重置
    if (btnType.text === '重置') {
      formParams.materialNo = null
      formParams.parentMaterialNo = null
    }
    // 导出
    if (btnType.text === '导出') {
      handeExportMaterial()
      return
    }
    getTableData()
  }
  // 表单按钮-导出物料列表
  const handeExportMaterial = async () => {
    try {
      const res = await ExportDerivedMaterial()
      if (res.data) {
        const url = res.data
        const downloadLink = document.createElement('a')
        downloadLink.style.display = 'none'
        downloadLink.href = url
        downloadLink.setAttribute('download', '所有基础物料表') // 设置下载的文件名
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    } catch (error) {
      ElMessage({
        type: 'error',
        message: '导出失败请联系管理员',
      })
    }
  }

  // 获取表格列表数据
  const getTableData = async () => {
    tableInfo.loading = true
    let parms = {
      page: tableParams.value.pageNum,
      size: tableParams.value.pageSize,
      materialNo: formParams.materialNo,
      parentMaterialNo: formParams.parentMaterialNo,
    }

    // const { data, code } = await GetMaterialList(parms)
    // if (code === 0) {
    //   console.log('-表格列表数据', data)
    //   tableInfo.list = data?.records || []
    //   tableParams.value.total = data?.total || 0
    // }
    tableInfo.list = [
      {
        id:1,
        parentMaterialNo: '12',
      },
      {
        id:2,
        parentMaterialName: '无聊',
      },
      {
        id:3,
        materialNo: '345',
      },
      {
        id:4,
        materialName: '子物料名称',
      },
    ]
    tableParams.value.total = 100
    tableInfo.loading = false
  }

  // 获取父成品列表列表数据
  // const GetParentProductListData = async () => {
  //   let params = {
  //     isInvolvedManHour: 1,
  //     isLineUse: 0,
  //   }
  //   const { data, code } = await GetCascadeMaterialList(params)
  //   console.log('-获取父成品列表列表数据', data)
  //   parentMaterialNoList.value = data.filter((items) => items.type === 1)
  //   childMaterialNoList.value = data.filter((items) => items.type === 2)
  // }

  // 初始化函数
  onMounted(async () => {
    // await GetParentProductListData()
    await getTableData()
  })
</script>

<style lang="scss" scoped>
  .material-relationship-list {
    position: relative;
    width: 100%;
    padding: 20px;
  }
</style>
