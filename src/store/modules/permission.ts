import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes, routerArray, notFoundRouter } from '@/routers/index'
import { hasPermission, filterAsyncRoutes } from '@/utils/routers'
import { filterKeepAlive, filterRoutes } from '@/utils/routers'
export const usePermissionStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'permissionState',
  // state: 返回对象的函数
  state: () => ({
    // 路由
    routes: [],
    // 动态路由
    addRoutes: [],
    // 缓存路由
    cacheRoutes: {},
  }),
  getters: {
    permission_routes: (state) => {
      return state.routes
    },
    keepAliveRoutes: (state) => {
      return filterKeepAlive(asyncRoutes)
    },
  },
  // 可以同步 也可以异步
  actions: {
    // 生成路由
    generateRoutes(roles) {
      return new Promise((resolve) => {
        // 在这判断是否有权限，哪些角色拥有哪些权限
        let accessedRoutes
        if (roles && roles.length && !roles.includes('admin')) {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        } else {
          accessedRoutes = asyncRoutes || []
          console.log(2)
        }
        // 2024-2-2 暂时注释路由权限
        // console.log('本地的路由', accessedRoutes);
        // const mesnuData = JSON.parse(localStorage.getItem('userState'))
        // if (mesnuData) {
        //   console.log('获取远程的路由权限', mesnuData.userInfo.menus);
        //   // 获取所有菜单权限
        //   const permMenuArr = getPermMenuArr(mesnuData.userInfo.menus);
        //   console.log('获取所有菜单权限',permMenuArr);
        //   accessedRoutes = getRouterByPerm(permMenuArr, accessedRoutes);
        //   console.log('获取匹配到的路由数据',accessedRoutes);
        // }
        accessedRoutes = accessedRoutes.concat(notFoundRouter)
        this.routes = constantRoutes.concat(accessedRoutes)
        this.addRoutes = accessedRoutes
        resolve(accessedRoutes)
      })
    },
    // 清楚路由
    clearRoutes() {
      this.routes = []
      this.addRoutes = []
      this.cacheRoutes = []
    },
    getCacheRoutes() {
      this.cacheRoutes = filterKeepAlive(asyncRoutes)
      return this.cacheRoutes
    },
  },
})

function getPermMenuArr(menus) {
  const permMenuArr = []
  menus.forEach((menu) => {
    // 菜单显隐 0 显示 1 不显示
    if (!menu.hidden) {
      permMenuArr.push(menu.name)
      if (menu.children && !menu.hidden) {
        permMenuArr.push(...getPermMenuArr(menu.children))
      }
    }
  })
  return permMenuArr
}

// 获取匹配权限的路由信息-方法调用2024-1-10
function getRouterByPerm(permResourceArr, routers) {
  const permRouters = []
  routers.forEach((route) => {
    if (route.name && permResourceArr.includes(route.name)) {
      permRouters.push(route)
    } else if (route.children) {
      const children = getRouterByPerm(permResourceArr, route.children)
      if (children.length > 0) {
        route.children = children
        permRouters.push(route)
      }
    }
  })
  return permRouters
}
