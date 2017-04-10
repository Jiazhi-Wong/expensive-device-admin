import {LoginUsers} from './mockdata/user'

export default function (data) {
  let isRegister = false;

  for (let user of LoginUsers) {
    if (user.username === data.username) {
      isRegister = true;
      if (user.password === data.password) {
        return {code: 0, msg: '登录成功', data: user}
      } else {
        return {code: -1, msg: '用户名和密码不正确'}
      }
    }
  }

  if (!isRegister) {
    return {code: -2, msg: '该用户不存在'}
  }
}
