<!-- 查看报价详情 -->
<template>
  <BaseDialog v-model="priceVisible" title="总价情况" width="470px" draggable :show-close="true" destroy-on-close>
    <div class="price-box">
      <div>
        <span class="price-title">含税价格</span>
        <p>加工费：{{ priceInfo.subProcessPrice }}元</p>
        <p>物料费：{{ priceInfo.price }}元</p>
        <p>总费用：{{ priceInfo.totalSpend }}元</p>
      </div>
      <div>
        <span class="price-title">不含税价格</span>
        <p>加工费：{{ priceInfo.subNoProcessPrice }}元</p>
        <p>物料费：{{ priceInfo.noPrice }}元</p>
        <p>总费用：{{ priceInfo.totalNoSpend }}元</p>
      </div>
    </div>
    <div class="price-set">
      <el-input
        v-model="grossRatea"
        onkeyup="value=value.replace(/[^\d.]/g,'')"
        placeholder="设置毛利率"
        style="width: 250px"
        @input="handleInput"
        @change="handlePrice"
      />
      %
    </div>
    <div v-show="isShow" class="price-box">
      <div>
        <p>对外报价：{{ priceData.externalPrice }}元</p>
      </div>
      <div>
        <p>对外报价：{{ priceData.insidePrice }}元</p>
      </div>
    </div>
    <div class="price-set">
      <span class="price-tip">部分物料在erp中没有价格，会影响报价准确性</span>
      <el-button @click="viewNoprice">查看无报价物料</el-button>
    </div>
  </BaseDialog>
  <!-- 查看无报价物料弹窗 -->
  <BaseDialog v-model="noPriceVisible" title="无报价物料列表" width="700px" draggable :show-close="true" destroy-on-close>
    <div style="height: 50vh">
      <BasePropTable :is-show-pagination="false" :columns="noPriceColumns" :data="priceInfo.noPriceMaterialList">
        <!-- 加工渠道 -->
        <template #materialSource="{ row }">
          {{ channelMap[row.materialSource] || '--' }}
        </template>
      </BasePropTable>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, computed, watch } from 'vue'
  import { lookBomSpend } from '@/api/bom/inventory/index'
  import { ElMessage } from 'element-plus'
  import { noPriceColumns, channelMap } from '../../constants'
  const BasePropTable = defineAsyncComponent(() => import('@/components/base-table/index.vue'))
  // 公共弹窗
  const BaseDialog = defineAsyncComponent(() => import('@/components/BaseDialog/index.vue'))
  interface Props {
    visible?: boolean
    bomNum?: any
  }
  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    bomNum: {},
  })
  const emits = defineEmits(['update:visible', 'success'])

  const priceVisible: any = computed({
    get: () => {
      return props.visible
    },
    set: (value: any) => {
      emits('update:visible', value)
    },
  })
  const rowInfo: any = computed(() => props.bomNum)
  const isShow = ref<boolean>(false)
  const noPriceVisible = ref<boolean>(false)
  const grossRatea: any = ref('')
  // 报价数据
  const priceInfo: any = ref({})
  // 报价字段
  const priceData: any = reactive({
    externalPrice: null,
    insidePrice: null,
  })
  // 总价详情查询
  const getPageList = async () => {
    let p = {
      bomNumber: rowInfo.value.bomNumber,
    }
    let { code, data }: any = await lookBomSpend(p)
    if (code !== 200) return
    priceInfo.value = data || {}
  }
  getPageList()
  // 处理非数字
  const handleInput = (e: any) => {
    let regex = /^[a-zA-Z]+$/
    console.log('e', typeof e, e)
    if (regex.test(e)) {
      isShow.value = false
      return
    }
  }

  // 设置毛利率totalSpend: 含税价格(对外), totalNoSpend: 不含税价格(对内)
  const handlePrice = (val: any) => {
    console.log('e', typeof val, val)
    if (!val) {
      isShow.value = false
      ElMessage({
        message: '毛利率不能为空',
        type: 'warning',
      })
      return
    }
    if (Number(val) > 100 || Number(val) < 1) {
      isShow.value = false
      ElMessage({
        message: '毛利率为1-100的数字',
        type: 'warning',
      })
      grossRatea.value = ''
      return
    }
    isShow.value = true
    priceData.externalPrice = (Number(priceInfo.value.totalSpend) * (1 + val * 0.01)).toFixed(2)
    priceData.insidePrice = (Number(priceInfo.value.totalNoSpend) * (1 + val * 0.01)).toFixed(2)
  }
  // 查看无报价物料
  const viewNoprice = () => {
    noPriceVisible.value = true
    // alert('查看无报价物料')
  }

  watch(
    () => priceVisible.value,
    (newVal: any) => {
      if (newVal) {
        // getPageList()
        grossRatea.value = ''
        isShow.value = false
      }
    },
    {
      immediate: true,
    },
  )
</script>

<style lang="scss" scoped>
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
    ::v-deep(.el-input__inner) {
      text-align: center;
    }
  }
</style>
