import request from '@/utils/request'

export function get() {
  return request({
    url: 'auth/api/genConfig',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'auth/api/genConfig',
    data,
    method: 'put'
  })
}
