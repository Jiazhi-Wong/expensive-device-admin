import ajax from '@/assets/js/ajax'

let baseUrl = '/ajaxhandler.ashx'
export default {
  getGroupListPage: function (req) {  // 获取组别列表
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'getGroupListPage',
          data: req
        }
      }).then(res => {
        resolve(res)
      }).catch(error => {
        console.warn(error);
      })
    })
  },
  updateGroup: function (req) { // 编辑或添加一个组别
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'updateGroup',
          data: req
        }
      }).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error);
      })
    })
  },
  delGroup: function (req) { // 删除某个组别
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'delGroup',
          data: req
        }
      }).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error);
      })
    })
  },
  getCreditListPage: function (req) {
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'getCreditListPage',
          data: req
        }
      }).then(res => {
        resolve(res)
      }).catch(error => {
        console.warn(error);
      })
    })
  },
  addCredit: function (req) {
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'addCredit',
          data: req
        }
      }).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error);
      })
    })
  },
  delCredit: function (req) {
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'delCredit',
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
