<template>
  <div class="app-container" id="app-container">
    <div class="container" v-if="!formProp">
      <!-- 工具栏 -->
      <div class="head-tools">
        <!-- 搜索框 评价名称 -->
        <el-input
          clearable
          placeholder="请输入名称"
          v-model="pageParams.key"
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
        <el-button size="small" @click="doButton(0)" type="primary">创建评价表</el-button>
        <el-button
          size="small"
          @click="doButton(1)"
          type="primary"
          v-show="pageParams.projectCommentId !== 0"
        >添加现有表</el-button>
      </div>
      <br />
      <!-- 数据内容 -->
      <div class="table-content">
        <!-- 表格数据 -->
        <div class="content" style="margin-top: 10px;">
          <el-table size="small" :data="tableData" :max-height="600" border>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="name" label="表名称" align="center" width="400"></el-table-column>
            <el-table-column prop="fullScore" label="得分" align="center"></el-table-column>
            <el-table-column width="300" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click="doRunButton(scope.row, 0)" plain size="mini">设置</el-button>
                <el-button
                  type="primary"
                  v-show="pageParams.projectCommentId === 0"
                  @click="doRunButton(scope.row, 1)"
                  plain
                  size="mini"
                >复制</el-button>
                <el-button type="danger" @click="doRunButton(scope.row, 2)" plain size="mini">删除</el-button>
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
    <el-dialog
      title="基本信息"
      :visible.sync="createProp"
      width="20%"
      center
      :modal="false"
      :modal-append-to-body="false"
    >
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
            v-show="!evaluateProp"
            clearable
            placeholder="请输入表名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreatSubmit('creatForm')">提交</el-button>
      </span>
    </el-dialog>
    <!-- 添加已有评价项目 -->
    <el-dialog
      title="添加现有评价表"
      :visible.sync="evaluateProp"
      width="20%"
      center
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="createForm"
        label-position="right"
        label-width="70px"
        :rules="ruleForm"
        ref="creatForms"
      >
        <el-form-item label="表名称" prop="name">
          <el-select
            v-model="createForm.formIds"
            filterable
            placeholder="请选择"
            v-show="evaluateProp"
          >
            <el-option
              v-for="item in evaluateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreatSubmits('creatForms')">提交</el-button>
      </span>
    </el-dialog>
    <!-- 复制 -->
    <el-dialog
      title="复制"
      :visible.sync="copyProp"
      width="25%"
      :modal="false"
      :modal-append-to-body="false"
    >
      <div>该操作将复制当前数据，是否复制？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="copyProp = false">取消</el-button>
        <el-button type="primary" @click="doCopyConfirm">确定</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      title
      :visible.sync="delProp"
      width="25%"
      :modal="false"
      :modal-append-to-body="false"
    >
      <div>该操作将永久删除数据，是否删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="delProp = false" size>取消</el-button>
        <el-button type="primary" @click="doDeleteConfirm">确定</el-button>
      </span>
    </el-dialog>
    <form-manage :formId="formId" v-if="formProp" @doChildClose="doChildClose"></form-manage>
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import { getCompanyId, getEmployeeId } from '@/utils/auth'
import formManage from './manage'
import { requireContent } from '@/utils/rule'
import {
  tableData,
  creatSubmit,
  copyButton,
  endButton,
  evaluateData,
  creatSubmits,
  delForm
} from '@/api/evaluate/evaluateForm'

export default {
  name: 'index',
  mixins: [initDict],
  components: { formManage },
  data () {
    return {
      createProp: false,              // 创建评价弹窗
      evaluateProp: false,            // 添加现有表弹窗
      delProp: false,                 // 删除弹窗
      addProp: false,                 // 添加现有表
      copyProp: false,                // 复制评价表
      formProp: false,                // 表单管理页面弹窗
      screenLoading: false,           // 全局加载
      formName: '',                   // 评价表搜索字段
      formId: '',                     // 表单管理页面字段
      row: null,                      // 当前行数据
      tableHeight: null,              // 表格最大高度
      tableData: [],                  // 表格数据
      evaluateList: [],               // 现有表格数据
      pageData: {                     // 分页查询返回数据
        data: [],                     // 列表数据
        total: 10                     // 查询总数
      },
      createForm: {                   // 查询总数
        companyId: null,              // 项目所属公司
        employeeId: null,             // 执行创建操作评价项目的职员id
        name: '',                     // 创建表的名称
      },
      createForms: {
        projectCommentId: null,       // 执行创建操作评价项目的职员id
        formIds: [],
      },
      pageParams: {                   // 分页查询参数
        companyId: getCompanyId(),
        key: null,                // 查询关键字
        pageSize: 0,                 // 每页个数
        pageNum: 0,                   // 当前页数
        projectCommentId: 0        // 评价项目提交id
      },
      ruleForm: {
        name: [
          { required: true, validator: requireContent, trigger: 'blur' }
        ],
      },
    }
  },
  created () {
    this.doCreat()
  },
  mounted () {
    this.getHeight;

    this.tableHeight = this.setHeight
  },
  computed: {
    getHeight () {
      let container = document.getElementById("app-container");
      let main = document.getElementsByClassName("app-main")[0].clientHeight;
      container.style.height = main + "px";
      return "";
    },
    // 设置表格最大高度
    setHeight () {
      let tag = document.getElementById('app-container')
      return tag.clientHeight - 220
    },
  },
  methods: {
    // 初始化
    doCreat () {
      let row = this.$route.query.row
      let projectCommentId = sessionStorage.getItem('projectCommentId')
      if (projectCommentId) {
        this.pageParams.projectCommentId = projectCommentId
        this.pageParams.companyId = 0
      } else {
        if (row) {
          this.pageParams.projectCommentId = row.projectCommentId
          sessionStorage.setItem('projectCommentId', row.projectCommentId)
          this.pageParams.companyId = 0
        } else {
          this.pageParams.projectCommentId = 0
          this.pageParams.companyId = getCompanyId()
        }
      }
      this.doSearch(0)
    },
    // 查询表格数据
    doSearch (page, size = 0) {
      this.pageParams.pageNum = page
      this.pageParams.pageSize = size
      this.getData()
    },
    // 获取评价中表格数据
    getData () {
      let params = this.pageParams
      this.screenLoading = true
      tableData(params).then(res => {
        this.screenLoading = false
        if (res.code === 0) {
          let data = res.data
          this.tableData = data
          // this.pageData.total = Number(data.total)
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    doButton (type) {
      if (type === 0) {
        this.createProp = true
      } else {
        this.evaluateProp = true
        this.getEvaluateData()
      }
    },
    // 重置评价请求参数
    doRefresh () {
      this.tableData = []
      this.pageParams = {             // 分页查询参数
        companyId: getCompanyId(),
        projectCommentId: 0,
        key: null,                // 查询关键字
        pageSize: 0,                 // 每页个数
        pageNum: 0                    // 当前页数
      }
    },
    // 创建评价项提交操作
    doCreatSubmit (ruleForm) {
      let form = {
        companyId: getCompanyId(),
        employeeId: getEmployeeId(),
        projectCommentId: this.pageParams.projectCommentId,
        name: this.createForm.name,
      }
      this.screenLoading = true
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          creatSubmit(form).then(res => {
            this.screenLoading = false
            if (res.code === 0) {
              this.createProp = false
              this.$refs[ruleForm].resetFields()
              this.$message({ message: '创建成功', type: 'success' })
              this.doSearch(0)
            } else {
              this.$message({ message: res.msg, type: 'error' })
            }
          })
        }
      })
    },
    // 添加已有评价表提交
    doCreatSubmits (ruleForm) {
      let form = {
        projectCommentId: this.pageParams.projectCommentId,
        formIds: this.createForms.formIds.toString(),
      }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.screenLoading = true
          creatSubmits(form).then(res => {
            this.screenLoading = false
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
    // 删除表
    doDeleteConfirm () {
      let params = {
        companyId: getCompanyId(),
        employeeId: getEmployeeId(),
        projectCommentId: this.pageParams.projectCommentId,
        formId: this.row.id
      }
      if (params.projectCommentId !== 0) {
        params.companyId = 0
      }
      this.screenLoading = true
      delForm(params).then(res => {
        this.delProp = false
        this.screenLoading = false

        if (res.code === 0) {
          this.getData()
          this.$message({ message: '删除成功', type: 'success' })
        } else {
          this.$message({ message: '删除失败', type: 'error' })
        }
      })
    },
    // 评价中数据列表操作按钮
    doRunButton (row, status) {

      this.row = row
      if (status === 0) {
        sessionStorage.removeItem('formId')
        this.formId = row.id
        this.formProp = true
      } else if (status === 1) {
        this.copyProp = true
      } else {
        this.delProp = true
      }
    },
    // 获取添加评价表数据
    getEvaluateData (type) {
      let params = {
        projectCommentId: this.pageParams.projectCommentId,
        companyId: this.pageParams.companyId,
        pageNum: 0,
        pageSize: 0
      }
      evaluateData(params).then(res => {
        if (res.code === 0) {
          this.evaluateList = res.data
        }
      })
    },
    // 表单管理页面返回
    doChildClose () {
      this.formProp = false
    },
    // 添加评价表
    doCopy () {
      this.copyProp = true
    },
    // 确定复制评价表
    doCopyConfirm () {
      let params = {
        formId: this.row.id,
        employeeId: getEmployeeId()
      }
      this.screenLoading = true

      copyButton(params).then(res => {
        this.screenLoading = false

        if (res.code === 0) {
          this.copyProp = false
          this.doSearch(0)
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
