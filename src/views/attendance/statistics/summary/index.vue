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
            @change="search"
          ></el-date-picker>
          <!-- 员工选择 -->
          <el-input
            size="small"
            style="width:16%; margin-left: 20px"
            placeholder="选择人员"
            v-model="choseUser"
            disabled
            class="input-with-select"
          >
            <el-button
              style="margin-top: -5px"
              slot="prepend"
              type="info"
              size="small"
              @click="transfer.show = true"
              plain
            >部门/员工
            </el-button>
          </el-input>
          <!--&lt;!&ndash; 员工列表是否包含 离职员工 &ndash;&gt;-->
          <!--<el-switch style="margin-left: 20px" v-model="transfer.leave" active-text="离职员工 (保留个三月)"></el-switch>-->
        </el-col>
        <el-col :span="1">
          <el-button type="success" size="small" @click="exportExcel" plain>导出</el-button>
        </el-col>
      </el-row>

      <!-- 动态列控制选择 -->
      <el-row style="margin-top: 20px; display: flex; flex-direction: row">
        <el-tag type="success">显示比例</el-tag>
        <el-checkbox-group v-model="columns.selects" size="small">
          <el-checkbox-button v-for="cl in columns.cls" :label="cl" :key="cl">{{cl}}</el-checkbox-button>
        </el-checkbox-group>
      </el-row>
    </div>

    <!-- 内容区域 -->
    <div class="content-container" style="margin-top: 10px">
      <el-table size="small" row-key="index" :data="pageData.data" style="width: 100%;" border>
        <!-- 默认列 -->
        <el-table-column prop="employeeName" label="姓名"/>
        <el-table-column prop="deptName" label="公司/部门"/>
        <!--<el-table-column prop="jobName" label="职位"/>-->

        <!-- 手动控制列 -->
        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[0]) > -1"
          prop="attendance"
          :label="columns.cls[0]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[1]) > -1"
          prop="rest"
          :label="columns.cls[1]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[2]) > -1"
          prop="late"
          :label="columns.cls[2]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[3]) > -1"
          prop="lateMin"
          :label="columns.cls[3]"
        >
          <template slot-scope="scope">
            <span>{{scope.row.lateMin | secondFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[4]) > -1"
          prop="seriousLate"
          :label="columns.cls[4]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[5]) > -1"
          prop="seriousLateMin"
          :label="columns.cls[5]"
        >
          <template slot-scope="scope">
            <span>{{scope.row.seriousLateMin | secondFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[6]) > -1"
          prop="leaveEarly"
          :label="columns.cls[6]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[7]) > -1"
          prop="leaveEarlyMin"
          :label="columns.cls[7]"
        >
          <template slot-scope="scope">
            <span>{{scope.row.leaveEarlyMin | secondFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[8]) > -1"
          prop="absenteeism"
          :label="columns.cls[8]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[9]) > -1"
          prop="missCard"
          :label="columns.cls[9]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[10]) > -1"
          prop="workHour"
          :label="columns.cls[10]"
        >
          <template slot-scope="scope">
            <span>{{scope.row.workHour | secondFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[11]) > -1"
          prop="patchCard"
          :label="columns.cls[11]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[12]) > -1"
          prop="leave"
          :label="columns.cls[12]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[13]) > -1"
          prop="goOut"
          :label="columns.cls[13]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[14]) > -1"
          prop="businessTrip"
          :label="columns.cls[14]"
        />

        <el-table-column
          v-if="columns.selects.indexOf(columns.cls[15]) > -1"
          prop="overtime"
          :label="columns.cls[15]"
        />

        <!-- 动态显示列 -->
        <el-table-column
          v-for="(item, index) in columns.dynamic"
          :prop="item.prop"
          :key="index"
          :label="item.label"
        />
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
    <el-dialog title="选择员工" :visible.sync="transfer.show" width="50%" :modal="false">
      <div class="tree-transfer" style="display: flex; flex-direction: row">
        <!-- 左侧 组织架构 -->
        <div class="chose-tree" style="width: 33%;">
          <el-input size="small" v-model="filterLeft" style="width: 66%" placeholder="搜索成员"></el-input>
          <el-tree
            class="filter-tree"
            show-checkbox
            node-key="id"
            :data="transfer.data"
            :filter-node-method="filterNode"
            ref="tree"
          ></el-tree>
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
                <div @click="doUserDelete(user, index)" class="el-icon-close"></div>
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

  import { page, exportExcel } from '@/api/attendanceSummary'
  import { getCompanyId } from '@/utils/auth'
  import { org } from '@/api/employee/dept'

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
          companyId: getCompanyId()
        },
        pageData: {
          data: [],
          total: 1
        },
        columns: {
          cls: ['出勤天数', '休息天数', '迟到次数', '迟到时长', '严重迟到次数', '严重迟到时长', '早退次数',
            '早退时长', '旷工天数', '缺卡次数', '工作时长', '补卡次数', '请假天数', '外出天数', '出差天数', '加班时长'
          ],
          selects: [],
          dynamic:
            []
        }
      }
    },
    watch: {
      filterLeft(val) {
        this.$refs.tree.filter(val)
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
        this.getOrganizationalStructure()
        this.refreshPageData()
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

      // 组织架构-员工列表
      getOrganizationalStructure() {
        // 请求参数
        let params = {
          companyId: getCompanyId(),
          contain: 1  // 是否包含员工 1：是 0：否
        }
        org(params).then(res => {
          if (res.code === 0) {
            this.transfer.data = res.data
            if (res.data.length === 0) {
              this.getComPanyFor(res.data)
            } else {
              res.data.forEach(p => {
                this.getComPanyFor(p)
              })
            }
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
            this.pageData.data = []
            this.pageData.data = res.data.list
            this.pageData.total = res.data.total

            // 处理动态显示列 数据
            this.columns.dynamic = []
            if (this.pageData.data.length > 0) {
              this.pageData.data[0].times.forEach(time => {
                let column = {
                  'prop': time.date,
                  'label': time.date + ' (' + time.week + ')'
                }
                this.columns.dynamic.push(column)
              })
            }

            // 处理显示数据
            this.pageData.data.forEach(item => {
              item.times.forEach(time => {
                item[time.date] = time.cardTimes.split(' ').join('\n')
              })
            })

          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })

      },
      // 递归循环处理数据
      getComPanyFor(data) {
        let flag = false
        if (data.children) {
          if (data.children && data.employees) {
            data.employees.forEach(p => {
              p.id = p.employeeId
              data.children.push(p)
            })
            flag = true
          } else if (data.children && !data.employees) {
            flag = true
          } else {
            flag = true
          }
          if (flag) {
            data.children.forEach(p => {
              this.getComPanyFor(p)
            })
          }
        } else {
          if (data.employees) {
            data.employees.forEach(p => {
              p.id = p.employeeId
            })
            data.children = data.employees
          }
          return false
        }

      },
      // 查询
      search() {
        this.pageParams.pageNum = 0
        this.refreshPageData()
      },
      // 删除已选的员工
      doUserDelete(row, index) {
        this.chose.users.splice(index, 1)
        this.pageParams.ids.splice(index, 1)
        // this.$nextTick(() => {
        //   this.$refs.tree.setCheckedNodes(this.chose.users)
        // })
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
          link.download = '月度汇总.xlsx'
          link.href = url
          link.click()
        })
      },

      // 监听穿梭框组件添加
      add() {
        this.chose.users = []
        this.pageParams.ids = []
        this.$refs.tree.getCheckedNodes().forEach(item => {
          if (!item.hasOwnProperty('children')) {
            if (this.isExist(item)) {
              this.pageParams.ids.push(item)
              this.chose.users.push(item)
            }
          }
        })

      },

      // 监听穿梭框组件移除
      isExist(item) {
        let flag = true
        this.chose.users.forEach(user => {
          if (user.id == item.id) {
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

          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '上个月',
              onClick(picker) {
                const end = gettimeEnd()
                const start = gettimeStart()
                picker.$emit('pick', [start, end])

                function gettimeStart() {
                  const nowdays = new Date()
                  let year = nowdays.getFullYear()
                  let month = nowdays.getMonth()
                  if (month === 0) {
                    month = 12
                    year = year - 1
                  }
                  if (month < 10) {
                    month = '0' + month
                  }
                  let firstDayOfPreMonth = year + '-' + month + '-' + '01'
                  firstDayOfPreMonth = firstDayOfPreMonth.toString()
                  return new Date(firstDayOfPreMonth)
                }

                function gettimeEnd() {
                  const nowdays = new Date()
                  let year = nowdays.getFullYear()
                  let month = nowdays.getMonth()
                  if (month === 0) {
                    month = 12
                    year = year - 1
                  }
                  if (month < 10) {
                    month = '0' + month
                  }
                  const lastDay = new Date(year, month, 0)
                  let lastDayOfPreMonth = year + '-' + month + '-' + lastDay.getDate()
                  lastDayOfPreMonth = lastDayOfPreMonth.toString()
                  return new Date(lastDayOfPreMonth)
                }
              }
            }
          ],

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
    filters: {
      secondFormat: (second) => {
        let hour = 60 * 60
        let min = 60
        let zero = 0

        let h = Math.floor(second / 3600)
        let m = Math.floor((second / 60 % 60))

        if (second > hour) {
          return h + '小时' + m + '分钟'
        }
        if (second > min) {
          return m + '分钟'
        }
        if (second > zero) {
          return second + '秒'
        }

        return second
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
    cursor: pointer;
  }

  ul > li:hover {
    background: #ccc;
  }
</style>
