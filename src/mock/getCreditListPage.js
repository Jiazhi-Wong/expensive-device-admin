let creditItem = {
  id: 1234,
  type: 2,
  score: 5,
  message: '按时完好归还',
  loanId: 123456
}

let CreditList = []

for (let i = 0; i < 15; i++) {
  CreditList.push(creditItem);
}

export default function (req) {
  let {page, pageSize} = req;

  let total = CreditList.length;

  let resCreditList = CreditList.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1))

  return {error_code: 0, msg: '请求成功', data: {
    total,
    creditList: resCreditList
  }}
}
