<template>
  <div class="app-container bom-template-wrap">
    <div class="bom-template-box">
      <div class="bom-title">BOM配单</div>
      <div class="template-name-box">
        <div v-if="!isEditName" class="name-text" @click="handleEditName">
          {{ templateName }}
          <el-icon :size="20" class="edit-icon">
            <Edit />
          </el-icon>
        </div>
        <template v-else>
          <el-input ref="editNameInputref" v-model="templateName" clearable>
            <template #append>
              <div class="edit-name-cancel-box" @click.stop="handleEditNameCancel"> 取消 </div>
            </template>
          </el-input>
          <el-button type="primary" class="save-name-box" @click.stop="handleSaveName"> 保存名称 </el-button>
        </template>
      </div>
      <div class="template-bom">
        <div>模板BOM：{{ bomRow.templateBomName || '--' }}</div>
        <div>业务线：{{ bomRow.templateProductType }}</div>
        <div>客户：{{ bomRow.templateCustom }}</div>
        <div>平台：{{ bomRow.templatePlatform }}</div>
      </div>
      <!-- 表格 -->
      <div class="template-table-box">
        <BasePropTable
          :is-show-pagination="false"
          :loading="tableInfo.loading"
          :columns="templateColumns"
          :data="tableInfo.list"
          @column-operation="handleColumnOperation"
        >
          <!-- 加工渠道 -->
          <template #materialSource="{ row }">
            {{ channelMap[row.materialSource] || '--' }}
          </template>
        </BasePropTable>
      </div>
      <div class="operation-box">
        <div>
          <el-button type="primary" @click.stop="addComponent">
            <el-icon style="margin-right: 6px"><plus /></el-icon>
            添加组件
          </el-button>
        </div>
        <div>
          <el-button @click="viewTotalPrice">查看总价</el-button>
          <el-button @click="handleBackList">返回列表</el-button>
        </div>
      </div>
    </div>
    <BomComponentDialog
      v-model:visible="componentDialogVisible"
      :type="currentOperation"
      :row-info="currentRow"
      :bom-data="bomRow"
      @success="handleSuccess"
    ></BomComponentDialog>
    <!-- 查看总价 -->
    <BomPriceDialog v-model:visible="totalPriceVisible" :bom-num="bomRow"></BomPriceDialog>
    <!-- 删除确认弹窗 -->
    <BaseConfirm v-model="moveVisible" label="请确认是否移除当前组件？" @cancel="handeleCancel" @submit="handleMove"> </BaseConfirm>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, nextTick, watch, onMounted } from 'vue'
  import { bomNameUpdate, bomPartsList, removeComponent } from '@/api/bom/inventory/index'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { useBomStore } from '@/store/modules/bom'
  import { templateColumns, channelMap } from '../constants'

  const BasePropTable = defineAsyncComponent(() => import('@/components/base-table/index.vue'))
  // 更新组件弹框
  const BomComponentDialog = defineAsyncComponent(() => import('../dialog/component/index.vue'))
  // 查看报价弹窗
  const BomPriceDialog = defineAsyncComponent(() => import('../dialog/component/price.vue'))
  // 二次确认弹窗
  const BaseConfirm = defineAsyncComponent(() => import('@/components/BaseConfirm/index.vue'))
  // 接收路由参数
  const route = useRoute()
  // BOM清单行数据
  const bomRow: any = ref({})
  // 路由跳转
  const router = useRouter()
  const emits = defineEmits(['saveBom'])
  const isEditName = ref<boolean>(false)
  const totalPriceVisible = ref<boolean>(false)
  const moveVisible = ref<boolean>(false)
  const editNameInputref = ref<any>(null)
  const componentDialogVisible = ref<boolean>(false)
  const currentOperation = ref<string>('add')
  const currentRow = ref<any>({})
  // 表格数据
  const tableInfo = reactive<any>({
    loading: false,
    list: [],
  })

  const templateName = ref<any>('')
  // bom配单列表
  const getBomList = () => {
    tableInfo.loading = true
    let p = {
      bomNumber: bomRow.value.bomNumber,
    }
    bomPartsList(p)
      .then(({ data, code }: any) => {
        tableInfo.loading = false
        if (code === 200) {
          tableInfo.list = data || []
        }
      })
      .finally(() => {
        tableInfo.loading = false
      })
  }
  watch(
    () => bomRow.value.bomName,
    (newVal: any) => {
      if (newVal) {
        templateName.value = newVal
        getBomList()
      }
    },
    {
      immediate: true,
    },
  )
  // 查看总价
  const viewTotalPrice = () => {
    totalPriceVisible.value = true
  }
  // 返回列表
  const handleBackList = () => {
    router.go(-1)
  }
  // 编辑模板名称
  const handleEditName = () => {
    isEditName.value = true
    nextTick(() => {
      editNameInputref.value?.focus()
    })
  }
  // 取消编辑模板名称
  const handleEditNameCancel = () => {
    templateName.value = bomRow.value?.bomName || ''
    isEditName.value = false
  }
  // 保存模板名称
  const handleSaveName = () => {
    let p = {
      bomName: templateName.value,
      bomNumber: bomRow.value.bomNumber,
    }
    if (!templateName.value) {
      ElMessage({
        message: '名称不能为空',
        type: 'warning',
      })
      return
    }
    bomNameUpdate(p)
      .then(({ data, code }: any) => {
        if (code === 200) {
          ElMessage({
            type: 'success',
            message: '名称修改成功',
          })
          isEditName.value = false
        }
      })
      .finally(() => {})
  }
  // 添加组件
  const addComponent = () => {
    currentOperation.value = 'add'
    componentDialogVisible.value = true
  }
  // 更换组件
  const updateComponent = (row: any) => {
    currentOperation.value = 'update'
    currentRow.value = { ...row }
    componentDialogVisible.value = true
  }
  // 新增、更换成功回调
  const handleSuccess = () => {
    componentDialogVisible.value = false
    getBomList()
  }
  // 取消
  const handeleCancel = () => {
    moveVisible.value = false
  }
  // 移除组件提交
  const handleMove = async () => {
    let p = {
      bomNumber: bomRow.value.bomNumber,
      subMaterialCode: currentRow.value.materialCode,
    }
    let { code, data }: any = await removeComponent(p)
    if (code !== 200) return
    ElMessage({
      showClose: true,
      message: '移除成功！',
      type: 'success',
    })
    moveVisible.value = false
    getBomList()
  }
  // 表格列操作
  const handleColumnOperation = (el: any, row: any, index: number) => {
    switch (el.name) {
      // 更换组件
      case 'update-component':
        updateComponent(row)
        break
      // 移除组件
      case 'delete-component':
        currentRow.value = { ...row }
        moveVisible.value = true
        break
    }
  }
  onMounted(() => {
    bomRow.value = useBomStore().bomRowData || {}
  })
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    display: -webkit-flex;
  }
  .bom-template-wrap {
    ::v-deep(.base-prop-table-box .footer .operator) {
      margin-bottom: 0;
    }
    ::v-deep(.el-input-group__append) {
      padding: 0 0;
    }
    .bom-template-box {
      @extend.flex;
      flex-direction: column;
      height: 100%;
      .back-box {
        cursor: pointer;
        .text {
          margin-left: 10px;
        }
      }
      .bom-title {
        font-size: 18px;
      }
      .back-box:hover {
        color: $primaryColor;
        ::v-deep(.el-button) {
          color: $primaryColor;
          border-color: $primaryColor;
        }
      }
      .template-name-box {
        @extend.flex;
        margin: 16px 0 5px 0;
        .edit-name-cancel-box {
          padding: 0 20px;
          cursor: pointer;
        }
        .save-name-box {
          margin-left: 16px;
        }
        .name-text {
          @extend.flex;
          align-items: center;
          width: 100%;
          height: 32px;
          padding: 0 16px;
          cursor: pointer;
          background-color: rgba(245, 247, 250, 1);
          border-radius: 4px;
          .edit-icon {
            margin-left: 12px;
          }
        }
        .name-text:hover {
          color: $primaryColor;
        }
      }
      .template-bom {
        @extend.flex;
        align-items: center;
        height: 32px;
        padding: 0 16px;
        cursor: pointer;
        background-color: rgba(245, 247, 250, 1);
        border-radius: 4px;
        div {
          margin-right: 24px;
        }
      }
      .template-table-box {
        flex: 1;
        .table-footer-btn {
          margin-top: 16px;
        }
      }
      .operation-box {
        @extend.flex;
        justify-content: space-between;
        margin-top: 16px;
      }
    }
    .price-box {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      .price-title {
        color: #02a7f0;
      }
    }
    .price-set {
      text-align: center;
      margin: 20px 0;
      .price-tip {
        font-size: 14px;
        margin-right: 5px;
        color: #d9001b !important;
      }
    }
  }
</style>
