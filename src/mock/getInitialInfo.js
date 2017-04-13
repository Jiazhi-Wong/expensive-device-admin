export default function () {
  let groupOptions = [{
    name: '组别1',
    value: 1
  }, {
    name: '组别2',
    value: 2
  }, {
    name: '组别3',
    value: 3
  }];

  let initialPassword = '12345678';

  return {code: 0, msg: '请求成功', data: {
    groupOptions, initialPassword
  }}
}
