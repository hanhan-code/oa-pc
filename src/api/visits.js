import request from '@/utils/request'

export function count() {
  return request({
    url: 'auth/api/visits',
    method: 'post'
  })
}

export function get() {
  return request({
    url: 'auth/api/visits',
    method: 'get'
  })
}

export function getChartData() {
  return request({
    url: 'auth/api/visits/chartData',
    method: 'get'
  })
}
