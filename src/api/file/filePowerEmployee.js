import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/file/file/power/employee',
    method: 'post',
    data
  })
}

export function page(params) {
  return request({
    url: '/file/file/power/employee',
    method: 'get',
    params
  })
}


export function del(id) {
  return request({
    url: '/file/file/power/employee/' + id,
    method: 'delete'
  })
}

