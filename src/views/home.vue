<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group />

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart />
      </el-row>

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <raddar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'

/**
 * 记录访问，只有页面刷新或者第一次加载才会记录
 */

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,//首页四模块展示图
    LineChart,//第二栏
    RaddarChart,//第三栏雷达图
    PieChart, //第四栏饼图
    BarChart  //第五栏柱状图
    },
  computed: {
    ...mapGetters([
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 18px 22px 22px 22px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
