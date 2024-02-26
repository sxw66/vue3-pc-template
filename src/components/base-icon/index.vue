<!-- 兼容饿了么图标 | 阿里巴巴图标库 -->
<template>
  <template v-if="IconComponents">
    <el-icon :size="size" :color="color">
      <component :is="IconComponents"></component>
    </el-icon>
  </template>
  <template v-else>
    <span :class="['iconfont', props.name]" :style="{ 'font-size': `${size}px`, color: color }"></span>
  </template>
</template>

<script setup lang="ts">
  import * as ElIconsModules from '@element-plus/icons-vue'
  import { ref } from 'vue'

  const ElIconsNames = Object.keys(ElIconsModules)

  const props = withDefaults(
    defineProps<{
      name: string
      color?: string
      size?: number
    }>(),
    {
      name: '',
      color: '',
      size: 18,
    },
  )

  let IconComponents = null

  if (ElIconsNames.includes(props.name)) {
    IconComponents = ElIconsModules[props.name]
  }
</script>

<style lang="scss" scoped></style>
