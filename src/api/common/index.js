import request from "@/utils/request";

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
