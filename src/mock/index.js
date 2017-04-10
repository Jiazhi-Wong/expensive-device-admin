import Mock from 'mockjs';
import login from './login';

export default function () {
  Mock.mock('/ajaxhandler.ashx', function (req) {
    if (req.type === 'POST') {
      let body = JSON.parse(req.body);

      if (body.mode === 'login') {
        return login(body.data);
      }

    }
  })
};
