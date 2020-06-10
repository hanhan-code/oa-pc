<template>
  <el-drawer
    :title="isAdd ? '新增项目经验' : '编辑项目经验'"
    :visible.sync="dialog"
    direction="rtl"
    :show-close="false"
    size="625px"
    ref="drawer"
  >
    <div
      class="demo-drawer__content"
      style="padding: 20px; height:calc(100vh - 70px);overflow-x: hidden;overflow-y: auto;"
    >
      <!-- 项目经验表单 -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-suffix=":"
        label-width="150px"
      >
        <el-divider content-position="left">
          <i class="el-icon-s-home"></i>&nbsp;&nbsp;&nbsp;&nbsp;基本信息
        </el-divider>

        <el-form-item label="员工姓名" prop="employeeName" size="small" required>
          <el-autocomplete
            v-model="form.employeeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="员工姓名"
            @select="handleSelect"
            :disabled="mask || !isAdd"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="员工编号" prop="employeeNumber" size="small">
          <el-input v-model="form.employeeNumber" placeholder="员工编号，自动填充" disabled></el-input>
        </el-form-item>

        <el-form-item label="开始时间" size="small" prop="startTime">
          <el-date-picker v-model="form.startTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                          :disabled="mask"></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" size="small" prop="endTime">
          <el-date-picker v-model="form.endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                          :disabled="mask"></el-date-picker>
        </el-form-item>

        <el-form-item label="项目名称" prop="projectName" size="small">
          <el-input placeholder="项目名称" v-model="form.projectName" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="担任职位" prop="position" size="small">
          <el-input placeholder="担任职位" v-model="form.position" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="项目规模" prop="projectScale" size="small">
          <el-input placeholder="项目规模" v-model="form.projectScale" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="工作内容" prop="jobContent" size="small">
          <el-input placeholder="工作内容" v-model="form.jobContent" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="证明人" prop="witness" size="small">
          <el-input placeholder="证明人" v-model="form.witness" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="证明人电话" prop="witnessPhone" size="small">
          <el-input type="number" placeholder="证明人电话" v-model="form.witnessPhone" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark" size="small">
          <el-input placeholder="备注" v-model="form.remark" :disabled="mask"></el-input>
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

  import { add, edit } from '@/api/employee/projectExperience'
  import { search, infoByNumber } from '@/api/employee/employee'

  export default {
    name: 'FormEdit',
    props: {
      isAdd: {
        type: Boolean,
        required: true
      },
      companyId: String
    },
    data() {
      return {
        mask: false,
        form: {

          id: null,
          companyId: null,
          employeeId: null,
          employeeNumber: null,
          employeeName: null,

          projectName: null,
          position: null,
          projectScale: null,
          jobContent: null,
          witness: null,
          witnessPhone: null,
          startTime: null,
          endTime: null,
          remark: null
        },
        dialog: false,
        rules: {
          // employeeNumber: [
          //   { required: true, message: '请输入' },
          // ],
          employeeName: [
            { required: true, message: '请输入' }
          ],

          projectName: [
            { required: true, message: '请输入' }
          ],
          position: [
            { required: true, message: '请输入' }
          ],
          // projectScale: [
          //   { required: true, message: '请输入' }
          // ],
          // jobContent: [
          //   { required: true, message: '请输入' },
          // ],
          // witness: [
          //   { required: true, message: '请输入' },
          // ],
          witnessPhone: [
            // { required: true, message: '请输入' },
            { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入' }
          ],
          startTime: [
            { required: true, message: '请输入' }
          ],
          endTime: [
            { required: true, message: '请输入' }
          ]
          // remark: [
          //   { required: true, message: '请输入' },
          // ]
        }
      }
    },
    methods: {
      doSubmit() {
        this.form.companyId = this.companyId
        // 表单校验
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 校验员工姓名与员工编号对应姓名是否一致
            infoByNumber(this.form.employeeNumber).then(res => {
              if (res.code === 0) {
                if (res.data.employeeName === this.form.employeeName) {
                  if (this.isAdd) {
                    this.doAdd()
                  } else {
                    this.doEdit()
                  }
                } else {
                  this.$message({ message: '员工姓名与员工编号对应关系不一致', type: 'warning' })
                }
              } else {
                this.$message({ message: res.msg, type: 'warning' })
              }
            })
          } else {
            return false
          }
        })
      },
      cancel() {
        this.mask = false
        this.dialog = false
        this.resetForm()
      },
      doAdd() {
        add(this.form).then(res => {
          if (res.code === 0) {
            this.dialog = false
            this.resetForm()
            this.$notify({
              message: '添加成功',
              type: 'success',
              duration: 2500
            })
            // 调用父组件方法 刷新页面
            this.$emit('refreshPage')
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },
      doEdit() {
        edit(this.form).then(res => {
          if (res.code === 0) {
            this.dialog = false
            this.resetForm()
            this.$notify({
              message: '修改成功',
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
      resetForm() {
        setTimeout(() => {
          this.form = {

            id: null,
            companyId: null,
            employeeId: null,
            employeeNumber: null,
            employeeName: null,

            projectName: null,
            position: null,
            projectScale: null,
            jobContent: null,
            witness: null,
            witnessPhone: null,
            startTime: null,
            endTime: null,
            remark: null
          }
          this.$refs['form'].resetFields()
        }, 200)
      },
      /** 员工模糊搜索 **/
      querySearchAsync(queryString, cb) {

        if (queryString === '' || queryString == null) {
          return
        }

        // 模糊查询
        search(this.companyId, this.form.employeeName).then(res => {
          if (res.code === 0) {
            let results = queryString ? res.data.filter(this.createStateFilter(queryString)) : res.data
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              cb(results)
            }, 1000 * Math.random())
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })

      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect(item) {
        this.form.employeeId = item.employeeId
        this.form.employeeNumber = item.employeeNumber
      }
    }
  }
</script>

<style scoped>
</style>
