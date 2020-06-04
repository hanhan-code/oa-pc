import Cookies from 'js-cookie'
import Config from '@/config'

const TokenKey = Config.TokenKey

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setLoginInfo(res) {
  localStorage.setItem('userId', JSON.stringify(res.data.userId))
  localStorage.setItem('companyId', JSON.stringify(res.data.companyId))
  localStorage.setItem('employeeId', JSON.stringify(res.data.employeeId))
}

export function clearLoginInfo() {
  localStorage.removeItem('userId')
  localStorage.removeItem('companyId')
}

// 获取当前登录用户信息， 防止后台 Long 类型数据 精度丢失

export function getUserId() {
  return JSON.parse(localStorage.getItem('userId'))
}

export function getCompanyId() {
  return JSON.parse(localStorage.getItem('companyId'))
}


export function getEmployeeId() {
  return JSON.parse(localStorage.getItem('employeeId'))
}
