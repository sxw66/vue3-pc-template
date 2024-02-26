<template>
  <div class="cascade-select-box">
    <base-tabs type="border-card">
      <el-tab-pane :label="selectorName">
        <el-radio-group v-if="optionsList?.length" v-model="selectValue">
          <template
            v-for="(el, elIdx) in optionsList || []"
            :key="el[defaultProps['value']]"
          >
            <el-radio
              :label="el[defaultProps['value']]"
              @change="(val) => handleChange(val, selectorName, el, elIdx)"
            >
              {{ el[defaultProps["label"]] }}
            </el-radio>
          </template>
        </el-radio-group>
        <div v-else class="empty-box">
          <BaseEmpty :image-size="80" />
        </div>
      </el-tab-pane>
    </base-tabs>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed } from "vue";

// 内容为空组件
const BaseEmpty = defineAsyncComponent(() => import("@/components/base-empty/index.vue"));
// tab标签
const BaseTabs = defineAsyncComponent(() => import("@/components/BaseTabs/index.vue"));

interface Props {
  modelValue: string | number; // 双向绑定值（选中的值）
  name: string; // 卡片选择器名称
  options?: any[]; // 卡片选择器选项
  defaultProps?: any; // 映射字段
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  name: "名称",
  options: () => [],
  defaultProps: {
    label: "label",
    value: "value",
  },
});
const emit = defineEmits(["update:modelValue", "change"]);

const defaultPropMap = {
  label: "label",
  value: "value",
};

const selectorName = computed(() => props.name);

const optionsList = computed(() => props.options);
const defaultProps = computed(() => {
  return {
    ...defaultPropMap,
    ...props.defaultProps,
  };
});
const selectValue = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit("update:modelValue", value);
  },
});
const handleChange = (value: string | number, name: string, data: any, index: number) => {
  emit("change", {
    name,
    index,
    value,
    data,
  });
};
</script>

<style lang="scss" scoped>
.cascade-select-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  & ::v-deep(.el-tabs__content) {
    overflow-y: auto;
    padding: 12px 15px 15px 15px;
  }
  ::v-deep(.el-tabs__item) {
    height: 28px;
  }
  ::v-deep(.el-tabs--border-card) {
    border-color: #dcdfe6;
    border-radius: 2px;
  }
  ::v-deep(.el-tabs__header) {
    background-color: #fff;
  }
  ::v-deep(.el-tabs__header .el-tabs__item) {
    border-bottom: 1px solid #dcdfe6;
    border-right: none;
    color: #303133;
  }

  ::v-deep(.el-radio-group) {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
    font-size: 0;
    .el-radio {
      width: 100%;
      height: 26px;
    }
  }
}
</style>
