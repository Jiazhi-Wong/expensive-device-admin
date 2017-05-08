import {Loans} from './mockdata/loans'

export default function (req) {
  let {page, pageSize} = req;

  let total = Loans.length;

  let resLoans = Loans.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1))

  return {error_code: 0, msg: '请求成功', data: {
    total,
    loanList: resLoans
  }}
}
