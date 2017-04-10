import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '系统管理员'
  }
];

const Users = [];

for (let i = 0; i < 10; i++) {
  Users.push(Mock.mock({
    id: '2017-' + Mock.Random.date('MM-dd') + '-' + Mock.mock({
      'random': /\d{3}/
    }).random,
    name: Mock.Random.cname(),
    // addr: Mock.mock('@county(true)'),
    // 'age|18-60': 1,
    birth: Mock.Random.date(),
    phone: Mock.mock({
      'regexp': /13\d{9}/
    }).regexp,
    email: Mock.Random.email(),
    authority: Mock.mock({
      "authority|1": [
        "领导审核权",
        "管理员审核权",
        "全局浏览",
        "归属浏览"
      ]
    }).authority,
    role: Mock.mock({
      "role|1": [
        "管理员",
        "借用人"
      ]
    }).role,
    // sex: Mock.Random.integer(0, 1)
  }));
}

export {LoginUsers, Users};
