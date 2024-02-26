<!-- 内容为空组件-->
<template>
  <div class="base-empty-box">
    <el-empty :image="image" :image-size="imageSize" :description="description">
      <template #default>
        <slot name="default"></slot>
      </template>
    </el-empty>
  </div>
</template>

<script lang="ts" setup>
  import emptyImg from '@/assets/images/empty/01.png'

  export interface Props {
    image?: string
    imageSize?: number
    description?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    image: emptyImg,
    imageSize: 180,
    description: '暂无内容',
  })
</script>

<style lang="scss" scoped>
  .base-empty-box {
    padding-top: 20px;
    ::v-deep(.el-empty) {
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      align-content: center;
      padding: 0 0;
      .el-empty__description {
        margin-top: 10px;
      }
    }
  }
</style>
