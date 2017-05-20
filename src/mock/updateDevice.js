import {Devices} from './mockdata/devices'

export default function (req) {
  let {id} = req;

  if (id == 0) {
    Devices.push(req);
  }

  return {error_code: 0, msg: '请求成功'}
}
