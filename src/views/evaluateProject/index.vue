<template>
  <div class="app-container dialog" ref="appContainer">
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
      <el-button
        class="filter-item"
        size="small"
        type="success"
        icon="el-icon-search"
        @click="doSearch(0)"
      >搜索</el-button>
      <el-button size="small" type="primary" @click="doRemind">催交</el-button>
    </div>
    <br />
    <!-- 数据内容 -->
    <div class="table-content">
      <el-tabs v-model="activeName" @tab-click="doTabClick">
        <el-tab-pane label="评价中" name="0">
          <!-- 表格数据 -->
          <div class="content" style="margin-top: 10px;">
            <el-table size="small" :data="tableData" :max-height="tableHeight" border>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="name" label="项目全称" align="center"></el-table-column>
              <el-table-column label="评价进度" align="center">
                <template slot-scope="scope">{{scope.row.commentedNum}}/{{scope.row.commentAllNum}}</template>
              </el-table-column>
              <el-table-column label="当前得分" align="center">
                <template
                  slot-scope="scope"
                >{{scope.row.fullScore - scope.row.deductScore}}/{{scope.row.fullScore}}</template>
              </el-table-column>
              <el-table-column label="不合格数" prop="unqualifiedNum" align="center"></el-table-column>
              <el-table-column label="扣分" prop="importantDeductScore" align="center"></el-table-column>
              <el-table-column prop="fullScore" label="得分" align="center"></el-table-column>
              <el-table-column label="待评价数量" align="center">
                <template slot-scope="scope">{{scope.row.commentAllNum - scope.row.commentedNum}}</template>
              </el-table-column>
              <el-table-column width="300" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    v-show="scope.row.status !== 1"
                    type="primary"
                    @click="doWait(scope.row)"
                    plain
                    size="mini"
                  >待评价</el-button>
                  <el-button
                    v-show="scope.row.status !== 1"
                    type="primary"
                    @click="doEnd(scope.row)"
                    plain
                    size="mini"
                  >完结</el-button>
                  <span v-show="scope.row.status === 1">已暂停评价</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="评价结束" name="1">
          <!-- 表格数据 -->
          <div class="content" style="margin-top: 10px;">
            <el-table size="small" :data="tableData" :max-height="tableHeight" border>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="abbName" label="项目全称" align="center"></el-table-column>
              <el-table-column prop="name" label="评审内容" align="center"></el-table-column>
              <el-table-column label="评审性质" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.belongTo === 1">项目监理机构自我评价</div>
                  <div v-if="scope.row.belongTo === 2">监理单位对项目监理机构工作的考核评价</div>
                  <div v-if="scope.row.belongTo === 3">建设单位对项目监理机构工作的考核评价</div>
                  <div v-if="scope.row.belongTo === 4">其他</div>
                </template>
              </el-table-column>
              <el-table-column label="得分率" align="center">
                <template slot-scope="scope">{{scope.row.scoreRate}}/{{scope.row.level}}</template>
              </el-table-column>
              <el-table-column label="当前得分" align="center">
                <template
                  slot-scope="scope"
                >{{scope.row.fullScore - scope.row.deductScore}}/{{scope.row.fullScore}}</template>
              </el-table-column>
              <el-table-column label="不合格数" prop="unqualifiedNum" align="center"></el-table-column>
              <el-table-column label="扣分" prop="deductScore" align="center"></el-table-column>
              <el-table-column prop="fullScore" label="得分" align="center"></el-table-column>
              <el-table-column prop="deductScore" label="失分" sortable align="center"></el-table-column>
              <el-table-column width="300" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    v-show="scope.row.status !== 1"
                    @click="doWait(scope.row)"
                    plain
                    size="mini"
                  >详情</el-button>
                  <span v-show="scope.row.status === 1">已暂停评价</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

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
    <!-- 完结 -->
    <el-dialog
      :visible.sync="endProp"
      width="40%"
      title="项目监理部工作评价总表"
      :modal="false"
      :modal-append-to-body="false"
      center
    >
      <evaluate-end
        :num="num"
        v-if="endProp"
        :projectCommentId="projectCommentId"
        @doEndClose="doEndClose"
      ></evaluate-end>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doEndConfirm">提交</el-button>
      </span>
    </el-dialog>
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import { getCompanyId, getEmployeeId } from '@/utils/auth'
import { listData } from '@/api/evaluateProject/evaluateProject'
import evaluateEnd from '@/views/evaluateProject/end'

export default {
  name: 'index',
  mixins: [initDict],
  components: { evaluateEnd },
  data () {
    return {
      screenLoading: false,           // 全局加载
      endProp: false,                 // 完结弹窗
      num: 0,                         // 更新提交子组件
      activeName: '0',                // 被激活的 tabBar标签
      projectCommentId: null,         // 评价项id
      tableHeight: null,              // 表格最大高度
      row: null,
      tableData: [],                  // 表格数据
      pageData: {                     // 分页查询返回数据
        data: [],                     // 列表数据
        total: 10                     // 查询总数
      },
      pageParams: {                   // 分页查询参数
        companyId: getCompanyId(),
        employeeId: getEmployeeId(),
        keyWord: null,                // 查询关键字
        pageSize: 10,                 // 每页个数
        pageNum: 1,                // 当前页数
        type: 1, // 人员类别：0:提交资料人员；1：评审人员
        commented: 0, // 是否已评价；0：评价中，1：已评价
      },
    }
  },
  created () {
    this.doSearch(1)
    this.doCreat()
  },
  computed: {
    // 获取高度
    getHeight () {
      let _this = this
      let clientHeight = _this.$refs.appContainer.clientHeight
      return clientHeight - 250 + 'px'
    }
  },
  mounted () {
    this.tableHeight = this.getHeight
  },
  methods: {
    // 初始化
    doCreat () {
      sessionStorage.removeItem('query')
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
      listData(params).then(res => {
        this.screenLoading = false
        if (res.code === 0) {
          let data = res.data
          this.tableData = data.records
          this.pageData.total = Number(data.total)
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
    // 点击tab标签页
    doTabClick (e) {
      this.pageParams.commented = Number(e.name)
      this.doRefresh()
      this.doSearch(1)
    },
    // 催办
    doRemind () {
      this.$router.push({ path: '/evaluates/evaluateRemind' })
    },
    // 待评价
    doWait (row) {
      let query = {
        projectCommentId: row.projectCommentId,
        status: row.status
      }
      this.$router.push({ path: '/evaluates/evaluateWait', query: query })
    },
    // 完结
    doEnd (row) {
      this.projectCommentId = row.projectCommentId
      this.endProp = true
      this.row = row
    },

    // 确认完结
    doEndConfirm () {
      this.num++
    },
    // 关闭完结
    doEndClose () {
      this.endProp = false
      this.doRefresh()
      this.doSearch(1)
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
.app-container {
  width: 100%;
  padding: 20px;
  height: 100%;
  position: absolute;
}
.el-select {
  width: 100%;
}
</style>
<style>
.dialog .el-dialog__wrapper {
  overflow: hidden;
}
.dialog .el-dialog {
  width: 40%;
  height: 80%;
  margin: 10% auto;
  margin-top: 10vh !important;
}
.dialog .el-dialog__body {
  height: 83%;
  overflow: auto;
}
.danger-row {
  color: #e6a23c;
}

.success-row {
  color: #67c23a;
}
</style>
