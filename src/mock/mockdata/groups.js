import Mock from 'mockjs';

const Groups = [];

for (let i = 0; i < 25; i++) {
  Groups.push(Mock.mock({
    id: Mock.mock({
      'wxId': /\d{5}/
    }).wxId * 1,
    groupName: Mock.Random.ctitle(5),
    teacher: Mock.Random.cname(),
    linkman: Mock.Random.cname(),
    phone: Mock.mock({
      'regexp': /13\d{9}/
    }).regexp,
    creditScore: Mock.mock({
      "score|1-100": 100
    }).score,
  }));
}

export {Groups};
