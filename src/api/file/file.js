import request from "@/utils/request";
import Qs from "qs";

export function addFolder(data) {
  return request({
    url: "/file/folder",
    method: "post",
    data
  });
}

export function filePage(params) {
  return request({
    url: "/file/files",
    method: "get",
    params
  });
}

export function fullPage(params) {
  return request({
    url: "/file/file/search",
    method: "get",
    params
  });
}

export function addFile(params) {
  return request({
    url: "/file/file",
    method: "post",
    params
  });
}

/**
 * 权限校验
 * @param params
 */
export function fileAuth(ids, power) {
  return request({
    url: "/file/file/auth/" + power,
    method: "post",
    data: ids
  });
}

/**
 * 重名文件校验
 * @param params
 */
export function checkDupFileName(data) {
  return request({
    url: "/file/duplicate",
    method: "post",
    data: data
  });
}

export function secondAddFile(params) {
  return request({
    url: "/file/file/md5",
    method: "post",
    data: params
  });
}

export function rename(params) {
  return request({
    url: "/file/file",
    method: "put",
    data: params
  });
}

/**
 * 树结构数据
 * @param params
 */
export function tree(data) {
  return request({
    url: "/file/file/tree",
    method: "get",
    params: data
  });
}

/**
 * 移动
 * @param params
 */
export function move(data) {
  return request({
    url: "/file/file/move",
    method: "put",
    data: data
  });
}

export function preview(id) {
  return request({
    url: "/file/file/" + id,
    method: "get"
  });
}

export function deleteByIds(ids) {
  return request({
    url: "/file/files",
    method: "delete",
    data: ids
  });
}

/**
 * 下载
 * @param params
 */
export function fileDownload(id) {
  return request({
    url: "/file/files/down?id=" + id,
    method: "get",
    responseType: "blob"
  });
}

export function fileTree(params) {
  return request({
    url: "/file/file/tree",
    method: "get",
    params
  });
}
