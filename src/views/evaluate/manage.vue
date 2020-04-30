<template>
  <div class="container" id="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-tree
          :data="treeData"
          node-key="id"
          accordion
          highlight-current
          :default-expanded-keys="[0]"
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span @click="doTreeClick(data)">{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => doAddTree(node, data)"
                v-show="node.level < 3"
              >添加</el-button>
              <el-button
                type="text"
                size="mini"
                v-show="data.pid"
                @click="() => doEditTree(node, data)"
              >修改</el-button>
              <el-button
                type="text"
                size="mini"
                v-show="data.pid"
                @click="() => doDeleTree(node, data)"
              >删除</el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="20">
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
          <el-button size="small" @click="doAdd" type="primary">添加考评项</el-button>
          <el-button size="small" @click="doBack" type="primary">返回上一级</el-button>
        </div>
        <br />
        <!-- 数据内容 -->
        <div class="table-content">
          <!-- 表格数据 -->
          <div class="content" style="margin-top: 10px;">
            <el-table size="small" :data="tableData" :max-height="600" border>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="formClassName" label="评价项目" align="center"></el-table-column>
              <el-table-column prop="content" label="评价内容" align="center"></el-table-column>
              <el-table-column prop="grading" label="评分标准" align="center"></el-table-column>
              <el-table-column prop="score" label="总分" align="center"></el-table-column>
              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span>
                    <i class="table-san"></i>
                  </span>
                </template>
                <template slot-scope="scope">
                  <span v-show="scope.row.important === 1">
                    <i class="table-san"></i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="300" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="doEdit(scope.row)" plain size="mini">修改</el-button>
                  <el-button type="info" @click="doDetail(scope.row)" plain size="mini">查看</el-button>
                  <el-button type="danger" @click="doDelete(scope.row)" plain size="mini">删除</el-button>
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
      </el-col>
    </el-row>

    <!-- 添加考评评价项 -->
    <el-dialog
      title="添加考评项"
      :visible.sync="addProp"
      width="30%"
      center
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="addForm"
        label-position="right"
        label-width="110px"
        :rules="ruleForm"
        ref="creatForm"
      >
        <el-form-item label="所属分类" prop="formClassId">
          <el-cascader
            v-model="addForm.formClassId"
            :options="treeData[0].children"
            :show-all-levels="false"
            checkStrictly
            filterable
            placeholder="请选择考评分类"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="评价标准" prop="grading">
          <el-input
            v-model="addForm.grading"
            type="textarea"
            filterable
            clearable
            placeholder="请输入标准"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <i class="table-san san-color"></i>重要评价项
          </template>
          <el-switch v-model="addForm.important"></el-switch>
        </el-form-item>
        <el-form-item label="应得分数" prop="fullScore">
          <el-select
            v-model="addForm.fullScore"
            filterable
            clearable
            placeholder="请选择分数"
            autocomplete="off"
          >
            <el-option :label="item" :value="item" v-for="(item, v) in scoreList" :key="v"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doAddConfirm('creatForm')">確定</el-button>
      </span>
    </el-dialog>
    <!-- 修改评价表 -->
    <el-dialog
      title="修改评价项"
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
        ref="creatForm"
      >
        <el-form-item label="所属分类" prop="formClassId">
          <el-cascader
            v-model="editForm.formClassId"
            :options="treeData[0].children"
            :show-all-levels="false"
            checkStrictly
            filterable
            :placeholder="editForm.formClassName"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="评价标准" prop="grading">
          <el-input
            v-model="editForm.grading"
            type="textarea"
            filterable
            clearable
            placeholder="请输入标准"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="重要评价项" prop="important">
          <el-switch v-model="editForm.important"></el-switch>
        </el-form-item>
        <el-form-item label="应得分数" prop="fullScore">
          <el-select
            v-model="editForm.fullScore"
            filterable
            clearable
            placeholder="请选择分数"
            autocomplete="off"
          >
            <el-option :label="item" :value="item" v-for="(item, i) in scoreList" :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doEditConfirm('creatForm')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 查看评价表 -->
    <el-dialog
      title="查看考评项"
      :visible.sync="detailProp"
      width="30%"
      center
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="detailForm"
        label-position="right"
        label-width="110px"
        :rules="ruleForm"
        ref="creatForm"
      >
        <el-form-item label="所属分类" prop="formClassId">
          <el-input v-model="detailForm.formClassId" placeholder="请选择分类" disabled></el-input>
        </el-form-item>
        <el-form-item label="评价标准" prop="grading">
          <el-input v-model="detailForm.grading" disabled type="textarea" placeholder="请输入标准"></el-input>
        </el-form-item>
        <el-form-item label="重要评价项" prop="important">
          <el-switch v-model="detailForm.important" disabled></el-switch>
        </el-form-item>
        <el-form-item label="应得分数" prop="fullScore">
          <el-select v-model="detailForm.fullScore" disabled placeholder="请选择分数">
            <el-option :label="item" :value="item" v-for="(item, index) in scoreList" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 删除评价表 -->
    <el-dialog
      title="删除评价表"
      :visible.sync="deleteProp"
      width="20%"
      :modal="false"
      :modal-append-to-body="false"
    >
      确定删除评价表？
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="deleteProp = false">取消</el-button>
        <el-button type="primary" @click="doDeleteConfirm">确定</el-button>
      </span>
    </el-dialog>
    <!-- 添加树 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addTreeProp"
      width="20%"
      center
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-input clearable placeholder="请输入表名称" v-model="formName" size="small" class="filter-item" />
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="default" @click="addTreeProp = false">取消</el-button> -->
        <el-button type="primary" @click="doAddTrees">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改树 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editTreeProp"
      width="20%"
      center
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-input clearable placeholder="请输入表名称" v-model="formName" size="small" class="filter-item" />
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="default" @click="editTreeProp = false">取消</el-button> -->
        <el-button type="primary" @click="doEditTrees">确定</el-button>
      </span>
    </el-dialog>
    <!-- 删除树 -->
    <el-dialog
      title="系统提示"
      :visible.sync="deleTreeProp"
      width="20%"
      :modal="false"
      :modal-append-to-body="false"
    >
      确定删除评价表？
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="deleTreeProp = false">取消</el-button>
        <el-button type="primary" @click="doDeleTrees">确定</el-button>
      </span>
    </el-dialog>
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import { getCompanyId, getEmployeeId } from '@/utils/auth'
import {
  treeList,
  formData,
  treeAdd,
  treeEdit,
  treeDele,
  formAdd,
  formEdit,
  formDelete,
  formDetail
} from '@/api/evaluate/evaluateForm'

export default {
  name: 'index',
  mixins: [initDict],
  data () {
    return {
      addProp: false,                 // 添加评价表
      editProp: false,                // 修改评价表
      screenLoading: false,           // 全局加载
      detailProp: false,              // 查看评价表
      deleteProp: false,              // 删除评价表
      addTreeProp: false,             // 添加树评价表
      editTreeProp: false,            // 修改树评价表
      deleTreeProp: false,            // 删除树评价表
      activeName: '1',                // 被激活的 tabBar标签
      formName: '',                   // 评价表搜索字段
      tableHeight: null,              // 表格最大高度
      row: null,                      // 行数据
      treeData: [
        {
          id: 0,
          label: '全部分类',
        }
      ],                              // 表格数据
      tableData: [],                  // 表格数据
      scoreList: [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10'
      ],                              // 分数列表
      pageData: {                     // 分页查询返回数据
        data: [],                     // 列表数据
        total: 10                     // 查询总数
      },
      addForm: {
        important: 0,                 // 是否重要项 1：是 0：不是
        formClassId: [],               // 考评类id
        grading: '',                  // 评价标准
        fullScore: 0,                 // 分值
        formId: null,                 // 表格类id
      },
      editForm: {                     // 查询总数
        important: 0,                 // 是否重要项 1：是 0：不是
        formClassId: [],               // 考评类id
        grading: '',                  // 评价标准
        fullScore: 0,                 // 分值
        formClassItemId: null         // 提交资料人员id列表
      },
      detailForm: {                     // 查询总数
        important: 0,                 // 是否重要项 1：是 0：不是
        formClassId: 0,               // 考评类id
        grading: '',                  // 评价标准
        fullScore: 0,                 // 分值
        formClassItemId: null         // 提交资料人员id列表
      },
      pageParams: {                   // 分页查询参数
        companyId: getCompanyId(),
        formId: null,
        keyWord: null,                // 查询关键字
        formClassId: 0,               // 表格子类id
        pageSize: 10,                 // 每页个数
        pageNum: 0                    // 当前页数
      },
      ruleForm: {
        grading: [
          { required: true, message: '必填字段不能为空', trigger: 'blur' }
        ],
        formClassId: [
          { required: true, message: '必填字段不能为空', trigger: 'change' }
        ],
      }
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
  props: {
    formId: [String, Number]
  },
  methods: {
    // 初始化
    doCreat () {
      if (sessionStorage.getItem('formId')) {
        this.formId = sessionStorage.getItem('formId')
        this.pageParams.formId = sessionStorage.getItem('formId')
        this.pageParams.formClassId = 0
      } else {
        let formId = this.formId
        sessionStorage.setItem('formId', formId)
        this.pageParams.formId = formId
        this.pageParams.formClassId = 0
      }
      this.getTreeData()
      this.doSearch(0)
    },
    // 查询表格数据
    doSearch (page = 0, size = 10) {
      this.pageParams.pageNum = page
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
          this.tableData = data.records
          this.pageData.total = Number(data.total)
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 获取树结构数据
    getTreeData () {
      let params = {
        formId: this.formId
      }
      this.screenLoading = true
      treeList(params).then(res => {
        this.screenLoading = false
        if (res.code === 0) {
          let data = res.data
          data.treeList.forEach((p, i, arr) => {
            this.doFilter(p)
          })
          this.treeData = [
            {
              id: data.formId,
              label: data.formName,
              children: [],
            }
          ]
          this.treeData[0].children = data.treeList
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 递归数据
    doFilter (data) {
      if (data.childList && data.childList.length > 0) {
        data.id = data.formClassId
        data.value = data.formClassId
        data.label = data.formClassName
        data.children = data.childList
        data.children.forEach((p, i, arr) => {
          this.doFilter(p)
        })
      } else {
        data.id = data.formClassId
        data.value = data.formClassId
        data.label = data.formClassName
        data.children = data.childList
        return false
      }
    },
    // 点击当前节点
    doTreeClick (data) {
      this.row = data
      if (data.pid) {
        this.pageParams.formClassId = data.id
        this.pageParams.formId = 0
      } else {
        this.pageParams.formClassId = 0
        this.pageParams.formId = data.id
      }
      this.doSearch()
    },
    // 添加树子类
    doAddTree (node, data) {
      console.log(node, data)
      this.formName = ""
      this.addTreeProp = true
      this.row = data
    },
    // 修改树子类
    doEditTree (node, data) {
      this.row = data
      this.formName = data.label
      this.editTreeProp = true
    },
    // 删除树子类
    doDeleTree (node, data) {
      this.row = data
      this.deleTreeProp = true
    },
    // 确定添加树子类
    doAddTrees (data) {
      let params = {
        employeeId: getEmployeeId(),
        name: this.formName,
        formId: this.formId,
        pid: this.row.id,
        id: 0
      }
      if (!this.row.pid) {
        params.pid = 0
      }
      this.screenLoading = true
      treeAdd(params).then(res => {
        this.screenLoading = false
        this.addTreeProp = false
        if (res.code === 0) {
          this.doRefresh()
          this.getData()
          this.getTreeData()
          this.$message({ message: res.msg, type: 'success' })
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 确定修改树子类
    doEditTrees () {
      let params = {
        employeeId: getEmployeeId(),
        name: this.formName,
        formId: this.formId,
        id: this.row.id,
        pid: this.row.pid,
      }
      this.screenLoading = true
      treeEdit(params).then(res => {
        this.screenLoading = false
        this.editTreeProp = false
        if (res.code === 0) {
          this.doRefresh()
          this.getData()
          this.getTreeData()
          this.$message({ message: res.msg, type: 'success' })
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 确定删除树子类
    doDeleTrees () {
      let params = {
        employeeId: getEmployeeId(),
        id: this.row.id
      }
      this.screenLoading = true
      treeDele(params).then(res => {
        this.screenLoading = false
        this.deleTreeProp = false
        if (res.code === 0) {
          this.doRefresh()
          this.getTreeData()
          this.getData()
          this.$message({ message: res.msg, type: 'success' })
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
      this.pageParams.pageNum = 0
    },
    // 添加表格评价表弹窗
    doAdd () {
      this.addProp = true
    },
    // 修改表格评价表弹窗
    doEdit (row) {
      this.editProp = true
      this.row = row
      this.screenLoading = true
      formDetail(row.formClassItemId).then(res => {
        this.screenLoading = false
        if (res.code === 0) {
          let data = res.data
          // data.formClassId = data.formClassName
          data.important = data.important === 1 ? true : false
          this.editForm = JSON.parse(JSON.stringify(data))
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 查看表格评价表弹窗
    doDetail (row) {
      this.detailProp = true
      this.screenLoading = true
      formDetail(row.formClassItemId).then(res => {
        this.screenLoading = false
        if (res.code === 0) {
          let data = res.data
          data.formClassId = data.formClassName
          data.important = data.important === 1 ? true : false
          this.detailForm = JSON.parse(JSON.stringify(data))
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 删除表格评价表弹窗
    doDelete (row) {
      this.row = row
      this.deleteProp = true
    },
    // 创建考评项提交操作
    doAddConfirm (ruleForm) {
      if (this.addForm.formClassId.length === 0) {
        this.$message({ message: '请选择考评分类', type: 'error' })
        return
      }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let important = this.addForm.important ? 1 : 0,
            formClassId = this.addForm.formClassId[this.addForm.formClassId.length - 1]
          let form = {
            important: important,                       // 是否重要项 1：是 0：不是
            formClassId: formClassId,                   // 考评类id
            employeeId: getEmployeeId(),                // 操作者职员id
            grading: this.addForm.grading,              // 评价标准
            fullScore: this.addForm.fullScore,          // 分值
            formId: this.formId,                        // 表格类id
          }
          this.screenLoading = true
          formAdd(form).then(res => {
            this.screenLoading = false
            if (res.code === 0) {
              this.addProp = false
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
    // 修改考评项提交操作
    doEditConfirm (ruleForm) {
      if (this.editForm.formClassId.length === 0) {
        this.$message({ message: '请选择考评分类', type: 'error' })
        return
      }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let important = this.editForm.important ? 1 : 0,
            formClassId = this.editForm.formClassId[this.editForm.formClassId.length - 1]
          let form = {
            important: important,                             // 是否重要项 1：是 0：不是
            formClassId: formClassId,
            formClassItemId: this.editForm.formClassItemId,   // 考评类id
            employeeId: getEmployeeId(),                      // 操作者职员id
            grading: this.editForm.grading,                   // 评价标准
            fullScore: this.editForm.fullScore,               // 分值
            formId: this.formId,                              // 表格类id
          }
          this.screenLoading = true
          formEdit(form).then(res => {
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
    // 删除考评项提交操作
    doDeleteConfirm (ruleForm) {
      let form = {
        id: this.row.formClassItemId,
        employeeId: getEmployeeId()
      }
      this.screenLoading = true
      formDelete(form).then(res => {
        this.screenLoading = false
        if (res.code === 0) {
          this.deleteProp = false
          this.$message({ message: res.msg, type: 'success' })
          this.doSearch()
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 返回上一级
    doBack () {
      this.$emit('doChildClose')
      sessionStorage.removeItem('formId')
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
.el-row,
.el-col,
.el-tree {
  height: inherit;
}
.el-tree {
  overflow: hidden;
  overflow-y: auto;
}
.el-select {
  width: 100%;
}
.table-san {
  display: inline;
  top: -3px;
  position: relative;
}
</style>
<style>
.custom-tree-node span button:first-child {
  padding-left: 20px;
}
</style>
