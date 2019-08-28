import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api_address: '172.27.200.155',
    api_port: '3000'
  },
  getters: {
    api_address: (state) => {
      return `http://${state.api_address}:${state.api_port}`
    }
  },
  mutations: {

  },
  actions: {

  }
})
