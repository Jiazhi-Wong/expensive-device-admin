import {Users} from './mockdata/user'

export default function (req) {
  let {page, pageSize} = req;

  let total = Users.length;

  let resUsers = Users.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1))

  return {code: 0, msg: '请求成功', data: {
    total,
    users: resUsers
  }}
}
