import ajax from '@/assets/js/ajax'

let baseUrl = '/ajaxhandler.ashx'
export default {
  getUserListPage: function (req) {  // 获取用户列表
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'getUserListPage',
          data: req
        }
      }).then(res => {
        resolve(res)
      }).catch(error => {
        console.warn(error);
      })
    })
  },
  updateUser: function (req) { // 编辑或添加一个用户
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'updateUser',
          data: req
        }
      }).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error);
      })
    })
  },
  delUser: function (req) { // 删除某个用户
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'delUser',
          data: req
        }
      }).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error);
      })
    })
  }
}
