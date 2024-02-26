<!-- 新建BOM清单 -->
<template>
  <div class="bom-update-dialog-box">
    <BaseDialog v-model="dialogVisible" title="从成品BOM中选择" width="50%" draggable :show-close="true" destroy-on-close>
      <div class="select-search-box">
        <div class="title">筛选条件</div>
        <el-row :gutter="20">
          <el-col v-for="item in selectList || []" :key="item.prop" :span="24 / selectList.length">
            <div style="height: 200px">
              <BaseSelectCard
                v-model="selectParams[item.prop]"
                :name="item.name"
                :options="item.options"
                :default-props="{ value: 'attributeCode', label: 'attributeValue' }"
                @change="getTableData()"
              />
            </div>
          </el-col>
        </el-row>
      </div>
      <BasePropTable
        :loading="tableInfo.loading"
        :columns="updateColumns"
        :data="tableInfo.list"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        :pager-count="5"
        small
        class="update-table-box"
        @size-change="handleSizeChange"
        @current-page-change="handlePageChange"
        @column-operation="handleColumnOperation"
      >
        <template #header>
          <!-- 自定义查询条件 -->
          <el-form :model="searchInfo">
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item label="物料编码">
                  <el-input v-model="searchInfo.materialCode" clearable placeholder="请输入物料编码" @change="getTableData()" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目名称">
                  <el-input v-model="searchInfo.projectName" placeholder="请输入项目名称" @change="getTableData()" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
        <!-- bom类型 -->
        <template #bomType="{ row }">
          {{ bomTypeMap[row.bomType] || '--' }}
        </template>
      </BasePropTable>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, computed, watch } from 'vue'
  import { bomTemplateList, bomCreate, customerList, platformList } from '@/api/bom/inventory/index'
  import { useRouter } from 'vue-router'
  import { useBomStore } from '@/store/modules/bom'
  import { updateColumns, bomTypeMap } from '../../constants'
  // BOM清单组件表格组件
  const BasePropTable = defineAsyncComponent(() => import('@/components/base-table/index.vue'))
  // 平铺筛选条件
  const BaseSelectCard = defineAsyncComponent(() => import('@/components/BaseSelect/Card/index.vue'))
  // 公共弹窗
  const BaseDialog = defineAsyncComponent(() => import('@/components/BaseDialog/index.vue'))
  const router = useRouter()
  const BomStore = useBomStore()

  interface Props {
    visible?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
  })

  const emits = defineEmits(['update:visible'])

  const dialogVisible: any = computed({
    get: () => {
      return props.visible
    },
    set: (value: any) => {
      emits('update:visible', value)
    },
  })

  const pageInfo = ref<any>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  })
  const selectParams = ref({
    customCode: '',
    platformCode: '',
  })

  const searchInfo = ref<any>({
    materialCode: '',
    projectName: '',
  })

  const rowData = ref<any>(null)

  // 表格数据
  const tableInfo: any = reactive({
    list: [],
    loading: false,
  })

  const selectList: any = ref([
    {
      name: '客户',
      prop: 'customCode',
      options: [],
    },
    {
      name: '平台',
      prop: 'platformCode',
      options: [],
    },
  ])
  // 获取全部客户下拉数据
  const getCustomerList = async () => {
    let { code, data }: any = await customerList()
    if (code !== 200) return
    selectList.value[0].options = [{ attributeValue: '汇总', attributeCode: '' }, ...data] || []
  }
  // 获取全部平台下拉数据
  const getPlatformList = async () => {
    let { code, data }: any = await platformList()
    if (code !== 200) return
    selectList.value[1].options = [{ attributeValue: '汇总', attributeCode: '' }, ...data] || []
  }
  // 获取模板列表数据
  const getTableData = () => {
    tableInfo.loading = true
    let p = {
      pageNum: pageInfo.value.pageNum,
      pageSize: pageInfo.value.pageSize,
      body: {
        ...searchInfo.value,
        ...selectParams.value,
      },
    }
    bomTemplateList(p)
      .then(({ data, code }: any) => {
        tableInfo.loading = false
        if (code === 200) {
          // 成功
          tableInfo.list = data?.records || []
          pageInfo.value.total = data?.total || 0
        }
      })
      .finally(() => {
        tableInfo.loading = false
      })
  }
  // 重置搜索条件
  const resetForm = () => {
    searchInfo.value.materialCode = ''
    searchInfo.value.projectName = ''
  }

  // 分页（每页条数）
  const handleSizeChange = (sizes: number) => {
    pageInfo.value.pageNum = 1
    pageInfo.value.pageSize = sizes
    getTableData()
  }
  // 分页（当前页码）
  const handlePageChange = (page: number) => {
    pageInfo.value.pageNum = page
    getTableData()
  }
  // 选择模板
  const selectTemplate = (row: any) => {
    rowData.value = { ...row }
    // 新建bom
    let p = {
      templateBomNumber: row.bomNumber || '',
      useTemplate: true,
    }
    bomCreate(p)
      .then(({ data, code }: any) => {
        tableInfo.loading = false
        if (code === 200) {
          // 跳转bom配单页面、缓存当前行数据
          BomStore.setBomInfo(data)
          router.push({
            path: '/bom/inventory/template',
          })
        }
      })
      .finally(() => {})
  }
  // 表格列操作
  const handleColumnOperation = (el: any, row: any, index: number) => {
    switch (el.name) {
      // 选择模板
      case 'select':
        selectTemplate(row)
        break
    }
  }
  // 打开弹窗查询列表数据
  watch(
    () => dialogVisible.value,
    (newVal: any) => {
      if (newVal) {
        getCustomerList()
        getPlatformList()
        getTableData()
      } else {
        resetForm()
      }
    },
    {
      immediate: true,
    },
  )
</script>

<style lang="scss" scoped>
  .bom-update-dialog-box {
    .flex {
      display: flex;
      display: -webkit-flex;
    }
    .select-search-box {
      .title {
        font-size: 16px;
        margin-bottom: 8px;
      }
    }
    .update-table-box {
      margin-top: 16px;
      ::v-deep(.el-form-item--default) {
        margin-bottom: 0;
      }
      ::v-deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }
</style>
