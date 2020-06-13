import { getInfo, codeIN, toSwitch, toWeb } from '@/api/login'
import { getToken, setToken, removeToken, setLoginInfo, clearLoginInfo } from '@/utils/auth'
import routes from '@/router/route'
import routers from '@/router/routers'
import store from '@/store'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = []
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    toSwitch({ commit }, userInfo) {
      const id = userInfo
      return new Promise((resolve, reject) => {
        let data = id
        toSwitch(data).then(res => {
          commit('SET_USER', res.data)
          // 登陆状态
          if (res.code == 0) {
            setToken(res.data.token)
            commit('SET_TOKEN', res.data.token)
            // 设置 用户主键、所属公司主键
            setLoginInfo(res)
            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            // commit('SET_LOAD_MENUS', true)
            resolve()
            toWeb().then(res => {
              setUserInfo(res.data, commit)
              routers.replace('/')
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

            // setUserInfo(res.data, commit)

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
            // setUserInfo(res.data, commit)
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
        routers.replace({ path: '/login' })
        sessionStorage.clear()
      })
    },

  }
}

export const setUserInfo = (res, commit) => {
  let arr = []
  routes.forEach(p => {
    let flag = res.some(n => n.path === p.name)
    if (flag) {
      arr.push(p)
    }
  })
  store.dispatch('GenerateRoutes', arr)
}

export default user
