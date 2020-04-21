<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-tools">
      <!-- 文件操作 -->
      <div class="file-create">
        <el-input
          clearable
          placeholder="文件组名称"
          size="small"
          v-model="pageParams.groupName"
          style="width: 180px;margin-right: 10px"
          class="filter-item"
        />
        <el-button
          class="filter-item"
          size="small"
          type="success"
          icon="el-icon-search"
          @click="init"
        >搜索
        </el-button>

        <el-button
          class="filter-item"
          size="small"
          type="success"
          @click="add"
        >添加
        </el-button>
      </div>
    </div>

    <!-- 数据内容 -->
    <div class="table-content">

      <!-- 表格数据 -->
      <div class="content" style="margin-top: 10px;">
        <el-table
          size="small"
          style="width: 100%;"
          :data="pageData.data"
          :fit="true"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="groupName" min-width="220" label="文件组名称">
          </el-table-column>
          <el-table-column prop="createTime" min-width="120" label="创建日期">
            <template slot-scope="scope">
              <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="160">
            <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row.id)" plain size="mini">编辑</el-button>
              <el-button type="primary" @click="del(scope.row)" plain size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 底部工具 -->
      <div class="footer" style="margin-bottom: 20px">
        <!--分页组件-->
        <el-pagination
          style="margin-top: 8px;"
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="pageParams.pageNum"
          :total="pageData.total"
          layout="total, prev, pager, next, sizes"
        />
      </div>


      <!--  表单组件 -->
      <Form
        :is-add="isAdd"
        :dict-map="dictMap"
        :company-id="pageParams.companyId"
        ref="form"
        @refreshPage="init"
      ></Form>

    </div>
  </div>
</template>

<script>

  import {
    groupPage,
    delGroup
  } from '@/api/file/group'
  import { getCompanyId } from '@/utils/auth'
  import initDict from '@/mixins/initDict'
  import Form from './form'


  export default {
    name: 'index',
    mixins: [initDict],
    components: { Form },
    data() {
      return {
        // 分页查询返回数据
        pageData: {
          data: [],           // 列表数据
          total: 10           // 查询总数
        },
        // 分页查询参数
        pageParams: {
          groupName: null,                // 文件组名称
          companyId: getCompanyId(),      // 公司主键
          pageSize: 10,
          pageNum: 0
        },
        isAdd: false,           // 添加：编辑
      }
    },
    mounted() {
      this.init()
      // 获取权限字典数据
      this.getDictMap('disk_power')
    },
    methods: {

      // 初始化
      init(){

        groupPage(this.pageParams).then(res => {
          if (res.code === 0 && res.data.records.length > 0) {
            this.pageData.data = res.data.records
            this.pageData.total = Number.parseInt(res.data.total)
          } else if (res.code !== 0) {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },


      // 添加，调用编辑表单组件  isAdd = true
      add() {
        this.isAdd = true
        // 显示抽屉
        this.$refs.form.dialog = true
        // 清除表单校验
        this.$refs.form.resetForm()
      },

      // 修改，调用编辑表单组件  isAdd = false
      edit(id) {
        this.isAdd = false

        // 获取表单信息
        this.$refs.form.info(id)

        // 显示抽屉
        this.$refs.form.dialog = true
      },

      // 删除
      del(group){

        this.$confirm('此操作将永久删除该文件组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          delGroup(group.id).then(res => {
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

</style>
