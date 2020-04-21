import request from '@/utils/request'

export function getCompanyList() {
  return request({
    url: 'auth/api/company',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'auth/api/company',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'auth/api/company/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'auth/api/company',
    method: 'put',
    data
  })
}
