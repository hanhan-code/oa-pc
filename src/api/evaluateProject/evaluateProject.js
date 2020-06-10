import request from "@/utils/request";

/**
 * @description 获取评价項目列表接口数据 /assessment /assessment
 */
export function listData(data) {
  return request({
    url: "/assessment/project/mobile/comment/list",
    method: "get",
    params: data,
  });
}

/**
 * @description 获取评价項目下所有表单接口数据
 */
export function formData(data) {
  return request({
    url: "/assessment/form/mobile",
    method: "get",
    params: data,
  });
}

/**
 * @description 获取评价項目列表接口数据
 */
export function formDatas(data) {
  return request({
    url: "/assessment/form/mobile",
    method: "get",
    params: data,
  });
}

/**
 * @description 获取催办项目提交人员信息与提醒消息
 */
export function personData(data) {
  return request({
    url: "/assessment/project/mobile/remind",
    method: "get",
    params: data,
  });
}

/**
 * @description 获取催办项目提交人员信息与提醒消息 详情页面
 */
export function personDatas(data) {
  return request({
    url: "/assessment/project/mobile/remind/item",
    method: "get",
    params: data,
  });
}

/**
 * @description 获取催办项目提交消息接口
 */
export function messageData(data) {
  return request({
    url: "/assessment/message/weChat/sendApplicationMsgByUserIds",
    method: "post",
    data: data,
  });
}

/**
 * @description 获取项目完结数据
 */
export function endData(data) {
  return request({
    url: "/assessment/project/mobile/comment/info",
    method: "get",
    params: data,
  });
}

/**
 * @description 调用项目完结提交接口
 */
export function endSubmit(data) {
  return request({
    url: "/assessment/project/mobile/final/form",
    method: "post",
    data: data,
  });
}

/**
 * @description 获取工程施工准备阶段数据
 */
export function readyData(data) {
  return request({
    url: "/assessment/form/mobile/class/item",
    method: "get",
    params: data,
  });
}

/**
 * @description 调用评价接口
 */
export function evaluateData(data) {
  return request({
    url: "/assessment/form/mobile/item",
    method: "put",
    data: data,
  });
}

/**
 * @description 调用重评接口
 */
export function resetData(data) {
  return request({
    url: "/assessment/form/mobile/reevaluation",
    method: "put",
    data: data,
  });
}

/**
 * @description 调用文件接口
 */
export function fileData(data) {
  return request({
    url: "/assessment/file/file",
    method: "get",
    params: data,
  });
}

/**
 * @description 提交文件接口
 */
export function submitFile(data) {
  return request({
    url: "/assessment/project/mobile/file",
    method: "post",
    data: data,
  });
}

/**
 * @description 删除文件
 */
export function fileDel(data) {
  return request({
    url: `/assessment/project/mobile/file?fileId=${data.fileId}&projectCommentId=${data.projectCommentId}&formClassItemId=${data.formClassItemId}`,
    method: "delete",
  });
}

/**
 * @description 删除文件
 */
export function fileDels(data) {
  return request({
    url: "/file/attachment/remote",
    method: "delete",
    data: data,
  });
}

/**
 * @description 获取组织架构人员信息
 */
export function employeeData(data) {
  return request({
    url: "/emp/base/search/" + data.companyId + "/" + data.employeeName,
    method: "get",
  });
}
