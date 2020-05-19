<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-tools">
      <!-- 搜索按钮 -->
      <el-button size="small" type="primary">
        <router-link to="/evaluates/evaluateWait">返回上一级</router-link>
      </el-button>
      <el-button size="small" type="success" @click="getData">{{query.formName}}</el-button>
    </div>
    <br />
    <!-- 数据内容 -->
    <div class="table-content" ref="tableContent">
      <div class="content" style="margin-top: 10px;">
        <el-table
          size="small"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="formClassId"
          type="expand"
        >
          >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <read-repeat :query="query" :params="scope.row" @doRest="doRest"></read-repeat>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="name" label="表的分类" align="center"></el-table-column>
          <el-table-column label="评价类状态" align="center">
            <template slot-scope="scope">
              <div v-show="scope.row.commentStatus === 0">未评审完成</div>
              <div v-show="scope.row.commentStatus === 1">评审完成</div>
            </template>
          </el-table-column>
          <el-table-column label="提交状态" align="center">
            <template slot-scope="scope">
              <div v-show="scope.row.submitStatus === 0">存在未提交</div>
              <div v-show="scope.row.submitStatus === 1">提交完成</div>
            </template>
          </el-table-column>
          <el-table-column prop="noCommentNum" label="暂未评审项的个数" align="center"></el-table-column>
          <el-table-column prop="noSubmitNum" label="暂未提交项的个数" align="center"></el-table-column>
          <el-table-column prop="totalChildNum" label="评价子项总数" align="center"></el-table-column>
        </el-table>
      </div>
    </div>

    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import readRepeat from '@/views/evaluateProject/readRepeat'
import { getCompanyId, getEmployeeId } from '@/utils/auth'
import {
  readyData,
  personDatas,
  evaluateData,
  resetData,
  fileData,
  fileDel,
  fileDels,
  submitFile
} from "@/api/evaluateProject/evaluateProject";


export default {
  name: 'ready',
  mixins: [initDict],
  components: { readRepeat },
  data () {
    return {
      screenLoading: false,           // 全局加载
      remindProp: false,
      activeName: '0',                // 被激活的 tabBar标签
      tableHeight: null,              // 表格最大高度
      query: {},
      evaluateList: [],
      tableData: [],                  // 表格数据
      pageParams: {
        formId: null,               // 分页查询参数
        projectCommentId: null  // 评价项目提交id
      },
    }
  },
  created () {
    this.doCreat()
  },
  computed: {
    // 获取页面高度
    getHeight () {
      let _this = this
      let clientHeight = _this.$refs.tableContent.clientHeight
      return clientHeight + 'px'
    }
  },
  mounted () {
    this.tableHeight = this.getHeight
  },
  methods: {
    // 初始化
    doCreat () {
      let query = this.$route.query
      this.query = query
      this.pageParams.projectCommentId = query.projectCommentId
      this.pageParams.formId = query.formId
      this.getData()
    },
    // 获取评价中表格数据
    getData () {
      let params = this.pageParams
      this.screenLoading = true
      readyData(params).then(res => {
        this.screenLoading = false
        if (res.code === 0) {
          res.data.forEach(p => {
            if (p.childList) {
              p.childList.forEach(list => {
                list.flag = false
                if (!list.formClassItemList || list.formClassItemList.length === 0) {
                  list.show = false
                } else {
                  list.show = true
                }
                list.first = list.formClassItemList.some(sort => sort.fileList.length > 0 && sort.status === 0)
                list.second = list.formClassItemList.some(sort => sort.fileList.length === 0 && sort.status === 0)
                list.formClassItemList.forEach(item => {
                  item.formId = list.formId
                  item.formClassId = list.formClassId
                })
              })
            } else {
              p.flag = false
              if (!p.formClassItemList || p.formClassItemList.length === 0) {
                p.show = false
              } else {
                p.show = true
                p.first = p.formClassItemList.every(sort => sort.fileList.length > 0 && sort.status === 0)
                p.second = p.formClassItemList.every(sort => sort.fileList.length === 0 && sort.status === 0)
              }
              p.formClassItemList.forEach(item => {
                item.formId = p.formId
                item.formClassId = p.formClassId
              })
              p.childList = [
                {
                  formClassId: p.formClassId,
                  formId: p.formId,
                  formClassItemList: p.formClassItemList,
                  fullScore: p.fullScore,
                  name: p.name,
                  show: p.show,
                  flag: p.flag,
                  totalChildNum: p.totalChildNum,
                }
              ]
            }
          })
          this.doConcat(res.data)
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 数据排序
    doConcat (data) {
      data.forEach((p, i, arr) => {
        p.first = p.childList.some(list => list.first)
        p.second = p.childList.some(list => list.second)
      })
      let firstList = data.filter(p => p.first)
      let secondList = data.filter(p => !p.first && p.second)
      let thirdList = data.filter(p => !p.first && !p.second)
      // this.list.push(...data)
      this.tableData = [].concat(firstList, secondList, thirdList)
    },
    // 子组件返回
    doRest () {
      this.getData()
    },
  }
}
</script>
<style scoped>
.app-container {
  width: 100%;
  padding: 20px;
  height: 100%;
  position: absolute;
}

.table-content {
  height: calc(100% - 70px);
}
</style>

