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
              <el-table-column prop="grading" label="评价项标准" align="center"></el-table-column>
              <el-table-column prop="fullScore" label="满分值" align="center"></el-table-column>
              <el-table-column prop="deductScore" label="扣分值" align="center"></el-table-column>
              <el-table-column label="提交文件">
                <template slot-scope="scope">
                  <div
                    v-for="(item, i) in scope.row.fileList"
                    :key="i"
                    v-show="scope.row.fileList.length > 0"
                    class="upload"
                  >
                    <!-- 文件类型 ICON 图标处理1 -->
                    <div @click="doClickImg(item)">
                      <svg-icon class="svg-icon" :icon-class="$utils.getIcon(item.url)" />&nbsp;&nbsp;
                    </div>
                    <el-tooltip class="item" effect="dark" :content="item.fileName" placement="top">
                      <div class="upload-text">{{item.fileName}}</div>
                    </el-tooltip>
                    <span class="upload-close" @click="doDelete(item, scope.row)">
                      <i class="el-icon-close"></i>
                    </span>
                  </div>
                </template>
              </el-table-column>
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
                    v-show="scope.row.status === 0 
                    && query.status !== 3 &&
                     scope.row.fileList.length > 0"
                    @click="doRemind(scope.row)"
                    plain
                    size="mini"
                  >催办</el-button>
                  <!-- <el-button
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
                  >重评</el-button>-->
                  <el-button
                    type="primary"
                    v-show="scope.row.status === 0 && query.status !== 3"
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
      是否确认催办？
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="remindProp = false">取消</el-button>
        <el-button type="primary" @click="doRemindConfirm">确定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog
      title="系统提示"
      :visible.sync="deleProp"
      width="20%"
      :modal="false"
      :modal-append-to-body="false"
    >
      此操作将永久删除该记录, 是否继续?
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="deleProp = false">取消</el-button>
        <el-button type="primary" @click="doDeleConfirm">确定</el-button>
      </span>
    </el-dialog>

    <!-- 下载进度条 -->
    <el-dialog
      title="上传进度"
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
          <span>{{file.name}} ( {{$utils.getSize(file.size)}} )</span>
          <el-progress :percentage="file.percent"></el-progress>
        </div>
      </div>
    </el-dialog>
    <input
      type="file"
      ref="upload"
      :value="fileValue"
      class="upload-hide"
      multiple="multiple"
      @change="doChange"
    />
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
      deleProp: false,              // 删除弹窗
      score: 0,                    // 分数
      row: null,                    // 当前行数据
      file: null,                   // 文件对象
      scoreColumns: [],                // 分数列表
      fileValue: '',                  // 解决文件无法重复提交文
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
        type: 1
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
    // 上传
    doUpload (row) {
      this.row = row
      this.$refs.upload.click()
    },
    // 上传文件
    doChange (e) {
      let file = e.target.files,
        arr = [],
        size = 0,
        form = new FormData(),
        reg = /.?(exe)$|(bat)$|(ibat)$|(sh)$|(cmd)$|(dex)$|(py)$|(apk)$|(ipa)$/gi // 上传文件类型限制
      if (file.length === 0) {
        return;
      }
      this.progress.visible = true
      for (let i = 0; i < file.length; i++) {
        if (reg.test(file[i].name)) {
          this.progress.visible = false
          this.$message({ message: "暂不支持此类文件上传 " + file[i].name, type: 'error' })
          break
        }
        size += file[i].size
        form.append('files ', file[i])
      }
      if (size >= 20971520) {
        this.progress.visible = false
        this.$message({ message: "文件大小不能超过20M，请重新上传", type: 'error' });
        return
      }
      const http = axios.create({
        headers: {
          Authorization: "Bearer " + getToken()
        },
        onUploadProgress: progressEvent => {
          // 计算进度
          let value = Math.floor(
            Number((progressEvent.loaded / size) * 100)
          );
          if (value >= 100) {
            value = 100
          }
          let obj = {
            name: '服务器正在上传中...请稍后',
            size: size,
            percent: value
          }
          this.progress.files.splice(0, 1, obj)
        }
      });
      http.post(this.$network + "file/attachments", form).then(response => {
        let res = response.data
        // 解决文件无法重复提交
        this.fileValue = ''
        if (res.code === 0) {
          // 如果上传文件数量大于1 手动计算进度条进度
          this.progress.visible = false
          this.progress.files = []
          res.data.forEach(p => {
            p.url = p.link
          })
          this.doFileData(res.data)
        } else {
          this.progress.visible = false
          if (res.code >= 1 && res.code <= 10) {
            this.$message({ message: res.msg, type: 'error' });
          } else if (res.code > 10) {
            this.$message({ message: "系统异常,请稍后再试", type: 'error' });
          }
        }
      }).catch(res => {
        this.progress.visible = false
      })
    },
    // 点击图片进行相关操作
    doClickImg (file) {
      let reg = /.(ppt)$|(pptx)$|(xlsx)$|(docx)$|(xls)$|(doc)$/gi,
        regs = /.(png)$|(jpg)$|(jpeg)|(svg)$|(icon)$|(pdf)$|(txt)$/gi,
        url = this.$filePrefix + file.url,
        previewUrl
      if (reg.test(url)) {
        previewUrl = 'http://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url)
      } else if (regs.test(url)) {
        previewUrl = url
      } else {
        previewUrl = url
        // let link = document.createElement('a')
        // link.style.display = "none"
        // link.href = url
        // link.click()
        // link.target = "_blank"
        // document.body.appendChild(link)
        // location.href = url
      }
      window.open(previewUrl)
    },
    // 文件删除
    doDelete (file, row) {
      this.row = row
      this.file = file
      this.deleProp = true
    },
    // 文件删除
    doDeleConfirm () {
      let idList = {
        fileId: this.file.fileId,
        formClassItemId: this.row.formClassItemId,
        projectCommentId: this.query.projectCommentId
      }
      this.screenLoading = true
      fileDel(idList).then((res) => {
        this.screenLoading = false
        if (res.code === 0) {
          this.deleProp = false
          this.$message({ message: "删除成功", type: 'success' });
          this.$emit('doRest')
        } else {
          this.$message({ message: "系统异常，请稍后再试", type: 'error' });
        }
      })
    },
    // 上传图片之前
    doFileData (data) {
      let params = {
        detailId: this.row.deductDetailId,
        employeeId: getEmployeeId(),
        formClassId: this.row.formClassId,
        formClassItemId: this.row.formClassItemId,
        formId: this.row.formId,
        projectCommentId: this.query.projectCommentId,
        fileList: data
      }
      this.screenLoading = true
      submitFile(params).then(res => {
        this.screenLoading = false
        this.$emit('doRest')
        if (res.code === 0) {
          this.$message({ message: '上传成功', type: 'success' });
        } else {
          this.$message({ message: res.msg, type: 'error' });
        }
      })
    },
  }
}
</script>

<style scoped>
.upload-hide {
  display: none;
}
.upload {
  position: relative;
  display: inline-block;
  height: 50px;
  margin-left: 10px;
  border: 1px dotted #828181;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  z-index: 0;
}
.upload-text {
  width: 0;
  flex: 1;
  color: #828181;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.upload img {
  width: 80px;
  height: 80px;
  text-align: center;
  margin-right: 0.5px;
}
.upload .upload-close {
  position: absolute;
  top: -2px;
  right: -4px;
  text-align: center;
  width: 30px;
  height: 30px;
  z-index: 9999;
}
.svg-icon {
  width: 35px;
  height: 35px;
  margin-top: 3px;
  margin-left: 10px;
}
</style>
