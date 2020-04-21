import request from '@/utils/request'

export function resetEmail(data) {
  return request({
    url: 'auth/api/code/resetEmail',
    method: 'post',
    data
  })
}

export function updatePass(pass) {
  return request({
    url: 'auth/api/users/updatePass/' + pass,
    method: 'get'
  })
}
