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
    <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20"
    >
      <!-- 工具栏 -->
      <div class="head-tools">
        <!-- 搜索 -->
        <el-input
          clearable
          placeholder="员工姓名"
          v-model="pageParams.employeeName"
          size="small"
          style="width: 180px;"
          class="filter-item"
        />
        <el-input
          clearable
          placeholder="员工编号"
          v-model="pageParams.employeeNumber"
          size="small"
          style="width: 180px;"
          class="filter-item"
        />
        <el-select
          style="vertical-align: top"
          size="small"
          v-model="pageParams.state"
          placeholder="请选择"
        >
          <el-option
            v-for="item in dictMap.em_work_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          class="filter-item"
          size="mini"
          @click="refreshPage"
          type="success"
          icon="el-icon-search"
        >查询
        </el-button>
      </div>

      <!-- 数据内容 -->
      <div class="table-content">
        <!-- 内容操作方式 -->
        <div class="operate">
          <el-button size="small" type="primary" @click="add" plain>添加</el-button>
          <el-button size="small" type="primary" :disabled="editButton" @click="edit" plain>编辑</el-button>
          <el-button size="small" type="primary" :disabled="editButton" @click="look" plain>查看</el-button>
          <el-button size="small" type="danger" @click="del" plain>删除</el-button>
          <el-upload
            style="display: inline-block;"
            :show-file-list="false"
            ref="upload"
            :headers="headers"
            :action="$network + '/emp/base/import'"
            :limit="1"
            :file-list="fileList"
            :on-success="handleSuccess"
          >
          </el-upload>

        </div>

        <!-- 底部工具 -->
        <div class="footer" style="margin-bottom: 20px">
          <!--分页组件-->
          <el-pagination
            :total="pageData.total"
            @size-change="sizeChange"
            @current-change="pageChange"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
          />
        </div>
      </div>
    </el-col>

    <div>
      <!--  表单组件 -->
      <FormEdit
        :is-add="isAdd"
        :dict-map="dictMap"
        :depts="dept.componentDetps"
        ref="formEdit"
        @refreshPage="refreshPage"
      ></FormEdit>
    </div>
  </div>
</template>

<script>

  import { getOrgExcludeEmployee } from '@/api/synch'
  import { getInfo } from '@/api/login'
  import { page,  batchDel, downTemplate, exportExcel } from '@/api/employee'
  import FormEdit from './form'
  import initDict from '@/mixins/initDict'
  import { getToken } from '@/utils/auth'
  import { getJobsByDeptId } from '@/api/synch'

  export default {
    name: 'index',
    mixins: [initDict],
    components: { FormEdit },
    data() {
      return {
        name: '岗位信息',
        fileList: [],
        // 当前登陆用户信息
        login: {
          loginUserId: null,
          loginUserCompanyId: null
        },

        // 岗位数据
        dept: {
          lefts: [],                // 左侧组织架构
          componentDetps: [],        // 传递子组件部门数据
          rootId: null              // TODO: 最顶级部门为公司，选中公司则就是查询全部
        },

        // 分页请求参数
        pageParams: {
          employeeName: null,
          employeeNumber: null,
          state: null,
          deptId: null,
          pageSize: 10,
          pageNum: 0,
          companyId: null
        },

        // 页面请求数据
        pageData: {
          data: [],
          total: 10
        },

        isAdd: false,               // 是否为添加，通过props向子组件传递

        editButton: true,          // 编辑功能 是否禁用

        tableSelects: []           // 表格选择数据存储
      }
    },
    mounted() {
      this.init()
      // 获取字典
      this.getDictMap('em_education,em_job_title,em_nation,em_politic_countenance,em_marriage,em_work_status,em_sex')
    },
    methods: {

      protectStr(str, inNum, outNum) {
        if (!str) {
          return ''
        }
        let toStr = str + ''
        var len = toStr.length - inNum - outNum
        var parseStr = ''
        for (var i = 0; i < len; i++) {
          parseStr += '*'
        }
        return toStr.substring(0, inNum) + parseStr + toStr.substring(toStr.length - outNum)
      },

      // // 批量导入成功
      // handleSuccess(response, file, fileList) {
      //   if (response.code === 0) {
      //     this.$message.success('导入成功！')
      //     this.$refs.upload.clearFiles()
      //     this.refreshPage()
      //   } else {
      //     this.$message.error(response.msg)
      //   }
      // },

      entryDateFmt(i) {
        if (i) {
          return this.$moment(i).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },

      init() {
        this.setLoginInfo()
        this.refreshPage()
      },
      // 设置默认查询用户、公司ID
      setLoginInfo() {
        getInfo().then(res => {
          if (res.code === 0) {

            // 初始化用户Id 、公司主键
            this.login.loginUserId = res.data.id
            this.login.loginUserCompanyId = res.data.companyId
            this.pageParams.companyId = res.data.companyId

            this.setOrgInfo()
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },
      // 设置组织架构、部门列表信息
      setOrgInfo() {
        getOrgExcludeEmployee(this.login.loginUserCompanyId).then(res => {
          if (res.code === 0) {
            this.dept.lefts = []
            this.dept.lefts.push(res.data)
            this.dept.componentDetps = res.data.children
            this.dept.rootId = res.data.id
            console.log(this.dept)
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },
      refreshPage() {

        // 最顶级部门为公司 即为查询全部
        if (this.pageParams.deptId === this.dept.rootId) {
          this.pageParams.deptId = null
        }

        page(this.pageParams).then(res => {
          if (res.code === 0) {
            this.pageData.data = res.data.list
            this.pageData.total = res.data.total
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },
      // 部门选中 过滤
      handleNodeClick(data) {
        this.pageParams.deptId = data.id
        this.refreshPage()
      },
      // 表格选择事件
      tableSelectChange(selects) {
        // 选中数据
        this.tableSelects = selects
        // 编辑按钮功能 禁用、启用
        if (this.tableSelects.length === 1) {
          this.editButton = false
        } else {
          this.editButton = true
        }
      },
      add() {
        this.$refs.formEdit.mask = false

        // 设置打开抽屉模式为 添加员工信息
        this.isAdd = true

        // 清除表单校验
        this.$refs.formEdit.resetForm()

        // 设置所选默认部门
        if (this.pageParams.deptId !== this.dept.rootId) {
          this.$refs.formEdit.setDept(this.pageParams.deptId)
        }
        // 获取并设置 最新员工编号
        this.$refs.formEdit.setEmployeeNumber(this.login.loginUserCompanyId)

      },
      edit() {
        this.$refs.formEdit.mask = false
        // 设置打开抽屉模式为 编辑员工信息
        this.isAdd = false
        // 显示抽屉
        this.$refs.formEdit.dialog = true
        // 传递所选数据
        this.$refs.formEdit.form = JSON.parse(JSON.stringify(this.tableSelects[0]))

        getJobsByDeptId(this.$refs.formEdit.form.deptId).then(res => {
          if (res.code === 0) {
            this.$refs.formEdit.jobs = res.data
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },
      look() {
        this.edit()
        this.$refs.formEdit.mask = true
      },
      del() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.tableSelects.length > 0) {

            // 处理删除列表
            let ids = new Array()
            this.tableSelects.forEach(item => {
              ids.push(item.id)
            })

            batchDel(ids).then(res => {
              if (res.code === 0) {
                this.refreshPage()
                this.$notify({
                  title: '删除成功',
                  type: 'success',
                  duration: 1500
                })
              } else {
                this.$message({ message: res.msg, type: 'warning' })
              }
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      // // 批量导出
      // exportExcel() {
      //   // 发起请求
      //   exportExcel(this.pageParams).then(res => {
      //     let blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
      //     let url = URL.createObjectURL(blob)
      //     let link = document.createElement('a')
      //     link.download = this.name + '.xls'
      //     link.href = url
      //     link.click()
      //   }).catch(err => {
      //     this.$message({ message: err.msg, type: 'error' })
      //   })
      //
      // },

      // // Excel 模版下载
      // downTemplate() {
      //   // fileName 几位当前模块名称，其它模块即为其它模块名称
      //   downTemplate(this.name).then(res => {
      //     let blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
      //     let url = URL.createObjectURL(blob)
      //     let link = document.createElement('a')
      //     link.download = this.name + '模版.xls'
      //     link.href = url
      //     link.click()
      //   }).catch(err => {
      //     this.$message({ message: err.msg, type: 'error' })
      //   })
      // },
      // ======================= 分页控制 ==========================
      pageChange(page) {
        this.pageParams.pageNum = page
        this.refreshPage()
      },
      sizeChange(size) {
        this.pageParams.pageSize = size
        this.refreshPage()
      }
    },
    computed: {
      headers() {
        return {
          'Authorization': 'Bearer ' + getToken()
        }
      }
    }
  }
</script>

<style scoped>
  .head-tools {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .head-tools:hover {
    border: 1px solid #ccc;
  }

  .table-content {
    margin-top: 15px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .table-content:hover {
    border: 1px solid #ccc;
  }
</style>
