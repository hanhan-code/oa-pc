import request from '@/utils/request'

export function get(name) {
  return request({
    url: 'emp/dict/detail?name=' + name,
    method: 'get'
  })
}

export function getDictMap(names) {
  return request({
    url: 'emp/dict/details?names=' + names,
    method: 'get'
  })
}

