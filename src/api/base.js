import ajax from '@/assets/js/ajax'

let baseUrl = '/ajaxhandler.ashx'
export default {
  login: function (req, cb) {  // 登录
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'login',
          data: req
        }
      }).then(res => {
        cb(res);
        resolve(res)
      }).catch(error => {
        console.warn(error);
      })
    })
  },
  getInitialInfo: function (cb) {
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'getInitialInfo'
        }
      }).then(res => {
        cb(res);
      }).catch(error => {
        console.warn(error);
      })
    })
  }
}
