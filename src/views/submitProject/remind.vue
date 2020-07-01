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
      <el-button size="small" type="primary" @click="remindProp = true">提交</el-button>
      <el-button size="small" type="primary">
        <router-link to="/projectComment/submitProject">返回上一级</router-link>
      </el-button>
    </div>
    <br />
    <!-- 数据内容 -->
    <div class="table-content">
      <div class="content" style="margin-top: 10px;">
        <el-table
          size="small"
          :data="tableData"
          :max-height="600"
          border
          @select="doSelectChange"
          @select-all="doSelectChanges"
        >
          <el-table-column type="selection" label="序号" align="center"></el-table-column>
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
          <el-table-column label="扣分" prop="deductScore" align="center"></el-table-column>
          <el-table-column label="待评价数量" align="center">
            <template slot-scope="scope">{{scope.row.commentAllNum - scope.row.commentedNum}}</template>
          </el-table-column>
          <el-table-column prop="fullScore" label="得分" align="center"></el-table-column>
          <el-table-column prop="deductScore" label="失分" sortable align="center"></el-table-column>
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
    <!-- 删除树 -->
    <el-dialog
      title="系统提示"
      :visible.sync="remindProp"
      width="20%"
      :modal="false"
      :modal-append-to-body="false"
    >
      是否确认催办？
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="remindProp = false">取消</el-button>
        <el-button type="primary" @click="doRemind">确定</el-button>
      </span>
    </el-dialog>
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import { getCompanyId, getEmployeeId } from '@/utils/auth'
import { listData, personData } from '@/api/evaluateProject/evaluateProject'


export default {
  name: 'remind',
  mixins: [initDict],
  data () {
    return {
      screenLoading: false,           // 全局加载
      remindProp: false,
      activeName: '0',                // 被激活的 tabBar标签
      tableHeight: null,              // 表格最大高度
      evaluateList: [],
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
        type: 0, // 人员类别：0:提交资料人员；1：评审人员
        commented: 0, // 是否已评价；0：评价中，1：已评价
      },
    }
  },
  created () {
    this.doSearch(1)
    this.doCreat()
  },
  mounted () {
  },
  methods: {
    // 初始化
    doCreat () {

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
          this.$nextTick(() => {
            if (this.evaluateList.length > 0) {
              this.doToggleSelect(this.evaluateList)
            }
          })
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
    // 催交
    doRemind () {
      if (this.evaluateList.length === 0) {
        this.$message({ message: '请选择催办项目', type: 'error' })
        this.remindProp = false
        return
      }
      let idList = {
        projectCommentIds: this.evaluateList.map(p => p.projectCommentId).toString(),
        ids: this.evaluateList.map(p => p.projectCommentId).toString(),
        type: 1,
        path: '/evaluateProject',
      }
      // 获取催交消息内容与用户id
      this.screenLoading = true
      personData(idList).then((res) => {
        this.screenLoading = false
        if (res.code === 0) {
          this.$router.push('/projectComment/submitProject')
          this.remindProp = false
          this.$message({ message: res.msg, type: 'success' })
        }
      })
    },
    // 评价表 全选框操作
    doSelectChanges (select) {
      let evaluateList = this.evaluateList
      if (evaluateList.length === 0) {
        evaluateList.push(...select)
        evaluateList.splice(0, 0)
      } else {
        if (select.length === 0) {
          this.tableData.forEach((p, i, arr) => {
            this.doFilter(p)
          })
        } else {
          select.forEach((p, i, arr) => {
            this.doFilter(p)
          })
        }
      }
    },
    // 评价表 多选框操作
    doSelectChange (select, row) {
      let evaluateList = this.evaluateList
      if (evaluateList.length === 0) {
        evaluateList.push(row)
        evaluateList.splice(0, 0)
      } else {
        this.doFilter(row)
      }
    },
    // 多选框数据过滤
    doFilter (row) {
      let evaluateList = this.evaluateList
      let flag = evaluateList.some(p => p.projectId === row.projectId)
      if (flag) {
        evaluateList.forEach((p, i, arr) => {
          if (row.projectId === p.projectId) {
            arr.splice(i, 1)
          }
        })
      } else {
        evaluateList.push(row)
      }

    },
    // 表格多选框是否选中
    doToggleSelect (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
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
