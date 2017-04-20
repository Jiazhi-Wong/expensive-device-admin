import Mock from 'mockjs';

const Loans = [];

for (let i = 0; i < 55; i++) {
  Loans.push(Mock.mock({
    loanId: Mock.mock({
      'wxId': /\d{5}/
    }).wxId * 1,
    device: Mock.Random.ctitle(5),
    status: Mock.mock({
      "status|1": [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }).status,
    loaner: Mock.Random.cname(),
    phone: Mock.mock({
      'regexp': /13\d{9}/
    }).regexp,
    email: Mock.Random.email(),
    loanTime: Mock.mock({
      loanTime: new Date(new Date().getTime() - Math.floor(Math.random() * 300000000)).getTime()
    }).loanTime,
    returnTime: Mock.mock({
      returnTime: new Date(new Date().getTime() + Math.floor(Math.random() * 300000000)).getTime()
    }).returnTime,
    realReturnTime: Mock.mock({
      realReturnTime: new Date(new Date().getTime() + Math.floor(Math.random() * 200000000)).getTime()
    }).realReturnTime,
  }));
}

export {Loans};
