<template>
  <div class="m-headerSearch">
    <el-tooltip effect="dark" content="菜单搜索" placement="bottom">
      <el-icon class="header-icon" style="font-size: 22px" @click="handleSearch"><Search /></el-icon>
    </el-tooltip>
    <el-dialog v-model="isShowSearch" width="40%" :show-close="false" align-center destroy-on-close @close="handleClean">
      <el-input v-model="search" placeholder="菜单搜索 ：支持菜单名称、路径" class="header-search-input" clearable @input="querySearch">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <div class="header-search-con">
        <el-scrollbar v-if="options.length" max-height="500px" always :min-size="20">
          <div
            v-for="(item, index) in options"
            :key="item.item.path"
            :class="['c-item', { 'is-active': activeIndex === index }]"
            @click.stop="handleChange(item?.item?.path, index)"
          >
            {{ item?.item?.title?.join(' > ') }}
          </div>
        </el-scrollbar>
        <el-empty v-else :image-size="200" />
      </div>
      <div class="header-search-footer">
        <div class="left-box">
          <div class="f-item">
            <el-icon class="frame"><Back /></el-icon>
            <span>访问</span>
          </div>
          <div class="f-item">
            <el-icon class="frame"><Top /></el-icon>
            <el-icon class="frame"><Bottom /></el-icon>
            <span>切换</span>
          </div>
        </div>
        <div class="right-box">
          <div class="frame" style="font-size: 10px">ESC</div>
          <span>退出</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, watch, onBeforeUnmount } from 'vue'
  import path from 'path-browserify'
  import Fuse from 'fuse.js'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  const router = useRouter()
  const isShowSearch = ref(false)
  const options = ref([])
  const searchPool = ref([])
  const search = ref('')
  const fuse = ref(null)
  import { usePermissionStore } from '@/store/modules/permission'
  const PermissionStore = usePermissionStore()
  const routes = computed(() => PermissionStore.routes)
  const activeIndex = ref(-1) // 当前选中的菜单路径

  const handleSearch = () => {
    isShowSearch.value = true
  }

  const initFuse = (list) => {
    fuse.value = new Fuse(list, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      // maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        {
          name: 'title',
          weight: 0.7,
        },
        {
          name: 'path',
          weight: 0.3,
        },
      ],
    })
  }

  watch(searchPool, (list) => {
    initFuse(list)
  })

  // 筛选出可以在侧栏中显示的路线 生成标题
  const generateRoutes = (routes, basePath = '/', prefixTitle = []) => {
    let res = []

    for (const router of routes) {
      // 忽略隐藏的路由
      if (router.hidden) {
        continue
      }

      const data = {
        path: path.resolve(basePath, router.path),
        title: [...prefixTitle],
      }
      if (router?.meta?.title) {
        data.title = [...data.title, router.meta.title]

        if (router.redirect !== 'noRedirect') {
          // 仅推送带有标题的路由
          // 特殊情况：需要排除无重定向的父路由器
          res.push(data)
        }
      }
      // 递归子路由
      if (router.children) {
        const tempRoutes = generateRoutes(router.children, data.path, data.title)
        if (tempRoutes.length >= 1) {
          res = [...res, ...tempRoutes]
        }
      }
    }
    return res
  }

  // 跳转路由
  const toMenu = (path: string) => {
    if (path) {
      router.push({
        path: path,
      })
    }
    handleClean()
  }

  const handleChange = (val: string, index: number) => {
    activeIndex.value = index
    toMenu(val)
  }
  // 过滤搜索菜单
  const querySearch = (query) => {
    if (query !== '') {
      options.value = fuse.value.search(query)
    } else {
      options.value = []
    }
  }

  // 关闭弹框钩子
  const handleClean = () => {
    options.value = []
    search.value = ''
    isShowSearch.value = false
    activeIndex.value = -1
  }

  // 提示语
  const toMessage = (message: string) => {
    ElMessage({
      showClose: true,
      message: message,
      type: 'warning',
    })
  }

  // 添加按下键盘事件
  const handleKeyDown = (event) => {
    let path = options.value[0]?.item?.path
    switch (event.key) {
      // 回车
      case 'Enter':
        toMenu(path)
        break
      // 上箭头
      case 'ArrowUp':
        if (activeIndex.value <= 0) {
          options.value.length && toMessage('已到是第一条！')
          return
        }
        activeIndex.value--
        break
      // 下箭头
      case 'ArrowDown':
        if (activeIndex.value >= options.value.length - 1) {
          options.value.length && toMessage('已到是最后一条！')
          return
        }
        activeIndex.value++
        break
    }
  }
  onMounted(() => {
    searchPool.value = generateRoutes(JSON.parse(JSON.stringify(routes.value)))
    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown)
  })
  // 页面卸载之前销毁监听事件
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    display: -webkit-flex;
  }
  .m-headerSearch {
    @extend.flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    :deep(.el-dialog) {
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
      }
    }
    .header-search-input {
      margin: 20px 16px 16px 16px;
      width: calc(100% - 32px);
    }
    .header-search-con {
      margin: 0 20px;
      .c-item {
        padding: 6px 10px;
        /* background-color: rgba(244, 244, 245, 0.8); */
        margin-bottom: 10px;
        border-radius: 6px;
      }
      .c-item:hover {
        /* background-color: $primaryColor; */
        background-color: rgba(236, 245, 255, 0.8);
      }
      .is-active {
        background-color: rgba(236, 245, 255, 0.8);
      }
    }
    .header-search-footer {
      @extend.flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      border-top: 1px solid #efeff5;
      .frame {
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        margin-right: 5px;
        box-shadow: inset 0 -2px #cdcde6, inset 0 0 1px 1px #fff, 0 1px 2px 1px #1e235a66;
      }
      .left-box {
        @extend.flex;
        .f-item:not(:first-child) {
          margin-left: 20px;
        }
      }
      .right-box {
        @extend.flex;
      }
    }
    .item-info-pop {
      display: flex;
      align-items: center;
    }
    .item-child {
      display: flex;
      align-items: center;
      font-size: 13px;
    }
  }
</style>
