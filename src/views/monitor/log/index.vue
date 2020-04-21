<template>
  <div class="app-container">
    <Search :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="requestIp" label="IP"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column :show-overflow-tooltip="true" prop="method" label="方法名称"/>
      <el-table-column :show-overflow-tooltip="true" prop="params" label="参数"/>
      <el-table-column prop="oldData" :show-overflow-tooltip="true"  label="旧数据" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.oldData === null ">无旧数据</span>
          <span v-else-if="scope.row.oldData !== '' ">{{ scope.row.oldData }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="180px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.oldData === null ">--</el-button>
          <el-button v-else-if="scope.row.oldData !== '' " type="primary" size="mini" @click="dataRollBack(scope.row)">回滚</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import Search from './search'
import { dataRollBack } from '../../../api/log'
export default {
  components: { Search },
  mixins: [initData],
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    beforeInit() {
      this.url = '/auth/log'
      const sort = 'id,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (type && value) { this.params[type] = value }
      return true
    },

    dataRollBack(row) {
      dataRollBack(row.routing,row).then(res => {
        if (res.code === 0) {
          this.$message({ message: "回滚成功", type: 'success' })
          this.refreshPageData()
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
