<template>
  <!-- API系统管理 -->
  <BasePropTable
    v-if="!isFormVisible"
    class="api-list"
    :loading="tableInfo.loading"
    :columns="tableInfo.columnList"
    :data="tableInfo.list"
    :current-page="tableParams.pageNum"
    :page-size="tableParams.pageSize"
    :total="tableParams.total"
    @size-change="handleSizeChange"
    @current-page-change="handlePageChange"
    @form-operation="handleFormBtnSearch"
    @column-operation="handleColumnOperation"
  >
    <!-- <template #header> </template> -->
    <template #status="{ row }">
      <el-tag>{{ statusText(row.status) }}</el-tag>
    </template>
    <template #createTime="{ row }">
      {{ parseTime(row.createTime, '{y}-{m}-{d}') }}
    </template>
  </BasePropTable>
  <!-- 编辑 API系统管理 -->
  <editApiManagement v-else :edit-form-data="TableRows" @handleRestBack="handleRestBack" />
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { parseTime } from '@/utils/index'
  import { pageApiInfoList, delApiInfo } from '@/api/system/index'
  import { useSystemStore } from '@/store/modules/system'
  // 触发器表格组件
  const BasePropTable = defineAsyncComponent(() => import('@/components/base-table/index.vue'))
  // API系统管理-编辑组件
  const editApiManagement = defineAsyncComponent(() => import('./edit.api.management.vue'))

  const SystemStore = useSystemStore()
  // 表格请求参数
  const tableParams = ref<any>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  })

  // 表单请求参数
  const formParams = reactive<any>({
    apiId: '',
  })

  // 表格列参数
  const tableInfo = reactive<any>({
    loading: false,
    columnList: [
      {
        name: 'id',
        label: 'ID',
      },
      {
        name: 'uniqueName',
        label: '唯一标识',
        width: 120,
      },
      {
        name: 'name',
        label: '接口名称',
        width: 120,
      },
      {
        name: 'tenantId',
        label: '租户ID',
        search: true,
        valueType: 'input',
        span: 24,
      },
      {
        name: 'protocolType',
        label: '服务协议类型',
        width: 120,
      },
      {
        name: 'method',
        label: '方法',
      },
      {
        name: 'requestUrl',
        label: '请求url',
      },
      {
        name: 'params',
        label: 'url参数json',
        width: 150,
      },
      {
        name: 'headers',
        label: '请求头json',
        width: 150,
      },
      {
        name: 'body',
        label: '请求体json',
        width: 150,
      },
      {
        name: 'timeOut',
        label: '超时时间',
        width: 120,
      },
      {
        name: 'convertClassId',
        label: '响应结果转换规则分类ID',
        width: 200,
      },
      {
        name: 'status',
        label: '状态',
        slot: true,
        width: 130,
      },
      {
        name: 'remark',
        label: '备注',
        width: 160,
      },
      {
        name: 'createTime',
        label: '创建时间',
        slot: true,
        width: 140,
      },
      {
        name: 'operator',
        fixed: 'right',
        label: '操作',
        width: 200,
        options: [
          { label: '编辑', name: 'edit', type: 'primary' },
          { label: '删除', name: 'delete', type: 'danger' },
        ],
      },
    ],
    list: [],
  })

  // 是否打开触发器弹框
  const isFormVisible = ref<boolean>(false)
  // 触发器列表行数据
  const TableRows = ref()

  // 在组件中定义计算属性
  const statusText = computed(() => {
    return (status) => {
      switch (status) {
        case 1:
          return '开发中'
        case 2:
          return '测试中'
        case 3:
          return '禁用'
        case 4:
          return '发布'
        default:
          return '未知状态'
      }
    }
  })

  // 表单搜索参数
  const handleFormBtnSearch = (obj, btnType) => {
    formParams.tenantId = obj.tenantId
    // 新增Api
    if (btnType.text === '新增') {
      isFormVisible.value = true
      return
    }
    // 重置
    if (btnType.text === '重置') {
      formParams.tenantId = null
      return
    }
    getTableData()
  }

  // 获取表格列表数据
  const getTableData = async () => {
    tableInfo.loading = true
    let parms = {
      pageNum: tableParams.value.pageNum,
      pageSize: tableParams.value.pageSize,
      tenantId: formParams.tenantId,
    }
    const { data, code } = await pageApiInfoList(parms)
    if (code === 0) {
      console.log('获取API系统管理--表格列表数据', data)
      tableInfo.list = data?.records || []
      tableParams.value.total = data?.total || 0
    }
    tableInfo.loading = false
  }
  // 表格列操作
  const handleColumnOperation = (el: any, row: any, index: number) => {
    switch (el.name) {
      case 'edit':
        handeEditTrigger(row)
        SystemStore.handleSetSystemId(row.id)
        // console.log("SystemStore===========================", SystemStore.systemId);
        break
      case 'delete':
        handeDeleteTrigger(row.id)
        break
    }
  }

  // 表格编辑
  const handeEditTrigger = (row) => {
    console.log('编辑', row)
    isFormVisible.value = true
    TableRows.value = row
  }

  // 表格删除
  const handeDeleteTrigger = (id: string | number) => {
    ElMessageBox.confirm('删除该数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        let { code, data }: any = await delApiInfo({ id: id })
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

  // 关闭API系统管理
  const handleRestBack = (childrenState) => {
    isFormVisible.value = false
  }

  // 初始化函数
  onMounted(() => {
    getTableData()
  })
</script>

<style lang="scss" scoped>
  .api-list {
    position: relative;
    width: 100%;
    padding: 20px;
  }
</style>
