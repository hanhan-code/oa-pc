<template>
  <div class="app-container" id="app-container">
    <div class="container" v-if="!formProp">
      <!-- 工具栏 -->
      <div class="head-tools">
        <!-- 搜索框 评价名称 -->
        <el-input
          clearable
          placeholder="请输入名称"
          v-model="pageParams.keyword"
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
          @click="doSearch"
        >搜索</el-button>
        <el-button size="small" @click="createProp = true" type="primary">创建评价表</el-button>
        <el-button size="small" @click="addProp = true" type="primary">添加现有表</el-button>
      </div>
      <br />
      <!-- 数据内容 -->
      <div class="table-content">
        <!-- 表格数据 -->
        <div class="content" style="margin-top: 10px;">
          <el-table size="small" :data="tableData" :max-height="tableHeight" border>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
            <el-table-column prop="fullScore" label="得分" align="center"></el-table-column>
            <el-table-column width="300" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click="doRunButton(scope.row, 0)" plain size="mini">设置</el-button>
                <el-button type="primary" @click="doRunButton(scope.row, 1)" plain size="mini">复制</el-button>
                <el-button type="primary" @click="doRunButton(scope.row, 2)" plain size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <br />

        <!-- 底部工具 -->
        <!-- <div class="footer" style="margin-bottom: 20px"> -->
        <!--分页组件-->
        <!-- <el-pagination
          style="margin-top: 8px;"
          @size-change="doSizeChange"
          @current-change="doPageChange"
          :current-page="pageParams.pageNum"
          :total="pageData.total"
          layout="total, prev, pager, next, sizes"
        />-->
        <!-- </div> -->
      </div>
    </div>

    <!-- 创建评价项目 -->
    <el-dialog title="基本信息" :visible.sync="createProp" width="20%" center>
      <el-form
        :model="createForm"
        label-position="right"
        label-width="70px"
        :rules="ruleForm"
        ref="creatForm"
      >
        <el-form-item label="表名称" prop="name">
          <el-input
            v-model="createForm.name"
            filterable
            clearable
            placeholder="请输入表名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreatSubmit('creatForm')">创建项目</el-button>
      </span>
    </el-dialog>
    <!-- 复制 -->
    <el-dialog title="复制" :visible.sync="copyProp" width="25%" center>
      <div>该操作将复制当前数据，是否复制？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCopyConfirm">确定</el-button>
      </span>
    </el-dialog>
    <form-manage :formId="formId" v-if="formProp" @doChildClose="doChildClose"></form-manage>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import { getCompanyId, getEmployeeId } from '@/utils/auth'
import formManage from './form-manage'
// import { requireContent } from '@/utils/rule'
import {
  tableData,
  creatSubmit,
  copyButton,
  endButton,
} from '@/api/evaluate/evaluateForm'

export default {
  name: 'index',
  mixins: [initDict],
  components: { formManage },
  data () {
    return {
      createProp: false,              // 创建评价弹窗
      addProp: false,                 // 添加现有表
      copyProp: false,                // 复制评价表
      formProp: false,                // 表单管理页面弹窗
      formName: '',                   // 评价表搜索字段
      formId: '',                     // 表单管理页面字段
      row: null,                      // 当前行数据
      tableHeight: null,              // 表格最大高度
      tableData: [],                  // 表格数据
      pageData: {                     // 分页查询返回数据
        data: [],                     // 列表数据
        total: 10                     // 查询总数
      },
      createForm: {                   // 查询总数
        companyId: null,              // 项目所属公司
        employeeId: null,             // 执行创建操作评价项目的职员id
        name: '',                     // 创建表的名称
      },
      pageParams: {                   // 分页查询参数
        companyId: getCompanyId(),
        keyword: null,                // 查询关键字
        pageSize: 10,                 // 每页个数
        pageNum: 0,                   // 当前页数
        projectCommentId: null        // 评价项目提交id
      },
      ruleForm: {
        name: [
          { required: true, message: '必填字段不能为空', trigger: 'change' }
        ],
      }
    }
  },
  created () {
    this.doSearch()
    this.doCreat()
  },
  mounted () {
    this.tableHeight = this.setHeight
  },
  computed: {
    // 设置表格最大高度
    setHeight () {
      let tag = document.getElementById('app-container')
      return tag.clientHeight - 220
    },
  },
  activated () {
    this.doCreat()
  },
  methods: {
    // 初始化
    doCreat () {
      let params = this.$route.params.row
      if (params) {
        this.pageParams.projectCommentId = JSON.parse(row).projectCommentId
      } else {
        this.pageParams.projectCommentId = null
      }
    },
    // 查询表格数据
    doSearch (page = 0, size = 10) {
      this.pageParams.pageNum = page || 0
      this.pageParams.pageSize = size || 10
      this.getData()
    },
    // 获取评价中表格数据
    getData () {
      let params = this.pageParams

      tableData(params).then(res => {
        if (res.code === 0) {
          let data = res.data
          this.tableData = data
          // this.pageData.total = Number(data.total)
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 重置评价请求参数
    doRefresh () {
      this.tableData = []
      this.pageParams = {             // 分页查询参数
        companyId: getCompanyId(),
        keyword: null,                // 查询关键字
        pageSize: 10,                 // 每页个数
        pageNum: 0                    // 当前页数
      }
    },
    // 创建评价项提交操作
    doCreatSubmit (ruleForm) {
      let form = {
        companyId: getCompanyId(),
        employeeId: getEmployeeId(),
        name: this.createForm.name,
      }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          creatSubmit(form).then(res => {
            if (res.code === 0) {
              this.createProp = false
              this.$refs[ruleForm].resetFields()
              this.$message({ message: '创建成功', type: 'success' })
              this.doSearch()
            } else {
              this.$message({ message: res.msg, type: 'error' })
            }
          })
        }
      })
    },
    // 评价中数据列表操作按钮
    doRunButton (row, status) {
      if (status === 0) {
        this.formId = row.id
        this.formProp = true
      } else if (status === 1){
        this.copyProp = true
        this.row = row
      }
    },
    // 表单管理页面返回
    doChildClose () {
      this.formProp = false
    },
    // 添加评价表
    doCopy () {
      this.copyProp = true
    },
    // 确定添加评价表
    doCopyConfirm () {
      let params = {
        formId: this.row.id,
        employeeId: getEmployeeId()
      }
      copyButton(params).then(res => {
        if (res.code === 0) {
          this.copyProp = false
          this.doSearch()
          this.$message({ message: res.msg, type: 'success' })
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
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
