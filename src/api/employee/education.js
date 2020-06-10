import request from '@/utils/request'
import Qs from 'qs'


/**
 * 分页查询
 * @param params
 */
export function page(params) {
  return request({
    url: '/emp/education',
    method: 'get',
    params
  })
}

/**
 * 获取学历信息
 * @param id
 */
export function info(id) {
  return request({
    url: '/emp/education/' + id,
    method: 'get',
  })
}

/**
 * 添加员工
 * @param data
 */
export function add(data) {
  return request({
    url: '/emp/education',
    method: 'post',
    data: data
  })
}

/**
 * 修改信息
 * @param data
 */
export function edit(data) {
  return request({
    url: '/emp/education',
    method: 'put',
    data: data
  })
}

/**
 * 删除
 * @param id
 */
export function del(id) {
  return request({
    url: '/emp/education/' + id,
    method: 'delete'
  })
}

/**
 * 批量删除
 * @param ids
 */
export function batchDel(ids) {
  return request({
    url: '/emp/educations',
    method: 'delete',
    data: ids
  })
}

/**
 * 导出
 * @param params
 */
export function exportExcel(params) {
  return request({
    url: '/emp/educations',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

