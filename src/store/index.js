import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    user: getItem(TOKEN_KEY)  // 一个对象，用来存储当前登录用户信息token等数据
  },
  getters: {
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
      // localStorage
      setItem(TOKEN_KEY, state.user);
    }
  },
  actions: {
  },
  modules: {
  }
})
