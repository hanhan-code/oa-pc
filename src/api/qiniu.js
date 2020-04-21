import request from '@/utils/request'

export function get() {
  return request({
    url: 'auth/api/qiNiuConfig',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'auth/api/qiNiuConfig',
    data,
    method: 'put'
  })
}

export function del(id) {
  return request({
    url: 'auth/api/qiNiuContent/' + id,
    method: 'delete'
  })
}

export function download(id) {
  return request({
    url: 'auth/api/qiNiuContent/download/' + id,
    method: 'get'
  })
}

export function sync() {
  return request({
    url: 'auth/api/qiNiuContent/synchronize',
    method: 'post'
  })
}

export function delAll(ids) {
  return request({
    url: 'auth/api/qiNiuContent/',
    method: 'delete',
    data: ids
  })
}
