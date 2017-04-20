export default {
  loan: {
    statusOptions: [
      {
        label: '待管理员审核',
        value: 1
      },
      {
        label: '待领导审核',
        value: 2
      },
      {
        label: '待约定时间取设备',
        value: 3
      },
      {
        label: '使用中',
        value: 4
      },
      {
        label: '超期未归还',
        value: 5
      },
      {
        label: '续期申请待审核',
        value: 6
      },
      {
        label: '续期使用中',
        value: 7
      },
      {
        label: '已归还',
        value: 8
      },
      {
        label: '已取消',
        value: 9
      },
    ]
  },
  device: {
    statusOptions: [
      {
        label: '正常',
        value: 1
      },
      {
        label: '待修',
        value: 2
      },
      {
        label: '维修中',
        value: 3
      },
      {
        label: '报废',
        value: 4
      },
      {
        label: '闲置',
        value: 5
      }
    ]
  }
}
