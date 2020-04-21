import request from "@/utils/request";

/**
 * @description 获取评价中接口数据
 */
export function tableEndData(data) {
  return request({
    url: "project/commented",
    method: "get",
    params: data
  });
}

/**
 * @description 获取评价结束接口数据
 */
export function tableData(data) {
  return request({
    url: "project/commenting",
    method: "get",
    params: data
  });
}

/**
 * @description 调用评价中操作按钮接口
 */
export function runButton(data) {
  return request({
    url: "project/comment",
    method: "put",
    params: data
  });
}

/**
 * @description 调用评价结束操作按钮接口
 */
export function endButton(data) {
  return request({
    url: "project/comment",
    method: "put",
    params: data
  });
}

/**
 * @description 获取评价表接口数据
 */
export function evaluateData(data) {
  return request({
    url: "form/project",
    method: "get",
    params: data
  });
}

/**
 * @description 获取组织架构人员接口数据
 */
// export function companyData(id) {
//   return request({
//     url: "synch/userEmployee/orgEmployee/" + id,
//     method: "get",
//   });
// }
export function companyData(id) {
  return request({
    url: "http://oa.jsztgj.com:9999/synch/userEmployee/orgEmployee/" + id,
    method: "get"
  });
}

/**
 * @description 调用创建评价项接口
 */
export function creatSubmit(data) {
  return request({
    url: "project/comment",
    method: "post",
    data: data
  });
}
