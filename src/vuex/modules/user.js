import api from '@/api/api'
import * as types from '../mutation-types'

let state = {
  isLogin: false,
  userData: {
    uid: '',
    username: '',
    role: '',
    authority: '',
    token: ''
  }
}

let actions = {
  login: function ({commit}, payload) {
    return api.login(payload.data, function (res) {
      commit(types.LOGIN_IN, res);
    })
  },
  signOut: function ({commit}) {
    commit(types.EXIT_LOGIN);
  }
}

let mutations = {
  [types.LOGIN_IN] (state, res) {
    state.isLogin = res.error_code === 0;
    state.userData = Object.assign(state.userData, res.data);
  },
  [types.EXIT_LOGIN] (state) {
    state.isLogin = false;
    state.userData = Object.assign(state.userData, {
      uid: '',
      username: '',
      role: '',
      authority: '',
      token: ''
    });
  }
}

export default {
  state,
  actions,
  mutations
}
