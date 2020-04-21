import request from '@/utils/request'

export function del(id) {
  return request({
    url: 'auth/api/pictures/' + id,
    method: 'delete'
  })
}

export function delAll(ids) {
  return request({
    url: 'auth/api/pictures/',
    method: 'delete',
    data: ids
  })
}
