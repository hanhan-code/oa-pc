<template>
  <div class="page">
    <el-form :model="addForm" :rules="rules" ref="addForm" label-width="180px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="addForm.projectName" disabled placeholder="请填写项目"></el-input>
      </el-form-item>
      <el-form-item label="工程专业类别">
        <el-input v-model="addForm.typeName" disabled placeholder="请填写工程专业类别"></el-input>
      </el-form-item>
      <el-form-item label="工程专业等级" prop="sepLevelId">
        <el-select v-model="addForm.sepLevelId" filterable clearable placeholder="请选择项目">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in dictMap.project_level"
            :key="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总监姓名" prop="majordomoName">
        <el-autocomplete
          v-model="addForm.majordomoName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请填写总监姓名"
          @select="doSelectName"
          :trigger-on-focus="false"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="执业证书号" prop="certificateNum">
        <el-input v-model="addForm.certificateNum" placeholder="请填写执业证书号"></el-input>
      </el-form-item>
      <el-form-item label="本次评价属于" prop="belongToType">
        <el-Input v-model="addForm.belongTo" disabled filterable clearable placeholder="请填写"></el-Input>
      </el-form-item>
      <el-form-item label="工程形象进度" prop="visualProgress">
        <el-input v-model="addForm.visualProgress" type="textarea" placeholder="请填写工程形象进度"></el-input>&nbsp;
      </el-form-item>
      <el-form-item label="项目监理机构工作评价">
        <el-table size="small" :data="formInfoList" border v-show="formInfoList.length > 0">
          <el-table-column type="index" label="序号" align="center
          "></el-table-column>
          <el-table-column label="表的名称" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.formName}}%</template>
          </el-table-column>
          <el-table-column label="得分率%" align="center">
            <template slot-scope="scope">{{scope.row.scoreRate}}%</template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="项目监理机构评价等级" prop="assLevel">
        <el-select v-model="addForm.assLevel" filterable clearable placeholder="请选择">
          <el-option
            :label="item.text"
            :value="item.value"
            v-for="item in assLevelList"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>>

<script>
import initDict from '@/mixins/initDict'

import {
  endSubmit,
  endData,
  employeeData
} from '@/api/evaluateProject/evaluateProject'
import {
  companyData
} from '@/api/common'
import { getCompanyId, getEmployeeId } from '@/utils/auth'


export default {
  mixins: [initDict],
  data () {
    return {
      screenLoading: false,
      companyList: [],
      timeout: null,
      sepLevelColumns: [], // 工程专业等级（对应字典project_level 1：一级；2：二级；3：三级）
      addForm: {
        projectName: '123', // 项目名称
        sepLevelName: '一级', // 工程专业等级名称
        sepLevelId: '',  //工程专业等级（对应字典project_level 1：一级；2：二级；3：三级）
        majordomoName: '',  //总监姓名
        typeName: '',
        majordomoId: 0, // 总监id
        certificateNum: '',  //执业证书号
        belongToType: '1',  //工程属于（1项目监理机构自我评价; 2监理单位对项目监理机构工作的考核评价；3 建设单位对项目监理机构工作的考核评价；4其他）
        visualProgress: '',  //工程形象进度
        assLevel: 1,  //评价等级(1优秀 2良 3一般 4不合格)
      },
      rules: {
        sepLevelId: [
          { required: true, message: '必填字段不能为空', trigger: 'change' }
        ],
        majordomoName: [
          { required: true, message: '必填字段不能为空', trigger: 'blur' }
        ],
        certificateNum: [
          { required: true, message: '必填字段不能为空', trigger: 'blur' }
        ],
        visualProgress: [
          { required: true, message: '必填字段不能为空', trigger: 'blur' }
        ],
        assLevel: [
          { required: true, message: '请选择人员', trigger: 'change' }
        ]
      },
      formInfoList: [],  // 项目监理机构工作评价
      assLevelList: [// 评价等级
        // { text: '请选择 ', value: -1 },
        { text: '优秀 ', value: 1 },
        { text: '良', value: 2 },
        { text: '一般', value: 3 },
        { text: '不合格', value: 4 },
      ],
    }
  },
  watch: {
    num () {
      this.doSubmit('addForm')
    }
  },
  props: ['projectCommentId', 'num'],
  created () {
    this.doCreat()
  },
  methods: {
    doCreat () {
      this.getCompany()
      this.getDictMap('em_register_major,project_level')
      this.getData()
    },
    querySearchAsync (value, cb) {
      this.addForm.majordomoId = 0
      let arr = []
      this.companyList.forEach(p => {
        if ((p.label).indexOf(value) > 0) {
          let obj = {
            value: p.label,
            id: p.id
          }
          arr.push(obj)
        }
      })
      cb(arr);
    },
    doSelectName (item) {
      this.addForm.majordomoId = item.id
    },
    // 获取展示list
    getData () {
      let params = {
        projectCommentId: this.projectCommentId
      }
      this.screenLoading = true
      endData(params).then((res) => {
        this.screenLoading = false
        if (res.code === 0) {
          let data = res.data
          this.addForm = data
          this.dictMap.em_register_major.forEach(p => {
            if (p.value === data.typeId) {
              this.$set(this.addForm, 'typeName', p.label)
            }
          })
          this.formInfoList = data.formInfoList
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
              this.companyList.push({ id: p.employeeId, label: p.label, value: p.label })
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
    // 提交
    doSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.addForm.projectName
          let params = this.addForm
          this.screenLoading = true
          endSubmit(params).then(res => {
            this.screenLoading = false
            if (res.code === 0) {
              this.$emit('doEndClose')
              this.$message({ message: res.msg, type: 'success' })
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
  overflow-y: auto;
}
</style>