import { defineStore } from 'pinia'

export const useBomStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'bomInfo',
  // state: 返回对象的函数
  state: () => ({
    bomRowData: {}, // bom清单当前行数据
  }),

  getters: {},

  // 可以同步 也可以异步
  actions: {
    // 设置
    setBomInfo(val) {
      this.bomRowData = val
    },
  },
  // 进行持久化存储
  persist: {
    // 本地存储的名称
    key: 'bomInfo',
    //保存的位置
    storage: window.sessionStorage, // 【localStorage | sessionStorage】
  },
})
