import Mock from 'mockjs';
import login from './login';
import getInitialInfo from './getInitialInfo';
import getUserListPage from './getUserListPage';
import getGroupListPage from './getGroupListPage';
import getCreditListPage from './getCreditListPage';
import getDeviceListPage from './getDeviceListPage';
import getLoanListPage from './getLoanListPage';

export default function () {
  Mock.mock('/ajaxhandler.ashx', function (req) {
    if (req.type === 'POST') {
      let body = JSON.parse(req.body);

      if (body.mode === 'login') {
        return login(body.data);
      } else if (body.mode === 'getInitialInfo') {
        return getInitialInfo();
      } else if (body.mode === 'getUserListPage') {
        return getUserListPage(body.data);
      } else if (body.mode === 'getGroupListPage') {
        return getGroupListPage(body.data);
      } else if (body.mode === 'getCreditListPage') {
        return getCreditListPage(body.data);
      } else if (body.mode === 'getDeviceListPage') {
        return getDeviceListPage(body.data);
      }  else if (body.mode === 'getLoanListPage') {
        return getLoanListPage(body.data);
      }else {
        return {code: 0, msg: '该接口没有mock', data: {}};
      }
    }
  })
};
