import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/auth/api/users',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'auth/api/users/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'auth/api/users',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: user.oldPass,
    newPass: user.newPass
  }
  return request({
    url: 'auth/api/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(code, data) {
  return request({
    url: 'auth/api/users/updateEmail/' + code,
    method: 'post',
    data
  })
}

