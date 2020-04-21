import { login, getInfo,codeIN } from '@/api/login'
import { getToken, setToken, removeToken, setLoginInfo, clearLoginInfo } from '@/utils/auth'
import { decrypt } from '@/utils/rsaEncrypt'
import el from 'element-ui/src/locale/lang/el'
import { clearUserInfo } from '../../utils/auth'

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
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username
      const password = decrypt(userInfo.password)
      const code = userInfo.code
      const uuid = userInfo.uuid
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {

          // 登陆状态
          if (res.code == 0) {

            console.log('==========ddd=========')
            console.log(res)
            setToken(res.data.token, rememberMe)
            commit('SET_TOKEN', res.data.token)

            // 设置 用户主键、所属公司主键
            setLoginInfo(res)

            setUserInfo(res.data.user, commit)

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
    CodeIN({ commit }, phoneInfo) {
      const phone = phoneInfo.phone
      const code = phoneInfo.code
      return new Promise((resolve, reject) => {
        codeIN(phone, code).then(res => {

          // 登陆状态
          if (res.code == 0) {

            console.log('==========ddd=====ssss====')
            console.log(res)
            setToken(res.data.token, undefined)
            commit('SET_TOKEN', res.data.token)

            // 设置 用户主键、所属公司主键
            setLoginInfo(res)

            setUserInfo(res.data.user, commit)

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
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res)
}

export default user
