import vm from '@/main';
import axios from 'axios';

// 全局配置，API参考：https://github.com/mzabriskie/axios
// axios.defaults.baseURL = 'http://localhost:6060';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

/**
 * 通用的ajax方法
 * @param method {String} 'get' / 'post'
 * @param url {String} 请求的url
 * @param data {Object} 请求数据
 * @param successMsg {String} 成功的提示，没有就不提示
 */
function ajax({method, url, data, successMsg}) {
  method = method || 'post';  // 默认为post

  if (!url) {
    vm.$notify({
      title: '警告',
      message: '请求被驳回，请传入请求url！',
      type: 'warning',
      duration: 3000
    });

    return;
  }

  let args = {
    method: method,
    url: url
  };

  // 区别method处理参数，post只能用data，get只能用params
  method = method.toLowerCase();
  if (method === 'post') {
    args.data = data;
  } else if (method === 'get') {
    args.params = data;
  } else {
    args.data = data;
  }

  return axios(args)
    .then(function (response) {
      return new Promise((resolve, reject) => {
        if (response.data.error_code === 0) {
          if (!!successMsg) {
            vm.$notify({
              title: '成功',
              message: successMsg,
              type: 'success',
              duration: 3000
            });
          }
          resolve(response.data);
        } else {
          vm.$notify({
            title: '错误',
            message: response.data.msg,
            type: 'error',
            duration: 3000
          });
          reject(response.data);
        }
      });
    }, function (response) {
      return new Promise((resolve, reject) => {
        vm.$notify({
          title: '失败',
          message: response.message,
          type: 'error',
          duration: 4000
        });
        reject(response);
      })
    })
}

export default ajax;
