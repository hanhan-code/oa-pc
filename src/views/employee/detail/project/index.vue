<template>
  <div class="app-container">
    <!-- 工具栏-->
    <div class="head-container">
      <el-button type="primary" size="mini" @click="add" plain>添加</el-button>
      <el-button type="primary" size="mini" :disabled="button.edit" @click="edit" plain>编辑</el-button>
      <el-button type="primary" size="mini" :disabled="button.edit" @click="look" plain>查看</el-button>
      <el-button type="danger" size="mini" :disabled="button.delete" @click="del" plain>删除</el-button>
      <el-upload
        style="display: inline-block;"
        :show-file-list="false"
        ref="upload"
        :headers="headers"
        :action="$network + '/emp/projects'"
        :limit="1"
        :file-list="fileList"
        :on-success="handleSuccess"
      >
        <el-button type="primary" size="mini" plain>批量导入</el-button>
      </el-upload>
      <el-button type="primary" size="mini" @click="exportExcel" plain>批量导出</el-button>
      <el-button type="primary" size="mini" @click="downTemplate" plain>模版下载</el-button>
    </div>

    <div class="content-container">
      <!-- 表格数据 -->
      <div class="content" style="margin-top: 10px;">
        <el-table
          size="small"
          style="width: 100%;"
          :data="pageData.data"
          @selection-change="handleSelectionChange"
          :fit="true"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="employeeName" label="姓名" />
          <el-table-column prop="startTime" label="开始时间">
            <template slot-scope="scope">
              <span>{{$moment(scope.row.startTime).format('YYYY-MM-DD')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间">
            <template slot-scope="scope">
              <span>{{$moment(scope.row.endTime).format('YYYY-MM-DD')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectName" :show-overflow-tooltip="true" label="项目名称"></el-table-column>
          <el-table-column prop="projectScale" label="项目规模" />
          <el-table-column prop="position" label="担任职位" />
          <el-table-column prop="jobContent" :show-overflow-tooltip="true" label="工作内容"></el-table-column>
          <el-table-column prop="witness" label="证明人" />
          <el-table-column prop="witnessPhone" label="证明人电话"></el-table-column>
        </el-table>
      </div>

      <!-- 分页操作 -->
      <div class="footer" style="margin-bottom: 20px">
        <!--分页组件-->
        <el-pagination
          :total="pageData.total"
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="pageParams.pageNum"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
        />
      </div>
    </div>

    <!--  表单组件 -->
    <Form :is-add="isAdd" :company-id="companyId" ref="form" @refreshPage="initPage"></Form>
  </div>
</template>

<script>

import { batchDel, page, exportExcel } from '@/api/employee/projectExperience'
import { downTemplate } from '@/api/employee/employee'
import Form from './form'
import { getToken } from '@/utils/auth'

export default {
  name: 'project-experience',   // 项目经验
  props: {
    rootId: String,         // 部门列表最顶级部门ID  ==> 公司
    companyId: String       // 公司ID
  },
  components: { Form },
  data() {
    return {
      fileList: [],
      name: '项目经验',
      pageParams: {
        employeeName: null,
        employeeNumber: null,
        state: null,
        deptId: null,
        pageSize: 10,
        pageNum: 0,
        companyId: ''
      },
      isAdd: false,           // 添加：编辑
      pageData: {
        data: [],
        total: 10
      },        // 页面请求返回数据
      button: {
        edit: true,
        delete: true
      },
      selects: []
    }
  },
  watch: {
    companyId() {
      this.pageParams.companyId = this.companyId
      this.initPage()
    }
  },
  mounted() {
    this.pageParams.companyId = this.companyId
    if (this.pageParams.companyId) {
      this.initPage()
    }
  },
  methods: {
    // 批量导入成功
    handleSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.$message.success('导入成功！')
        this.$refs.upload.clearFiles()
        this.initPage()
      } else {
        this.$message.error(response.msg)
      }
    },
    // 页面数据刷新
    initPage() {

      // 根部门查询为NULL
      if (this.pageParams.deptId === this.rootId) {
        this.pageParams.deptId = null
      }

      page(this.pageParams).then(res => {
        if (res.code === 0) {
          this.pageData.data = res.data.records
          this.pageData.total = Number.parseInt(res.data.total)
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },

    /**
     * 父组件 点击复杂查询
     */
    searchPage(params) {

      // 复杂查询 包含部门条件 过滤
      this.pageParams.state = params.state
      this.pageParams.employeeName = params.employeeName
      this.pageParams.employeeNumber = params.employeeNumber

      // 设置 查询部门主键
      this.pageParams.deptId = params.deptId

      // 根部门查询为NULL
      if (this.pageParams.deptId === this.rootId) {
        this.pageParams.deptId = null
      }

      page(this.pageParams).then(res => {
        if (res.code === 0) {
          this.pageData.data = res.data.records
          this.pageData.total = Number.parseInt(res.data.total)
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },

    /**
     * 父组件 根据部门查询
     */
    searchDeptPage(deptId) {

      // 清空其余条件查询，部门查询为 单一条件过滤
      this.pageParams.state = null
      this.pageParams.employeeName = null
      this.pageParams.employeeNumber = null

      // 设置 查询部门主键
      this.pageParams.deptId = deptId
      // 根部门查询为NULL
      if (this.pageParams.deptId === this.rootId) {
        this.pageParams.deptId = null
      }

      page(this.pageParams).then(res => {
        if (res.code === 0) {
          this.pageData.data = res.data.records
          this.pageData.total = Number.parseInt(res.data.total)
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },

    // 添加，调用编辑表单组件  isAdd = true
    add() {
      this.$refs.form.mask = false
      this.isAdd = true

      // 显示抽屉
      this.$refs.form.dialog = true

      // 清除表单校验
      this.$refs.form.resetForm()
    },

    // 修改，调用编辑表单组件  isAdd = false
    edit() {
      this.$refs.form.mask = false
      this.isAdd = false
      // 显示抽屉
      this.$refs.form.dialog = true
      // 设置所选编辑数据, 使用JSON工具方法，进行对象复制，避免数据绑定造成数据联动
      this.$refs.form.form = JSON.parse(JSON.stringify(this.selects[0]))
    },
    look() {
      this.edit()
      this.$refs.form.mask = true
    },

    // 删除、批量删除
    del() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.selects.length > 0) {
          // 处理表格所选 行数据
          let ids = this.selects.map(item => {
            return item.id
          })
          batchDel(ids).then(res => {
            if (res.code === 0) {
              this.initPage()
            } else {
              this.$message({ message: res.msg, type: 'warning' })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },

    // 批量导入
    import() {
    },

    // 批量导出
    exportExcel() {
      // 发起请求
      this.pageParams.companyId = this.companyId;
      exportExcel(this.pageParams).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
        let url = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.download = this.name + '.xls'
        link.href = url
        link.click()
      })

    },

    // Excel 模版下载
    downTemplate() {
      // fileName 几位当前模块名称，其它模块即为其它模块名称
      downTemplate(this.name).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
        let url = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.download = this.name + '模版.xls'
        link.href = url
        link.click()
      })
    },

    /** 表格数据 行选择处理事件 **/
    handleSelectionChange(values) {

      // 修改、删除 功能按钮状态处理
      if (values.length === 0) {
        this.button.edit = true
        this.button.delete = true
      } else if (values.length === 1) {
        this.button.edit = false
        this.button.delete = false
      } else {
        this.button.edit = true
      }

      // 记录选中行数据
      this.selects = values
    },

    /** 分页事件 **/
    pageChange(page) {
      this.pageParams.pageNum = page
      this.initPage()
    },
    sizeChange(size) {
      this.pageParams.pageSize = size
      this.initPage()
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
</style>
