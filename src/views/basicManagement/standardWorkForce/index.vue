<template>
  <!-- 标准工时 -->
  <BasePropTable
    class="normal-hours-list"
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
    @column-operation="handleColumnOperation"
  >
    <template #created="{ row }">
      {{ parseTime(row.created, '{y}-{m}-{d} {h}:{i}:{s}') }}
    </template>
    <template #modified="{ row }">
      {{ parseTime(row.modified, '{y}-{m}-{d} {h}:{i}:{s}') }}
    </template>
  </BasePropTable>
  <!-- 编辑标准工时组件 -->
  <EditingHours :hours-visible="isFormVisible" :edit-form-data="tableRows" @closeHoursVisible="handeCloseHoursVisible" />

  <div class="upload-box" style="display: none">
    <el-upload
      ref="uploadRef"
      :action="importUrl"
      :headers="importHeaders"
      :show-file-list="false"
      :before-upload="beforeUploadAction"
      :on-success="handeOnSuccess"
    >
    </el-upload>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { UploadInstance } from 'element-plus'
  import { parseTime } from '@/utils/index'
  import {
    GetStandardHoursList,
    ExportNormalHours,
    ExportFinishedNormalHours,
    DeletionTime,
    importTask,
  } from '@/api/basic-management/standard-work-force'

  // 物料关系表格组件
  const BasePropTable = defineAsyncComponent(() => import('@/components/base-table/index.vue'))
  // 编辑标准工时组件
  const EditingHours = defineAsyncComponent(() => import('./editing-hours.vue'))

  // 是否打开编辑工时弹框
  const isFormVisible = ref<boolean>(false)
  // 编辑行数据
  const tableRows = ref()
  // 上传组件的实例
  const uploadRef = ref<UploadInstance>()
  // 表单操作按钮
  const FormButtonList = ref([
    { type: '', text: '重置' },
    { type: 'primary', text: '查询' },
    { type: 'success', text: '导入', name: 'upload' },
    { type: 'warning', text: '标准工时统计表导出' },
    { type: 'warning', text: '成品标准工时表导出' },
  ])
  // 表单请求参数
  const formParams = reactive<any>({
    materialNo: null,
    deviceType: null,
    customer: null,
    section: null,
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
        name: 'deviceType',
        label: '机型',
        width: 300,
        search: true,
        valueType: 'input',
        span: 6,
      },
      {
        name: 'customer',
        label: '客户',
        width: 100,
        search: true,
        valueType: 'input',
        span: 6,
      },
      {
        name: 'materialNo',
        label: '料编号',
        search: true,
        valueType: 'select',
        span: 6,
        width: 130,
        options: [
          { value: 1, label: '1DIP' },
          { value: 2, label: '2超声' },
          { value: 3, label: '3风机' },
          { value: 4, label: '4雷达' },
          { value: 5, label: '5装配' },
          { value: 6, label: '6组件' },
        ],
      },
      {
        name: 'section',
        label: '工段',
        slot: true,
        search: true,
        valueType: 'select',
        span: 6,
        options: [
          { value: 1, label: 'DIP' },
          { value: 2, label: '超声' },
          { value: 3, label: '风机' },
          { value: 4, label: '雷达' },
          { value: 5, label: '装配' },
          { value: 6, label: '组件' },
        ],
      },
      {
        name: 'materialName',
        label: '物料名称',
        width: 110,
        slot: true,
      },
      {
        name: 'materialSpecification',
        label: '物料规格',
        slot: true,
        width: 110,
      },

      {
        name: 'directHuman',
        label: '直接人力',
        width: 140,
      },
      {
        name: 'indirectHuman',
        label: '间接人力',
        width: 110,
      },
      {
        name: 'standardCapacity',
        label: '标准产能',
        width: 110,
      },
      {
        name: 'totalHuman',
        label: '总人力',
        width: 110,
      },
      {
        name: 'standardManHour',
        label: '直接工时',
        width: 110,
      },
      {
        name: 'includingIndirectHour',
        label: '含间接工时',
        width: 110,
      },
      {
        name: 'note',
        label: '备注',
        width: 140,
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
        width: 170,
      },
      {
        name: 'operator',
        fixed: 'right',
        label: '操作',
        width: 150,
        options: [
          { label: '编辑', name: 'edit', type: 'primary' },
          // { label: '删除', name: 'delete', type: 'danger' },
        ],
      },
    ],
    list: [],
  })

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
    formParams.deviceType = obj.deviceType
    formParams.customer = obj.customer
    formParams.section = obj.section
    // 重置
    if (btnType.text === '重置') {
      formParams.materialNo = null
      formParams.deviceType = null
      formParams.customer = null
      formParams.section = null
    }
    // 导出
    if (btnType.text === '导入') {
      console.log(';导入')
      uploadRef.value.$el.querySelector('input').click()
      return
    }
    // 标准工时统计表导出
    if (btnType.text === '标准工时统计表导出') {
      // 调用 handeExporFile 函数，传入 reqFunc 函数和参数
      handeExporFile(ExportNormalHours, '标准工时统计表导出.csv')
      return
    }
    // 成品标准工时表导出
    if (btnType.text === '成品标准工时表导出') {
      handeExporFile(ExportFinishedNormalHours, '成品标准工时表导出')
      return
    }
    getTableData()
  }
  // 表单按钮-公共导出方法
  const handeExporFile = async (reqFunc, fileName) => {
    try {
      // 导出所需参数
      let params = {
        page: tableParams.value.pageNum,
        size: tableParams.value.pageSize,
        materialNo: formParams.materialNo,
        deviceType: formParams.deviceType,
        customer: formParams.customer,
        section: formParams.section,
      }
      const res = await reqFunc({ ...params }) // 将参数传递给 reqFunc 函数
      if (res.data) {
        const url = res.data
        const downloadLink = document.createElement('a')
        downloadLink.style.display = 'none'
        downloadLink.href = url
        downloadLink.setAttribute('download', fileName) // 设置下载的文件名
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
  // 表格列操作
  const handleColumnOperation = (el: any, row: any, index: number) => {
    switch (el.name) {
      case 'edit':
        handeEditManHour(row)
        break
      case 'delete':
        handeDeleteManHour(row.id)
        break
    }
  }
  //
  // 表格编辑工时
  const handeEditManHour = (row) => {
    isFormVisible.value = true
    tableRows.value = row
    console.log('编辑工时', row)
  }
  // 关闭编辑弹框
  const handeCloseHoursVisible = (val) => {
    isFormVisible.value = false
    if (val) {
      getTableData()
    }
  }
  // 表格删除工时
  const handeDeleteManHour = (id: string | number) => {
    ElMessageBox.confirm('删除该数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        let { code, data }: any = await DeletionTime({ id: id })
        if (code === 0) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          getTableData()
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
  }
  // 获取表格列表数据
  const getTableData = async () => {
    tableInfo.loading = true
    let parms = {
      page: tableParams.value.pageNum,
      size: tableParams.value.pageSize,
      materialNo: formParams.materialNo,
      deviceType: formParams.deviceType,
      customer: formParams.customer,
      section: formParams.section,
    }
    const { data, code } = await GetStandardHoursList(parms)
    if (code === 0) {
      tableInfo.list = data?.records || []
      tableParams.value.total = data?.total || 0
    }
    tableInfo.loading = false
  }

  // 导入请求 URL
  const importUrl = ref('api/back/base/standard-work-hour/import-file')
  const importHeaders = ref({
    Authorization:
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJWMS4wIiwic3ViIjoiTUVTIiwiaXNzIjoiM0lST0JPVElDUyIsImlhdCI6MTcwNjUxOTYyOCwiYXVkIjoiVVNFUiIsImlkIjoiMSIsImNvbXBhbnlJZCI6IjE2OTEzMjYxMzE1MDMyNTE0NTYiLCJjb21wYW55VHlwZSI6ZmFsc2UsImNvbXBhbnlDb2RlIjoiZnV5b25nIiwiZGVwdElkIjoiMTc0NTA1MDE4MTM4MTMyODg5NiIsInN1cHBlckFkbWluIjp0cnVlLCJ1c2VybmFtZSI6IjEwMDAwIiwibmlja25hbWUiOiLotoXnuqfnrqHnkIblkZgiLCJyb2xlcyI6WyIxIl19.va33RIDUmD4dQW8qqdY-jh8tjSHe-CKV8MyuQ9AKgbxn0rwAW9gM-R6ZuxFBsxUTWi7BFsJ5euGVTCqtCa335g',
  })
  // 文件列表
  const fileList = ref([])
  // 上传文件之前的钩子
  const beforeUploadAction = (file, fileLi) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader()
      let reg = /\.xlsx$|\.xls$|\.csv$/i // 支持的文件格式：xlsx、xls、csv
      reader.readAsDataURL(file)
      let name = file.name
      if (reg.test(name)) {
        reader.onload = (e) => {
          fileList.value.push(e.target.result)
          resolve(e.target.result)
        }
      } else {
        ElMessage.error('请上传Excel或CSV文件')
        reject()
      }
    })
  }
  // 文件上传成功时的钩子
  const handeOnSuccess = (response: any) => {
    if (response.code === 0) {
      ElMessage({
        type: 'success',
        message: response.msg,
      })
    } else {
      ElMessage.error(response.msg)
    }
  }

  // 初始化函数
  onMounted(async () => {
    await getTableData()
  })
</script>

<style lang="scss" scoped>
  .normal-hours-list {
    position: relative;
    width: 100%;
    padding: 20px;
  }
</style>
