<!--
  /* 
   *name: 混合模式
   *author: lyf
   *date: 2023/12/14
   *desc: 混合模式（顶部左侧分栏布局）
   */
-->
<template>
  <div class="layout-mix-box">
    <div class="layout-top-box">
      <!-- 头部分类 -->
      <div class="header-nav">
        <div class="logo flex-center">
          <img src="@/assets/images/logos/white2.png" alt="logo" />
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
              <div class="circle"></div>
              <!-- <BaseIcon :name="item?.meta?.icon" color="#fff" style="margin-right: 3px"></BaseIcon> -->
              <span class="title">{{ item?.meta?.title }}</span>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <LayoutHeaderToolRight />
    </div>
    <div class="layout-bottom-box">
      <!-- 左侧子菜单 -->
      <div class="side-nav-sub" :style="{ width: isCollapse ? '60px' : '210px' }">
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
        <div class="collapse-icon-bx">
          <LayoutHeaderCollapseIcon />
        </div>
      </div>
      <!-- 内容区 -->
      <div class="main-right-box">
        <LayoutTagsView v-if="themeConfig.showTag" />
        <div class="mix-container">
          <LayoutMain />
        </div>
        <LayoutFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent, ref, computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { usePermissionStore } from '@/store/modules/permission'
  import { useSettingStore } from '@/store/modules/setting'

  // 基础图标组件
  const BaseIcon = defineAsyncComponent(() => import('@/components/base-icon/index.vue'))

  // 页脚组件
  const LayoutFooter = defineAsyncComponent(() => import('../components/Footer/index.vue'))

  // 左侧子菜单导航组件
  const SubMenu = defineAsyncComponent(() => import('../components/SubMenu/SubMenu.vue'))

  // 标签页组件
  const LayoutTagsView = defineAsyncComponent(() => import('../components/TagsView/index.vue'))

  // 头部右侧内容组件
  const LayoutHeaderToolRight = defineAsyncComponent(() => import('../components/Header/ToolRight.vue'))

  // 内容组件
  const LayoutMain = defineAsyncComponent(() => import('../components/Main/index.vue'))

  // 左侧菜单收起展开icon组件
  const LayoutHeaderCollapseIcon = defineAsyncComponent(() => import('../components/Header/components/CollapseIcon.vue'))

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
  .flex {
    display: flex;
    display: -webkit-flex;
  }
  .layout-mix-box {
    @extend.flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    :deep(.m-tool-right) {
      color: #fff;
    }
    :deep(.el-dropdown) {
      color: #fff;
    }
    .layout-top-box {
      @extend.flex;
      align-items: center;
      justify-content: space-between;
      transition: width 0.28s;
      height: 60px;
      background-color: #304156;
      box-sizing: border-box;
      .header-nav {
        @extend.flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 16px;
        box-sizing: border-box;
        /* border: 1px solid #fff; */
        .el-scrollbar {
          height: 70%;
        }
        .logo {
          box-sizing: border-box;
          img {
            height: 28px;
            object-fit: contain;
          }
        }
        .menu-wrap {
          @extend.flex;
          align-items: center;
          justify-content: center;
          margin-top: 3px;
          .item-menu-wrap {
            @extend.flex;
            align-items: center;
            justify-content: center;
            margin-left: 16px;
            padding: 8px 5px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .active-menu {
            position: relative;
            background: $primaryColor;
            border-radius: 5px;
            .circle {
              margin-right: 3px;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: #fff;
              /* box-shadow: 5px 0px 5px 4px rgba(255, 255, 0, 0.6); */
            }
          }
          .title {
            color: #e5eaf3;
          }
          .el-icon {
            color: #e5eaf3;
          }
        }
      }
    }
    .layout-bottom-box {
      @extend.flex;
      width: 100%;
      height: calc(100% - 60px);
      .side-nav-sub {
        width: 200px;
        box-sizing: border-box;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s ease;
        background: white;
        border-right: 1px solid #eee;
        .el-scrollbar {
          height: calc(100vh - 102px);
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
        .collapse-icon-bx {
          @extend.flex;
          align-items: center;
          justify-content: flex-end;
          height: 41px;
        }
      }
      .main-right-box {
        flex: 1;
        @extend.flex;
        flex-direction: column;
        overflow-y: auto;
        .mix-container {
          flex: 1;
          @extend.flex;
          flex-direction: column;
        }
      }
    }
  }
</style>
