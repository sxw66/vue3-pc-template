<template>
  <div class="app-container">
    <BasePropTable
      class="bom-list-box"
      :loading="tableInfo.loading"
      :columns="inventoryColumns"
      :data="tableInfo.list"
      :current-page="paginationParams.pageNum"
      :page-size="paginationParams.pageSize"
      :total="paginationParams.total"
      @size-change="handleSizeChange"
      @current-page-change="handlePageChange"
      @form-operation="handleTableSearch"
      @column-operation="handleColumnOperation"
    >
      <template #templateBom="{ row }">
        <div class="bom-template">
          {{ row.templateBomName || '--' }} 业务线：{{ row.templateProductType || '--' }} 客户：{{ row.templateCustom || '--' }} 平台：{{
            row.templatePlatform || '--'
          }}
        </div>
      </template>
      <template #createTime="{ row }">
        {{ parseTime(row.createTime, '{y}-{m}-{d}') }}
      </template>
    </BasePropTable>
    <!-- BOM清单 -->
    <BomUpdateFormDialog v-model:visible="updateDialogVisible" />
    <!-- 删除确认弹窗 -->
    <BaseConfirm v-model="delVisible" label="请确认是否删除当前BOM？" @submit="handleSubmitDel" @cancel="delVisible = false"> </BaseConfirm>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, onMounted } from 'vue'
  import { parseTime } from '@/utils/index'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { bomInventoryList, bomDelete, bomExport } from '@/api/bom/inventory/index'
  import { inventoryColumns } from './constants'
  import { useRouter } from 'vue-router'
  import { useBomStore } from '@/store/modules/bom'
  // BOM清单组件表格组件
  const BasePropTable = defineAsyncComponent(() => import('@/components/base-table/index.vue'))
  // 新建BOM清单组件
  const BomUpdateFormDialog = defineAsyncComponent(() => import('./dialog/update/index.vue'))
  // 二次确认弹窗
  const BaseConfirm = defineAsyncComponent(() => import('@/components/BaseConfirm/index.vue'))
  const router = useRouter()
  const BomStore = useBomStore()
  const paginationParams = ref<any>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  })

  // 搜索参数
  const tableSearchParams = ref<any>({
    bomName: '',
    bomNumber: '',
  })
  // 表格参数
  const tableInfo = reactive<any>({
    loading: false,
    list: [],
  })

  const updateDialogVisible = ref<boolean>(false)
  const delVisible = ref<boolean>(false)
  const rowData: any = ref({})

  // 条件查询
  const handleTableSearch = (obj, btnType) => {
    // 新建BOM清单
    if (btnType.text === '新增') {
      updateDialogVisible.value = true
    }
    // 查询
    if (btnType.text === '查询') {
      if (obj.bomName) {
        tableSearchParams.value.bomName = obj.bomName
        getTableData()
      }
    }
    // 重置
    if (btnType.text === '重置') {
      tableSearchParams.value.bomName = ''
      getTableData()
    }
  }

  // 获取表格列表数据
  const getTableData = () => {
    tableInfo.loading = true
    let p = {
      pageNum: paginationParams.value.pageNum,
      pageSize: paginationParams.value.pageSize,
      body: {
        ...tableSearchParams.value,
      },
    }
    bomInventoryList(p)
      .then(({ data, code }: any) => {
        tableInfo.loading = false
        if (code === 200) {
          // 成功
          tableInfo.list = data?.records || []
          paginationParams.value.total = data?.total || 0
        }
      })
      .finally(() => {
        tableInfo.loading = false
      })
  }
  onMounted(() => {
    getTableData()
  })
  // 删除提交
  const handleSubmitDel = async () => {
    let p = {
      bomNumber: rowData.value.bomNumber || '',
    }
    let { code, data }: any = await bomDelete(p)
    if (code !== 200) return
    ElMessage({
      showClose: true,
      message: '删除成功！',
      type: 'success',
    })
    delVisible.value = false
    getTableData()
  }
  // 导出bom
  const exportBomExcel = async (bomNum: string | number) => {
    await bomExport({ bomNumber: bomNum }).then((res: any) => {
      if (res) {
        const link = document.createElement('a')
        const blob = new Blob([res], { type: res.type ?? 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', decodeURI('bom清单数据.xls'))
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        ElMessage({
          type: 'error',
          message: res.message,
        })
      }
    })
  }
  // 表格列操作
  const handleColumnOperation = (el: any, row: any, index: number) => {
    switch (el.name) {
      // 继续配置
      case 'setting':
        // 缓存BOM清单当前行数据
        BomStore.setBomInfo(row)
        router.push({
          path: '/bom/inventory/template',
        })
        break
      // 删除BOM
      case 'delete':
        rowData.value = { ...row }
        delVisible.value = true
        break

      // 导出BOM
      case 'download':
        exportBomExcel(row.bomNumber)
        break
    }
  }
  // 分页（每页条数）
  const handleSizeChange = (sizes: number) => {
    paginationParams.value.pageNum = 1
    paginationParams.value.pageSize = sizes
    getTableData()
  }
  // 分页（当前页码）
  const handlePageChange = (page: number) => {
    paginationParams.value.pageNum = page
    getTableData()
  }
</script>

<style lang="scss" scoped>
  .bom-list-box {
    .operation-box {
      display: -webkit-flex;
      display: flex;
      justify-content: flex-end;
    }
    .bom-template {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
