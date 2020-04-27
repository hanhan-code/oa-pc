import request from "@/utils/request";

/**
 * @description 获取评价中接口数据
 */
export function tableEndData(data) {
  return request({
    url: "http://192.168.0.158:9007/project/commented",
    method: "get",
    params: data
  });
}

/**
 * @description 获取评价结束接口数据
 */
export function tableData(data) {
  return request({
    url: "http://192.168.0.158:9007/project/commenting",
    method: "get",
    params: data
  });
}

/**
 * @description 调用评价中操作按钮接口
 */
export function runButton(data) {
  return request({
    url: "http://192.168.0.158:9007/project/comment/status",
    method: "put",
    params: data
  });
}

/**
 * @description 调用评价中操作按钮接口
 */
export function resetData(data) {
  return request({
    url: "http://192.168.0.158:9007/project/comment",
    method: "put",
    params: data
  });
}

/**
 * @description 调用评价结束打印按钮接口
 */
export function printData(data) {
  return request({
    url: "http://192.168.0.158:9007/form/pdf",
    method: "get",
    params: data
  });
}

/**
 * @description 获取评价表接口数据
 */
export function evaluateData(data) {
  return request({
    url: "http://192.168.0.158:9007/form/company",
    method: "get",
    params: data
  });
}

/**
 * @description 获取评价项目接口数据
 */
export function projectData(data) {
  return request({
    url: "http://192.168.0.158:9007/project/comment",
    method: "get",
    params: data
  });
}

/**
 * @description 获取组织架构人员接口数据
 */
// export function companyData(id) {
//   return request({
//     url: "http://192.168.0.158:9007/synch/userEmployee/orgEmployee/" + id,
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
    url: "http://192.168.0.158:9007/project/comment",
    method: "post",
    data: data
  });
}

/**
 * @description 调用评价设置接口
 */
export function setSubmit(data) {
  return request({
    url: "http://192.168.0.158:9007/project/setting",
    method: "post",
    data: data
  });
}
