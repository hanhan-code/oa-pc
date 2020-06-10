import request from '@/utils/request'
import Qs from 'qs'

/**
 * 组织架构
 * @param params
 */
export function org(params) {
  return request({
    url: '/emp/job/all',
    method: 'get'
  })
}
