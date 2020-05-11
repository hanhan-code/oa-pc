<template>
  <div class="page">
    <el-form :model="addForm" :rules="rules" ref="addForm" label-width="180px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="addForm.projectName" readonly placeholder="请填写项目"></el-input>
      </el-form-item>
      <el-form-item label="工程专业类别">
        <el-input v-model="addForm.typeName" readonly placeholder="请填写工程专业类别"></el-input>
      </el-form-item>
      <el-form-item label="工程专业等级" prop="sepLevelName">
        <el-select v-model="addForm.sepLevelId" filterable clearable placeholder="请选择项目">
          <el-option
            :label="item.text"
            :value="item.value"
            v-for="item in sepLevelColumns"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总监姓名" prop="majordomoName">
        <el-input v-model="addForm.majordomoName" @input="doNameChange" placeholder="请填写总监姓名"></el-input>
      </el-form-item>
      <el-form-item label="执业证书号" prop="certificateNum">
        <el-input v-model="addForm.certificateNum" placeholder="请填写执业证书号"></el-input>
      </el-form-item>
      <el-form-item label="本次评价属于" prop="belongToType">
        <el-select v-model="addForm.belongToType" filterable clearable placeholder="请选择">
          <el-option
            :label="item.text"
            :value="item.value"
            v-for="item in belongList"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工程形象进度" prop="visualProgress">
        <el-input v-model="addForm.visualProgress" type="textarea" placeholder="请填写执业证书号"></el-input>
      </el-form-item>
      <el-form-item label="项目监理机构工作评价">
        <br />
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
      <el-form-item label="项目监理机构评价等级" prop="belongToType">
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
import { getCompanyId, getEmployeeId } from '@/utils/auth'

import {
  endSubmit,
  endData,
  employeeData
} from '@/api/evaluateProject/evaluateProject'


export default {
  data () {
    return {
      screenLoading: false,
      projectCommentId: null, // 当前项目人员id

      sepLevelColumns: [
        {
          text: '一级',
          value: 1
        },
        {
          text: '二级',
          value: 2
        },
        {
          text: '三级',
          value: 3
        },
      ], // 工程专业等级（对应字典project_level 1：一级；2：二级；3：三级）
      addForm: {
        projectName: '123', // 项目名称
        sepLevelName: '一级', // 工程专业等级名称
        sepLevelId: 1,  //工程专业等级（对应字典project_level 1：一级；2：二级；3：三级）
        majordomoName: '',  //总监姓名
        majordomoId: 0, // 总监id
        certificateNum: '',  //执业证书号
        belongToType: '1',  //工程属于（1项目监理机构自我评价; 2监理单位对项目监理机构工作的考核评价；3 建设单位对项目监理机构工作的考核评价；4其他）
        visualProgress: '',  //工程形象进度
        assLevel: 1,  //评价等级(1优秀 2良 3一般 4不合格)
      },
      rules: {
        sepLevelName: [
          { required: true, message: '必填字段不能为空', trigger: 'change' }
        ],
        majordomoName: [
          { required: true, message: '必填字段不能为空', trigger: 'blur' }
        ],
        certificateNum: [
          { required: true, message: '必填字段不能为空', trigger: 'blur' }
        ],
        belongToType: [
          { required: true, message: '必填字段不能为空', trigger: 'change' }
        ],
        visualProgress: [
          { required: true, message: '必填字段不能为空', trigger: 'blur' }
        ],
        assLevel: [
          { required: true, message: '请选择人员', trigger: 'change' }
        ]
      },
      dictList: [  //注册专业 props: name 值为 register
        '未知',
        '房屋建筑工程',
        '冶炼工程',
        '矿山工程',
        '化工石油工程',
        '水利水电工程',
        '电力工程',
        '农林工程',
        '铁路工程',
        '公路工程',
        '港口与航道工程',
        '航天航空工程',
        '通信工程',
        '市政公用工程',
        '机电安装工程',
      ],
      formInfoList: [],  // 项目监理机构工作评价
      addRule: { // 表单验证
        sepLevelId: [{ required: true, message: ' ' }],  //工程专业等级（对应字典project_level 1：一级；2：二级；3：三级）
        sepLevelName: [{ required: true, message: ' ' }], // 工程专业等级
        majordomoName: [{ required: true, message: ' ' }],  //总监姓名
        certificateNum: [{ required: true, message: ' ' }],  //执业证书号
        belongToType: [{ required: true, message: ' ' }],  //工程属于（1项目监理机构自我评价; 2监理单位对项目监理机构工作的考核评价；3 建设单位对项目监理机构工作的考核评价；4其他）
        visualProgress: [{ required: true, message: ' ' }],  //工程形象进度
        assLevel: [{ required: true, message: ' ' }],  //评价等级(1优秀 2良 3一般 4不合格)
      },
      belongList: [ // 近期日期下拉参数
        { text: '项目监理机构自我评价', value: '1' },
        { text: '监理单位对项目监理机构工作的考核评价', value: '2' },
        { text: '建设单位对项目监理机构工作的考核评价', value: '3' },
        { text: '其他', value: '4' },
      ],
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
      this.getData()
    },
    // 获取展示list
    getData () {
      let params = {
        projectCommentId: this.projectCommentId
      }
      this.screenLoading = true
      endData(params).then((res) => {
        this.screenLoading = false
        console.log(res)
        if (res.code === 0) {
          let data = res.data
          console.log(data)
          this.$set(this.addForm, 'projectName', data.projectName)
          this.$set(this.addForm, 'typeId', data.typeId)
          this.$set(this.addForm, 'assLevel', data.assLevel)
          this.$set(this.addForm, 'assLevel', data.assLevel)
          this.$set(this.addForm, 'projectCommentId', data.projectCommentId)
          this.$set(this.addForm, 'projectId', data.projectId)
          this.$set(this.addForm, 'typeName', this.dictList[Number(data.typeId)])
          this.formInfoList = data.formInfoList
          this.dictProp = true
        }
      })
    },
    // 总监姓名获取
    doNameChange (value) {
      let reg = /([^\u4e00-\u9fa5]$)/g
      if (value === '') {
        return
      } else if (reg.test(value)) {
        this.$message({ message: '请输入正确的名称', type: 'error' })
        return
      }
      let params = {
        companyId: getCompanyId(),
        employeeName: value
      }
      employeeData(params).then(res => {
        let data = res.data
        if (data.code === 0) {
          if (data.length === 0) {
            this.addForm.majordomoId = 0
          } else {
            data.forEach(p => {
              if (p.value === this.addForm.majordomoName) {
                this.addForm.majordomoId = p.employeeId
              }
            })
          }
        }
      })
    },
    // 提交
    doSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.addForm
          params.belongTo = (this.belongList.filter(p => p.value === this.addForm.belongToType))[0].text
          this.screenLoading = true
          endSubmit(params).then(res => {
            this.screenLoading = false
            if (res.code === 0) {
              this.$emit('doEndClose')
              this.$message({ message: res.msg, type: 'success' })
              this.$router.push('/evaluateProject')
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