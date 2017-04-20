import ajax from '@/assets/js/ajax'

let baseUrl = '/ajaxhandler.ashx'
export default {
  getLoanListPage: function (req) {  // 获取借用记录列表
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'getLoanListPage',
          data: req
        }
      }).then(res => {
        resolve(res)
      }).catch(error => {
        console.warn(error);
      })
    })
  },
  handleAdminExamine: function (req) { // 管理员是否审核通过
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'handleAdminExamine',
          data: req
        }
      }).then(res => {
        resolve(res)
      }).catch(error => {
        console.warn(error);
      })
    })
  },
  handleLeaderExamine: function (req) { // 领导是否审核通过
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'handleLeaderExamine',
          data: req
        }
      }).then(res => {
        resolve(res)
      }).catch(error => {
        console.warn(error);
      })
    })
  }
}
