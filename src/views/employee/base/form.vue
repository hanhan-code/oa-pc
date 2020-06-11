<template>
  <el-drawer
    :title="isAdd ? '新增员工信息' : '编辑员工信息'"
    :visible.sync="dialog"
    direction="rtl"
    :show-close="false"
    size="725px"
    ref="drawer"
  >
    <div
      class="demo-drawer__content"
      style="padding: 20px; height:calc(100vh - 70px);overflow-x: hidden;overflow-y: auto;"
    >
      <!-- 员工信息表单 -->
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="auto"
        label-suffix=":"
      >
        <el-divider content-position="left">
          <i class="el-icon-s-home"></i>&nbsp;&nbsp;&nbsp;&nbsp;基本信息
        </el-divider>

        <el-form-item label="员工姓名" prop="employeeName" size="small" required label-width="auto">
          <el-input placeholder="员工姓名" v-model="form.employeeName" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="员工编号" prop="employeeNumber" size="small" label-width="auto">
          <el-input v-model="form.employeeNumber" disabled></el-input>
        </el-form-item>

        <el-form-item label="身份证号" prop="identityCard" size="small" label-width="auto">
          <el-input placeholder="身份证号" v-model="form.identityCard" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="移动电话" prop="phone" size="small" label-width="auto">
          <el-input placeholder="移动电话" v-model="form.phone" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="身份证有效期" size="small" prop="identityValidity" label-width="auto">
          <el-date-picker
            v-model="form.identityValidity"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="mask"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex" :disabled="mask">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="年龄" prop="age" size="small" label-width="auto">
          <el-input placeholder="自动生成" v-model="form.age" disabled></el-input>
        </el-form-item>

        <el-form-item label="学历" size="small" prop="education">
          <el-select v-model="form.education" placeholder="教育程度" :disabled="mask">
            <el-option
              v-for="item in dictMap.em_education"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职称" size="small" prop="jobTitle">
          <el-select v-model="form.jobTitle" placeholder="职称" :disabled="mask">
            <el-option
              v-for="item in dictMap.em_job_title"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="籍贯" prop="nativePlace" size="small" label-width="auto">
          <el-input placeholder="籍贯" v-model="form.nativePlace" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="民族" size="small" prop="nation">
          <el-select v-model="form.nation" placeholder="民族" :disabled="mask">
            <el-option
              v-for="item in dictMap.em_nation"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="身高" prop="height" size="small" label-width="auto">
          <el-input placeholder="身高（厘米）" v-model="form.height" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="体重" prop="weight" size="small" label-width="auto">
          <el-input placeholder="体重（千克）" v-model="form.weight" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="腰围" prop="waistline" size="small" label-width="auto">
          <el-input placeholder="腰围（厘米）" v-model="form.waistline" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="鞋码" prop="shoeSize" size="small" label-width="auto">
          <el-input placeholder="鞋码（中国码）" v-model="form.shoeSize" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="健康状况" prop="health" size="small" label-width="auto">
          <el-input placeholder="健康状况" v-model="form.health" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="婚姻" size="small" prop="marriage">
          <el-select v-model="form.marriage" placeholder="婚姻状况" :disabled="mask">
            <el-option
              v-for="item in dictMap.em_marriage"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="政治面貌" size="small" prop="politicCountenance">
          <el-select v-model="form.politicCountenance" placeholder="政治面貌" :disabled="mask">
            <el-option
              v-for="item in dictMap.em_politic_countenance"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否工会会员" prop="unionMember">
          <el-switch v-model="form.unionMember" :disabled="mask"></el-switch>
        </el-form-item>

        <el-form-item label="所属部门" size="small" prop="nameList">
          <el-dropdown trigger="click">
            <el-select
              v-model="form.nameList"
              value-key="id"
              popper-class="select-dept"
              clearable
              multiple
              :style="style"
              @clear="doClear"
              @remove-tag="doClearTag"
              collapse-tags
              placeholder="请选择"
            ></el-select>
            <el-dropdown-menu slot="dropdown">
              <el-tree
                :data="depts"
                show-checkbox
                node-key="id"
                ref="tree"
                accordion
                :default-expanded-keys="form.deptIds"
                :default-checked-keys="form.deptIds"
                check-strictly
                @check="nodeClick"
              ></el-tree>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <el-form-item label="所属岗位" size="small">
          <el-select v-model="form.jobs" placeholder="岗位" multiple collapse-tags :disabled="mask">
            <el-option v-for="item in jobs" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工作状态" size="small" prop="workStatus">
          <el-select v-model="form.workStatus" placeholder="工作状态" :disabled="mask">
            <el-option
              v-for="item in dictMap.em_work_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-divider content-position="left">
          <i class="el-icon-s-ticket"></i>&nbsp;&nbsp;&nbsp;&nbsp;经历日期
        </el-divider>

        <el-form-item label="出生日期" prop="birthDate" size="small" label-width="auto">
          <el-input placeholder="身份证填写完毕自动填充" v-model="form.birthDate" disabled></el-input>
        </el-form-item>

        <el-form-item label="参加工作日期" size="small" prop="joinWorkDate" label-width="auto">
          <el-date-picker
            v-model="form.joinWorkDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="mask"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="入职日期" size="small" prop="entryDate" label-width="auto">
          <el-date-picker
            v-model="form.entryDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="mask"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="入党(团)日期" size="small" prop="joinOrganizationDate" label-width="auto">
          <el-date-picker
            v-model="form.joinOrganizationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="mask"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="试用期结束时间" size="small" prop="trialEndDate" label-width="auto">
          <el-date-picker
            v-model="form.trialEndDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :disabled="mask"
            @change="form.correctionDate = form.trialEndDate"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="转正日期" size="small" prop="correctionDate" label-width="auto">
          <el-date-picker
            v-model="form.correctionDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :disabled="mask"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="离职日期" size="small" prop="leaveDate" label-width="auto">
          <el-date-picker
            v-model="form.leaveDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="mask || form.workStatus == 1"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="监理工作年限" prop="supervisorWorkLife" size="small" label-width="auto">
          <el-input placeholder v-model="form.supervisorWorkLife" :disabled="mask"></el-input>
        </el-form-item>

        <el-divider content-position="left">
          <i class="el-icon-phone"></i>&nbsp;&nbsp;&nbsp;&nbsp;联系方式
        </el-divider>

        <el-form-item label="办公电话" prop="officeTelephone" size="small" label-width="auto">
          <el-input placeholder="办公电话" v-model="form.officeTelephone" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email" size="small" label-width="auto">
          <el-input placeholder="邮箱" v-model="form.email" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="QQ" prop="qq" size="small" label-width="auto">
          <el-input placeholder="QQ" v-model="form.qq" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="家庭联系人" prop="familyContacts" size="small" label-width="auto">
          <el-input placeholder="家庭联系人" v-model="form.familyContacts" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="家庭电话" prop="homePhone" size="small" label-width="auto">
          <el-input placeholder="家庭电话" v-model="form.homePhone" :disabled="mask"></el-input>
        </el-form-item>

        <el-divider content-position="left">
          <i class="el-icon-info"></i>&nbsp;&nbsp;&nbsp;&nbsp;户口信息
        </el-divider>

        <el-form-item label="户籍性质" prop="householdRegister" size="small" label-width="auto">
          <el-input placeholder="户籍性质" v-model="form.householdRegister" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item
          label="户籍所在地"
          prop="householdRegisterLocation"
          size="small"
          label-width="auto"
        >
          <el-input placeholder="户籍所在地" v-model="form.householdRegisterLocation" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="暂住证号" prop="temporaryResidencePermit" size="small" label-width="auto">
          <el-input placeholder="暂住证号" v-model="form.temporaryResidencePermit" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item
          label="暂住证有效期"
          size="small"
          prop="temporaryResidencePermitValidity"
          label-width="auto"
        >
          <el-date-picker
            v-model="form.temporaryResidencePermitValidity"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="mask"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <div class="demo-drawer__footer" style="float: right; margin-top: 20px">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="doSubmit" type="primary" :disabled="mask">确 定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { add, edit, generatorNumber, infoById } from '@/api/employee/employee'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'FormEdit',
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dictMap: {
      em_education: Object,                   // 学历信息
      em_job_title: Object,                   // 职称
      em_marriage: Object,                    // 婚姻状况
      em_nation: Object,                      // 民族
      em_politic_countenance: Object,         // 政治面貌
      em_work_status: Object                  // 工作状态
    },
    depts: Array
  },
  data () {
    return {
      mask: false,
      nameList: [], // 用来清除部门数据
      form: {
        id: null,
        companyId: null,
        deptIds: [],
        nameList: [],
        jobs: [],
        employeeNumber: null,
        employeeName: null,
        identityCard: null,

        sex: null,
        photo: null,
        identityValidity: null,
        age: null,
        nativePlace: null,
        height: null,
        weight: null,
        waistline: null,

        shoeSize: null,
        health: null,
        education: null,
        jobTitle: null,
        nation: null,
        marriage: null,
        politicCountenance: null,
        unionMember: null,

        workStatus: null,
        birthDate: null,
        joinWorkDate: null,
        entryDate: null,
        joinOrganizationDate: null,
        trialEndDate: null,
        correctionDate: null,
        leaveDate: null,

        supervisorWorkLife: null,
        officeTelephone: null,
        phone: null,
        email: null,
        qq: null,
        familyContacts: null,
        homePhone: null,
        householdRegister: null,

        householdRegisterLocation: null,
        temporaryResidencePermit: null,
        temporaryResidencePermitValidity: null
      },
      style: 'width: 184px',
      dialog: false,
      rules: {
        employeeName: [
          { required: true, message: '请输入员工姓名' }
        ],
        identityCard: [
          { required: true, message: '请输入身份证号' },
          { validator: this.validID }
        ],
        nameList: [
          { required: false, message: '请选择所属部门' }
        ],
        jobs: [
          { required: true, message: '请选择所属部门' }
        ],
        workStatus: [
          { required: true, message: '请选择工作状态' }
        ],
        entryDate: [
          { required: true, message: '请选择入职日期' }
        ],
        trialEndDate: [
          { required: true, message: '请选择试用期结束时间' }
        ],
        phone: [
          { required: true, message: '请输入手机号' },
          { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入' }
        ],
        height: [
          { pattern: /^[0-9]+$/, message: '格式不正确' }
        ],
        weight: [
          { pattern: /^[0-9]+$/, message: '格式不正确' }
        ],
        waistline: [
          { pattern: /^[0-9]+$/, message: '格式不正确' }
        ],
        shoeSize: [
          { pattern: /^[0-9]+$/, message: '格式不正确' }
        ],
        supervisorWorkLife: [
          { pattern: /^[0-9]+$/, message: '格式不正确' }
        ]
      },
      jobs: []      // 岗位信息，动态级联显示
    }
  },
  mounted () {

  },
  methods: {
    doSubmit () {
      // 格式化性别 传参格式
      this.formatSexAndUnionMember()
      // 表单校验
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.doAdd()
          } else {
            this.doEdit()
          }
        } else {
          return false
        }
      })
    },
    cancel () {
      this.mask = false
      this.dialog = false
      this.resetForm()
    },
    doAdd () {
      add(this.form).then(res => {
        if (res.code === 0) {
          this.dialog = false
          this.resetForm()
          this.$notify({
            title: '添加成功',
            message: '员工信息添加成功',
            type: 'success',
            duration: 2500
          })
          // 调用父组件方法 刷新页面
          this.$emit('refreshPage')
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      }).catch(err => {
        this.$message({ message: err.response.data.message, type: 'warning' })
      })

    },
    doEdit () {
      edit(this.form).then(res => {
        if (res.code === 0) {
          this.dialog = false
          this.resetForm()
          this.$notify({
            title: '修改成功',
            message: '员工信息修改成功',
            type: 'success',
            duration: 2500
          })
          // 调用父组件方法 刷新页面
          this.$emit('refreshPage')
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      }).catch(err => {
        this.$message({ message: err.response.data.message, type: 'warning' })
      })
    },
    // 设置员工编号
    setEmployeeNumber (companyId) {
      // 生成当前公司员工编号
      setTimeout(e => {
        generatorNumber(companyId).then(res => {
          if (res.code === 0) {
            // 设置员工编号
            this.form.employeeNumber = res.data
            this.form.companyId = companyId
            // 显示抽屉
            this.dialog = true
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      }, 200)
    },
    // 清除树select选项
    doClear () {
      this.$refs.tree.setCheckedKeys([])
    },
    // 清除tag标记
    doClearTag (value) {
      this.nameList.forEach((p, i, arr) => {
        if (value === p) {
          this.form.deptIds.splice(i, 1)
          arr.splice(i, 1)
          this.$refs.tree.setCheckedKeys([]);
        }
      })
    },
    resetForm () {
      setTimeout(() => {
        this.form = {

          id: null,
          companyId: null,
          employeeNumber: null,
          employeeName: null,
          identityCard: null,
          deptIds: [],
          nameList: [],
          jobs: [],
          sex: null,
          photo: null,
          identityValidity: null,
          age: null,
          nativePlace: null,
          height: null,
          weight: null,
          waistline: null,

          shoeSize: null,
          health: null,
          education: null,
          jobTitle: null,
          nation: null,
          marriage: null,
          politicCountenance: null,
          unionMember: null,

          workStatus: null,
          birthDate: null,
          joinWorkDate: null,
          entryDate: null,
          joinOrganizationDate: null,
          trialEndDate: null,
          correctionDate: null,
          leaveDate: null,

          supervisorWorkLife: null,
          officeTelephone: null,
          phone: null,
          email: null,
          qq: null,
          familyContacts: null,
          homePhone: null,
          householdRegister: null,

          householdRegisterLocation: null,
          temporaryResidencePermit: null,
          temporaryResidencePermitValidity: null
        }
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
      }, 200)
    },
    // 实现自动生成生日，性别，年龄
    go (val) {
      let iden = this.form.identityCard   // 身份证号码
      let sex = null
      let birth = null
      let myDate = new Date()
      let month = myDate.getMonth() + 1
      let day = myDate.getDate()
      let age = 0

      if (val === 18) {
        age = myDate.getFullYear() - iden.substring(6, 10) - 1
        sex = iden.substring(16, 17)
        birth = iden.substring(6, 10) + '-' + iden.substring(10, 12) + '-' + iden.substring(12, 14)
        if (iden.substring(10, 12) < month || iden.substring(10, 12) == month && iden.substring(12, 14) <= day) age++

      }
      if (val === 15) {
        age = myDate.getFullYear() - iden.substring(6, 8) - 1901
        sex = iden.substring(13, 14)
        birth = '19' + iden.substring(6, 8) + '-' + iden.substring(8, 10) + '-' + iden.substring(10, 12)
        if (iden.substring(8, 10) < month || iden.substring(8, 10) == month && iden.substring(10, 12) <= day) age++
      }

      if (sex % 2 === 0) {
        sex = '0'
      } else {
        sex = '1'
      }

      // 计算 性别、年龄、出生年龄
      // this.form.sex = sex;
      this.form.age = age
      this.form.birthDate = birth

    }
    ,
    // 部门动态改变 岗位列表
    nodeClick (data, check) {
      this.form.deptIds = check.checkedKeys
      this.form.nameList = check.checkedNodes.map(p => p.label)
      this.nameList = check.checkedNodes.map(p => p.label)
    }
    ,
    // 身份证验证
    async validID (rule, value, callback) {
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(value)) {
        await this.go(value.length)
        callback()
      } else {
        callback(new Error('身份证号码不正确'))
      }
    },

    // 格式化性别、是否工会会员
    formatSexAndUnionMember () {

      if (this.form.sex !== null) {
        if (this.form.sex === '男') {
          this.form.sex = 1
        } else {
          this.form.sex = 2
        }
      }

      if (this.form.unionMember === false) {
        this.form.unionMember = 0
      } else {
        this.form.unionMember = 1
      }
    }
  }
}
</script>

<style scoped>
.el-tree {
  max-height: 400px;
  overflow: auto;
}
</style>
<style>
/* 部门下拉框不展示 */
.select-dept {
  display: none;
}
</style>
