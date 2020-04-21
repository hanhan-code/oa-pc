<template>
  <div class="app-container">
    <!--左侧 部门数据-->
    <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
      <el-tree
        :data="dept.lefts"
        :expand-on-click-node="false"
        default-expand-all
        @node-click="handleNodeClick"
      />
    </el-col>

    <!--右侧 表格数据，查询操作-->
    <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20">
      <!-- 工具栏 -->
      <div class="head-tools">
        <!-- 搜索 -->
        <el-input
          clearable
          placeholder="员工姓名"
          v-model="searchParams.employeeName"
          size="small"
          style="width: 180px;"
          class="filter-item"
        />
        <el-input
          clearable
          placeholder="员工编号"
          v-model="searchParams.employeeNumber"
          size="small"
          style="width: 180px;"
          class="filter-item"
        />
        <el-select
          style="vertical-align: top; width: 140px"
          size="small"
          clearable
          v-model="searchParams.state"
          placeholder="员工状态"
        >
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          @click="search"
          icon="el-icon-search"
        >查询
        </el-button>
      </div>

      <!-- Tab 面板 切换页面 -->
      <el-tabs
        type="border-card"
        :stretch="true"
        v-model="tabActive"
        @tab-click="tabClick"
        style="margin-top: 5px;border-radius: 8px"
      >
        <el-tab-pane label="学历信息">
          <Education
            ref="education"
            :root-id="dept.rootId"
            :company-id="login.loginUserCompanyId"
            v-if="tabActive === '0'"
          ></Education>
        </el-tab-pane>

        <el-tab-pane label="工作经历">
          <work-experience
            ref="work"
            :root-id="dept.rootId"
            :company-id="login.loginUserCompanyId"
            v-if="tabActive === '1'"
          ></work-experience>
        </el-tab-pane>

        <el-tab-pane label="项目经验">
          <project-experience
            ref="project"
            :root-id="dept.rootId"
            :company-id="login.loginUserCompanyId"
            v-if="tabActive === '2'"
          ></project-experience>
        </el-tab-pane>

        <el-tab-pane label="社会关系">
          <social-relation
            ref="relation"
            :root-id="dept.rootId"
            :company-id="login.loginUserCompanyId"
            v-if="tabActive === '3'"
          ></social-relation>
        </el-tab-pane>

        <el-tab-pane label="获奖记录">
          <win-prize
            ref="win"
            :root-id="dept.rootId"
            :company-id="login.loginUserCompanyId"
            v-if="tabActive === '4'"
          ></win-prize>
        </el-tab-pane>

        <el-tab-pane label="职称记录">
          <job-title
            ref="job"
            :root-id="dept.rootId"
            :company-id="login.loginUserCompanyId"
            v-if="tabActive === '5'"
          ></job-title>
        </el-tab-pane>

        <el-tab-pane label="执业资质">
          <qualification
            ref="qualification"
            :root-id="dept.rootId"
            :company-id="login.loginUserCompanyId"
            v-if="tabActive === '6'"
          ></qualification>
        </el-tab-pane>

        <el-tab-pane label="注册记录">
          <register
            ref="register"
            :root-id="dept.rootId"
            :company-id="login.loginUserCompanyId"
            v-if="tabActive === '7'"
          ></register>
        </el-tab-pane>

        <el-tab-pane label="资质延续">
          <continue-education
            ref="continue"
            :root-id="dept.rootId"
            :company-id="login.loginUserCompanyId"
            v-if="tabActive === '8'"
          ></continue-education>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </div>
</template>

<script>

  import { getOrgExcludeEmployee } from '@/api/synch'
  import { getUserId, getCompanyId } from '@/utils/auth'
  import Education from './eudcation/index'
  import WorkExperience from './work/index'
  import ProjectExperience from './project/index'
  import SocialRelation from './relation/index'
  import WinPrize from './win/index'
  import JobTitle from './title/index'
  import Qualification from './qualification/index'
  import Register from './register/index'
  import ContinueEducation from './continue/index'

  export default {
    name: 'index',
    components: {
      Education,
      WorkExperience,
      ProjectExperience,
      SocialRelation,
      WinPrize,
      JobTitle,
      Qualification,
      Register,
      ContinueEducation
    },
    data() {
      return {
        // 当前登陆用户信息
        login: {
          loginUserId: null,
          loginUserCompanyId: null
        },
        dept: {
          lefts: [],                                      // 左侧 组织架构 部门列表
          id: null,                                        // 所选部门ID
          rootId: null                                     // 公司ID 最顶级部门为公司
        },
        stateOptions: [{ label: '在职', value: 1 }, { label: '离职', value: 2 }],                        // 员工状态选择项
        tabActive: '0',                                                                                 // Tab 面板默认值
        searchParams: {
          state: null,
          employeeName: null,
          employeeNumber: null
        } // 查询绑定参数
      }
    },
    mounted() {
      this.init()
    }
    ,
    methods: {

      // 页面初始化
      init() {
        this.setLoginInfo()
      },

      // 设置默认查询用户、公司ID
      setLoginInfo() {

        // 初始化用户Id 、公司主键
        this.login.loginUserId = getUserId()
        this.login.loginUserCompanyId = getCompanyId()

        this.setOrgInfo()
      },

      // 设置组织架构、部门列表信息
      setOrgInfo() {
        getOrgExcludeEmployee(this.login.loginUserCompanyId).then(res => {
          if (res.code === 0) {
            this.dept.lefts = []
            this.dept.lefts.push(res.data)
            this.dept.rootId = res.data.id
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },

      // 面板切换 清楚复杂搜索条件
      tabClick() {
        this.searchParams.state = null
        this.searchParams.employeeName = null
        this.searchParams.employeeNumber = null
      },

      // 左侧 部门选择查询
      handleNodeClick(data) {

        // 设置所选部门主键，清空复杂查询
        this.dept.id = data.id
        this.searchParams.state = null
        this.searchParams.employeeName = null
        this.searchParams.employeeNumber = null

        switch (this.tabActive) {
          case '0':
            this.$refs.education.searchDeptPage(this.dept.id)
            break
          case '1':
            this.$refs.work.searchDeptPage(this.dept.id)
            break
          case '2':
            this.$refs.project.searchDeptPage(this.dept.id)
            break
          case '3':
            this.$refs.relation.searchDeptPage(this.dept.id)
            break
          case '4':
            this.$refs.win.searchDeptPage(this.dept.id)
            break
          case '5':
            this.$refs.job.searchDeptPage(this.dept.id)
            break
          case '6':
            this.$refs.qualification.searchDeptPage(this.dept.id)
            break
          case '7':
            this.$refs.register.searchDeptPage(this.dept.id)
            break
          case '8':
            this.$refs.continue.searchDeptPage(this.dept.id)
            break
        }
      },

      // 顶部 复杂查询
      search() {

        // 设置当前左侧所选部门
        this.searchParams.deptId = this.dept.id

        switch (this.tabActive) {
          case '0':
            this.$refs.education.searchPage(this.searchParams)
            break
          case '1':
            this.$refs.work.searchPage(this.searchParams)
            break
          case '2':
            this.$refs.project.searchPage(this.searchParams)
            break
          case '3':
            this.$refs.relation.searchPage(this.searchParams)
            break
          case '4':
            this.$refs.win.searchPage(this.searchParams)
            break
          case '5':
            this.$refs.job.searchPage(this.searchParams)
            break
          case '6':
            this.$refs.qualification.searchPage(this.searchParams)
            break
          case '7':
            this.$refs.register.searchPage(this.searchParams)
            break
          case '8':
            this.$refs.continue.searchPage(this.searchParams)
            break
        }
      }

    }
  }
</script>

<style>
  .head-tools {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .head-tools:hover {
    border: 1px solid #ccc;
  }

  /**
      element-UI 树形组件 节点选中 样式
     */
  .el-tree-node.is-current > .el-tree-node__content {
    color: #a3d3ff;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
