<template>
  <el-dialog v-bind="attrs" :class="['base-dialog-box']" align-center draggable>
    <!-- 遍历父组件传入的 solts 透传给子组件 -->
    <template v-for="(item, key, i) in slots" :key="i" #[key]>
      <slot :name="key"></slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { useAttrs, useSlots } from 'vue'
  // 透传属性 attrs
  const attrs = useAttrs()
  // 透传属性 slots
  const slots = useSlots()
</script>

<style lang="scss" scoped></style>
