<template>
  <div class="base-search-form-box">
    <!-- label-width="auto" -->
    <el-form ref="ruleFormRef" inline :model="formParams" class="form-inline" label-width="auto">
      <template v-for="(item, index) in columns" :key="index">
        <el-form-item v-if="item.valueType === 'input'" :label="item?.label">
          <el-input
            v-model.trim="formParams[item.name]"
            v-bind="item.attrs"
            @change="handeFormChange('input')"
            clearable
            class="sc-input"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item v-else-if="item.valueType === 'select'" :label="item?.label">
          <el-select
            v-model="formParams[item.name]"
            v-bind="item.attrs"
            @change="handeFormChange('select')"
            placeholder="请选择"
            class="sc-select"
          >
            <el-option v-for="list in item.options" :key="list.value" :label="list.label" :value="list.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.valueType === 'date-picker'" :label="item?.label">
          <el-date-picker v-model="formParams[item.name]" v-bind="item.attrs" @change="handeFormChange('date-picker')" />
        </el-form-item>
        <el-form-item v-if="item.valueType === 'cascader'" :label="item?.label">
          <el-cascader v-model="formParams[item.name]" v-bind="item.attrs" :options="item.options" @change="handeFormChange('cascader')" />
        </el-form-item>
        <el-form-item v-if="item.valueType === 'time-select'" :label="item?.label">
          <el-time-select v-model="formParams[item.name]" v-bind="item.attrs" @change="handeFormChange('time-select')" />
        </el-form-item>
      </template>
    </el-form>
    <div class="search-btn">
      <template v-for="button in searchButtonList" :key="button.text">
        <el-button v-if="!button.hidden" :disabled="button.disabled" :type="button.type" @click="handeButtonClick(button)"
          >{{ button.text }}
        </el-button>
      </template>
    </div>
    <!-- 此代码暂时注释2024-4-19 -->
    <!-- <div class="search-btn">
      <el-button v-if="columns.length > 8" link type="primary" @click="isExpand = !isExpand">
        {{ isExpand ? '合并' : '展开' }}
        <el-icon>
          <arrow-down v-if="!isExpand" />
          <arrow-up v-else />
        </el-icon>
      </el-button>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, computed } from 'vue'
  import type { FormInstance } from 'element-plus'
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

  const emit = defineEmits(['onButtonClick', 'onFormChange'])

  const ruleFormRef = ref<FormInstance>()

  // 收缩展开
  const isExpand = ref(false)
  const formParams:any = reactive({})

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
  const handeButtonClick = (items) => {
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
    emit('onButtonClick', formParams, items)
  }

  // 获取输入框参数
  const handeFormChange = (type) => {
    // 发射搜索参数和按钮类型
    emit('onFormChange', formParams, type)
  }
</script>

<style lang="scss" scoped>
  .base-search-form-box {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    .form-inline {
      // border: solid 1px rgb(29, 201, 72);
      .sc-select {
        min-width: 150px;
        width: 180px;
        box-sizing: border-box;
      }
      .sc-input {
        min-width: 150px;
        width: 180px;
        box-sizing: border-box;
      }
    }
    .search-btn {
      min-width: 215px;
    }
  }
</style>
