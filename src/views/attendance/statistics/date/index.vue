<template>
  <div class="app-container">

    <!-- 工具栏 -->
    <div class="head-container">

      <el-row type="flex" class="row-bg" justify="space-between">

        <el-col :span="23">

          <!-- 日期选择器 -->
          <el-date-picker
            v-model="dateSelect.dates"
            type="daterange"
            size="small"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="width:17%"
            :editable="false"
            :clearable="false"
            @change="search">
          </el-date-picker>

          <!-- 员工选择 -->
          <el-input size="small" style="width:16%; margin-left: 20px" v-model="choseUser" placeholder="选择人员" disabled
                    class="input-with-select">
            <el-button style="margin-top: -5px" slot="prepend" type="info" size="small" @click="transfer.show = true"
                       plain>
              部门/员工
            </el-button>
          </el-input>

          <!--&lt;!&ndash; 员工列表是否包含 离职员工 &ndash;&gt;-->
          <!--<el-switch style="margin-left: 20px" v-model="transfer.leave" active-text="离职员工 (保留个三月)"></el-switch>-->

        </el-col>

        <el-col :span="1">

          <el-button type="success" size="small" @click="exportExcel" plain>导出</el-button>

        </el-col>

      </el-row>

    </div>

    <!-- 内容区域 -->
    <div class="content-container" style="margin-top: 10px">
      <el-table size="small" :data="pageData.data" style="width: 100%;">
        <el-table-column prop="employeeName" label="姓名"/>
        <el-table-column prop="deptName" label="公司/部门"/>

        <!-- 动态显示列 -->
        <el-table-column v-for="(item, index) in pageData.dynamic" :prop="item.prop" :key="index" :label="item.label">

        </el-table-column>
      </el-table>
    </div>
    <!-- 底部工具 -->
    <div class="footer-container">
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

    <!-- 员工列表 对话框 -->
    <el-dialog
      title="选择人员"
      :visible.sync="transfer.show"
      width="50%"
      :modal="false">

      <div class="tree-transfer" style="display: flex; flex-direction: row">

        <!-- 左侧 组织架构 -->
        <div class="chose-tree" style="width: 33%;">
          <el-input size="small" v-model="filterLeft" style="width: 66%" placeholder="搜索成员"></el-input>
          <el-tree
            class="filter-tree"
            show-checkbox
            :data="transfer.data"
            :props="transfer.defaultProps"
            highlight-current
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
        </div>

        <!-- 中间 操作类型 -->
        <div class="chose-operate" style="width: 33%; margin: auto; text-align: center">
          <button @click="add" class="el-button address-first-btn el-button--primary is-circle">
            <i class="el-icon-arrow-right"></i>
          </button>
        </div>

        <!-- 右则 已选用户 -->
        <div class="chose-employees" style="width: 30%">
          <span style="font-weight: bold">已选员工</span>
          <ul>
            <li v-for="(user, index) in chose.users" :key="user.id" justify="space-between">
              <el-col :span="20">{{user.label}}</el-col>
              <el-col :span="3"></el-col>
              <el-col :span="1">
                <div @click="chose.users.splice(index, 1)" class="el-icon-close"></div>
              </el-col>
            </li>
          </ul>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="transfer.show=false">取 消</el-button>
        <el-button type="primary" @click="transfer.show=false,search()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import { page } from '@/api/attendanceDate'
  import { exportExcel } from '@/api/attendanceDate'
  import { companyInfo } from '@/api/attendanceCard'
  import { getInfo } from '@/api/login'

  export default {
    name: 'index',
    data() {
      return {
        chose: {
          users: []
        },
        filterLeft: '',
        transfer: {
          data: [],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          show: false,
          leave: false
        },
        dateSelect: {
          dates: [],
          timeOptionRange: null
        },
        pageParams: {
          startDate: '',
          endDate: '',
          ids: [],
          pageNum: 1,
          pageSize: 10,
          companyId: null
        },
        pageData: {
          data: [],
          total: 10,
          dynamic: []
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {

      // 左侧组织架构 人员搜索过滤
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },

      // 初始化
      init() {
        this.setDefaultDates()
        this.setDefaultUser()
      },

      // 设置默认选择日期
      setDefaultDates() {
        // 本月第一天、今天
        let start = this.$moment().startOf('month').format('YYYY-MM-DD')
        let end = this.$moment(new Date()).format('YYYY-MM-DD')
        this.dateSelect.dates = [start, end]

        // 设置查询 日期范围
        this.pageParams.startDate = this.dateSelect.dates[0]
        this.pageParams.endDate = this.dateSelect.dates[1]
      },

      // 设置默认查询用户、公司ID
      setDefaultUser() {
        getInfo().then(res => {
          if (res.code == 0) {
            // 公司主键
            this.pageParams.companyId = res.data.companyId

            this.getOrganizationalStructure()
            this.refreshPageData()
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },

      // 组织架构-员工列表
      getOrganizationalStructure() {
        companyInfo(this.pageParams.companyId).then(res => {
          if (res.code == 0) {
            this.transfer.data = res.data.children
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },

      // 分页数据刷新
      refreshPageData() {

        // 设置查询 日期范围
        this.pageParams.startDate = this.dateSelect.dates[0]
        this.pageParams.endDate = this.dateSelect.dates[1]

        // 清空上次记录，重新设置 选择用户ID
        this.pageParams.ids = []
        this.chose.users.forEach(user => {
          this.pageParams.ids.push(user.id)
        })

        // 发起请求
        page(this.pageParams).then(res => {

          if (res.code == 0) {

            this.pageData.data = res.data.list
            this.pageData.total = res.data.total

            // 处理动态显示列 数据
            this.pageData.dynamic = []
            if (this.pageData.data.length > 0) {
              this.pageData.data[0].times.forEach(time => {
                let column = {
                  'prop': time.date,
                  'label': time.date + ' (' + time.week + ')'
                }
                this.pageData.dynamic.push(column)
              })
            }

            // 动态数据显示 拼接
            this.pageData.data.forEach(item => {
              item.times.forEach(time => {
                if (time.cardTimes === '') {
                  item[time.date] = '--'
                } else {
                  item[time.date] = time.cardTimes.split(' ').join('\n')
                }
              })
            })

          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
      },

      // 条件查询  分页从第一页开始
      search() {
        this.pageParams.pageNum = 0
        this.refreshPageData()
      },

      // Excel 导出
      exportExcel() {

        // 设置查询 日期范围
        this.pageParams.startDate = this.dateSelect.dates[0]
        this.pageParams.endDate = this.dateSelect.dates[1]

        // 清空上次记录，重新设置 选择用户ID
        this.pageParams.ids = []
        this.chose.users.forEach(user => {
          this.pageParams.ids.push(user.id)
        })

        // 发起请求
        exportExcel(this.pageParams).then(res => {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
          let url = URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.download = '打卡时间.xlsx'
          link.href = url
          link.click()
        })
      },

      // 监听穿梭框组件添加
      add() {
        this.$refs.tree.getCheckedNodes().forEach(item => {
          if (!item.hasOwnProperty('children')) {
            if (this.isExist(item)) {
              this.chose.users.push(item)
            }
          }
        })
      },

      // 监听穿梭框组件移除
      isExist(item) {
        let flag = true
        this.chose.users.forEach(user => {
          if (user.id === item.id) {
            flag = false
          }
        })
        return flag
      },

      pageChange(page) {
        this.pageParams.pageNum = page
        this.refreshPageData()
      },

      sizeChange(size) {
        this.pageParams.pageSize = size
        this.refreshPageData()
      }
    },
    computed: {
      pickerOptions() {

        let that = this    // this 指向，disabledDate 和 onPick 中获取到的 this 指向 el-date-picker 实例
        return {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }],

          disabledDate(time) {

            // 获取 第一次选中时间（minDate）
            let timeOptionRange = that.dateSelect.timeOptionRange
            // 获取时间范围(30天的毫秒数)
            let secondNum = 30 * 24 * 60 * 60 * 1000

            if (timeOptionRange) {
              //如果有选中时间 设置超过选中时间后的30天||超过选中前的30天||大于当前时间 不可选
              return time.getTime() > timeOptionRange.getTime() + secondNum || time.getTime() < timeOptionRange.getTime() - secondNum || time.getTime() > (Date.now() - 8.64e6)
            } else {
              //如果没有选中时间（初始化状态） 设置当前时间后的时间不可选
              return time.getTime() > (Date.now() - 8.64e6)
            }
          },

          onPick({ maxDate, minDate }) {

            // 当选中了第一个日期还没选第二个
            // 只选中一个的时候自动赋值给minDate，当选中第二个后组件自动匹配，将大小日期分别赋值给maxDate、minDate
            if (minDate && !maxDate) {
              that.dateSelect.timeOptionRange = minDate
            }

            // 如果有maxDate属性，表示2个日期都选择了，则重置 timeOptionRange
            if (maxDate) {
              that.dateSelect.timeOptionRange = null
            }

          }
        }
      },
      choseUser: function() {
        if (this.chose.users.length == 0) {
          return
        } else {
          if (this.chose.users.length == 1) {
            return this.chose.users[0].label
          }
          return this.chose.users[0].label + ' +' + (this.chose.users.length - 1)
        }

      }
    },
    watch: {
      filterLeft(val) {
        this.$refs.tree.filter(val)
      }
    }
  }

</script>

<style scoped>
  ul {
    margin: 0px;
    padding-top: 10px;
    padding-left: 2px;
  }

  ul > li {
    list-style-type: none;
    width: 80%;
    height: 30px;
    /*border-radius: 5%;*/
    line-height: 30px;
    display: inline;
    flex-direction: row;
    float: left;
    cursor: pointer
  }

  ul > li:hover {
    background: #ccc;
  }
</style>
