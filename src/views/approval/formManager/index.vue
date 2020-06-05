<template >
  <div class="formManager">
    <!-- <el-row :gutter="20">
      <el-col :span="6" v-for="name in showList">
        <div>{{name.name}}</div>
      </el-col>
    </el-row> -->
  </div>
</template>
<script>
export default {
  name: 'index',  //表单管理
  data() {
    return {
      showList: [
        {
          id: "0",
          name: "新建分类",
          icon: "http://bdtest.jsztgj.com:8081/img/wdsp.7175f854.svg",
          mome: ""
        }, {
          id: "1",
          name: "出勤休假",
          icon: "http://bdtest.jsztgj.com:8081/img/qjsq.ef5db21a.svg",
          mome: ""
        },
        {
          id: "2",
          name: "财务",
          icon: "http://bdtest.jsztgj.com:8081/img/fysq.ca3489e4.svg",
          mome: ""
        },
        {
          id: "3",
          name: "综合",
          icon: "http://bdtest.jsztgj.com:8081/img/ycsq.203d0953.svg",
          mome: ""
        },
        {
          id: "4",
          name: "通用",
          icon: "http://bdtest.jsztgj.com:8081/img/tysq.543d9f61.svg",
          mome: ""
        }
      ]
    }
  }
}
</script>
<style scoped>
.formManager {
  width: 100%;
  height: 100%;
  padding: 20px;
}
.el-col div {
  border: 1px solid #a7a7a7;
}
</style>

