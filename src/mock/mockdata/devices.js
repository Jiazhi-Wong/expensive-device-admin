import Mock from 'mockjs';

const Devices = [];

for (let i = 0; i < 35; i++) {
  Devices.push(Mock.mock({
    id: Mock.mock({
      'id': /\d{5}/
    }).id * 1,
    deviceName: Mock.Random.ctitle(5),
    administrator: Mock.mock({
      "admin|1": [111, 222, 333]
    }).admin,
    location: Mock.Random.city(),
    price: Mock.mock({
      "number|1-100": 100
    }).number,
    status: Mock.mock({
      "status|1": [1, 2, 3, 4, 5]
    }).status,
  }));
}

export {Devices};
