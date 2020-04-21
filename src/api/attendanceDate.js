import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/attend/cards/search',
    method: 'post',
    data
  })
}


export function exportExcel(data) {
  return request({
    url: '/attend/cards/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
