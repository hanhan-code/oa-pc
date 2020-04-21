<template>
  <div class="app-container">
    <!--左侧 文件树形结构数据-->
    <el-col :xs="7" :sm="6" :md="4" :lg="7" :xl="7">
      <el-tree
        ref="file"
        :default-expanded-keys="[0]"
        :props="treeFileProps"
        node-key="id"
        lazy
        @node-click="handleNodeClick"
        :load="loadNode"
        accordion/>
    </el-col>
    <!--右侧 表格数据，查询操作-->
    <el-col :xs="16" :sm="18" :md="20" :lg="17" :xl="17"
    >
      <!-- 工具栏 -->
      <div class="head-tools">
        <!-- 搜索 -->
        <el-input
          clearable
          placeholder="员工姓名"
          v-model="pageParams.keyword"
          size="small"
          style="width: 180px;"
          class="filter-item"
        />
        <el-button
          class="filter-item"
          size="mini"
          @click="init"
          type="success"
          icon="el-icon-search"
        >查询
        </el-button>
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          @click="showAdd"
        >添加
        </el-button>
      </div>

      <!-- 数据内容 -->
      <div class="table-content">
        <!-- 表格数据 -->
        <div class="content" style="margin-top: 10px;">
          <el-table
            size="small"
            :data="pageData.data"
            style="width: 100%;"
            :fit="true"
          >
            <el-table-column type="selection" width="42"></el-table-column>
            <el-table-column prop="employeeName" label="姓名"/>
            <el-table-column prop="fileName" label="文件名称"/>
            <el-table-column prop="power" :show-overflow-tooltip="true" label="权限">
              <template slot-scope="scope">
              <span
                v-for="item in dictMap.disk_power"
                v-if="item.value == scope.row.power"
              >{{item.label}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="160">
              <template slot-scope="scope">
                <el-button type="primary" @click="delRecord(scope.row)" plain size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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


    <!-- 修改状态弹出框 -->
    <el-dialog
      title="添加文件权限"
      :visible.sync="add.visible"
      width="30%"
      :show-close="false"
      :modal="false">

      <el-form ref="form"
               :inline="false"
               label-position="right"
               label-suffix=":"
               label-width="100px"
               :rules="add.rules"
               :model="add.form">

        <!-- 员工姓名 远程搜索查询 -->
        <el-form-item label="员工姓名" prop="employeeName" size="small" required>
          <el-autocomplete
            v-model="add.form.employeeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="员工姓名"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>

        <!-- 文件名称-->
        <el-form-item label="文件名称" prop="fileName" size="small" required>
          <el-input style="width: 300px" placeholder="左侧点击选择文件" v-model="add.form.fileName" disabled></el-input>
        </el-form-item>

        <!-- 权限分配 -->
        <el-form-item label="权限分配" prop="powers" size="small" required>
          <el-checkbox-group v-model="add.form.powers">
            <el-checkbox size="mini" v-for="item in dictMap.disk_power"
                         :key="item.id"
                         :label="item.value"
            >{{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="confirmAdd" type="primary">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>

  import {
    add,
    page,
    del
  } from '@/api/file/filePowerEmployee'
  import { getCompanyId } from '@/utils/auth'
  import initDict from '@/mixins/initDict'
  import { fileTree } from '@/api/file/file'
  import { search } from '@/api/employee'

  export default {
    name: 'index',
    mixins: [initDict],
    data() {
      return {
        // 树形组件 props
        treeFileProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        },

        // 分页查询返回数据
        pageData: {
          data: [],           // 列表数据
          total: 10           // 查询总数
        },
        // 分页查询参数
        pageParams: {
          keyword: null,                  // 查询关键字
          companyId: getCompanyId(),      // 公司主键
          fileId: null,                   // 关联文件主键
          pageSize: 10,
          pageNum: 0
        },
        // 添加文件员工权限信息参数
        add: {
          // 表单信息
          form: {
            fileId: null,                 // 关联文件主键
            fileName: null,               // 文件名称
            employeeId: null,             // 员工主键
            employeeName: '',             // 员工姓名
            powers: []                    // 权限列表
          },
          // 表单校验
          rules: {
            employeeName: [
              { required: true, message: '请搜索并选择员工' }
            ],
            fileName: [
              { required: true, message: '请选择关联文件' }
            ],
            powers: [
              { required: true, message: '请选择文件权限' }
            ]
          },
          // 显示隐藏
          visible: false
        }
      }
    },
    mounted() {
      this.init()
      // 获取权限字典数据
      this.getDictMap('disk_power')
    },
    methods: {

      // 初始化
      init() {
        page(this.pageParams).then(res => {
          if (res.code === 0) {
            this.pageData.data = res.data.records
            this.pageData.total = Number.parseInt(res.data.total)
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },

      // 显示添加模态框
      showAdd() {
        this.add.visible = true
      },

      // 确认添加
      confirmAdd() {
        // 表单校验
        this.$refs['form'].validate((valid) => {
          if (valid) {

            if (this.add.form.fileId === null) {
              this.$message({ message: '请选择需要设置权限的文件', type: 'warning' })
              return
            }

            add(this.add.form).then(res => {
              if (res.code === 0) {
                this.dialog = false
                this.cancel()
                this.$notify({
                  message: '添加成功',
                  type: 'success',
                  duration: 2500
                })
                // 调用父组件方法 刷新页面
                this.init()
              } else {
                this.$message({ message: res.msg, type: 'warning' })
              }
            })
          } else {
            return false
          }
        })
      },

      // 取消
      cancel() {
        this.add.visible = false
        this.$refs.form.resetFields()
        this.add.form = {
          fileId: null,
          fileName: null,
          employeeId: null,
          employeeName: '',
          powers: []
        }
      },

      // 删除记录
      delRecord(record) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          del(record.id).then(res => {
            if (res.code === 0) {
              this.init()
            } else {
              this.$message({ message: res.msg, type: 'warning' })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },

      // 树级点击事件
      handleNodeClick(data) {
        console.log(data)
        this.pageParams.fileId = data.id
        this.add.form.fileId = data.id
        this.add.form.fileName = data.label
        this.init()
      },

      // 加载树形文件
      loadNode(node, resolve) {

        let params = {
          bizId: getCompanyId(),
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

      /** 员工模糊搜索 **/
      querySearchAsync(queryString, cb) {

        if (queryString === '' || queryString == null) {
          return
        }

        // 模糊查询
        search(getCompanyId(), this.add.form.employeeName).then(res => {
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
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect(item) {
        this.add.form.employeeId = item.employeeId
      },

      // 分页事件
      pageChange(page) {
        this.pageParams.pageNum = page
        this.init()
      },
      sizeChange(size) {
        this.pageParams.pageSize = size
        this.init()
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
