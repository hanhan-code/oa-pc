import request from '@/utils/request'
import Qs from 'qs'

export function add(data) {
  return request({
    url: '/file/group',
    method: 'post',
    data
  })
}

export function groupPage(params) {
  return request({
    url: '/file/groups',
    method: 'get',
    params
  })
}


export function info(id) {
  return request({
    url: '/file/group/' + id,
    method: 'get'
  })
}



export function delGroup(id) {
  return request({
    url: '/file/group/' + id,
    method: 'delete'
  })
}


export function edit(data) {
  return request({
    url: '/file/group',
    method: 'put',
    data
  })
}

