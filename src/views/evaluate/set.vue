<template>
  <div class="page">
    <el-form :model="setForm" :rules="rules" ref="setForm" label-width="120px">
      <el-form-item label="评价标准:" prop="name"></el-form-item>
      <el-form-item label="项目" prop="projectId">
        <el-select
          v-model="setForm.projectId"
          filterable
          style="width: 180px"
          clearable
          placeholder="请选择项目"
          @change="getSetData"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item, index) in projectList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评价名称" prop="projectCommentId">
        <el-select
          v-model="setForm.projectCommentId"
          filterable
          style="width: 180px"
          clearable
          @change="doChooseProject"
          @visible-change="doNext"
          placeholder="请选择项目"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item, index) in projectData"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优得分率>=" prop="fine">
        <el-col :span="8">
          <el-input
            v-model="setForm.fine"
            type="number"
            style="width: 180px"
            @input="doFine"
            placeholder="90"
          ></el-input>&nbsp;%
        </el-col>
        <el-col :span="15">
          <el-form-item label="并且单张表得分率>=" prop="fineSingle" label-width="160px">
            <el-input
              v-model="setForm.fineSingle"
              type="number"
              @input="doFineSingle"
              style="width: 180px"
              placeholder="85"
            ></el-input>&nbsp;%
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="良得分率>=" prop="good">
        <el-col :span="8">
          <el-input
            v-model="setForm.good"
            type="number"
            @input="doWell"
            style="width: 180px"
            placeholder="80"
          ></el-input>&nbsp;%
        </el-col>
        <el-col :span="15">
          <el-form-item label="并且单张表得分率>=" prop="goodSingle" label-width="160px">
            <el-input
              v-model="setForm.goodSingle"
              @input="doWellSingle"
              type="number"
              style="width: 180px"
              placeholder="75"
            ></el-input>&nbsp;%
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="一般得分率>=" prop="common">
        <el-col :span="8">
          <el-input
            v-model="setForm.common"
            @input="doCommon"
            type="number"
            style="width: 180px"
            placeholder="60"
          ></el-input>&nbsp;%
        </el-col>
      </el-form-item>
      <el-form-item prop="important">
        <template slot="label">
          <i class="table-san san-color"></i>重要评分项
        </template>
        <el-switch v-model="setForm.important"></el-switch>
      </el-form-item>
      <el-form-item label="重评项目" prop="reAse">
        <el-switch v-model="setForm.reAse"></el-switch>
      </el-form-item>
      <el-form-item label="评审完成后通知" prop="notice">
        <el-select
          v-model="setForm.notice"
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
      <el-form-item label="通知方式" prop="noticeMethod">
        <el-checkbox-group v-model="setForm.noticeMethod">
          <el-checkbox label="1" name="type">系统消息</el-checkbox>
          <el-checkbox label="2" name="type">企业微信</el-checkbox>
          <el-checkbox label="3" name="type">邮件通知</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="doReset('setForm')">取消</el-button>
        <el-button type="primary" @click="doSubmit('setForm')">提交</el-button>
      </el-form-item>
    </el-form>
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>>

<script>
import { getCompanyId, getEmployeeId } from '@/utils/auth'

import {
  fineRule,
  fineRules,
  wellRule,
  wellRules,
  comRule,
} from './rule'

import {
  requireContent,
} from '@/utils/rule'

import {
  companyData,
  setSubmit,
  projectData,
  setData,
  evaluateProject
} from '@/api/evaluate/evaluateProject'

export default {
  data () {
    return {
      screenLoading: false,                      // 全局加载
      projectName: '',                           // 评价项目
      companyList: [],                           // 公司组织架构-所有人员列表
      projectList: [],                           // 公司项目列表
      projectData: [],                           // 评价项目列表
      setForm: {
        projectId: '',                           // 项目id
        id: null,                                // 评价设置id
        projectCommentId: '',                    // 评价项id
        fine: '',                                // 优 得分率
        good: '',                                // 良 得分率
        common: '',                              // 一般得分率
        fineSingle: '',                          // 优 单表得分率
        goodSingle: '',                          // 良 单表得分率
        important: true,                        // 重要项(0:正常，1：重要)
        reAse: true,                            // 是否可重评（0：不可；1可重评）
        noticeMethod: [],                        // 通知方式 1系统消息，2企业微信，3邮件通知 逗号分隔
        notice: [],                              // 评审完通知人 id 1546，1564，1564 逗号分隔
      },
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ],
        projectCommentId: [
          { required: true, message: '请选择评价项目', trigger: 'blur' }
        ],
        fine: [
          { required: true, validator: fineRule, trigger: 'blur' }
        ],
        good: [
          { required: true, validator: wellRule, trigger: 'blur' }
        ],
        common: [
          { required: true, validator: comRule, trigger: 'blur' }
        ],
        fineSingle: [
          { required: true, validator: fineRules, trigger: 'blur' }
        ],
        goodSingle: [
          { required: true, validator: wellRules, trigger: 'blur' }
        ],
        notice: [
          { required: true, message: '请选择人员', trigger: 'change' }
        ],
        noticeMethod: [
          { type: 'array', required: true, message: '请至少选择一种通知方式', trigger: 'change' }
        ]
      }
    };
  },
  watch: {

  },
  computed: {
    // 设置选择框多选时标签数量
    setSubmitTags () {
      let _this = this
      return _this.setForm.notice.length > 4 ? true : false
    }
  },
  created () {
    this.doCreat()
  },
  mounted () {

  },
  methods: {
    // 初始化
    doCreat () {
      this.getCompany()
      this.getProject()
    },
    // 根据项目id获取所有评价项目id
    getSetData (id) {
      evaluateProject(id).then(res => {
        if (res.code === 0) {
          let data = res.data
          data.forEach(p => {
            p.name = p.name || ''
          })
          this.projectData = data
        }
      })
    },
    // 根据企业id获取所有项目id
    getProject () {
      projectData({ companyId: getCompanyId() }).then(res => {
        if (res.code === 0) {
          let data = res.data
          this.projectList = data
        }
      })
    },
    // 评价项目下拉框展开
    doNext (value) {
      if (value && !this.setForm.id) {
        this.$message({ type: 'error', message: '请选择项目' })
      }
    },
    // 选择评价项目
    doChooseProject (id) {
      let params = {
        companyId: getCompanyId(),
        projectCommentId: id
      }
      setData(params).then(res => {
        if (res.code === 0) {
          let data = res.data
          if (data) {
            this.setForm.fine = data.fine
            this.setForm.good = data.good
            this.setForm.common = data.common
            this.setForm.fineSingle = data.fineSingle
            this.setForm.goodSingle = data.goodSingle
            this.setForm.important = data.important === 1 ? true : false
            this.setForm.reAse = data.reAse === 1 ? true : false
            this.setForm.noticeMethod = data.noticeMethod.split(',')
            this.setForm.notice = data.notice.split(',')
          } else {
            for (let v in this.setForm) {
              if (v === 'id') {
                continue
              } else if (v === 'important' || v === 'reAse') {
                this.setForm[v] = true
              } else if (v === 'noticeMethod' || v === 'notice') {
                this.setForm[v] = []
              } else if (v === 'projectCommentId' || v === 'projectId') {
                continue
              } else {
                this.setForm[v] = ''
              }
            }
          }
        }
      })
    },
    // 根据公司id获取所有项目
    getCompany () {
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
    // 优单表得分率
    doFine (num) {
      let value = Number(num)
      this.setForm.fine = value.toFixed(0)
    },
    // 优单表得分率
    doFineSingle (num) {
      let value = Number(num)
      this.setForm.fineSingle = value.toFixed(0)
    },
    // 良得分率
    doWell (num) {
      let value = Number(num)
      this.setForm.good = value.toFixed(0)

      if (value !== '' && value > Number(this.setForm.fine)) {
        this.setForm.good = this.setForm.fine
        this.$message({ message: '良得分率不能高于优得分率', type: 'error' })
      }
    },
    // 单张表良得分率
    doWellSingle (num) {
      let value = Number(num)
      this.setForm.goodSingle = value.toFixed(0)

      if (value !== '' && value > Number(this.setForm.fineSingle)) {
        this.setForm.goodSingle = this.setForm.fineSingle
        this.$message({ message: '单张表 良得分率不能高于优得分率', type: 'error' })
      }
    },
    // 良得分率
    doCommon (num) {
      let value = Number(num)
      this.setForm.common = value.toFixed(0)
      if (value !== '' && value > Number(this.setForm.good)) {
        this.setForm.common = this.setForm.good
        this.$message({ message: '一般得分率不能高于良得分率', type: 'error' })
      }
    },
    // 提交
    doSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            companyId: getCompanyId(),
            employeeId: getEmployeeId(),
            notice: this.setForm.notice.toString(),
            noticeMethod: this.setForm.noticeMethod.toString(),
            important: this.setForm.important ? 1 : 0,
            reAse: this.setForm.reAse ? 1 : 0,
            fine: this.setForm.fine,
            good: this.setForm.good,
            common: this.setForm.common,
            fineSingle: this.setForm.fineSingle,
            goodSingle: this.setForm.goodSingle,
            projectId: this.setForm.projectId,
            id: this.setForm.id || null,
            projectCommentId: this.setForm.projectCommentId
          }
          this.screenLoading = true
          setSubmit(params).then(res => {
            this.screenLoading = false
            if (res.code === 0) {
              this.$message({ message: '设置成功', type: 'success' })
              this.doReset(formName)
            } else {
              this.$message({ message: res.msg, type: 'error' })
            }
          })
        } else {
          return false;
        }
      });
    },
    // 重置
    doReset (formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style scoped>
.page {
  width: 50%;
  margin: 0 auto;
  padding: 10px;
}
.table-san {
  display: inline;
  top: -3px;
  position: relative;
}
.san-color {
  border-color: transparent transparent red transparent;
}
</style>