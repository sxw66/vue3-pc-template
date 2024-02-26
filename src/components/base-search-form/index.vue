<template>
  <div class="base-search-form-box">
    <el-form ref="ruleFormRef" :inline="true" :label-position="'right'" :model="formParams" class="form-inline">
      <el-row :class="{ 'not-show': byHeight && !isExpand }" :gutter="gutterWidth">
        <template v-for="(item, index) in columns" :key="index">
          <el-col v-if="item.valueType" v-show="byHeight ? true : index < showRow * 4 || isExpand" :span="item.span">
            <BaseFormItem v-bind="item.attrs" :key="index" v-model="formParams[item.name]" :config="item" />
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div class="search-btn">
      <template v-for="button in searchButtonList" :key="button.text">
        <el-button :disabled="button.disabled" :type="button.type" @click="onButtonClick(button)">{{ button.text }} </el-button>
      </template>
      <el-button v-if="columns.length > 4" link type="primary" @click="isExpand = !isExpand">
        {{ isExpand ? '合并' : '展开' }}
        <el-icon>
          <arrow-down v-if="!isExpand" />
          <arrow-up v-else />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, computed } from 'vue'
  import type { FormInstance } from 'element-plus'
  import BaseFormItem from './components/base-form-item.vue'
  interface ItemProps<T> {
    [key: string]: T
  }
  interface Button {
    [x: string]: any
    type: string
    text: string
    disabled: boolean
  }
  interface Props {
    columns: ItemProps<any>[]
    labelWidth?: string
    gutterWidth?: number
    showRow?: number
    byHeight?: boolean
    searchButtonList?: Button[]
  }

  const props = withDefaults(defineProps<Props>(), {
    columns: () => [],
    labelWidth: '100px',
    gutterWidth: 24,
    showRow: 1,
    byHeight: false,
    searchButtonList: () => [],
  })

  const emit = defineEmits(['onButtonSearch'])

  const ruleFormRef = ref<FormInstance>()

  // 收缩展开
  const isExpand = ref(false)
  const formParams = reactive({})

  const initFormParams = () => {
    for (let item of columns.value) {
      formParams[item.name] = item?.value
    }
  }

  const columns = computed(() => {
    return props.columns
  })

  onMounted(() => {
    initFormParams()
  })

  // 获取参数进行组装为 obj
  const onButtonClick = (items) => {
    // 重置参数
    if (items.type === '') {
      ruleFormRef.value.clearValidate()
      ruleFormRef.value.resetFields()
      const keysList = Object.keys(formParams)
      keysList.forEach((key) => {
        formParams[key] = undefined
      })
    }
    // 发射搜索参数和按钮类型
    emit('onButtonSearch', formParams, items)
  }
</script>

<style lang="scss" scoped>
  .base-search-form-box {
    display: flex;
    justify-content: space-between;
    .form-inline {
      flex: 1;
    }
    .el-form--inline .el-form-item {
      width: 100%;
      margin-right: 10px;
    }
    .search-btn {
      margin-left: 40px;
    }
    .not-show {
      height: 40px;
      overflow: hidden;
    }
  }
</style>
