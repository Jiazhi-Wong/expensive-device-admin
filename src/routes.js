import Vue from 'vue'
import Router from 'vue-router'
import Login from './pages/Login.vue'
import Home from './pages/Home.vue'
import Main from './pages/Main.vue'
import NotFound from './pages/404.vue'

// user
import user from './pages/user/user'
import group from './pages/user/group'

// loan
import loan from './pages/loan/loan'

// device
import device from './pages/device/device'

Vue.use(Router)

let routes = [
  {
    path: '/login',
    component: Login,
    name: 'login',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '用户',
    iconCls: 'iconfont icon-user',//图标样式class
    children: [
      {path: '/main', component: Main, name: '主页', hidden: true},
      {path: '/user', component: user, name: '用户管理'},
      {path: '/group', component: group, name: '用户组别'},
    ]
  },
  {
    path: '/',
    component: Home,
    name: '借用',
    iconCls: 'iconfont icon-chakanjieyongjilu',
    children: [
      {path: '/loan', component: loan, name: '借用记录'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '设备',
    iconCls: 'iconfont icon-shebei',
    children: [
      {path: '/device', component: device, name: '设备管理'}
    ]
  },
  {
    path: '*',
    name: '404',
    component: NotFound,
    hidden: true
  }
];

export default new Router({
  routes,
});
