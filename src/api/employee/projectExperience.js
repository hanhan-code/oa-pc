import request from '@/utils/request'


/**
 * 分页查询
 * @param params
 */
export function page(params) {
  return request({
    url: '/emp/project',
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
    url: '/emp/project',
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
    url: '/emp/project',
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
    url: '/emp/project/' + id,
    method: 'delete'
  })
}

/**
 * 批量删除
 * @param ids
 */
export function batchDel(ids) {
  return request({
    url: '/emp/projects',
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
    url: '/emp/projects',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

