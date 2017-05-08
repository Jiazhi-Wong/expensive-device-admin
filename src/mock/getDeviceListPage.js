import {Devices} from './mockdata/devices'

export default function (req) {
  let {page, pageSize} = req;

  let total = Devices.length;

  let resDevices = Devices.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1))

  return {error_code: 0, msg: '请求成功', data: {
    total,
    devices: resDevices
  }}
}
