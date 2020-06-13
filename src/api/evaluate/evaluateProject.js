import request from "@/utils/request";

/**
 * @description 获取评价中接口数据
 */
export function tableEndData(data) {
  return request({
    url: "/assessment/project/commented",
    method: "get",
    params: data
  });
}

/**
 * @description 获取评价结束接口数据
 */
export function tableData(data) {
  return request({
    url: "/assessment/project/commenting",
    method: "get",
    params: data
  });
}

/**
 * @description 调用评价中操作按钮接口
 */
export function runButton(data) {
  return request({
    url: "/assessment/project/comment/status",
    method: "put",
    params: data
  });
}

/**
 * @description 调用评价中操作按钮接口
 */
export function resetData(data) {
  return request({
    url: "/assessment/project/comment",
    method: "put",
    params: data
  });
}

/**
 * @description 调用评价结束打印按钮接口
 */
export function printData(data) {
  return request({
    url: "/assessment/form/pdf",
    method: "get",
    params: data
  });
}

/**
 * @description 获取评价表接口数据
 */
export function evaluateData(data) {
  return request({
    url: "/assessment/form/company",
    method: "get",
    params: data
  });
}

/**
 * @description 获取评价项目接口数据
 */
export function projectData(data) {
  return request({
    url: "/assessment/project/comment",
    method: "get",
    params: data
  });
}

/**
 * @description 获取组织架构人员接口数据
 */
// export function companyData(id) {
//   return request({
//     url: "/assessment/synch/userEmployee/orgEmployee/" + id,
//     method: "get",
//   });
// }
export function companyData(data) {
  return request({
    url: "/emp/dept/org",
    method: "get",
    params: data
  });
}

/**
 * @description 调用创建评价项接口
 */
export function creatSubmit(data) {
  return request({
    url: "/assessment/project/comment",
    method: "post",
    data: data
  });
}

/**
 * @description 更新评价項目接口数据 /assessment /assessment
 */
export function detailProject(id) {
  return request({
    url: "/assessment/project/" + id,
    method: "get"
  });
}

/**
 * @description 更新评价項目接口数据 /assessment /assessment
 */
export function editProject(data) {
  return request({
    url: "/assessment/project/comment/info",
    method: "put",
    data: data
  });
}
/**
 * @description 调用评价设置接口
 */
export function setSubmit(data) {
  return request({
    url: "/assessment/project/setting",
    method: "post",
    data: data
  });
}

/**
 * @description 获取评价设置接口数据
 */
export function setData(data) {
  return request({
    url: "/assessment/project/setting",
    method: "get",
    params: data
  });
}
