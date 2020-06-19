<template>
  <el-drawer
    :title="isAdd ? '新增文件组' : '编辑文件组'"
    :visible.sync="dialog"
    direction="rtl"
    :show-close="false"
    size="50%"
    ref="drawer"
  >
    <div
      class="demo-drawer__content"
      style="padding: 0px 20px 20px 20px; height:calc(100vh - 70px);overflow-x: hidden;overflow-y: auto;"
    >
      <!-- 文件组信息表单 -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-suffix=":"
        label-width="100px"
      >
        <!-- 文件组名称 -->
        <el-form-item label="文件组名称" prop="groupName" size="small">
          <el-input style="width: 220px" v-model="form.groupName" placeholder="文件组名称"></el-input>
        </el-form-item>

        <!-- 权限分配 -->
        <el-form-item label="权限分配" prop="powers" size="small">
          <el-checkbox-group v-model="form.powers">
            <el-checkbox
              v-for="item in dictMap.disk_power"
              :key="item.id"
              :label="item.value"
            >{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 文件管理 -->
        <el-form-item label="文件管理" prop="files" size="small">
          <el-tree
            @check-change="fileCheckChange"
            ref="file"
            :default-checked-keys="form.files"
            :default-expanded-keys="[0]"
            :props="treeFileProps"
            node-key="id"
            lazy
            :load="loadNode"
            show-checkbox
            accordion
          />
        </el-form-item>

        <!-- 用户列表 -->
        <el-form-item label="用户列表" prop="employees" size="small">
          <!-- 远程搜索选择框 -->
          <el-autocomplete
            v-model="employeeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="员工姓名"
            @select="handleSelect"
          ></el-autocomplete>
          <!-- 添加到当前表格数据 -->
          <el-button @click="addUser">添加</el-button>
          <el-table
            :data="table.data.filter(data => !table.keyword || data.employeeName.toLowerCase().includes(table.keyword.toLowerCase()))"
            height="340"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column property="employeeName" label="姓名" width="120"></el-table-column>
            <el-table-column property="phone" label="手机号" width="160"></el-table-column>
            <el-table-column align="center">
              <!-- 右上角 搜索过滤查询 -->
              <template slot="header" slot-scope="scope">
                <el-input v-model="table.keyword" size="mini" placeholder="输入关键字搜索" />
              </template>
              <template slot-scope="scope">
                <el-button size="mini" @click="delUser(scope.$index,scope.row)" type="danger">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer" style="float: right; margin-top: 20px">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="doSubmit" type="primary">确 定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>

import { fileTree } from '@/api/file/file'
import { info, add, edit } from '@/api/file/group'
import { search, infoByNumber } from '@/api/employee/employee'
import { getCompanyId } from '@/utils/auth'

export default {
  name: 'FormEdit',
  props: {
    // 是否是添加
    isAdd: {
      type: Boolean,
      required: true
    },
    // 数据字典集合
    dictMap: {
      disk_power: Object                   // 云盘中心 权限列表
    },
    // 公司主键
    companyId: String
  },
  data () {
    return {
      treeFileProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      dialog: false,
      form: {
        id: null,               // 当前表单唯一ID
        groupName: null,        // 部门ID
        employees: [],        // 职位ID
        files: [],            // 员工编号ID
        powers: []
      },
      rules: {
        groupName: [
          { required: true, message: '请输入' }
        ]
      },
      table: {
        data: [],
        keyword: '',
        temp: undefined // 临时存储选中添加项
      },
      employeeName: ''
    }
  },
  watch: {
    dialog () {
      this.form.files = []
    }
  },
  methods: {

    // 加载树形文件
    loadNode (node, resolve) {

      let params = {
        bizId: this.companyId,
        bizType: 1,
        parentId: node.level === 0 ? 0 : node.data.id
      }

      fileTree(params).then(res => {
        if (res.code === 0) {
          if (node.level === 0) {

            let data = [{
              id: '0',
              label: '企业文件'
            }]

            data[0].children = res.data
            resolve(data)
          } else {
            resolve(res.data)
          }
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })

    },

    // 父组件显示 表单组件时调用   查询信息接口
    info (id) {
      info(id).then(res => {
        if (res.code === 0) {

          // 清除缓存
          this.table.data = []
          this.form.employees = []

          // 设置表单信息
          this.form.id = res.data.id
          this.form.groupName = res.data.groupName
          this.form.files = res.data.files
          this.form.powers = res.data.powers

          // 设置用户列表
          this.table.data = res.data.employees

          // 设置当前所拥有的员工主键
          this.table.data.forEach(item => {
            this.form.employees.push(item.employeeId)
          })
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },

    // 确认提交事件
    doSubmit () {
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
    // 取消
    cancel () {
      this.dialog = false
      this.resetForm()
    },
    // 添加
    doAdd () {
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
    // 编辑
    doEdit () {
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
    // 重置表单信息
    resetForm () {
      setTimeout(() => {
        this.form = {
          id: null,               // 当前表单唯一ID
          groupName: null,        // 部门ID
          employees: [],        // 职位ID
          files: [],            // 员工编号ID
          powers: []
        }
        this.$refs.form.resetFields()
        this.$refs.file.setCheckedKeys([])
        this.table.data = []
      }, 200)
    },

    // 文件权限选择改变事件
    fileCheckChange () {
      this.form.files = this.$refs.file.getCheckedKeys()
    },

    // 用户列表 添加用户
    addUser () {
      if (this.table.temp) {

        // 判断是否已经存在
        for (let i = 0; i < this.table.data.length; i++) {
          if (this.table.data[i].employeeId === this.table.temp.employeeId) {
            this.$message({ message: '该用户已经存在！', type: 'warning' })
            return
          }
        }

        let item = {
          employeeId: this.table.temp.employeeId,
          employeeName: this.table.temp.value,
          phone: this.table.temp.phone
        }

        // console.log('添加之前')
        // console.log('table data 数据： ', this.table.data)
        // console.log('form employees 数据： ', this.form.employees)

        this.table.data.push(item)
        this.form.employees.push(item.employeeId)

        // console.log('添加之后')
        // console.log('table data 数据： ', this.table.data)
        // console.log('form employees 数据： ', this.form.employees)

        this.table.temp = undefined
        this.employeeName = ''
      } else {
        this.$message({ message: '请先搜索，并选择用户!', type: 'warning' })
      }
    },
    // 用户列表 删除用户
    delUser (index, item) {

      // console.log('删除之前')
      // console.log('table data 数据： ', this.table.data)
      // console.log('form employees 数据： ', this.form.employees)

      this.table.data.splice(index, 1)
      this.form.employees.splice(index, 1)

      // console.log('删除之后')
      // console.log('table data 数据： ', this.table.data)
      // console.log('form employees 数据： ', this.form.employees)

    },

    /** 员工模糊搜索 **/
    querySearchAsync (queryString, cb) {

      if (queryString === '' || queryString == null) {
        return
      }

      // 模糊查询
      search(this.companyId, this.employeeName).then(res => {
        if (res.code === 0) {
          let results = queryString ? res.data.filter(this.createStateFilter(queryString)) : res.data
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 100)
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })

    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      this.table.temp = item
    }
  }
}
</script>

<style scoped>
</style>
