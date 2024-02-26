<!--
  /* 
   *name: 左侧分栏布局
   *author: lyf
   *date: 2023/12/14
   *desc: 导航栏左侧分栏布局
   */
-->
<template>
  <div class="main-columns">
    <!-- 左侧分类 -->
    <div class="layout-columns-aside">
      <div class="logo flex-center">
        <img src="@/assets/images/logos/white.png" alt="logo" />
      </div>
      <el-scrollbar>
        <div class="menu-wrap">
          <div
            v-for="item in menusRoutes"
            :key="item.path"
            class="item-menu-wrap"
            :class="{
              'active-menu': activeCurrentMenu === item.path,
            }"
            @click="handleChangeMenu(item)"
          >
            <el-icon :size="20">
              <component :is="item?.meta?.icon"></component>
            </el-icon>
            <span class="title">{{ item?.meta?.title }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- 左侧菜单 -->
    <div class="layout-columns-sub" :style="{ width: isCollapse ? '60px' : '210px' }">
      <div class="logo flex-center">
        <span v-show="subMenus.length">{{ isCollapse ? '精算' : '财务精算报价系统' }}</span>
      </div>
      <el-scrollbar>
        <el-menu
          :collapse="isCollapse"
          :router="false"
          :default-active="activeMenu"
          :unique-opened="uniqueOpened"
          :collapse-transition="false"
          class="menu-columns"
        >
          <SubMenu :menu-list="subMenus" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 内容区 -->
    <div class="container">
      <div class="layout-header">
        <div class="header-tool">
          <LayoutHeaderToolLeft />
          <LayoutHeaderToolRight />
        </div>
        <LayoutTagsView v-if="themeConfig.showTag" />
      </div>
      <LayoutMain />
      <LayoutFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent, ref, computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { usePermissionStore } from '@/store/modules/permission'
  import { useSettingStore } from '@/store/modules/setting'

  // 页脚组件
  const LayoutFooter = defineAsyncComponent(() => import('../components/Footer/index.vue'))
  // 左侧子菜单导航组件
  const SubMenu = defineAsyncComponent(() => import('../components/SubMenu/SubMenu.vue'))
  // 标签页组件
  const LayoutTagsView = defineAsyncComponent(() => import('../components/TagsView/index.vue'))
  // 头部右侧内容组件
  const LayoutHeaderToolRight = defineAsyncComponent(() => import('../components/Header/ToolRight.vue'))
  // 头部左侧内容组件
  const LayoutHeaderToolLeft = defineAsyncComponent(() => import('../components/Header/ToolLeft.vue'))
  // 内容组件
  const LayoutMain = defineAsyncComponent(() => import('../components/Main/index.vue'))

  const PermissionStore = usePermissionStore()
  const SettingStore = useSettingStore()
  const route = useRoute()
  const router = useRouter()

  // 获取路由
  const menusRoutes = computed(() => {
    return PermissionStore.permission_routes.filter((item) => !item.hidden)
  })
  // 是否只保存一个子菜单的展开
  const uniqueOpened = computed(() => SettingStore.themeConfig.uniqueOpened)

  const activeCurrentMenu = ref('')
  // 主题配置
  const themeConfig = computed(() => SettingStore.themeConfig)
  const isCollapse = computed(() => !SettingStore.isCollapse)
  const activeMenu = computed(() => {
    const { path } = route
    return path
  })
  const basePath = ref<string>('/')
  const subMenus = ref([])

  watch(
    () => [route],
    () => {
      if (!menusRoutes.value.length) return
      const [firstMenu] = route.matched
      activeCurrentMenu.value = firstMenu.path
      let menuItem = menusRoutes.value.find((item) => firstMenu.path === item.path)
      if (menuItem?.children?.length) {
        subMenus.value = menuItem.children
      } else {
        subMenus.value = []
      }
      basePath.value = firstMenu.path
    },
    {
      deep: true,
      immediate: true,
    },
  )

  const handleChangeMenu = (item) => {
    router.push(item.path)
  }
</script>

<style lang="scss" scoped>
  .main-columns {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    .layout-columns-aside {
      flex-shrink: 0;
      width: 80px;
      height: 100%;
      background-color: $menuBg;
      .el-scrollbar {
        height: calc(100% - 55px);
      }
      .logo {
        box-sizing: border-box;
        height: 50px;
        img {
          width: 32px;
          object-fit: contain;
        }
      }
      .menu-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .item-menu-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60px;
          width: 60px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .active-menu {
          position: relative;
          background: $primaryColor;
          border-radius: 5px;
        }
        .active-menu::before {
          content: '';
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: $primaryColor;
          box-shadow: 0 0 0 1px $subMenuActiveText;
          transition: all 0.3s;
          position: absolute;
          right: -4px;
        }
        .title {
          color: #e5eaf3;
        }
        .el-icon {
          color: #e5eaf3;
        }
      }
    }

    .layout-columns-sub {
      flex-shrink: 0;
      width: 200px;
      box-sizing: border-box;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
      border-right: 1px solid #eee;
      .el-scrollbar {
        height: calc(100vh - 50px);
      }
      .logo {
        width: 100%;
        box-sizing: border-box;
        height: 50px;
        border-bottom: 1px solid #eee;
        span {
          font-weight: bold;
          white-space: nowrap;
        }
      }
      ::v-deep(.menu-columns) {
        border-right: none;
      }
    }
    .container {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .layout-header {
        background: white;
        transition: width 0.28s;
        flex-shrink: 0;
        box-sizing: border-box;
        box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
        .header-tool {
          height: 50px;
          width: 100%;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          padding: 0 10px 0 0;
          justify-content: space-between;
        }
      }
    }
  }
</style>
