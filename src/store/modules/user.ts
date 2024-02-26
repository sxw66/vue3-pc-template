import { defineStore } from 'pinia'
import { getUserInfo, loginRegister } from '@/api/login'
export const useUserStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'userState',
  // state: 返回对象的函数
  state: () => ({
    // 登录token
    token: null,
    // 登录用户信息
    userInfo: {},
    // 角色
    roles: localStorage.roles ? JSON.parse(localStorage.roles) : [],
  }),
  getters: {},
  // 可以同步 也可以异步
  actions: {
    // 登录
    // login(userInfo) {
    //   return new Promise(async (resolve, reject) => {
    //     loginRegister(userInfo)
    //       .then(async (data) => {
    //         resolve(data)
    //         this.token = data.data
    //         if (this.token) {
    //           let userData = await this.getRoles()
    //           this.userInfo = userData
    //         }
    //       })
    //       .catch((err) => {
    //         reject(err)
    //       })
    //   })
    // },
    // 登录
    login(userInfo) {
      const { username, password } = userInfo
      return new Promise(async (resolve, reject) => {
        this.token = username
        this.userInfo = userInfo
        await this.getRoles()
        resolve(username)
      })
    },
    // 获取用户授权角色信息，实际应用中 可以通过token通过请求接口在这里获取用户信息
    getRoles() {
      return new Promise((resolve, reject) => {
        // 获取权限列表 默认就是超级管理员，因为没有进行接口请求 写死
        this.roles = ['admin']
        localStorage.roles = JSON.stringify(this.roles)
        resolve(this.roles)
        // getUserInfo().then((data) => {
        //   // 获取权限列表-是否是管理员
        //   if (data.data.isSuperAdmin) {
        //     this.roles = ['admin']
        //     localStorage.roles = JSON.stringify(this.roles)
        //   }
        //   resolve(data.data)
        // })
      })
    },
    // 获取用户信息 ，如实际应用中 可以通过token通过请求接口在这里获取用户信息
    getInfo(roles) {
      return new Promise((resolve, reject) => {
        this.roles = roles
        resolve(roles)
      })
    },
    // 退出
    logout() {
      return new Promise((resolve, reject) => {
        this.token = null
        this.userInfo = {}
        this.roles = []
        localStorage.clear()
        resolve(null)
      })
    },
  },
  // 进行持久化存储
  persist: {
    // 本地存储的名称
    key: 'userState',
    //保存的位置
    storage: window.localStorage, //localstorage
  },
})
