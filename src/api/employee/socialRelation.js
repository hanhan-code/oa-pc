import request from '@/utils/request'


/**
 * 分页查询
 * @param params
 */
export function page(params) {
  return request({
    url: '/emp/relation',
    method: 'get',
    params
  })
}


/**
 * 添加
 * @param data
 */
export function add(data) {
  return request({
    url: '/emp/relation',
    method: 'post',
    data
  })
}

/**
 * 修改信息
 * @param data
 */
export function edit(data) {
  return request({
    url: '/emp/relation',
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
    url: '/emp/relation/' + id,
    method: 'delete'
  })
}

/**
 * 批量删除
 * @param ids
 */
export function batchDel(ids) {
  return request({
    url: '/emp/relations',
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
    url: '/emp/relations',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

