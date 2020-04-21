import request from '@/utils/request'

/**
 * 组织架构信息
 * @param id
 */
export function org(id) {
  return request({
    url: '/synch/userEmployee/org/' + id,
    method: 'get'
  })
}

/**
 * 组织架构信息 不包含员工信息
 * @param id
 */
export function getOrgExcludeEmployee(id) {
  return request({
    url: '/synch/userEmployee/orgExcludeEmployee/' + id,
    method: 'get'
  })
}

/**
 * 根据 部门Id 获取职位列表
 * @param deptId
 */
export function getJobsByDeptId(deptId) {
  return request({
    url: 'synch/job/getJobByDeptId?deptId='+deptId,
    method: 'get',
    deptId
  })
}
