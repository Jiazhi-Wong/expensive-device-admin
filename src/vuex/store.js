import Vue from 'vue'
import Vuex from 'vuex'
import base from './modules/base'
import user from './modules/user'

Vue.use(Vuex)

// 创建 store 实例
export default new Vuex.Store({
  modules: {
    base,
    user
  }
})
