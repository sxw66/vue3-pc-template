<template>
  <el-tabs v-bind="attrs" :class="['base-tabs-box', { 'base-tabs-is-border': !border }]">
    <!-- 遍历父组件传入的 solts 透传给子组件 -->
    <template v-for="(item, key, i) in slots" :key="i" #[key]>
      <slot :name="key"></slot>
    </template>
  </el-tabs>
</template>

<script lang="ts" setup>
  import { useAttrs, useSlots, computed } from 'vue'
  interface Props {
    border?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    border: false,
  })
  const border = computed(() => props.border)
  // 透传属性 attrs
  const attrs = useAttrs()
  // 透传属性 slots
  const slots = useSlots()
</script>

<style lang="scss" scoped>
  .base-tabs-is-border {
    ::v-deep(.el-tabs__nav-wrap::after) {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 2px;
      background-color: var(--el-border-color-light);
      z-index: var(--el-index-normal);
    }
  }
  .base-tabs-box {
    height: 100%;
    ::v-deep(.el-tabs__content) {
      height: calc(100% - 54px);
    }
    ::v-deep(.el-tab-pane) {
      height: 100%;
    }
  }
</style>
