import request from '@/utils/request'

export function get() {
  return request({
    url: 'auth/api/aliPay',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'auth/api/aliPay',
    data,
    method: 'put'
  })
}

// 支付
export function toAliPay(url, data) {
  return request({
    url: 'auth/api/' + url,
    data,
    method: 'post'
  })
}
