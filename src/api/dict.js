import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'auth/api/dict',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'auth/api/dict/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'auth/api/dict',
    method: 'put',
    data
  })
}
