import { defineStore } from 'pinia'
// API 触发器 把多个页面使用到的公共ID存储起来
export const useSystemStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'systemStore',
  // state: 返回对象的函数
  state: () => ({
    // 系统id
    systemId: null,
  }),
  getters: {},
  // 可以同步 也可以异步
  actions: {
    handleSetSystemId(val: any) {
      this.systemId = val || ''
    },
  },
  //   // 进行持久化存储
  //   persist: {
  //     // 本地存储的名称
  //     key: 'systemStore',
  //     //保存的位置
  //     storage: window.localStorage, //localstorage
  //   },
})
