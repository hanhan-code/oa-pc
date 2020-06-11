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
    <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20">

      <!-- 工具栏 -->
      <div class="head-tools">

        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="23">
            <!-- 搜索关键字 -->
            <el-input
              clearable
              placeholder="员工姓名 / 证书名称"
              size="small"
              style="width: 180px; margin-right: 15px"
              v-model="pageParams.keyword"
              class="filter-item"
            />

            <!-- 高级筛选 -->
            <el-button
              class="filter-item"
              size="mini"
              type="success"
              @click="seniorQuery=true"
            >高级筛选
            </el-button>

            <!-- 搜索 -->
            <el-button
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-search"
              @click="refreshPage"
            >查询
            </el-button>

            <!-- 添加证书 -->
            <el-button
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-plus"
              @click="$router.push('/employee/detail')"
            >添加证书
            </el-button>
          </el-col>
          <el-col :span="1">

            <el-tooltip class="item" effect="light" placement="bottom">
              <div slot="content">一、审核不通过不能借阅<br/><br/>二、没有原件不能借阅</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-col>
        </el-row>

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
            <!--<el-table-column type="selection" width="42"></el-table-column>-->
            <el-table-column prop="employeeName" label="姓名"/>
            <el-table-column prop="deptName" :show-overflow-tooltip="true" label="部门"></el-table-column>
            <el-table-column prop="employeeNumber" label="员工编号"/>
            <el-table-column prop="certName" label="证书名称"/>
            <el-table-column prop="certType" label="证书类型">
              <template slot-scope="scope">
                <span
                  v-for="item in dictMap.cert_type"
                  v-if="item.value == scope.row.certType"
                >{{item.label}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="awardDate" label="发证日期"></el-table-column>
            <el-table-column prop="validityDate" label="有效日期"></el-table-column>
            <el-table-column prop="borrowStatus" label="借用状态">
              <template slot-scope="scope">
                <span
                  v-for="item in dictMap.cert_borrow_status"
                  v-if="item.value == scope.row.borrowStatus"
                >{{item.label}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="certStatus" label="审核状态">
              <template slot-scope="scope">
                <el-tag
                  v-for="item in dictMap.cert_audit_status"
                  :key="item.value"
                  v-if="item.value == scope.row.certStatus"
                  :type="auditTagType(scope.row.certStatus)"
                >{{item.label}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="original" label="是否有原件">
              <template slot-scope="scope">
                <!--打卡方式 1：GPS 2:WIFI 3:考勤机-->
                <span v-if="scope.row.original==1">有</span>
                <span v-if="scope.row.original==0">无</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="160">
              <template slot-scope="scope">
                <el-tag @click="audit(scope.row) , auditVisible = true">审核</el-tag>
                <el-button
                  type="primary" plain
                  v-if="scope.row.borrowStatus === 1"
                  @click="borrow(scope.row)"
                  size="mini"
                  :disabled="scope.row.original === 0 || scope.row.certStatus < 2 || scope.row.certStatus === 3"
                >借阅
                </el-button>
                <el-button
                  type="primary" plain
                  v-if="scope.row.borrowStatus === 2"
                  @click="returnBack(scope.row)"
                  size="mini"
                >归还
                </el-button>
                <el-tag @click="info(scope.row)">查看详情</el-tag>
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

    <!--  表单组件 -->
    <Form
      :is-audit="isAudit"
      :dict-map="dictMap"
      ref="form"
      @refreshPage="refreshPage"
    ></Form>


    <!-- 高级查询条件 -->
    <el-drawer
      title="高级查询"
      :visible.sync="seniorQuery"
      direction="rtl"
      :show-close="false"
      size="500px"
      ref="drawer">

      <div
        class="demo-drawer__content"
        style="padding-right: 40px; height:calc(100vh - 70px);overflow-x: hidden;overflow-y: auto;"
      >
        <!-- 高级筛选表单 -->
        <el-form
          ref="queryForm"
          :model="pageParams"
          :rules="seniorQueryRules"
          label-position="right"
          label-suffix=":"
          label-width="150px"
        >
          <el-divider content-position="left">
            <i class="el-icon-s-home"></i>&nbsp;&nbsp;&nbsp;&nbsp;筛选条件
          </el-divider>

          <el-form-item label="证书类型" size="small" prop="certType">
            <el-select v-model="pageParams.certType" placeholder="证书类型">
              <el-option
                v-for="item in dictMap.cert_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="借用状态" size="small" prop="borrowStatus">
            <el-select v-model="pageParams.borrowStatus" placeholder="借用状态">
              <el-option
                v-for="item in dictMap.cert_borrow_status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="审核状态" size="small" prop="certStatus">
            <el-select v-model="pageParams.certStatus" placeholder="审核状态">
              <el-option
                v-for="item in dictMap.cert_audit_status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="执业资质" size="small" prop="qualification">
            <el-select v-model="pageParams.qualification" placeholder="执业资质">
              <el-option
                v-for="item in dictMap.em_qualification"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="职称" size="small" prop="jobTitle">
            <el-select v-model="pageParams.jobTitle" placeholder="职称">
              <el-option
                v-for="item in dictMap.em_job_title"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否有原件" size="small" prop="original">
            <el-select v-model="pageParams.original" placeholder="职称">
              <el-option label="有" value="1"></el-option>
              <el-option label="无" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="学历专业" size="small">
            <el-input placeholder="学历专业" v-model="pageParams.majorName"></el-input>
          </el-form-item>

          <el-form-item label="员工状态" size="small" prop="employeeStatus">
            <el-select
              style="vertical-align: top"
              size="small"
              v-model="pageParams.employeeStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dictMap.em_work_status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-divider content-position="left">
            <i class="el-icon-s-home"></i>&nbsp;&nbsp;&nbsp;&nbsp;年龄区间
          </el-divider>

          <el-form-item label="最低年龄" prop="startAge" size="small">
            <el-input type="number" v-model="pageParams.startAge"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-form-item>

          <el-form-item label="最高年龄" prop="endAge" size="small">
            <el-input type="number" v-model="pageParams.endAge"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="demo-drawer__footer" style="float: right; margin-top: 20px">
          <el-button @click="clearSeniorQuery">清 除</el-button>
          <el-button type="primary" @click="seniorQuery=false">完 成</el-button>
        </div>
      </div>


    </el-drawer>


    <!-- 借阅 -->
    <el-dialog
      :title="borrowReturn.isBorrow === true ? '借阅证书' : '归还证书'"
      :visible.sync="borrowReturn.show"
      width="25%"
      :modal="false">

      <el-form ref="borrowForm"
               :inline="true"
               label-position="left"
               label-suffix=":"
               label-width="auto"
               style="padding-left: 8%"
               :model="borrowReturn.params">

        <el-form-item v-if="borrowReturn.isBorrow" label="借阅员工" prop="cardResult" size="small" label-width="auto">
          <el-autocomplete
            v-model="borrowReturn.params.borrowEmployeeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="员工姓名"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item v-if="borrowReturn.isBorrow" label="预计归还日期" size="small" prop="expectedReturnDate">
          <el-date-picker v-model="borrowReturn.params.expectedReturnDate"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <el-form-item v-if="!borrowReturn.isBorrow" label="归还日期" size="small" prop="returnDate">
          <el-date-picker v-model="borrowReturn.params.returnDate"
                          value-format="yyyy-MM-dd"
                          type="date" placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="备注" prop="remark" size="small">
          <el-input style="width: 260px"
                    :autosize="{ minRows: 2, maxRows: 6 }"
                    type="textarea"
                    v-model="borrowReturn.params.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clearBorrowReturnParams">取 消</el-button>
        <el-button type="primary" @click="doSubmitBorrowReturn">确 定</el-button>
      </span>

    </el-dialog>


  </div>
</template>

<script>

  import initDict from '@/mixins/initDict'
  import { getCompanyId } from '@/utils/auth'
  import { page, borrowCert, returnCert } from '@/api/cert/cert'
  import { search } from '@/api/employee/employee'
  import { org } from '@/api/employee/dept'
  import Form from './form'

  export default {
    mixins: [initDict],
    components: { Form },
    data() {
      return {
        pageParams: {
          companyId: getCompanyId(),
          deptId: null,
          keyword: '',
          certType: null,
          borrowStatus: null,
          certStatus: null,
          qualification: null,
          jobTile: null,
          original: null,
          employeeStatus: null,
          majorName: null,
          startAge: null,
          endAge: null,
          pageNum: 1,
          pageSize: 10
        },
        pageData: {
          data: [],
          total: 10
        },
        dept: {
          lefts: [],                // 左侧组织架构
          rootId: null              // TODO: 最顶级部门为公司，选中公司则就是查询全部
        },
        auditVisible: false,
        isAudit: false,
        seniorQuery: false,
        seniorQueryRules: {
          startAge: [
            // { required: true, message: '请输入' },
            { pattern: /^[0-9]*$/, message: '请输入' }
          ],
          endAge: [
            // { required: true, message: '请输入' },
            { pattern: /^[0-9]*$/, message: '请输入' }
          ]
        },
        borrowReturn: {
          show: false,
          isBorrow: false,
          params: {
            certId: null,
            borrowEmployeeId: null,
            borrowEmployeeName: null,
            expectedReturnDate: null,
            returnDate: null,
            remark: null
          }
        }
      }
    },
    mounted() {
      this.init()
      this.getDictMap('cert_type,em_work_status,em_job_title,cert_borrow_status,cert_audit_status,em_education,em_learn_form,em_qualification,em_register_major')
    },
    methods: {

      init() {
        this.setOrgInfo()
        this.refreshPage()
      },

      // 设置组织架构、部门列表信息
      setOrgInfo() {
        // 请求参数
        let params = {
          companyId: getCompanyId(),
          contain: 0  // 是否包含员工 1：是 0：否
        }
        org(params).then(res => {
          if (res.code === 0) {
            this.dept.lefts = []
            this.dept.lefts.push(res.data[0])
            this.dept.rootId = res.data[0].id
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },

      // 查询页面刷新
      refreshPage() {

        page(this.pageParams).then(res => {
          if (res.code === 0) {
            this.pageData.data = res.data.records
            this.pageData.total = Number.parseInt(res.data.total)
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },

      // 部门选中 过滤
      handleNodeClick(data) {
        this.pageParams.deptId = data.id
        // 如果所选部门为最顶级 则为查询所有，设置为 Null
        if (this.dept.rootId === data.id) {
          this.pageParams.deptId = null
        }
        this.refreshPage()
      },

      // 清除筛选条件
      clearSeniorQuery() {

        // 关闭筛选条件
        this.seniorQuery = false

        // 查询条件
        this.pageParams.certType = null
        this.pageParams.borrowStatus = null
        this.pageParams.certStatus = null
        this.pageParams.qualification = null
        this.pageParams.jobTile = null
        this.pageParams.original = null
        this.pageParams.startAge = null
        this.pageParams.endAge = null

      },

      // 审核
      audit(row) {

        this.isAudit = true

        // 获取表单信息
        this.$refs.form.getInfo(row.id)

        // 显示抽屉
        this.$refs.form.dialog = true
      },

      // 查看详情
      info(row) {

        this.isAudit = false

        // 获取表单信息
        this.$refs.form.getInfo(row.id)

        // 显示抽屉
        this.$refs.form.dialog = true
      },

      borrow(row) {
        this.borrowReturn.show = true
        this.borrowReturn.isBorrow = true
        this.borrowReturn.params.certId = row.id
      },
      returnBack(row) {
        this.borrowReturn.show = true
        this.borrowReturn.isBorrow = false
        this.borrowReturn.params.certId = row.id
      },

      // 审核状态标签
      auditTagType(certStatus) {
        let type = ''

        switch (certStatus) {
          case 1:
            break
          case 2:
            type = 'success'
            break
          case 3:
            type = 'info'
            break
          default:
            type = 'danger'
            break
        }
        return type
      },

      // 提交 借阅、归还
      doSubmitBorrowReturn() {
        if (this.borrowReturn.isBorrow) {
          borrowCert(this.borrowReturn.params).then(res => {
            console.log(res)

            if (res.code === 0) {
              this.clearBorrowReturnParams()
              this.$message({ message: '借阅成功', type: 'success' })
              this.refreshPage()
            } else {
              this.$message({ message: res.msg, type: 'warning' })
            }
          })
        } else {
          returnCert(this.borrowReturn.params).then(res => {
            if (res.code === 0) {
              this.clearBorrowReturnParams()
              this.$message({ message: '归还成功', type: 'success' })
              this.refreshPage()
            } else {
              this.$message({ message: res.msg, type: 'warning' })
            }
          })
        }
      },
      // 清空 借阅、归还表单
      clearBorrowReturnParams() {

        this.borrowReturn.show = false

        this.borrowReturn.params.certId = null
        this.borrowReturn.params.borrowEmployeeId = null
        this.borrowReturn.params.borrowEmployeeName = null
        this.borrowReturn.params.expectedReturnDate = null
        this.borrowReturn.params.returnDate = null
        this.borrowReturn.params.remark = null
      },

      /** 员工模糊搜索 **/
      querySearchAsync(queryString, cb) {

        if (queryString === '' || queryString == null) {
          return
        }

        // 模糊查询
        search(getCompanyId(), this.borrowReturn.params.borrowEmployeeName).then(res => {
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
        this.borrowReturn.params.borrowEmployeeId = item.employeeId
      },

      pageChange(page) {
        this.pageParams.pageNum = page
        this.refreshPage()
      },
      sizeChange(size) {
        this.pageParams.pageSize = size
        this.refreshPage()
      }
    },
    computed: {}
  }
</script>

<style scoped>

</style>
