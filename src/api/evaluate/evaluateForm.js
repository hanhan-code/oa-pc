import request from "@/utils/request";
//  评价表页面接口
/**
 * @description 获取评价表接口数据
 */
export function tableData(data) {
  return request({
    url: "form/company",
    method: "get",
    params: data
  });
}

/**
 * @description 调用评价表复制按钮接口
 */
export function copyButton(data) {
  return request({
    url: "project/commented",
    method: "get",
    params: data
  });
}

/**
 * @description 调用创建评价表提交接口
 */
export function creatSubmit(data) {
  return request({
    url: "form",
    method: "post",
    data: data
  });
}

// 评价表内容管理页面接口

/**
 * @description 获取评价表内容树结构数据
 */
export function treeList(data) {
  return request({
    url: "form/class",
    method: "get",
    params: data
  });
}

/**
 * @description 获取评价表分页接口数据
 */
export function formData(data) {
  return request({
    url: "form/class/item",
    method: "get",
    params: data
  });
}

/**
 * @description 调用评价表添加考评项接口
 */
export function formAdd(data) {
  return request({
    url: "form/class/item",
    method: "post",
    data: data
  });
}

/**
 * @description 调用评价表修改考评项接口
 */
export function formEdit(data) {
  return request({
    url: "form/item",
    method: "put",
    data: data
  });
}

/**
 * @description 调用评价表删除考评项接口
 */
export function formDelete(data) {
  return request({
    url: "form/class/item",
    method: "delete",
    data: data
  });
}

/**
 * @description 调用评价查看添加考评项接口
 */
export function formDetail(id) {
  return request({
    url: "form/item/detail/" + id,
    method: "get"
  });
}

/**
 * @description 调用评价表树结构添加子类接口
 */
export function treeAdd(data) {
  return request({
    url: "form/class",
    method: "post",
    data: data
  });
}

/**
 * @description 调用评价表树结构添加子类接口
 */
export function treeEdit(data) {
  return request({
    url: "form/class",
    method: "put",
    data: data
  });
}

/**
 * @description 调用评价表树结构添加子类接口
 */
export function treeDele(data) {
  return request({
    url: "form/class",
    method: "delete",
    data: data
  });
}
