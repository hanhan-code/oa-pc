<template>
  <el-drawer
    :title="isAdd ? '新增社会关系' : '编辑社会关系'"
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
      <!-- 社会关系表单 -->
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

        <el-form-item label="关系人姓名" prop="relationName" size="small">
          <el-input placeholder="关系人姓名" v-model="form.relationName" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="关系人称呼" prop="relationCall" size="small">
          <el-input placeholder="关系人称呼" v-model="form.relationCall" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="工作单位" prop="workUnit" size="small">
          <el-input placeholder="工作单位" v-model="form.workUnit" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="担任职位" prop="position" size="small">
          <el-input placeholder="担任职位" v-model="form.position" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone" size="small">
          <el-input placeholder="手机号" v-model="form.phone" :disabled="mask"></el-input>
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

  import { add, edit } from '@/api/employee/socialRelation'
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

          relationName: null,
          relationCall: null,
          workUnit: null,
          position: null,
          phone: null,
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

          relationName: [
            { required: true, message: '请输入' }
          ],
          relationCall: [
            { required: true, message: '请输入' }
          ],
          // workUnit: [
          //   { required: true, message: '请输入' },
          // ],
          // position: [
          //   { required: true, message: '请输入' },
          // ],
          phone: [
            { required: true, message: '请输入' },
            { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入' }
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
        })
      },
      resetForm() {
        setTimeout(() => {
          this.form = {

            id: null,
            companyId:null,
            employeeId: null,
            employeeNumber: null,
            employeeName: null,

            relationName: null,
            relationCall: null,
            workUnit: null,
            position: null,
            phone: null,
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
