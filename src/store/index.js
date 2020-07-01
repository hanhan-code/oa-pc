import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import api from './modules/api'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'
import VuexPersistence from "vuex-persist" // vuex 持久化存储

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
})

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [vuexLocal.plugin],
  modules: {
    app,
    api,
    user,
    tagsView,
    permission,
    settings
  },
  getters,
})

export default store
