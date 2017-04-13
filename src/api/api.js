import base from './base'
import user from './user'
import group from './group'
import device from './device'

let baseUrl = '/ajaxhandler.ashx'
export default Object.assign(
  {},
  base,
  user,
  group,
  device
)
