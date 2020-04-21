import request from '@/utils/request'
import Qs from 'qs'

export function page(data) {
  return request({
    url: 'emp/base/search',
    method: 'post',
    data
  })
}

/**
 * 根据 公司主键、员工姓名 模糊查询 远程搜索
 * @param companyId
 * @param employeeName
 */
export function search(companyId, employeeName) {
  return request({
    url: 'emp/base/search/' + companyId + '/' + employeeName,
    method: 'get'
  })
}

/**
 * 根据员工编号查询员工信息
 * @param employeeName
 */
export function infoByNumber(employeeName) {
  return request({
    url: 'emp/base/info/' + employeeName,
    method: 'get'
  })
}

/**
 * 添加员工
 * @param data
 */
export function add(data) {
  return request({
    url: '/emp/base',
    method: 'post',
    data: data
  })
}

/**
 * 获取 生成成员工编号
 * @param companyId
 */
export function generatorNumber(companyId) {
  return request({
    url: '/emp/base/number/' + companyId,
    method: 'get'
  })
}

/**
 * 修改信息
 * @param data
 */
export function edit(data) {
  return request({
    url: '/emp/base',
    method: 'put',
    data
  })
}

/**
 * 删除
 * @param id
 */
export function del(id) {
  return request({
    url: '/emp/base/' + id,
    method: 'delete'
  })
}

/**
 * 批量删除
 * @param ids
 */
export function batchDel(ids) {
  return request({
    url: '/emp/base/batch',
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
    url: '/emp/base/export',
    method: 'get',
    data: Qs.stringify(params),
    responseType: 'blob'
  })
}

/**
 * 导出模版下载
 * @param filename
 */
export function downTemplate(filename) {
  return request({
    url: '/emp/common/down/' + filename,
    method: 'get',
    responseType: 'blob'
  })
}
