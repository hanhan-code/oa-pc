import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/attend/attendances/search',
    method: 'post',
    data
  })
}

export function companyInfo(id) {
  return request({
    url: '/synch/userEmployee/org/' + id,
    method: 'get'
  })
}

/**
 * 修改考勤记录状态
 * @param data
 */
export function updateStatus(data) {
  return request({
    url: '/attend/attendances/status',
    method: 'put',
    data: data
  })
}


export function exportExcel(data) {
  return request({
    url: '/attend/attendances/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}


