<template>
  <div class="login-container">
    <div class="login-box">
      <BaseSwitchDark class="login-dark" />
      <div class="login-left">
        <!-- <img src="@/assets/images/login/1.png" /> -->
      </div>
      <div class="login-form">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent } from 'vue'
  // 异步加载组件
  const LoginForm = defineAsyncComponent(() => import('./components/login-form.vue'))
  const BaseSwitchDark = defineAsyncComponent(() => import('@/components/base-switch-dark/index.vue'))
</script>
<style lang="scss" scoped>
  @import './index';
</style>
