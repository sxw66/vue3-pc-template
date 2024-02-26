<template>
  <!--  API系统管理 编辑新建触发器 -->
  <div class="api-edit">
    <el-button type="primary" @click="handleBack">返回列表页</el-button>
    <el-row :gutter="20">
      <!-- API系统管理-输入组件 -->
      <el-col :span="12">
        <h1 class="title">输入</h1>
        <leftApiMnagement @handleLeftBack="handleBack" />
      </el-col>
      <!-- API系统管理-输出组件 -->
      <el-col :span="12">
        <h1 class="title">输出</h1>
        <rightApiMnagement @handleRightBack="handleBack" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, watchEffect, defineAsyncComponent } from 'vue'
  const leftApiMnagement = defineAsyncComponent(() => import('./components/left.api.vue'))
  const rightApiMnagement = defineAsyncComponent(() => import('./components/right-api.vue'))

  // 接收父组件传递的参数
  // const props = defineProps({
  //   triggerVisible: Boolean,
  //   EditFormData: Object,
  // });

  //分发事件给父组件
  let emits = defineEmits(['handleRestBack'])

  // 关闭-取消
  const handleBack = () => {
    emits('handleRestBack')
  }
  // // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  // watchEffect(() => {
  //   // if (props.EditFormData) {
  //   //   importForm.id = props.EditFormData.id;
  //   //   importForm.labelName = props.EditFormData.name;
  //   // }
  // });
</script>

<style lang="scss" scoped>
  .api-edit {
    position: relative;
    width: 100%;
    padding: 20px;
    .title {
      text-align: center;
    }
  }
</style>
