<template>
  <!-- 数据内容 -->
  <div class>
    <div>
      <el-table
        size="small"
        :data="params.childList"
        :max-height="600"
        row-key="formClassId"
        border
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <read-repeat :query="query" :params="scope.row"></read-repeat> -->
            <el-table size="small" :data="scope.row.formClassItemList" :max-height="600" border>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="fullScore" label="满分值" align="center"></el-table-column>
              <el-table-column prop="deductScore" label="扣分值" align="center"></el-table-column>
              <el-table-column prop="grading" label="评价项标准" align="center"></el-table-column>
              <el-table-column label="是否重要项" align="center">
                <template slot-scope="scope">
                  <div v-show="scope.row.important === 0">否</div>
                  <div v-show="scope.row.important === 1">是</div>
                </template>
              </el-table-column>
              <el-table-column label="评价状态" align="center">
                <template slot-scope="scope">
                  <div v-show="scope.row.status === 0">未评价</div>
                  <div v-show="scope.row.status === 1">已评价</div>
                  <div v-show="scope.row.status === 2">历史评价</div>
                  <div v-show="scope.row.status === 3">重新评价</div>
                  <div v-show="scope.row.status === 4">已经完结项目的评价</div>
                </template>
              </el-table-column>
              <el-table-column width="300" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    v-show="scope.row.status === 0 && query.status !== 3"
                    @click="doRemind(scope.row)"
                    plain
                    size="mini"
                  >催交</el-button>
                  <el-button
                    type="primary"
                    v-show="scope.row.status === 0 && query.status !== 3"
                    @click="doEvaluate(scope.row)"
                    plain
                    size="mini"
                  >评审</el-button>
                  <el-button
                    type="primary"
                    v-show="scope.row.status === 1"
                    @click="doRepeat(scope.row)"
                    plain
                    size="mini"
                  >重评</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="表的分类" align="center"></el-table-column>
        <el-table-column label="评价类状态" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.commentStatus === 0">未评审完成</div>
            <div v-show="scope.row.commentStatus === 1">评审完成</div>
          </template>
        </el-table-column>
        <el-table-column label="提交状态" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.submitStatus === 0">存在未提交</div>
            <div v-show="scope.row.submitStatus === 1">提交完成</div>
          </template>
        </el-table-column>
        <el-table-column prop="noCommentNum" label="暂未评审项的个数" align="center"></el-table-column>
        <el-table-column prop="noSubmitNum" label="暂未提交项的个数" align="center"></el-table-column>
        <el-table-column prop="totalChildNum" label="评价子项总数" align="center"></el-table-column>
      </el-table>

      <!-- <el-table
        size="small"
        :data="params.formClassItemList"
        :max-height="600"
        border
        v-show="params.formClassItemList"
      >
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="fullScore" label="满分值" align="center"></el-table-column>
        <el-table-column prop="deductScore" label="扣分值" align="center"></el-table-column>
        <el-table-column prop="grading" label="评价项标准" align="center"></el-table-column>
        <el-table-column label="是否重要项" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.commentStatus === 0">否</div>
            <div v-show="scope.row.commentStatus === 1">是</div>
          </template>
        </el-table-column>
        <el-table-column label="评价状态" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.status === 0">未评价</div>
            <div v-show="scope.row.status === 1">已评价</div>
            <div v-show="scope.row.status === 2">历史评价</div>
            <div v-show="scope.row.status === 3">重新评价</div>
            <div v-show="scope.row.status === 4">已经完结项目的评价</div>
          </template>
        </el-table-column>
        <el-table-column width="300" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-show="query.status === 0 && query.status !== 3"
              @click="doRemind(scope.row)"
              plain
              size="mini"
            >催交</el-button>
            <el-button
              type="primary"
              v-show="query.status === 0 && query.status !== 3"
              @click="doEvaluate(scope.row)"
              plain
              size="mini"
            >评审</el-button>
            <el-button
              type="primary"
              v-show="query.status !== 0 && query.status !== 3"
              @click="doRepeat(scope.row)"
              plain
              size="mini"
            >重评</el-button>
          </template>
        </el-table-column>
      </el-table>-->
    </div>
    <!-- 催交 -->
    <el-dialog
      title="系统提示"
      :visible.sync="remindProp"
      width="20%"
      :modal="false"
      :modal-append-to-body="false"
    >
      是否确认催交？
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="remindProp = false">取消</el-button>
        <el-button type="primary" @click="doRemindConfirm">确定</el-button>
      </span>
    </el-dialog>

    <!-- 重评 -->
    <el-dialog
      title="系统提示"
      :visible.sync="repeatProp"
      width="20%"
      :modal="false"
      :modal-append-to-body="false"
    >
      是否确认重评？
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="repeatProp = false">取消</el-button>
        <el-button type="primary" @click="doRepeatConfirm">确定</el-button>
      </span>
    </el-dialog>

    <!-- 评审 -->
    <el-dialog
      title="选择分数"
      :visible.sync="evaluateProp"
      width="20%"
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-select v-model="score" filterable clearable placeholder="请选择分数">
        <el-option :label="item" :value="item" v-for="item in scoreColumns" :key="item"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="evaluateProp = false">取消</el-button>
        <el-button type="primary" @click="doEvaluateConfirm">确定</el-button>
      </span>
    </el-dialog>
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import { getCompanyId, getEmployeeId } from '@/utils/auth'
import {
  readyData,
  personDatas,
  evaluateData,
  resetData,
  fileData,
  fileDel,
  fileDels,
  submitFile
} from "@/api/evaluateProject/evaluateProject";


export default {
  name: 'readRepeat',
  mixins: [initDict],
  data () {
    return {
      screenLoading: false,           // 全局加载
      remindProp: false,               // 催交弹窗
      evaluateProp: false,            // 评审弹窗
      repeatProp: false,            // 重评弹窗
      score: 0,                    // 分数
      row: null,
      scoreColumns: [],                // 分数列表
      pageParams: {
        formId: null,               // 分页查询参数
        projectCommentId: null      // 评价项目提交id
      },
    }
  },
  props: ['query', 'params'],
  mounted () {
  },
  methods: {
    // 催交
    doRemind (row) {
      this.row = row
      this.remindProp = true
    },
    // 确认催交
    doRemindConfirm () {
      let idList = {
        itemDetailId: this.row.deductDetailId,
        type: 0
      }
      // 获取催交消息内容与用户id
      this.screenLoading = true
      personDatas(idList).then((res) => {
        this.screenLoading = false
        this.remindProp = false
        if (res.code === 0) {
          this.$emit('doRest')
          this.$message({ message: res.msg, type: 'success' })
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 评审
    doEvaluate (row) {
      this.evaluateProp = true
      this.row = row
      for (let i = 0; i <= row.fullScore; i++) {
        this.scoreColumns[i] = i
      }
    },
    // 确认评审
    doEvaluateConfirm (value) {
      let params = {
        deductCore: this.score,
        employeeId: getEmployeeId(),
        important: this.row.important,
        itemDetailId: this.row.deductDetailId,
      }
      this.screenLoading = true
      evaluateData(params).then((res) => {
        this.screenLoading = false
        this.evaluateProp = false
        if (res.code === 0) {
          this.$emit('doRest')
          this.$message({ message: res.msg, type: 'success' })
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 重评
    doRepeat (row) {
      this.row = row
      this.repeatProp = true
    },
    // 确认重评
    doRepeatConfirm () {
      let params = {
        employeeId: getEmployeeId(),
        projectFormDetailId: this.row.deductDetailId
      }
      // 获取催交消息内容与用户id
      this.screenLoading = true
      resetData(params).then((res) => {
        this.repeatProp = false
        this.screenLoading = false
        if (res.code === 0) {
          this.$emit('doRest')
          this.$message({ message: res.msg, type: 'success' })
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
