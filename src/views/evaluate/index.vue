<template>
  <div class="app-container" ref="appContainer">
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
      <el-button size="small" @click="createProp = true" type="primary">创建评价项目</el-button>
    </div>
    <br />
    <!-- 数据内容 -->
    <div class="table-content">
      <el-tabs v-model="activeName" @tab-click="doTabClick">
        <el-tab-pane label="评价中" name="1">
          <!-- 表格数据 -->
          <div class="content" style="margin-top: 10px;">
            <el-table
              size="small"
              :data="tableData"
              :max-height="tableHeight"
              border
              :row-class-name="doRowClass"
            >
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
              <el-table-column label="提交人" align="center">
                <template slot-scope="scope">{{scope.row.submitUserNameList.toString()}}</template>
              </el-table-column>
              <el-table-column label="评审人" align="center">
                <template slot-scope="scope">{{scope.row.commentUserNameList.toString()}}</template>
              </el-table-column>
              <el-table-column prop="score" label="得分" align="center"></el-table-column>
              <el-table-column prop="process" label="进度" align="center"></el-table-column>
              <el-table-column width="300" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="success"
                    @click="doRunButton(scope.row, 2)"
                    v-show="scope.row.status === 0 || scope.row.status === 1"
                    plain
                    size="mini"
                  >开始</el-button>
                  <el-button
                    type="warning"
                    @click="doRunButton(scope.row, 1)"
                    v-show="scope.row.status === 2"
                    plain
                    size="mini"
                  >暂停</el-button>
                  <el-button type="danger" @click="doRunButton(scope.row, 3)" plain size="mini">结束</el-button>
                  <el-button type="primary" @click="doRunButton(scope.row, 4)" plain size="mini">修改</el-button>
                  <el-button type="primary" @click="doRunButton(scope.row, 5)" plain size="mini">设置</el-button>
                  <!-- <el-button type="primary" @click="doEndButton(scope.row)" plain size="mini">打印</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="评价结束" name="0">
          <!-- 表格数据 -->
          <div class="content" style="margin-top: 10px;">
            <el-table size="small" :data="tableData" :max-height="tableHeight" border>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
              <el-table-column label="提交人" align="center">
                <template slot-scope="scope">{{scope.row.submitUserNameList.toString()}}</template>
              </el-table-column>
              <el-table-column label="评审人" align="center">
                <template slot-scope="scope">{{scope.row.commentUserNameList.toString()}}</template>
              </el-table-column>
              <el-table-column label="结束时间" align="center">
                <template
                  slot-scope="scope"
                >{{$moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
              </el-table-column>
              <el-table-column prop="deductRate" label="得分率" align="center"></el-table-column>
              <el-table-column prop="fullScore" label="得分" align="center"></el-table-column>
              <el-table-column prop="deductScore" label="失分" sortable align="center"></el-table-column>
              <el-table-column width="300" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="doEndButton(scope.row,0)" plain size="mini">打印</el-button>
                  <el-button type="primary" @click="doEndButton(scope.row,1)" plain size="mini">重评</el-button>
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
    <!-- 创建评价项目 -->
    <el-dialog
      title="基本信息"
      :visible.sync="createProp"
      width="30%"
      center
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="createForm"
        label-position="right"
        label-width="110px"
        :rules="ruleForm"
        ref="creatForm"
      >
        <el-form-item label="评审名称" prop="name">
          <el-input
            v-model="createForm.name"
            filterable
            :collapse-tags="setEmployeeTags"
            clearable
            placeholder="请输入评审名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择项目" prop="projectId">
          <el-select
            v-model="createForm.projectId"
            filterable
            clearable
            placeholder="请选择项目"
            autocomplete="off"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in projectList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评价性质类型" prop="commentType">
          <el-select
            v-model="createForm.commentType"
            filterable
            clearable
            placeholder="请选择项目"
            autocomplete="off"
            @change="doCommentType"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in belongList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交资料人员" prop="submitEmployeeIdList">
          <el-select
            v-model="createForm.submitEmployeeIdList"
            filterable
            clearable
            :collapse-tags="setSubmitTags"
            multiple
            placeholder="请选择人员"
          >
            <el-option
              :label="item.label"
              :value="item.id"
              v-for="(item, index) in companyList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评审人员" prop="commentEmployeeIdList">
          <el-select
            v-model="createForm.commentEmployeeIdList"
            filterable
            :collapse-tags="setEmployeeTags"
            clearable
            multiple
            placeholder="请选择人员"
          >
            <el-option
              :label="item.label"
              :value="item.id"
              v-for="(item, i) in companyList"
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目评价表" required>
          <el-button type="primary" @click="doAdd" plain size="mini">添加评价表</el-button>
        </el-form-item>
      </el-form>
      <el-table
        size="small"
        :data="evaluateList"
        :show-header="false"
        v-show="evaluateList.length > 0"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="项目名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column width="80" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" @click="doDelete(scope.row.id)" plain size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreatSubmit('creatForm')">提交</el-button>
      </span>
    </el-dialog>

    <!-- 修改评价项目 -->
    <el-dialog
      title="修改"
      :visible.sync="editProp"
      width="30%"
      center
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="editForm"
        label-position="right"
        label-width="110px"
        :rules="ruleForm"
        ref="editForm"
      >
        <el-form-item label="评审名称" prop="name">
          <el-input
            v-model="editForm.name"
            filterable
            :collapse-tags="setEmployeeTags"
            clearable
            placeholder="请输入评审名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择项目" prop="projectId">
          <el-select
            v-model="editForm.projectId"
            filterable
            clearable
            placeholder="请选择项目"
            autocomplete="off"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in projectList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评价性质类型" prop="commentType">
          <el-select
            v-model="editForm.commentType"
            filterable
            clearable
            placeholder="请选择项目"
            autocomplete="off"
            @change="doCommentType"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in belongList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交资料人员" prop="submitEmployeeIdList">
          <el-select
            v-model="editForm.submitEmployeeIdList"
            filterable
            clearable
            :collapse-tags="setSubmitTags"
            multiple
            placeholder="请选择人员"
          >
            <el-option
              :label="item.label"
              :value="item.id"
              v-for="(item, index) in companyList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评审人员" prop="commentEmployeeIdList">
          <el-select
            v-model="editForm.commentEmployeeIdList"
            filterable
            :collapse-tags="setEmployeeTags"
            clearable
            multiple
            placeholder="请选择人员"
          >
            <el-option
              :label="item.label"
              :value="item.id"
              v-for="(item, i) in companyList"
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目评价表" required>
          <el-button type="primary" @click="doAdd" plain size="mini">添加评价表</el-button>
        </el-form-item>
      </el-form>
      <el-table
        size="small"
        :data="evaluateList"
        :show-header="false"
        v-show="evaluateList.length > 0"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="项目名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column width="80" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" @click="doDelete(scope.row.id)" plain size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doEditSubmit('editForm')">提交</el-button>
      </span>
    </el-dialog>

    <!-- 添加评价表 -->
    <el-dialog
      title="选择评价表"
      :visible.sync="addProp"
      width="30%"
      center
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-input
        clearable
        placeholder="请输入表名称"
        v-model="formName"
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
        @click="getEvaluateData(1)"
      >搜索</el-button>
      <br />
      <br />
      <br />
      <el-table
        size="small"
        border
        row-key="id"
        :data="evaluateData"
        reserve-selection
        max-height="200"
        ref="multipleTable"
        @select="doSelectChange"
        @selection-change="doTableChange"
        @select-all="doSelectChanges"
      >
        <el-table-column type="selection" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="表的名称" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doAddConfirm">确定</el-button>
      </span>
    </el-dialog>
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import { getCompanyId, getEmployeeId } from '@/utils/auth'
import {
  tableData,
  tableEndData,
  evaluateData,
  companyData,
  creatSubmit,
  runButton,
  printData,
  resetData,
  projectData,
  detailProject,
  editProject
} from '@/api/evaluate/evaluateProject'

export default {
  name: 'index',
  mixins: [initDict],
  data () {
    return {
      createProp: false,              // 创建评价弹窗
      addProp: false,                 // 添加评价表
      editProp: false,                // 修改评价项目
      screenLoading: false,           // 全局加载
      activeName: '1',                // 被激活的 tabBar标签
      formName: '',                   // 评价表搜索字段
      tableHeight: null,              // 表格最大高度
      tableData: [],                  // 表格数据
      evaluateData: [],               // 评价表数据
      projectList: [],                // 项目列表
      evaluateList: [],               // 多选框选中评价表格数据
      companyList: [],                // 公司组织架构-所有人员列表
      belongList: [                   // 评价性质类型
        { name: '项目监理机构自我评价', id: '1' },
        { name: '监理单位对项目监理机构工作的考核评价', id: '2' },
        { name: '建设单位对项目监理机构工作的考核评价', id: '3' },
        { name: '其他', id: '4' },
      ],
      pageData: {                     // 分页查询返回数据
        data: [],                     // 列表数据
        total: 10                     // 查询总数
      },
      createForm: {                   // 查询总数
        name: '',                     // 评价项目名称
        companyId: null,              // 项目所属公司
        commentType: '',              // 评价类型id
        commentTypeName: '',          // 评价类型名称
        employeeId: null,             // 执行创建操作评价项目的职员id
        projectId: null,              // 所评价的项目id
        formIdList: [],               // 对应评价表单id列表
        commentEmployeeIdList: [],           // 评审项目人员id列表
        submitEmployeeIdList: []              // 提交资料人员id列表
      },
      editForm: {},                   // 修改评价项目
      pageParams: {                   // 分页查询参数
        companyId: getCompanyId(),
        keyWord: null,                // 查询关键字
        pageSize: 10,                 // 每页个数
        pageNum: 0                    // 当前页数
      },
      uploadParams: {                 // 文件上传参数
        bizType: 1,
        parentId: 0
      },
      selects: [],                    // 表格选择事件  所选中的数据列表
      ruleForm: {
        projectId: [
          { required: true, message: '必填字段不能为空', trigger: 'change' }
        ],
        commentEmployeeIdList: [
          { required: true, message: '必填字段不能为空', trigger: 'change' }
        ],
        submitEmployeeIdList: [
          { required: true, message: '必填字段不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.doSearch(0)
    this.getCompanyData()
    this.getProjectData()
    this.doCreat()
  },
  mounted () {
    sessionStorage.removeItem('formId')
    sessionStorage.removeItem('projectCommentId')
    this.tableHeight = this.getHeight
  },
  computed: {
    // 获取高度
    getHeight () {
      let _this = this
      let clientHeight = _this.$refs.appContainer.clientHeight
      return clientHeight - 250 + 'px'
    },
    // 设置选择框多选时标签数量
    setEmployeeTags () {
      let _this = this
      return _this.createForm.commentEmployeeIdList.length > 4 ? true : false
    },
    // 设置选择框多选时标签数量
    setSubmitTags () {
      let _this = this
      return _this.createForm.submitEmployeeIdList.length > 4 ? true : false
    }
  },
  methods: {
    // 初始化
    doCreat () {
      this.getEvaluateData()
    },
    // 设置样式
    doRowClass ({ row, rowIndex }) {
      if (row.status === 0 || row.status === 1) {
        return 'danger-row';
      } else if (row.status === 2) {
        return 'success-row';
      }
      return '';
    },
    // 评价类型名称
    doCommentType (id) {
      this.belongList.forEach(p => {
        if (p.id === id) {
          this.createForm.commentTypeName = p.name
        }
      })
    },
    // 查询表格数据
    doSearch (num, size = 10) {
      this.pageParams.pageNum = num
      this.pageParams.pageSize = size || 10
      if (this.activeName === '1') {
        this.getData()
      } else {
        this.getEndData()
      }
    },
    // 获取评价中表格数据
    getData () {
      let params = this.pageParams
      this.screenLoading = true

      tableData(params).then(res => {
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
    // 获取评价结束表格数据
    getEndData () {
      let params = this.pageParams
      this.screenLoading = true

      tableEndData(params).then(res => {
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
    // 获取项目详情
    getProjectDetail (id) {
      detailProject(id).then(res => {
        if (res.code === 0) {
          let data = res.data
          data.commentType = data.commentType.toString()
          this.editForm = data
          this.evaluateList = data.formList
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 获取项目列表
    getProjectData () {
      let params = {
        companyId: getCompanyId()
      }
      projectData(params).then(res => {
        if (res.code === 0) {
          let data = res.data
          this.projectList = data
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
        keyWord: null,                // 查询关键字
        pageSize: 10,                 // 每页个数
        pageNum: 0                    // 当前页数
      }
    },
    // 点击tab标签页
    doTabClick () {
      this.doSearch(0)
      this.doRefresh()
    },
    // 创建评价项提交操作
    doCreatSubmit (ruleForm) {
      let formIdList = this.evaluateList.map(p => (p.id).toString())
      let form = {
        companyId: getCompanyId(),
        employeeId: getEmployeeId(),
        projectId: this.createForm.projectId,
        formIdList: formIdList,
        submitEmployeeIdList: this.createForm.submitEmployeeIdList,
        commentEmployeeIdList: this.createForm.commentEmployeeIdList,
        name: this.createForm.name,
        commentType: this.createForm.commentType,
        commentTypeName: this.createForm.commentTypeName
      }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.evaluateList.length === 0) {
            this.$message({ message: '请添加项目评价表', type: 'error' })
            return
          }
          this.screenLoading = true

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
    // 修改评价项提交操作
    doEditSubmit (ruleForm) {
      let formIdList = this.evaluateList.map(p => (p.id).toString())
      let form = {
        companyId: getCompanyId(),
        employeeId: getEmployeeId(),
        projectId: this.editForm.projectId,
        formIdList: formIdList,
        submitEmployeeIdList: this.editForm.submitEmployeeIdList,
        commentEmployeeIdList: this.editForm.commentEmployeeIdList,
        name: this.editForm.name,
        id: this.editForm.id,
        commentType: this.editForm.commentType,
        commentTypeName: this.editForm.commentTypeName
      }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.evaluateList.length === 0) {
            this.$message({ message: '请添加项目评价表', type: 'error' })
            return
          }
          this.screenLoading = true

          editProject(form).then(res => {
            this.screenLoading = false

            if (res.code === 0) {
              this.editProp = false
              this.$refs[ruleForm].resetFields()
              this.$message({ message: '修改成功', type: 'success' })
              this.doSearch(0)
            } else {
              this.$message({ message: res.msg, type: 'error' })
            }
          })
        }
      })
    },
    // 评价中数据列表操作按钮
    doRunButton (row, status) {
      if (status === 4) {
        this.editProp = true
        this.getProjectDetail(row.projectCommentId)
        return
      } else if (status === 5) {
        sessionStorage.removeItem('projectCommentId')
        this.$router.push({ path: 'eform', query: { row: row } })
        return
      }
      let params = {
        employeeId: getEmployeeId(),
        projectCommentId: row.projectCommentId,
        status: status
      }
      this.$confirm('是否继续执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.screenLoading = true

        runButton(params).then(res => {
          this.screenLoading = false

          if (res.code === 0) {
            this.getData()
            this.$message({ message: '操作成功', type: 'success' })
          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
      })
    },
    // 评价结束数据列表操作按钮
    doEndButton (row, type) {
      let params = {
        employeeId: getEmployeeId(),
        projectCommentId: row.projectCommentId
      }
      if (type === 0) {
        // this.screenLoading = true
        let link = document.createElement('a')
        link.target = "blank"
        link.style.display = "none"
        link.href = this.$network + 'assessment/form/pdf?projectCommentId=' + row.projectCommentId
        link.click()
        document.body.append(link)

      } else {
        this.$confirm('是否继续执行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.screenLoading = true

          resetData(params).then(res => {
            if (res.code === 0) {
              this.$message({ message: '操作成功', type: 'success' })
              this.getEndData()
            } else {
              this.$message({ message: res.msg, type: 'error' })
            }
          })
        })
      }
    },
    // 添加评价表
    doAdd () {
      this.createProp = false
      this.addProp = true
    },
    // 确定添加评价表
    doAddConfirm () {
      this.createProp = true
      this.addProp = false
    },
    // 删除评价表
    doDelete (id) {
      this.toggle = false
      this.evaluateList.forEach((p, i, arr) => {
        if (p.id === id) {
          this.$refs.multipleTable.toggleRowSelection(p, false);
        }
      })
    },
    // 根据公司id获取所有项目
    getCompanyData () {
      // this.companyId // 公司id暂时先默认为1001
      let params = {
        companyId: getCompanyId(),
        contain: 1
      }
      companyData(params).then(res => {
        if (res.code === 0) {
          let data = res.data[0]
          if (data.employees && data.employees.length > 0) {
            data.employees.forEach(p => {
              this.companyList.push({ id: p.employeeId, label: p.label })
            })
          }
          this.getComPanyFor(data)
        }
      })
    },
    // 递归循环处理数据
    getComPanyFor (data) {
      if (data.children) {
        data.children.forEach(p => {
          this.getComPanyFor(p)
        })
      } else {
        data.employees.forEach(p => {
          let flag = this.companyList.some(n => n.id === p.employeeId)
          if (!flag) {
            this.companyList.push({ id: p.employeeId, label: p.label })
          }
        })
        return false
      }
    },
    // 获取添加评价表数据
    getEvaluateData (type) {
      let params = {
        companyId: getCompanyId(),
        keyWord: this.formName,
        pageNum: 0,
        pageSize: 10000
      }
      evaluateData(params).then(res => {
        if (res.code === 0) {
          this.evaluateData = res.data.records
        }
      })
    },
    // 评价表 全选框操作
    doSelectChanges (select) {
      this.evaluateList = select
    },
    // 评价表 多选框操作
    doSelectChange (select, row) {
      this.evaluateList = select
    },
    doTableChange (select) {
      this.evaluateList = select
      console.log(select, 222)
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
.app-container {
  width: 100%;
  padding: 20px;
  height: 100%;
  position: absolute;
}
.table-content {
  height: calc(100% - 50px);
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
