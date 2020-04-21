<template>
  <el-drawer
    :title="isAudit ? '审核证书信息' : '查看证书详情'"
    :visible.sync="dialog"
    direction="rtl"
    :show-close="false"
    size="625px"
    ref="drawer"
  >
    <div
      class="demo-drawer__content"
      style="padding-right: 20px; height:calc(100vh - 70px);overflow-x: hidden;overflow-y: auto;"
    >
      <!-- 学历信息表单 -->
      <el-form
        ref="form"
        :model="form"
        label-position="right"
        label-suffix=":"
        label-width="150px"
      >
        <el-divider content-position="left">
          <i class="el-icon-s-home"></i>&nbsp;&nbsp;&nbsp;&nbsp;基本信息
        </el-divider>

        <!-- ============================================== 公共信息模块 ======================================================= -->
        <el-form-item label="员工姓名" prop="employeeName" size="small">
          <el-input v-model="form.employeeName" placeholder="员工姓名" disabled></el-input>
        </el-form-item>

        <el-form-item label="员工编号" prop="employeeNumber" size="small">
          <el-input v-model="form.employeeNumber" placeholder="员工编号" disabled></el-input>
        </el-form-item>

        <el-form-item label="证书类型" size="small" prop="certType">
          <el-select v-model="form.certType" placeholder="证书类型" disabled>
            <el-option
              v-for="item in dictMap.cert_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="借用状态" size="small" prop="borrowStatus">
          <el-select v-model="form.borrowStatus" placeholder="借用状态" disabled>
            <el-option
              v-for="item in dictMap.cert_borrow_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :class="isAudit ? 'audit':''" label="审核状态" size="small" prop="certStatus">
          <el-select v-model="form.certStatus" placeholder="审核状态" :disabled="!isAudit">
            <el-option
              v-for="item in dictMap.cert_audit_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :class="isAudit ? 'audit':''" label="审核备注" prop="auditRemark" size="small">
          <el-input v-model="form.auditRemark" type="textarea" maxlength="30" show-word-limit placeholder="审核备注"
                    :disabled="!isAudit"></el-input>
        </el-form-item>

        <!-- ============================================== 业务信息模块 ======================================================= -->
        <el-divider content-position="left">
          <i class="el-icon-s-home"></i>&nbsp;&nbsp;&nbsp;&nbsp;业务证书信息
        </el-divider>

        <!-- ******************************** 执业资格证书信息 ********************************* -->

        <el-form-item v-if="form.certType === '1'" label="资质名称" size="small" prop="qualification">
          <el-select v-model="form.qualification" placeholder="资质名称" disabled>
            <el-option
              v-for="item in dictMap.em_qualification"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.certType === '1'" label="管理号" prop="manageNo" size="small">
          <el-input placeholder="管理号" v-model="form.manageNo" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '1'" label="职业资格证编号" prop="qualificationCardNo" size="small">
          <el-input placeholder="职业资格证编号" v-model="form.qualificationCardNo" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '1'" label="考试专业" size="small" prop="major">
          <el-select v-model="form.major" placeholder="考试专业" disabled>
            <el-option
              v-for="item in dictMap.em_register_major"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.certType === '1'" label="批准日期" size="small" prop="approvalDate">
          <el-date-picker
            v-model="form.approvalDate"
            type="date"
            placeholder="选择日期"
            disabled
          ></el-date-picker>
        </el-form-item>

        <el-form-item v-if="form.certType === '1'" label="签发日期" size="small" prop="issueDate">
          <el-date-picker
            v-model="form.issueDate"
            type="date"
            placeholder="选择日期"
            disabled
          ></el-date-picker>
        </el-form-item>


        <!-- ******************************** 注册证书信息 ********************************* -->

        <el-form-item v-if="form.certType === '2'" label="注册证书编号" prop="registerCardNo" size="small">
          <el-input placeholder="注册证书编号" v-model="form.registerCardNo" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '2'" label="注册编号" prop="registerNo" size="small">
          <el-input placeholder="注册编号" v-model="form.registerNo" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '2'" label="执业资质证书管理号" prop="qualificationManageNo" size="small">
          <el-input placeholder="资格证书管理号" v-model="form.qualificationManageNo" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '2'" label="执业资质证书编号" prop="qualificationNo" size="small">
          <el-input placeholder="资格证书编号" v-model="form.qualificationNo" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '2'" label="注册专业一" size="small" prop="majorOne">
          <el-select v-model="form.majorOne" placeholder="注册专业一" disabled>
            <el-option
              v-for="item in dictMap.em_register_major"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.certType === '2'" label="注册专业二" size="small" prop="majorTwo" disabled>
          <el-select v-model="form.majorTwo" placeholder="注册专业二">
            <el-option
              v-for="item in dictMap.em_register_major"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.certType === '2'" label="签发日期" size="small" prop="issueDate">
          <el-date-picker
            v-model="form.issueDate"
            type="date"
            placeholder="签发日期"
            disabled
          ></el-date-picker>
        </el-form-item>

        <el-form-item v-if="form.certType === '2'" label="注册有效期" size="small" prop="validityDate">
          <el-date-picker
            v-model="form.validityDate"
            type="date"
            placeholder="注册有效期"
            disabled
          ></el-date-picker>
        </el-form-item>

        <el-form-item v-if="form.certType === '2'" label="注册单位" prop="registerUnit" size="small">
          <el-input placeholder="注册单位" v-model="form.registerUnit" disabled></el-input>
        </el-form-item>


        <!-- ******************************** 职称证书信息 ********************************* -->

        <el-form-item v-if="form.certType === '3'" label="职称" size="small" prop="jobTitle">
          <el-select v-model="form.jobTitle" placeholder="职称" disabled>
            <el-option
              v-for="item in dictMap.em_job_title"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.certType === '3'" label="证书编号" prop="certNo" size="small">
          <el-input placeholder="证书编号" v-model="form.certNo" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '3'" label="评定专业" prop="major" size="small">
          <el-input placeholder="评定专业" v-model="form.major" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '3'" label="评定单位（地点）" prop="assessUnit" size="small">
          <el-input placeholder="评定单位（地点）" v-model="form.assessUnit" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '3'" label="评定日期" size="small" prop="assessTime" disabled>
          <el-date-picker
            v-model="form.assessTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>


        <!-- ******************************** 毕业证书信息 ********************************* -->

        <el-form-item v-if="form.certType === '4'" label="学历" size="small" prop="education">
          <el-select v-model="form.education" placeholder="教育程度" disabled>
            <el-option
              v-for="item in dictMap.em_education"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.certType === '4'" label="毕业学校" prop="graduationSchool" size="small">
          <el-input placeholder="毕业学校" v-model="form.graduationSchool" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '4'" label="学历专业" prop="degreeMajor" size="small">
          <el-input placeholder="学历专业" v-model="form.degreeMajor" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="form.certType === '4'" label="学习形势" size="small" prop="learnForm">
          <el-select v-model="form.learnForm" placeholder="学习形势" disabled>
            <el-option
              v-for="item in dictMap.em_learn_form"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.certType === '4'" label="开始时间" size="small" prop="startTime">
          <el-date-picker v-model="form.startTime" type="date" placeholder="选择日期" disabled></el-date-picker>
        </el-form-item>

        <el-form-item v-if="form.certType === '4'" label="结束时间" size="small" prop="endTime">
          <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期"
                          disabled></el-date-picker>
        </el-form-item>

        <el-form-item v-if="form.certType === '4'" label="证书编号" prop="certificateNo" size="small">
          <el-input placeholder="证书编号" v-model="form.certificateNo" disabled></el-input>
        </el-form-item>


        <!-- ******************************** 共有信息 ********************************* -->


        <el-form-item label="原件存放部门" prop="originalStorageLocation" size="small">
          <el-input placeholder="原件存放部门" v-model="form.originalStorageLocation" disabled></el-input>
        </el-form-item>

        <el-form-item label="是否有原件" prop="original" size="small">
          <el-switch v-model="form.original" active-value="1" inactive-value="0" disabled></el-switch>
        </el-form-item>

        <el-form-item label="是否有扫描件" prop="scan" size="small">
          <el-switch v-model="form.scan" active-value="1" inactive-value="0" disabled></el-switch>
        </el-form-item>

        <el-form-item label="备注" prop="remark" size="small">
          <el-input placeholder="备注" v-model="form.remark" disabled></el-input>
        </el-form-item>

        <!-- ============================================== 附件信息模块 ======================================================= -->
        <el-divider content-position="left">
          <i class="el-icon-s-home"></i>&nbsp;&nbsp;&nbsp;&nbsp;附件信息
        </el-divider>

        <!-- 附件列表 -->
        <div class="attachments">
          <!-- 附件文件项 -->
          <div class="attachments-item" v-for="(file, index) in preview.files" :key="file.id">
            <div class="item-thumbnail">
              <!-- 图片默认展示 缩略图 -->
              <img v-if="file.dataType === 1" style="width: 100%; height: 100%; border-radius: 6px;"
                   :src="file.thumbnail" alt="图片"/>
              <!-- 音频、视频、文档、以及其他类型-->
              <svg-icon v-else style="width: 66px; height: 66px" :icon-class="file.className"/>
              <!-- 操作类型 -->
              <span class="item-actions">
                  <span class="item-preview">
                    <!-- 预览 暂只支持图片预览-->
                    <i v-if="file.dataType === 1" class="el-icon-zoom-in" @click="filePreview(file)"></i>
                  </span>
                <!--<span class="item-down">-->
                <!--  &lt;!&ndash; 下载 &ndash;&gt;-->
                <!--  <i class="el-icon-download" @click="fileDownload(file)"></i>-->
                <!--</span>-->
              </span>
            </div>
            <!-- 文件大小 -->
            <el-tooltip :content="'文件大小: ' + file.sizeText" placement="top" effect="light">
              <span style="font-size: 14px;display: inline-block; margin-top: 5px">{{file.fileName}}</span>
            </el-tooltip>
          </div>
        </div>

        <!-- 图片预览 -->
        <el-dialog :visible.sync="preview.visible" :append-to-body="true">
          <img width="100%" :src="preview.url" alt/>
        </el-dialog>

      </el-form>

      <div class="demo-drawer__footer" style="float: right; margin-top: 20px">
        <el-button @click="cancel">关 闭</el-button>
        <el-button type="primary" @click="submitAudit" :disabled="!isAudit">确 定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>

  import { info, audit } from '@/api/cert/cert'

  export default {
    name: 'FormEdit',
    props: {
      isAudit: {
        type: Boolean,
        required: true
      },
      dictMap: {
        cert_type: Object,                   // 学历信息
        cert_borrow_status: Object,                   // 学习形势
        cert_audit_status: Object
      }
    },
    data() {
      return {
        form: {
          id: null, // 当前表单唯一ID
          deptId: null, // 部门ID
          jobId: null, // 职位ID
          employeeId: null, // 员工编号ID

          // 证书基本信息
          employeeNumber: null,
          employeeName: null,
          certName: null,
          certType: null,
          certStatus: null,
          borrowStatus: null,
          auditRemark: null,

          enclosures: []
        },
        dialog: false,
        lastCertStatus: null,   // 存储证书记录的当前 审核状态
        preview: {
          files: [],
          visible: false,
          url: ''
        }
      }
    },
    methods: {
      getInfo(id) {
        info(id).then(res => {
          if (res.code === 0) {
            // 表单数据
            this.form = res.data

            // 基本信息 特殊处理
            this.form.certType = this.form.certType + ''
            this.form.borrowStatus = this.form.borrowStatus + ''
            this.form.certStatus = this.form.certStatus + ''

            this.form.scan = this.form.scan ? this.form.scan + '' : null
            this.form.original = this.form.original ? this.form.original + '' : null

            // 证书类型  1: 执业资格 2:注册证 3:职称证书 4:毕业证书 5:其他证书
            switch (this.form.certType) {
              case '1':
                console.log('执业资格')
                this.form.qualification = this.form.qualification + ''
                this.form.major = this.form.major + ''
                break
              case '2':
                console.log('注册证')
                this.form.majorOne = this.form.majorOne + ''
                this.form.majorTwo = this.form.majorTwo + ''
                break
              case '3':
                console.log('职称证书')
                this.form.jobTitle = this.form.jobTitle + ''
                break
              case '4':
                break
              default:
                break
            }

            // 附件列表信息处理
            if (this.form.enclosures && this.form.enclosures.length !== 0) {

              this.form.enclosures.forEach(item => {
                this.setFileInfo(item)
              })
              // 附件文件预览列表
              this.preview.files = this.form.enclosures
            }

            // 存储当前记录的 证书审核状态
            this.lastCertStatus = this.form.certStatus

          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },
      cancel() {
        this.dialog = false
        this.resetForm()
        this.lastCertStatus = null
      },
      resetForm() {
        setTimeout(() => {
          this.form = {

            id: null, // 当前表单唯一ID
            deptId: null, // 部门ID
            jobId: null, // 职位ID
            employeeId: null, // 员工编号ID

            // 证书基本信息
            employeeNumber: null,
            employeeName: null,
            certName: null,
            certType: null,
            certStatus: null,
            borrowStatus: null,

            enclosures: []
          }
          this.preview.files = []
          this.$refs.form.resetFields()
        }, 200)
      },

      // 提交审核操作
      submitAudit() {

        // 校验审核状态与原状态是否一致
        if (this.lastCertStatus === this.form.certStatus) {
          this.$message({ message: '审核状态与该记录原状态一致!', type: 'warning' })
          return
        }

        // 审核请求参数
        let params = {
          certId: this.form.id,
          certStatus: this.form.certStatus,
          remark: this.form.auditRemark
        }
        audit(params).then(res => {
          if (res.code === 0) {
            this.dialog = false
            this.$message({ message: '审核成功', type: 'success' })
            // 调用父组件方法 刷新页面
            this.$emit('refreshPage')
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },

      // 附件列表操作
      setFileInfo(file) {
        // 根据文件字节大小 计算文件具体大小值
        if (!file.sizeText) {
          file.sizeText = this.$utils.getSize(file.size)
        }
        // 设置文档类型 Icon 类名, 如果是图片则处理 缩略图 地址
        if (file.dataType !== 1) {
          file.className = this.$utils.getIcon(file.fileName)
        } else {
          file.thumbnail = this.$utils.getThumbnail(file.link)
        }
      },
      filePreview(file) {
        if (file.dataType === 1) {
          this.preview.url = this.$filePrefix + file.link
          this.preview.visible = true
        } else {

        }
      },
      fileDownload(file) {
        window.open(this.$filePrefix + file.link)
      }
    }
  }
</script>

<style scoped>


  .audit >>> .el-form-item__label {
    color: red;
  }


  .attachments {
    margin: 0 auto;
    padding-top: 15px;
    padding-left: 20px;
  }

  .attachments {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .attachments-item {
    width: 148px;
    margin-right: 8px;
    margin-bottom: 8px;
    text-align: center;
  }

  .item-thumbnail {
    position: relative;
    border: 1px solid #c0ccda;
    background-color: #fff;
    border-radius: 6px;
    box-sizing: border-box;
    width: 100%;
    height: 148px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-thumbnail:hover .item-actions, .item-thumbnail > img:hover .item-actions {
    filter: alpha(Opacity=90);
    -moz-opacity: 0.9;
    opacity: 0.9;
    background-color: rgba(0, 0, 0, .7);
  }


  .item-thumbnail > .item-actions {
    position: absolute;
    width: 148px;
    height: 148px;
    border-radius: 6px;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s;
  }

  .item-thumbnail > .item-actions:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }

  .item-actions > span {
    cursor: pointer;
  }


</style>
