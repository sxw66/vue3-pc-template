<template>
  <el-menu-item :index="subItem.path" @click="handleClickMenu(subItem)">
    <BaseIcon :name="subItem?.meta?.icon" style="margin-right: 3px"></BaseIcon>
    <template #title>
      <span>{{ subItem?.meta?.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from 'vue'
  import { useRouter } from 'vue-router'
  import { isExternal } from '@/utils/validate'

  // 基础图标组件
  const BaseIcon = defineAsyncComponent(() => import('@/components/base-icon/index.vue'))

  const router = useRouter()
  let props = defineProps({
    menuList: {
      type: Array,
      default: () => [],
    },
    subItem: {
      type: Object,
      default: () => {},
    },
  })

  const handleClickMenu = (subItem) => {
    if (isExternal(subItem.path)) return window.open(subItem.path, '_blank')
    router.push(subItem.path)
  }
</script>
