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

  let deviceAdministrators = [{
    name: '设备管理员1',
    uid: 111
  }, {
    name: '设备管理员2',
    uid: 222
  }, {
    name: '设备管理员3',
    uid: 333
  }];

  let initialPassword = '12345678';

  return {code: 0, msg: '请求成功', data: {
    groupOptions,
    deviceAdministrators,
    initialPassword
  }}
}
