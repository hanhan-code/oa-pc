import request from '@/utils/request'

export function get() {
  return request({
    url: 'auth/api/email',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'auth/api/email',
    data,
    method: 'put'
  })
}

export function send(data) {
  return request({
    url: 'auth/api/email',
    data,
    method: 'post'
  })
}
