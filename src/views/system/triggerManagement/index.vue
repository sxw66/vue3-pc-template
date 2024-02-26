<template>
  <!-- API触发器列表 -->
  <BasePropTable
    class="trigger-list"
    :loading="tableInfo.loading"
    :columns="tableInfo.columnList"
    :data="tableInfo.list"
    :current-page="tableParams.pageNum"
    :page-size="tableParams.pageSize"
    :total="tableParams.total"
    @size-change="handleSizeChange"
    @current-page-change="handlePageChange"
    @reset="handleRest"
    @submit="handleTableSearch"
    @column-operation="handleColumnOperation"
  >
    <template #header> </template>
    <template #triggerPosition="{ row }">
      <el-tag>{{ row.triggerPosition === 1 ? '后置' : '前置' }} </el-tag>
    </template>
    <template #refPosition="{ row }">
      <el-tag>{{ row.refPosition === 1 ? 'body' : 'header' }}</el-tag>
    </template>
    <template #createTime="{ row }">
      {{ parseTime(row.createTime, '{y}-{m}-{d}') }}
    </template>
  </BasePropTable>
  <!-- 编辑触发器 -->
  <editTriggerManagement :trigger-visible="updateDialogVisible" :edit-form-data="TableRows" @closeTrigger="handeCloseTrigger" />
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { parseTime } from '@/utils/index'
  import { pageinterfaceList, delinterface } from '@/api/system/index'
  // 触发器表格组件
  const BasePropTable = defineAsyncComponent(() => import('@/components/base-table/index.vue'))
  // 触发器编辑组件
  const editTriggerManagement = defineAsyncComponent(() => import('./edit.trigger.management.vue'))

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
        name: 'tenantId',
        search: true,
        valueType: 'input',
        span: 24,
        label: '搜索接口ID',
        hide: true,
      },
      {
        name: 'apiId',
        label: '接口ID',
      },
      {
        name: 'triggerApiId',
        label: '被触发接口ID',
      },
      {
        name: 'triggerPosition',
        label: '触发位置',
        slot: true,
      },
      {
        name: 'convertRuleClassId',
        label: '转换规则分类ID',
      },
      {
        name: 'refPosition',
        label: '转换结果使用位置',
        slot: true,
      },
      {
        name: 'createTime',
        label: '创建时间',
        slot: true,
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
  const updateDialogVisible = ref<boolean>(false)
  // 触发器列表行数据
  const TableRows = ref()

  // 表格搜索参数
  const handleTableSearch = (val) => {
    console.log('表格搜索提交值', val)
    formParams.apiId = val.tenantId
    getTableData()
  }

  // 表格重置
  const handleRest = () => {
    formParams.apiId = null
    getTableData()
  }

  // 获取表格列表数据
  const getTableData = async () => {
    tableInfo.loading = true
    let parms = {
      pageNum: tableParams.value.pageNum,
      pageSize: tableParams.value.pageSize,
      apiId: formParams.apiId,
    }
    const { data, code } = await pageinterfaceList(parms)
    if (code === 0) {
      console.log('获取表格列表数据', data)
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
        break
      case 'delete':
        handeDeleteTrigger(row.id)
        break
    }
  }

  // 表格编辑
  const handeEditTrigger = (row) => {
    console.log('编辑', row)
    updateDialogVisible.value = true
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
        let { code, data }: any = await delinterface({ id: id })
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

  // 关闭触发器弹框
  const handeCloseTrigger = (childrenState) => {
    // 根据子组件传递的状态来判断是否新增或者编辑成功
    if (childrenState) {
      getTableData()
    }
    updateDialogVisible.value = false
  }

  // 初始化函数
  onMounted(() => {
    getTableData()
  })
</script>

<style lang="scss" scoped>
  .trigger-list {
    position: relative;
    width: 100%;
    padding: 20px;
  }
</style>
