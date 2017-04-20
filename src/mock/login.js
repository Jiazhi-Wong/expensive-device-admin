const LoginUsers = [
  {
    uid: 1,
    username: 'admin',
    password: '123456',
    role: 1,
    authority: [1],
  },
  {
    uid: 2,
    username: 'admin2',
    password: '123456',
    role: 1,
    authority: [2],
  },
  {
    uid: 3,
    username: 'admin3',
    password: '123456',
    role: 1,
    authority: [3],
  },
];

export default function (data) {
  let isRegister = false;

  for (let user of LoginUsers) {
    if (user.username === data.username) {
      isRegister = true;
      if (user.password === data.password) {
        let {uid, username, role, authority} = user;
        return {code: 0, msg: '登录成功', data: {uid, username, role, authority}}
      } else {
        return {code: -1, msg: '用户名和密码不正确'}
      }
    }
  }

  if (!isRegister) {
    return {code: -2, msg: '该用户不存在'}
  }
}
