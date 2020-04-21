import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/attend/monthly/search',
    method: 'post',
    data
  })
}

export function exportExcel(data) {
  return request({
    url: '/attend/monthly/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
