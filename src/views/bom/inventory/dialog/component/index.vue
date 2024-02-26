<!-- 新建组件 -->
<template>
  <div class="bom-component-dialog-box">
    <BaseDialog v-model="dialogVisible" :title="typeMap[type]" width="850px" draggable :show-close="true" destroy-on-close>
      <div style="height: 60vh">
        <BasePropTable
          :columns="componentColumns"
          :data="tableInfo.list"
          :current-page="tableInfo.pageNum"
          :page-size="tableInfo.pageSize"
          :total="tableInfo.total"
          class="component-table-box"
          @size-change="handleSizeChange"
          @current-page-change="handlePageChange"
          @column-operation="handleColumnOperation"
        >
          <template #header>
            <!-- 自定义查询条件 -->
            <el-form :model="searchParams">
              <el-row :gutter="30">
                <el-col :span="8">
                  <el-form-item>
                    <el-dropdown class="classify-select-box">
                      <el-button type="primary">
                        <span class="iconfont icon-caidan" style="margin-right: 6px"></span>
                        <div class="classify-select-label">
                          {{ classifySelectedVal }}
                        </div>
                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu class="classify-menu-box">
                          <el-dropdown-item v-for="item in classifyList || []" :key="item.id" @click.stop="handleClassifySelect(item)">
                            {{ item?.componentTypeName }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料编码">
                    <el-input
                      v-model="searchParams.materialCode"
                      placeholder="请输入物料编码"
                      clearable
                      @change="handleSearch(searchParams.materialCode)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料名称">
                    <el-input
                      v-model="searchParams.materialName"
                      placeholder="请输入物料名称"
                      clearable
                      @change="handleSearch(searchParams.materialName)"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
          <!-- 加工渠道 -->
          <template #materialSource="{ row }">
            {{ channelMap[row.materialSource] || '--' }}
          </template>
        </BasePropTable>
      </div>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, computed, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { componentList, materialList, addComponent, updateComponent } from '@/api/bom/inventory/index'
  import { componentColumns, channelMap } from '../../constants'
  const BasePropTable = defineAsyncComponent(() => import('@/components/base-table/index.vue'))
  // 公共弹窗
  const BaseDialog = defineAsyncComponent(() => import('@/components/BaseDialog/index.vue'))

  interface Props {
    visible?: boolean
    type?: string // 操作类型（新增 add | 编辑 update）
    rowInfo?: any // 选中行数据
    bomData?: any // 当前行BOM清单数据
  }
  interface Isearch {
    componentTypeId: string
    materialCode: string
    materialName: string
  }
  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    type: 'add',
    rowInfo: {},
    bomData: {},
  })
  // 接收路由参数
  const route = useRoute()
  const emits = defineEmits(['update:visible', 'success'])

  // 列表
  const tableInfo = reactive<any>({
    list: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
  })
  // 搜索参数
  const searchParams = ref<Isearch>({
    componentTypeId: '',
    materialCode: '',
    materialName: '',
  })
  const dialogVisible: any = computed({
    get: () => {
      return props.visible
    },
    set: (value: any) => {
      emits('update:visible', value)
    },
  })

  const type = computed(() => props.type)
  const rowInfo = computed(() => props.rowInfo)
  const bomData = computed(() => props.bomData)
  const typeMap = {
    add: '添加组件',
    update: '更换组件',
  }
  const classifySelectedVal = ref<any>('全部组件分类')
  // 下拉组件
  const classifyList = ref<any[]>([])
  // 获取所有下拉组件
  const getCompList = async () => {
    let { code, data }: any = await componentList({})
    if (code !== 200) return
    classifyList.value = data
  }
  // 列表查询
  const getPageList = async () => {
    let p = {
      pageNum: tableInfo.pageNum,
      pageSize: tableInfo.pageSize,
      body: {
        ...searchParams.value,
      },
    }
    let { code, data }: any = await materialList(p)
    if (code !== 200) return
    tableInfo.list = data?.records || []
    tableInfo.total = data?.total || 0
  }
  const handleSearch = (v: any) => {
    // 如果输入框存在搜索条件，下拉组件查询置为默认全部
    if (v) {
      resetCompType()
    }
    getPageList()
  }
  // 分页（每页条数）
  const handleSizeChange = (sizes: number) => {
    tableInfo.pageNum = 1
    tableInfo.pageSize = sizes
    getPageList()
  }
  // 分页（当前页码）
  const handlePageChange = (page: number) => {
    tableInfo.pageNum = page
    getPageList()
  }
  // 新增、修改组件
  const handleAddEdit = (val: any) => {
    // 新增组件参数
    let addParams = {
      bomNumber: bomData.value.bomNumber,
      subMaterialCode: val.materialCode,
    }
    // 更换组件参数
    let updateParams = {
      bomNumber: bomData.value.bomNumber,
      subMaterialCode: rowInfo.value.materialCode,
      replaceMaterialCode: val.materialCode,
    }
    // 二次确认弹窗
    ElMessageBox.confirm(type.value === 'add' ? '确认新增组件?' : '确认对物料进行更换吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        if (type.value === 'add') {
          let { code, data }: any = await addComponent(addParams)
          if (code !== 200) return
          if (code === 200) {
            ElMessage({
              type: 'success',
              message: '新增组件成功',
            })
            // 返回列表
            emits('success', 'add')
          }
        } else {
          let { code, data }: any = await updateComponent(updateParams)
          if (code !== 200) return
          if (code === 200) {
            ElMessage({
              type: 'success',
              message: '已对物料进行修改',
            })
            // 返回列表
            emits('success', 'update')
          }
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: type.value === 'add' ? '取消新增' : '取消更换',
        })
      })
  }
  // 表格列操作
  const handleColumnOperation = (el: any, row: any, index: number) => {
    switch (el.name) {
      // 选择组件
      case 'select':
        // 新增 | 更换组件
        handleAddEdit(row)
        break
    }
  }
  // 重置输入框搜索字段
  const resetForm = () => {
    searchParams.value.materialCode = ''
    searchParams.value.materialName = ''
  }
  // 重置下拉搜索
  const resetCompType = () => {
    classifySelectedVal.value = '全部组件分类'
    searchParams.value.componentTypeId = ''
  }
  // 选中分类
  const handleClassifySelect = (item: any) => {
    classifySelectedVal.value = item.componentTypeName
    searchParams.value.componentTypeId = item.id
    if (item.id) {
      resetForm()
    }
    getPageList()
  }
  watch(
    () => dialogVisible.value,
    (newVal: any) => {
      if (newVal) {
        getCompList()
        getPageList()
      } else {
        resetCompType()
        resetForm()
      }
    },
    {
      immediate: true,
    },
  )
</script>

<style lang="scss" scoped>
  .classify-menu-box {
    width: 200px;
    max-height: 300px;
    overflow-y: auto;
  }
  .bom-component-dialog-box {
    .flex {
      display: flex;
      display: -webkit-flex;
    }
    .classify-select-box {
      width: 200px;
      ::v-deep(.el-button) {
        width: 100%;
      }
      .classify-select-label {
        width: 140px;
        text-align: left;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 隐藏溢出部分 */
        text-overflow: ellipsis; /* 显示省略号 */
      }
    }
    .component-table-box {
      height: 100%;
      ::v-deep(.el-form-item--default) {
        margin-bottom: 0;
      }
      ::v-deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }
</style>
