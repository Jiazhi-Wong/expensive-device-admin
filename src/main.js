import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import babelpolyfill from 'babel-polyfill'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './routes'
import store from './vuex/store'

import mock from '@/mock/index'
// if (process.env.NODE_ENV !== 'production') {
  mock();
// }

Vue.use(ElementUI)

NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
  // console.log(store.state.user.isLogin);
  if (store.state.user.isLogin) {
    next()
  } else {
    if (to.name === 'login') {
      next()
    } else {
      next({ name: 'login' })
    }
  }
  // console.dir(store);
  // if (to.path === '/login') {
  //   sessionStorage.removeItem('user');
  // }
  // let user = JSON.parse(sessionStorage.getItem('user'));
  // if (!user && to.path !== '/login') {
  //   next({ path: '/login' })
  // } else {
  //   next()
  // }
})

export default new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
  //render: h => h(Login)
}).$mount('#app')

//router.replace('/login')

