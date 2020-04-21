import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'auth/api/logs/error/' + id,
    method: 'get'
  })
}


export function dataRollBack(routing,param) {
  return request({
    url: "/" + routing + '/logCore/dataRollBack',
    method: 'post',
    data: param
  })
}
