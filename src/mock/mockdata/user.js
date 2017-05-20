import Mock from 'mockjs';

let Users = [];

for (let i = 0; i < 5; i++) {
  Users.push(Mock.mock({
    uid: Mock.mock({
      'wxId': /\d{5}/
    }).wxId * 1,
    wxId: Mock.mock({
      'wxId': /\d{8}/
    }).wxId,
    number: Mock.mock({
      'number': /3113\d{6}/
    }).number,
    name: Mock.Random.cname(),
    // addr: Mock.mock('@county(true)'),
    // 'age|18-60': 1,
    phone: Mock.mock({
      'regexp': /13\d{9}/
    }).regexp,
    email: Mock.Random.email(),
    authority: Mock.mock({
      authorityArr: [1,2,3],
      authority: function () {
        return this.authorityArr.filter(() => Math.random() > 0.5);
      }
    }).authority,
    isAllAuthorityRange: Mock.mock({
      "boolean|1": true
    }).boolean,
    role: Mock.mock({
      "role|1": [1, 2]
    }).role,
    group: Mock.mock({
      "group|1": [1, 2, 3]
    }).group,
    // sex: Mock.Random.integer(0, 1)
  }));
}

// Users = [
//   {
//     uid: 10001,
//     wxId:
//   }
// ]

export {Users};
