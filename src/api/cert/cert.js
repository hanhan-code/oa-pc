import request from '@/utils/request'

/**
 * 分页查询
 * use params instead of data
 * 用 params 代替 data, 后台才能使用 get 请求方式接收映射参数
 * @param params
 */
export function page(params) {
  return request({
    url: '/file/cert/admin',
    method: 'get',
    params
  })
}


/**
 * 获取信息
 * @param id
 */
export function info(id) {
  return request({
    url: '/file/cert/' + id,
    method: 'get',
  })
}


/**
 * 审核功能
 * @param id  记录主键
 * @param status 状态
 */
export function audit(data) {
  return request({
    url: '/file/cert/audit',
    method: 'put',
    data: data
  })
}


/**
 * 借阅
 */
export function borrowCert(data) {
  return request({
    url: '/file/cert/borrow',
    method: 'put',
    data: data
  })
}


/**
 * 归还
 */
export function returnCert(data) {
  return request({
    url: '/file/cert/return',
    method: 'put',
    data: data
  })
}


