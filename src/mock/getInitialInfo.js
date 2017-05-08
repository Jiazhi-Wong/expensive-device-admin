export default function () {
  let groupOptions = [{
    groupName: '组别1',
    id: 1
  }, {
    groupName: '组别2',
    id: 2
  }, {
    groupName: '组别3',
    id: 3
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

  return {error_code: 0, msg: '请求成功', data: {
    groupOptions,
    deviceAdministrators,
    initialPassword
  }}
}
