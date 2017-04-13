import {Groups} from './mockdata/groups'

export default function (req) {
  let {page, pageSize} = req;

  let total = Groups.length;

  let resGroups = Groups.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1))

  return {code: 0, msg: '请求成功', data: {
    total,
    groups: resGroups
  }}
}
