import {Users} from './mockdata/user'

export default function (req) {
  let {uid} = req;

  if (uid == 0) {
    Users.push(req);
  }

  return {error_code: 0, msg: '请求成功'}
}
