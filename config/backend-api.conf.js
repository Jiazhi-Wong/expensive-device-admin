// 本地配好后台环境后，在开发的时候会将下面请求代理到后台的接口，也就是index配置中的dev.proxyTable选项
// 如果没有后台环境，也可以使用mock，在/src/main.js中可以开启
let host = 'localhost';
let port = '8080';
let api = [
    '/login',
    '/user/add',
];
let proxyApi = {};

api.forEach(function(api) {
    proxyApi[api] = 'http://' + host + ':' + port;
});

module.exports = proxyApi;
