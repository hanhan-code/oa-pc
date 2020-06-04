import {  getInfo,codeIN,toSwitch,toWeb } from '@/api/login'
import { getToken, setToken, removeToken, setLoginInfo, clearLoginInfo } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    user: {},
    res: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      console.log(token,1112)
    },
    SET_USER: (state, user) => {
      state.user = user
      console.log(user,2223)
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      console.log(roles,3334)
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
      console.log(loadMenus,4445)
    }
  },

  actions: {
    // 登录
    toSwitch({ commit }, userInfo) {
      const id =  userInfo
      return new Promise((resolve, reject) => {
        let data = id
        toSwitch(data).then(res => {
          commit('SET_USER', res.data)
          console.log(res,1111)
          // 登陆状态
          if (res.code == 0) {
            setToken(res.data.token)
            commit('SET_TOKEN', res.data.token)
            // 设置 用户主键、所属公司主键
            setLoginInfo(res)
            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            commit('SET_LOAD_MENUS', true)
            resolve()
            toWeb().then(res=>{
              console.log(res,6666)
              setUserInfo(res.data, commit)
            })
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }

        }).catch(error => {
          reject(error)
        })
      })
    },

    CodeIN({ commit }, phoneInfo) {
      const phone = phoneInfo.phone
      const code = phoneInfo.code
      return new Promise((resolve, reject) => {
        codeIN(phone, code).then(res => {

          // 登陆状态
          if (res.code == 0) {

            setToken(res.data.token, undefined)
            commit('SET_TOKEN', res.data.token)

            // 设置 用户主键、所属公司主键
            setLoginInfo(res)

            setUserInfo(res.data, commit)

            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            commit('SET_LOAD_MENUS', true)
            resolve()
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }

        }).catch(error => {
          reject(error)
        })
      })
    },
    

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          if (res.code == 0) {
            setUserInfo(res.data, commit)
            resolve(res.data)
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        clearLoginInfo()
        resolve()
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.length === 0) {
    commit('SET_ROLES', res)
  } else {
    commit('SET_ROLES', res)
  }
}

export default user
