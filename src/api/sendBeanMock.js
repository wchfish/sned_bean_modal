const newUserMock = {
  "data": {
    "beanCount": 11,
    "userIdentity": 0
  },
  "success": true
}

const oldUserMock = {
  "data": {
    "beanCount": 10,
    "userIdentity": 1
  },
  "success": true
}

const failMock = {
  "message":"达到上限",
  "resultCode":"9004708",
  "resultTips":"达到上限",
  "success":false
}

export {
  newUserMock,
  oldUserMock,
  failMock,
}
