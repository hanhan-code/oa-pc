import request from '@/utils/request'
//登录
export function login(username,password) {
  return request({
    url: 'auth/auth/login',
    method: 'post',
    data:{
      username,
      password
    }
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: 'auth/auth/info',
    method: 'get'
  })
}

//切换公司
export function changeCompany(companyId) {
  return request({
    url: 'auth/auth/changeCompany',
    method: 'post',
    data: {
      companyId
    }
  })
}
//发送验证码
export function sendVerificationCode(data) {
  return request({
    url: 'auth/auth/sendVerificationCode',
    method: 'post',
    data
  })
}

//手机号码登录
export function codeIN(phone,code) {
  return request({
    url: 'auth/auth/phone/code',
    method: 'post',
    data:{
      phone,
      code
    }
  })
}
