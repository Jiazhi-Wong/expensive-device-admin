import ajax from '@/assets/js/ajax'

let baseUrl = '/ajaxhandler.ashx'
export default {
  getDeviceListPage: function (req) {  // 获取组别列表
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'getDeviceListPage',
          data: req
        }
      }).then(res => {
        resolve(res)
      }).catch(error => {
        console.warn(error);
      })
    })
  },
  updateDevice: function (req) { // 编辑或添加一个组别
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'updateDevice',
          data: req
        }
      }).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error);
      })
    })
  },
  delDevice: function (req) { // 删除某个组别
    return new Promise((resolve, reject) => {
      ajax({
        url: baseUrl,
        data: {
          mode: 'delDevice',
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
