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
            :picker-options="pickerOptions"
            size="small"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd"
            style="width:17%"
            :editable="false"
            :clearable="false"
            @change="search"
          ></el-date-picker>

          <!-- 员工选择 -->
          <el-input
            size="small"
            style="width:16%; margin-left: 20px"
            v-model="choseUser"
            placeholder="选择人员"
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
            >部门/员工</el-button>
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
      <el-table size="small" :data="pageData.data" style="width: 100%;" :fit="true">
        <el-table-column prop="employeeName" label="姓名" />
        <el-table-column prop="attendanceDate" label="考勤日期" />
        <el-table-column prop="shiftTime" label="考勤时间" />
        <el-table-column prop="cardDate" label="打卡时间" />
        <el-table-column prop="cardResult" label="考勤状态">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in dicts"
              v-show="item.value == scope.row.cardResult"
              :key="index"
            >{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cardType" label="打卡类型">
          <template slot-scope="scope">
            <!--打卡方式 1：GPS 2:WIFI 3:考勤机-->
            <span v-if="scope.row.cardType==1">GPS定位</span>
            <span v-if="scope.row.cardType==2">WIFI</span>
            <span v-if="scope.row.cardType==3">考勤机</span>
          </template>
        </el-table-column>
        <el-table-column prop="gps" :show-overflow-tooltip="true" label="打卡地址">
          <template slot-scope="scope">
            <span>{{scope.row.gps != null ? scope.row.gps : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="异常备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark != null ? scope.row.remark : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="equipmentNo" label="打卡设备" />

        <el-table-column prop="adminUpdateRemark" label="管理员修改备注">
          <template slot-scope="scope">
            <span>{{scope.row.adminUpdateRemark != null ? scope.row.adminUpdateRemark : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="showEditStatus(scope.row)">修改状态</el-button>
          </template>
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

    <!-- 自定义树形穿梭框组件 -->
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

    <!-- 修改状态弹出框 -->
    <el-dialog
      title="修改考勤状态"
      :visible.sync="updateState.show"
      width="30%"
      :show-close="false"
      @close="cancelUpdateStatus"
      :modal="false"
    >
      <el-form
        ref="updateForm"
        :inline="true"
        label-position="left"
        label-suffix=":"
        label-width="auto"
        :model="updateState.form"
      >
        <el-divider content-position="left">修改选项</el-divider>

        <el-form-item label="考勤状态" prop="cardResult" label-width="auto">
          <el-select v-model="updateState.form.cardResult" placeholder="考勤状态" style="width: 200px">
            <el-option v-for="item in dicts" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时长" prop="num">
          <el-input
            style="width: 200px"
            placeholder="请输入时长"
            v-model="updateState.form.num"
            :disabled="(updateState.form.cardResult == 0 || updateState.form.cardResult == 4) ? true : false"
          ></el-input>
        </el-form-item>

        <el-form-item label="修改备注" prop="adminUpdateRemark">
          <el-input
            style="width: 260px"
            :autosize="{ minRows: 2, maxRows: 6 }"
            type="textarea"
            v-model="updateState.form.adminUpdateRemark"
          ></el-input>
        </el-form-item>

        <el-divider content-position="left">图片备注</el-divider>

        <el-upload
          ref="imageUpload"
          multiple
          :action="$upload + 'attachment'"
          accept=".png, .jpg, .jpeg, .bmp, .tif, .svg, .gif, .webp"
          list-type="picture-card"
          :file-list="preview.images"
          :headers="header_token"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>

        <!-- 图片预览 -->
        <el-dialog :visible.sync="preview.visible" :modal-append-to-body="false">
          <img width="100%" :src="preview.url" alt />
        </el-dialog>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateStatus">取 消</el-button>
        <el-button type="primary" @click="doUpdateStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { page, exportExcel, updateStatus } from '@/api/attendanceCard'
import initDict from '@/mixins/initDict'
import { getCompanyId } from '@/utils/auth'
import { org } from '@/api/employee/dept'

export default {
  name: 'index',
  mixins: [initDict],
  data () {
    return {
      chose: {
        users: [],
        ids: [] // 人员id列表
      },
      filterLeft: '',
      transfer: {
        data: [],
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
        total: 10
      },
      updateState: {
        form: {
          id: null,
          cardResult: null,
          num: null,
          adminUpdateRemark: null,
          enclosures: []
        },
        lastAttendanceStatus: null,
        show: false
      },
      dialogImageUrl: '',
      dialogVisible: false,
      preview: {
        images: [],
        visible: false,
        url: ''
      }
    }
  },
  watch: {
    filterLeft (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.init()
    this.getDict('at_attendance_card_status')
  },
  methods: {

    // 左侧组织架构 人员搜索过滤
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    // 初始化
    init () {
      this.setDefaultDates()
      this.getOrganizationalStructure()
      this.refreshPageData()
    },

    // 设置默认选择日期
    setDefaultDates () {
      // 本月第一天、今天
      let start = this.$moment().startOf('month').format('YYYY-MM-DD')
      let end = this.$moment(new Date()).format('YYYY-MM-DD')
      this.dateSelect.dates = [start, end]

      // 设置查询 日期范围
      this.pageParams.startDate = this.dateSelect.dates[0]
      this.pageParams.endDate = this.dateSelect.dates[1]
    },

    // 组织架构-员工列表
    getOrganizationalStructure () {
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
    // 递归循环处理数据
    getComPanyFor (data) {
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
    // 分页数据刷新
    refreshPageData () {

      // 设置查询 日期范围
      this.pageParams.startDate = this.dateSelect.dates[0]
      this.pageParams.endDate = this.dateSelect.dates[1]

      // 清空上次记录，重新设置 选择用户ID
      this.pageParams.ids = []
      this.chose.users.forEach(user => {
        this.pageParams.ids.push(user.id + '')
      })

      // 发起请求
      page(this.pageParams).then(res => {
        if (res.code == 0) {
          this.pageData.data = res.data.list
          this.pageData.total = res.data.total
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })

    },

    // 条件查询  分页从第一页开始
    search () {
      this.pageParams.pageNum = 0
      this.refreshPageData()
    },

    // 显示修改考勤记录状态弹出框
    showEditStatus (row) {
      // 显示弹出框
      this.updateState.show = true
      // 对象复制，避免数据绑定问题
      let temp = JSON.parse(JSON.stringify(row))
      this.updateState.form.id = temp.id
      this.updateState.form.cardResult = temp.cardResult.toString()

      // 记录当前考勤记录了 打卡状态
      this.updateState.lastAttendanceStatus = temp.cardResult.toString()
    },
    // 删除已选的员工
    doUserDelete (row, index) {
      this.chose.users.splice(index, 1)
      this.pageParams.ids.splice(index, 1)
      // this.$nextTick(() => {
      //   this.$refs.tree.setCheckedNodes(this.chose.users)
      // })
    },
    // 取消修改
    cancelUpdateStatus () {

      this.updateState.show = false
      this.updateState.lastAttendanceStatus = null
      this.updateState.form.id = null
      this.updateState.form.cardResult = null
      this.updateState.form.num = null
      this.updateState.form.adminUpdateRemark = null
      this.updateState.form.enclosures = []

      // 清空附件列表
      this.preview.images = []
    },

    // 提交修改考勤记录状态
    doUpdateStatus () {

      // 检测考勤状态
      if (this.updateState.lastAttendanceStatus === this.updateState.form.cardResult) {
        this.$message({ message: '更改考勤状态与原考勤状态一致!', type: 'warning' })
        return
      }

      // 正常、缺卡 ，时长判断
      if (this.updateState.form.cardResult != 0 && this.updateState.form.cardResult != 4) {
        if (this.updateState.form.num === null || this.updateState.form.num === '') {
          this.$message({ message: '请输出时长', type: 'warning' })
          return
        }
      }

      // 提交修改
      updateStatus(this.updateState.form).then(res => {
        if (res.code === 0) {
          this.$message({ message: '修改成功', type: 'success' })
          this.updateState.show = false
          this.refreshPageData()
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },

    // Excel 导出
    exportExcel () {

      // 设置查询 日期范围
      this.pageParams.startDate = this.dateSelect.dates[0]
      this.pageParams.endDate = this.dateSelect.dates[1]

      // 设置 选择用户ID
      this.pageParams.ids = []
      this.chose.users.forEach(user => {
        this.pageParams.ids.push(user.id + '')
      })

      // 发起请求
      exportExcel(this.pageParams).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
        let url = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.download = '考勤记录.xlsx'
        link.href = url
        link.click()
      })

    },

    // 监听穿梭框组件添加
    add () {
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
    isExist (item) {
      let flag = true
      this.chose.users.forEach(user => {
        if (user.id === item.id) {
          flag = false
        }
      })
      return flag
    },

    // 图片上传成功
    handleSuccess (response, file, fileList) {
      let ids = []
      fileList.forEach(item => {
        if (item.hasOwnProperty('response')) {
          if (item.response.code === 0) {
            let url = item.response.data.id
            ids.push(url)
          }
        }
      })
      this.updateState.form.enclosures = ids
      console.log(this.updateState.form.enclosures)
    },

    // 图片删除
    handleRemove (file, fileList) {
      let ids = []
      fileList.forEach(item => {

        if (item.hasOwnProperty('response')) {
          if (item.response.code === 0) {
            ids.push(item.response.data.id)
          }
        }
      })
      this.updateState.form.enclosures = ids
    },

    // 图片预览
    handlePictureCardPreview (file) {
      this.preview.url = file.url
      this.preview.visible = true
    },

    pageChange (page) {
      this.pageParams.pageNum = page
      this.refreshPageData()
    },
    sizeChange (size) {
      this.pageParams.pageSize = size
      this.refreshPageData()
    }
  },
  computed: {
    pickerOptions () {
      let that = this    // this 指向，disabledDate 和 onPick 中获取到的 this 指向 el-date-picker 实例
      return {

        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }],

        disabledDate (time) {

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

        onPick ({ maxDate, minDate }) {

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
    choseUser: function () {

      if (this.chose.users.length == 0) {
        return
      } else {
        if (this.chose.users.length == 1) {
          return this.chose.users[0].label
        }
        return this.chose.users[0].label + ' +' + (this.chose.users.length - 1)
      }

    }
  }
}

</script>

<style scoped>
.tree-transfer > ul {
  margin: 0px;
  padding-top: 10px;
  padding-left: 2px;
}

.tree-transfer > ul > li {
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

.tree-transfer > ul > li:hover {
  background: #ccc;
}
</style>
