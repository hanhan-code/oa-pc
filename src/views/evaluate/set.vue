<template>
  <div class="page">
    <el-form :model="setForm" :rules="rules" ref="setForm" label-width="120px">
      <el-form-item label="评价标准:" prop="name"></el-form-item>
      <el-form-item label="评价项目" prop="id">
        <el-select v-model="setForm.id" filterable clearable placeholder="请选择项目">
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item, index) in projectList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优得分率%" prop="fine">
        <el-col :span="5">
          <el-input
            v-model="setForm.fine"
            type="number"
            style="width: 180px"
            @blur="doFine"
            placeholder=">=90%"
          ></el-input>
        </el-col>
        <el-col :span="8" align="center">
          <el-form-item label="并且单张表得分率%" prop="fineSingle" label-width="160px">
            <el-input
              v-model="setForm.fineSingle"
              type="number"
              @blur="doFineSingle"
              style="width: 180px"
              placeholder=">=85%"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="良得分率%" prop="good">
        <el-col :span="5">
          <el-input
            v-model="setForm.good"
            type="number"
            @blur="doWell"
            style="width: 180px"
            placeholder="90% - 80%"
          ></el-input>
        </el-col>
        <el-col :span="8" align="center">
          <el-form-item label="并且单张表得分率%" prop="goodSingle" label-width="160px">
            <el-input
              v-model="setForm.goodSingle"
              @blur="doWellSingle"
              type="number"
              style="width: 180px"
              placeholder="85% - 75%"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="一般得分率%" prop="common">
        <el-col :span="5">
          <el-input
            v-model="setForm.common"
            @blur="doCommon"
            type="number"
            style="width: 180px"
            placeholder="80% - 60%"
          ></el-input>
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
  projectData
} from '@/api/evaluate/evaluateProject'

export default {
  data () {
    return {
      screenLoading: false,                      // 全局加载
      companyList: [],                           // 公司组织架构-所有人员列表
      projectList: [],                           // 公司项目列表
      setForm: {
        id: '',                                  // 项目id
        fine: '',                                // 优 得分率
        good: '',                                // 良 得分率
        common: '',                              // 一般得分率
        fineSingle: '',                          // 优 单表得分率
        goodSingle: '',                          // 良 单表得分率
        important: false,                        // 重要项(0:正常，1：重要)
        reAse: false,                            // 是否可重评（0：不可；1可重评）
        noticeMethod: [],                        // 通知方式 1系统消息，2企业微信，3邮件通知 逗号分隔
        notice: [],                              // 评审完通知人 id 1546，1564，1564 逗号分隔
      },
      rules: {
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
    this.getCompanyData()
    this.getProjectData()
    this.doCreat()
  },
  mounted () {

  },
  methods: {
    doCreat () {
      // this.companyList = [
      //   {
      //     "id": "694933565493055488",
      //     "label": "任淑凡"
      //   },
      //   {
      //     "id": "627531100963835904",
      //     "label": "范伟伟"
      //   },
      //   {
      //     "id": "627531101530066944",
      //     "label": "戴宪锁"
      //   },
      //   {
      //     "id": "456253109877458796",
      //     "label": "葛浩天"
      //   },
      //   {
      //     "id": "684720845036556288",
      //     "label": "聂方龙"
      //   },
      //   {
      //     "id": "684721784237690880",
      //     "label": "陈韩"
      //   },
      //   {
      //     "id": "689844882410672128",
      //     "label": "曾飞"
      //   }
      // ]
    },
    // 根据企业id获取所有项目id
    getProjectData () {
      projectData({ companyId: getCompanyId() }).then(res => {
        if (res.code === 0) {
          let data = res.data
          this.projectList = data
        }
      })
    },
    // 根据公司id获取所有项目
    getCompanyData () {
      // this.companyId // 公司id暂时先默认为1001
      companyData(getCompanyId()).then(res => {
        if (res.code === 0) {
          let data = res.data
          data.children.forEach((p, i, arr) => {
            if (p.children) {
              p.children.forEach((k, v, arr1) => {
                if (k.children) {
                  k.children.forEach((n, o, arr2) => {
                    if (n.children) {
                      n.children.forEach(q => {
                        this.companyList.push({ id: q.id, label: q.label })
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    },
    // 优单表得分率
    doFine (e) {
      let value = e.target.value
      if (value.indexOf('.') > 0) {
        this.setForm.fine = parseInt(value)
      }
    },
    // 优单表得分率
    doFineSingle (e) {
      let value = e.target.value
      if (value.indexOf('.') > 0) {
        this.setForm.fineSingle = parseInt(value)
      }
    },
    // 良得分率
    doWell (e) {
      let value = e.target.value
      if (value.indexOf('.') > 0) {
        this.setForm.good = parseInt(value)
      }
      if (value !== '' && value >= Number(this.setForm.fine)) {
        this.setForm.good = this.setForm.fine
        this.$message({ message: '良得分率不能高于优得分率', type: 'error' })
      }
    },
    // 单张表良得分率
    doWellSingle (e) {
      let value = e.target.value
      if (value.indexOf('.') > 0) {
        this.setForm.goodSingle = parseInt(value)
      }
      if (value !== '' && value >= Number(this.setForm.fineSingle)) {
        this.setForm.goodSingle = this.setForm.fineSingle
        this.$message({ message: '单张表 良得分率不能高于优得分率', type: 'error' })
      }
    },
    // 良得分率
    doCommon (e) {
      let value = e.target.value
      this.setForm.common = parseInt(value)
      if (value !== '' && value >= Number(this.setForm.good)) {
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
            projectId: this.setForm.id,
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