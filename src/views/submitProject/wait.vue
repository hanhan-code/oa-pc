<template>
  <div class="app-container" id="app-container">
    <!-- 工具栏 -->
    <div class="head-tools">
      <!-- 搜索框 评价名称 -->
      <el-input
        clearable
        placeholder="请输入名称"
        v-model="pageParams.keyWord"
        size="small"
        style="width: 180px;margin-right: 10px"
        class="filter-item"
      />
      <!-- 搜索按钮 -->
      <el-button size="small" type="success" icon="el-icon-search" @click="doSearch(0)">搜索</el-button>
      <el-button size="small" type="primary">
        <router-link to="/submit/submitProject">返回上一级</router-link>
      </el-button>
    </div>
    <br />
    <!-- 数据内容 -->
    <div class="table-content">
      <el-tag>完成进度: {{statusOption.process}}</el-tag>&nbsp;&nbsp;&nbsp;
      <el-tag type="info">得分率: {{statusOption.scoreRate}}</el-tag>&nbsp;&nbsp;&nbsp;
      <el-tag type="danger">评定: {{statusOption.level}}</el-tag>
      <br />
      <div class="content" style="margin-top: 10px;">
        <el-table size="small" :data="tableData" :max-height="600" border v-if="query.status === 3">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="formName" label="表单名称" align="center"></el-table-column>
          <el-table-column label="完成情况" align="center">
            <template slot-scope="scope">{{scope.row.commentNum}}/{{scope.row.allCommentNum}}</template>
          </el-table-column>
          <el-table-column label="评分得分" align="center">
            <template slot-scope="scope">{{scope.row.score}}/{{scope.row.fullScore}}</template>
          </el-table-column>
          <el-table-column label="评价扣分" align="center">
            <template slot-scope="scope">{{scope.row.fullScore - scope.row.score}}分</template>
          </el-table-column>
          <el-table-column label="扣分" align="center">
            <template slot-scope="scope">{{scope.row.deductImportantNum}}项</template>
          </el-table-column>
          <el-table-column label="结束时间" align="center">
            <template slot-scope="scope">{{dateTime(scope.row.dateTime)}}</template>
          </el-table-column>
          <el-table-column width="300" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-show="query.status !== 1 && query.status !== 3"
                @click="doEndButton(scope.row,1)"
                plain
                size="mini"
              >待评价</el-button>
              <el-button
                type="primary"
                v-show="query.status === 3"
                @click="doEndButton(scope.row,1)"
                plain
                size="mini"
              >详情</el-button>
              <span v-show="query.status === 1">已暂停评价</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table size="small" :data="tableData" :max-height="600" border v-else>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="formName" label="表单名称" align="center"></el-table-column>
          <el-table-column label="完成情况" align="center">
            <template slot-scope="scope">{{scope.row.commentNum}}/{{scope.row.allCommentNum}}</template>
          </el-table-column>
          <el-table-column label="评分得分" align="center">
            <template slot-scope="scope">{{scope.row.score}}/{{scope.row.fullScore}}</template>
          </el-table-column>
          <el-table-column label="结束时间" align="center">
            <template slot-scope="scope">{{dateTime(scope.row.dateTime)}}</template>
          </el-table-column>
          <el-table-column width="300" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-show="query.status !== 1 && query.status !== 3"
                @click="doWait(scope.row)"
                plain
                size="mini"
              >待评价</el-button>
              <el-button
                type="primary"
                v-show="query.status === 3"
                @click="doWait(scope.row)"
                plain
                size="mini"
              >详情</el-button>
              <span v-show="query.status === 1">已暂停评价</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <br />

      <!-- 底部工具 -->
      <div class="footer" style="margin-bottom: 20px">
        <!--分页组件-->
        <el-pagination
          style="margin-top: 8px;"
          @size-change="doSizeChange"
          @current-change="doPageChange"
          :current-page="pageParams.pageNum"
          :total="pageData.total"
          layout="total, prev, pager, next, sizes"
        />
      </div>
    </div>
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import { getCompanyId, getEmployeeId } from '@/utils/auth'
import { formData, personData } from '@/api/evaluateProject/evaluateProject'


export default {
  name: 'remind',
  mixins: [initDict],
  data () {
    return {
      screenLoading: false,           // 全局加载
      remindProp: false,
      activeName: '0',                // 被激活的 tabBar标签
      tableHeight: null,              // 表格最大高度
      query: {},
      evaluateList: [],
      tableData: [],                  // 表格数据
      pageData: {                     // 分页查询返回数据
        data: [],                     // 列表数据
        total: 10                     // 查询总数
      },
      statusOption: {
        level: '未知',
        process: '0%',
        scoreRate: '0%'
      }, // 主页数据展示列表
      pageParams: {                   // 分页查询参数
        pageNum: 1,
        pageSize: 10,
        keyWord: '',
        projectCommentId: null  // 评价项目提交id
      },
    }
  },
  created () {
    this.doSearch(1)
    this.doCreat()
  },
  computed: {
    dateTime () {
      let _this = this
      return function (value) {
        if (value) {
          return _this.$moment(value.dateTime).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    // 初始化
    doCreat () {
      let query = this.$route.query
      this.query = query
      this.pageParams.projectCommentId = query.projectCommentId
    },
    // 查询表格数据
    doSearch (num, size = 10) {
      this.pageParams.pageNum = num
      this.pageParams.pageSize = size
      this.getData()
    },
    // 获取评价中表格数据
    getData () {
      let params = this.pageParams
      this.screenLoading = true
      formData(params).then(res => {
        this.screenLoading = false
        if (res.code === 0) {
          let data = res.data
          this.tableData = data.formList.records
          this.pageData.total = Number(data.formList.total)
          this.statusOption = {
            level: data.level,
            process: data.process,
            scoreRate: data.scoreRate
          }
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 重置评价请求参数
    doRefresh () {
      this.tableData = []
      this.pageParams.keyWord = null
      this.pageParams.pageSize = 10
      this.pageParams.pageNum = 1
    },
    // 待评价
    doWait (row) {
      let query = {
        status: this.query.status,
        projectCommentId: this.query.projectCommentId,
        formId: row.formId,
        formName: row.formName
      }
      this.$router.push({ path: '/submits/submitReady', query: query })
    },
    // 主页面表格 点击分页
    doSizeChange (size) {
      this.doRefresh()
      this.doSearch(0, size)
    },
    // 主页面表格 分页改变
    doPageChange (page) {
      this.doRefresh()
      this.doSearch(page, 10)
    },
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
<style>
.danger-row {
  color: #e6a23c;
}

.success-row {
  color: #67c23a;
}
</style>
