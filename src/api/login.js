import request from '@/utils/request'
//登录
export function login(data) {
  return request({
    url: 'user/auth/login',
    method: 'post',
    data
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
    url: `/message/sms/code?phone=${data.phone}&templateType=${data.templateType}`,
    method: 'get',
    data
  })
}

//手机号码登录
export function codeIN(phone, code) {
  return request({
    url: '/user/auth/phone',
    method: 'post',
    data: {
      phone,
      code
    }
  })
}
//我的公司列表
export function myCompany(min) {
  const params = {
    pageNum: min.pageNum,
    pageSize: min.pageSize,
    userId: min.userId,
    keyword: min.keyword
  }
  return request({
    url: 'user/company/mine',
    method: 'get',
    params
  })
}


// 切换公司-认证信息
export function toSwitch(id) {
  return request({
    url: 'user/auth/company/switch?companyId=' + id,
    method: 'get',
  })
}

//获取公司应用
export function toWeb(id) {
  return request({
    url: 'user/app/web',
    method: 'get',
  })
}