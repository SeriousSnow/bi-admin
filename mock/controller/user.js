// 自定义token
const satokens = {
  admin: 'qtcoding gV5DhK9PB9YMjg0QerSdyB5HlBed5gT4',
  editor: 'editor-satoken',
  test: 'test-satoken',
}

module.exports = [
  {
    url: '/publicKey',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: {
          mockServer: true,
          publicKey:
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBT2vr+dhZElF73FJ6xiP181txKWUSNLPQQlid6DUJhGAOZblluafIdLmnUyKE8mMHhT3R+Ib3ssZcJku6Hn72yHYj/qPkCGFv0eFo7G+GJfDIUeDyalBN0QsuiE/XzPHJBuJDfRArOiWvH0BXOv5kpeXSXM8yTt5Na1jAYSiQ/wIDAQAB',
        },
      }
    },
  },
  {
    url: '/login',
    type: 'post',
    response(config) {
      const { username } = config.body
      const satoken = satokens[username]
      if (!satoken) {
        return {
          code: 500,
          msg: '帐户或密码不正确。',
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: { satoken },
      }
    },
  },
  {
    url: '/register',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟注册成功',
      }
    },
  },
  {
    url: '/userInfo',
    type: 'post',
    response(config) {
      const { satoken } = config.body
      let permissions = ['admin']
      let username = 'admin'
      if ('admin-satoken' === satoken) {
        permissions = ['admin']
        username = 'admin'
      }
      if ('editor-satoken' === satoken) {
        permissions = ['editor']
        username = 'editor'
      }
      if ('test-satoken' === satoken) {
        permissions = ['admin', 'editor']
        username = 'test'
      }
      return {
        code: 200,
        msg: 'success',
        data: {
          permissions,
          username,
          'avatar|1': ['https://i.gtimg.cn/club/item/face/img/2/15922_100.gif', 'https://i.gtimg.cn/club/item/face/img/8/15918_100.gif'],
        },
      }
    },
  },
  {
    url: '/logout',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
]
