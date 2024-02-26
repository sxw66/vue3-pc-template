<template>
  <div class="base-theme-wrap-box">
    <el-drawer v-model="drawer" title="主题配置" size="480px">
      <div>
        <el-divider content-position="center">
          <div class="module-title">导航栏模式</div>
        </el-divider>
        <ul class="navigation-bar-mode">
          <li :class="{ 'is-active': layout == 'vertical' }" @click="changeSwitch('mode', 'vertical')">
            <el-container>
              <el-aside width="20px" style="background: #304156"></el-aside>
              <el-container>
                <el-header height="20px">Header</el-header>
                <el-main style="background: #f0f2f5"></el-main>
              </el-container>
            </el-container>
            <div class="label">左侧模式</div>
          </li>
          <li :class="{ 'is-active': layout == 'horizontal' }" @click="changeSwitch('mode', 'horizontal')">
            <el-container>
              <el-header height="20px" style="background: #304156; color: #fff; width: 90px"> Header </el-header>
              <el-main style="background: #f0f2f5"></el-main>
            </el-container>
            <div class="label">顶部模式</div>
          </li>
          <li :class="{ 'is-active': layout == 'columns' }" @click="changeSwitch('mode', 'columns')">
            <el-container>
              <el-aside width="8px" style="background: #304156"></el-aside>
              <el-aside width="12px" style="border-right: 1px solid #e4e7ed"></el-aside>
              <el-container>
                <el-header height="20px">Header</el-header>
                <el-main style="background: #f0f2f5"></el-main>
              </el-container>
            </el-container>
            <div class="label">分栏模式</div>
          </li>
          <li :class="{ 'is-active': layout == 'mix' }" @click="changeSwitch('mode', 'mix')">
            <el-container>
              <el-header height="20px" style="background: #304156; color: #fff; width: 90px"> Header </el-header>
              <el-container>
                <el-aside width="20px" style="border-right: 1px solid #e4e7ed"></el-aside>
                <el-container>
                  <el-main style="background: #f0f2f5"></el-main>
                </el-container>
              </el-container>
            </el-container>
            <div class="label">混合模式</div>
          </li>
        </ul>
      </div>
      <el-divider content-position="center">
        <div class="module-title">界面显示</div>
      </el-divider>
      <div class="theme-item">
        <label>主题颜色</label>
        <el-color-picker v-model="primary" :predefine="predefineColor" @change="changePrimary" />
      </div>
      <div class="theme-item">
        <label>暗黑模式</label>
        <BaseSwitchDark></BaseSwitchDark>
      </div>
      <div class="theme-item">
        <label>灰色模式</label>
        <el-switch v-model="gray" @change="(val) => changeGrayWeak('gray', val)" />
      </div>
      <div class="theme-item">
        <label>色弱模式</label>
        <el-switch v-model="weak" @change="(val) => changeGrayWeak('weak', val)" />
      </div>
      <div class="theme-item">
        <label>标签栏</label>
        <el-switch v-model="showTag" @change="(val) => changeSwitch('showTag', val)" />
      </div>
      <div class="theme-item">
        <label>侧边栏 Logo</label>
        <el-switch v-model="showLogo" @change="(val) => changeSwitch('showLogo', val)" />
      </div>
      <div class="theme-item">
        <label>保持一个子菜单的展开</label>
        <el-switch v-model="uniqueOpened" @change="(val) => changeSwitch('uniqueOpened', val)" />
      </div>
      <div class="theme-item">
        <label>固定header</label>
        <el-switch v-model="fixedHeader" @change="(val) => changeSwitch('fixedHeader', val)" />
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent, computed, ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { openLoading, closeLoading } from '@/utils/element'
  import { PRIMARY_COLOR } from '@/config/index'
  import { useSettingStore } from '@/store/modules/setting'
  // 引入组件
  const BaseSwitchDark = defineAsyncComponent(() => import('@/components/base-switch-dark/index.vue'))

  const SettingStore = useSettingStore()
  const showTag = ref(SettingStore.themeConfig.showTag)
  const showLogo = ref(SettingStore.themeConfig.showLogo)
  const uniqueOpened = ref(SettingStore.themeConfig.uniqueOpened)
  const primary = ref(SettingStore.themeConfig.primary)
  const fixedHeader = ref(SettingStore.themeConfig.fixedHeader)
  const gray = ref(SettingStore.themeConfig.gray)
  const weak = ref(SettingStore.themeConfig.weak)

  const layout = computed(() => SettingStore.themeConfig.mode)
  const drawer = computed({
    get() {
      return SettingStore.themeConfig.showSetting
    },
    set() {
      changeSwitch('showSetting', !SettingStore.themeConfig.showSetting)
    },
  })

  // 预定义主题颜色
  const predefineColor = ['#9EA8FC', '#A26EF4', '#C6C7F8', '#A8C5DA', '#64D572', '#A1E3CB', '#F25E43', '#915B8B', '#006E54', '#1BD1A8']

  // 进行配置
  const changeSwitch = (key, val) => {
    SettingStore.setThemeConfig({ key, val })
    if (key === 'mode') {
      openLoading()
      setTimeout(() => {
        closeLoading()
      }, 500)
    }
  }

  // 监听布局变化
  watch(
    () => layout.value,
    () => {
      const body = document.body as HTMLElement
      body.setAttribute('class', `layout-${layout.value}`)
    },
    { immediate: true },
  )

  // 修改主题颜色
  const changePrimary = (val) => {
    if (!val) {
      primary.value = val = PRIMARY_COLOR
      ElMessage({ type: 'success', message: `主题颜色已重置为 ${PRIMARY_COLOR}` })
    }
    document.documentElement.style.setProperty('--el-color-primary', val)
    changeSwitch('primary', val)
  }

  // 修改灰色模式
  const changeGrayWeak = (type, val) => {
    const body = document.documentElement as HTMLElement
    if (!val) return body.setAttribute('style', '')
    if (type === 'gray') body.setAttribute('style', 'filter: grayscale(1)')
    if (type === 'weak') body.setAttribute('style', 'filter: invert(80%)')
    changeSwitch(type, val)
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.el-drawer__header) {
    border-bottom: 1px solid #ebeef5;
    padding: 15px 20px 14px;
    margin-bottom: 0;
  }
  .flex {
    display: flex;
    display: -webkit-flex;
  }
  .base-theme-wrap-box {
    :deep(.el-drawer__title) {
      font-weight: bold;
      color: black;
    }
    .theme-item {
      width: 100%;
      display: flex;
      margin-bottom: 15px;
      align-items: center;
      font-size: 14px;
      color: black;
      justify-content: space-between;
    }
    /* 导航栏模式 */
    .navigation-bar-mode {
      list-style: none;
      padding: 0 0;
      margin: 0 0;
      @extend.flex;
      justify-content: space-between;
      text-align: center;
      margin-bottom: 16px;
      li {
        cursor: pointer;
        font-size: 12px;
        ::v-deep(.el-container:first-child) {
          border: 2px solid #e4e7ed;
          border-radius: 2px;
        }
        .label {
          margin-top: 6px;
        }
      }
      li:hover {
        .label {
          color: $primaryColor;
        }
      }
      li.is-active {
        ::v-deep(.el-container:first-child) {
          border: 2px solid $primaryColor;
        }
        .label {
          color: $primaryColor;
        }
      }
    }
  }
</style>
