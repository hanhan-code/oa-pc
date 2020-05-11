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
                  <el-button
                    type="primary"
                    v-show="scope.row.status !== 1 && query.status !== 3"
                    @click="doUpload(scope.row)"
                    plain
                    size="mini"
                  >上传</el-button>
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

    <!-- 下载进度条 -->
    <el-dialog
      title="下载进度"
      :visible="progress.visible"
      :modal="false"
      width="36%"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <!-- 文件进度列表 -->
      <div class="progress-list">
        <div class="progress-item" v-for="(file, index) in progress.files" :key="index">
          <span>{{file.name}} ( {{file.size}} )</span>
          <el-progress :percentage="file.percent"></el-progress>
        </div>
      </div>
    </el-dialog>
    <input type="file" ref="upload" class="upload-hide" multiple="multiple" @change="doChange" />
    <!-- <el-upload
      class="upload-demo"
      multiple
      :limit="5"
      :on-exceed="handleExceed"
      :file-list="fileList"
    ></el-upload>-->
    <el-button type="text" v-loading.fullscreen.lock="screenLoading"></el-button>
  </div>
</template>

<script>

import initDict from '@/mixins/initDict'
import { getCompanyId, getEmployeeId, getToken } from '@/utils/auth'
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
import axios from 'axios'

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
      // 进度条参数
      progress: {
        files: [],
        visible: false,
        size: 0        // 同时上传数量
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
    doUpload (row) {
      this.row = row
      this.$refs.upload.click()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    },
    beforeRemove (file, fileList) {
      doAfter(fileList)
      return false
    },
    // 上传文件
    doChange (e) {
      let file = e.target.files,
        percent,
        uploadNum = 0, // 用来多文件上传判定条件
        arr = []; // 用来多文件上传进度条
      if (file.length === 0) {
        return;
      }
      this.progress.visible = true
      for (let i = 0; i < file.length; i++) {
        let form = new FormData();
        form.append("file", file[i]);
        const http = axios.create({
          headers: {
            Authorization: "Bearer " + getToken()
          },
          onUploadProgress: progressEvent => {
            // 计算进度
            let value = Math.floor(
              Number((progressEvent.loaded / file[i].size) * 100)
            );
            if (value >= 100) {
              value = 100
            }
            let obj = {
              name: file[i].name,
              size: file[i].size,
              percent: value
            }
            this.progress.files.splice(i, 1, obj)
          }
        });
        http.post(this.$network + "file/attachment", form).then(response => {
          let res = response.data
          if (res.code === 0) {
            uploadNum++;
            // 如果上传文件数量大于1 手动计算进度条进度
            if (
              (file.length > 1 && uploadNum === file.length) ||
              file.length === 1
            ) {
              this.progress.visible = false
              this.progress.files = []
              this.doFileData(res)
              this.$message({ message: "上传成功", type: 'success' });
            }
          } else {
            if (file.length === 1 && res.code >= 1 && res.code <= 10) {
              this.$message({ message: res.msg, type: 'error' });
            } else if (file.length === 1 && res.code > 10) {
              this.$message({ message: "系统异常,请稍后再试", type: 'error' });
            }
          }
        });
      }
    },
    // 上传图片之前
    doFileData (data) {
      let params = {
        detailId: this.row.deductDetailId,
        employeeId: this.getEmployeeId,
        formClassId: this.row.formClassId,
        formId: this.row.formId,
        projectCommentId: this.pageParams.projectCommentId,
        url: data.data.link,
      }
      this.screenLoading = true
      submitFile(params).then(res => {
        this.screenLoading = false
        this.$emit('doRest')
      })
    },
  }
}
</script>

<style scoped>
.upload-hide {
  display: none;
}
</style>
