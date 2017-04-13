import api from '@/api/api'
import * as types from '../mutation-types'

let state = {
  initialPassword: '',
  groupOptions: []
}

let actions = {
  getInitialInfo: function ({commit}) {
    return api.getInitialInfo(function (res) {
      commit(types.GET_INITIAL, res);
    })
  },
}

let mutations = {
  [types.GET_INITIAL] (state, res) {
    if (res.code === 0) {
      state.initialPassword = res.data.initialPassword;
      state.groupOptions = res.data.groupOptions;
    }
  }
}

export default {
  state,
  actions,
  mutations
}
