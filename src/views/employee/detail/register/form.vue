<template>
  <el-drawer
    :title="isAdd ? '新增注册证记录' : '编辑注册证记录'"
    :visible.sync="dialog"
    direction="rtl"
    :show-close="false"
    size="625px"
    ref="drawer"
  >
    <div
      class="demo-drawer__content"
      style="padding: 20px; height:calc(100vh - 70px);overflow-x: hidden;overflow-y: auto;"
    >
      <!-- 执业资格表单 -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-suffix=":"
        label-width="150px"
      >
        <el-divider content-position="left">
          <i class="el-icon-s-home"></i>&nbsp;&nbsp;&nbsp;&nbsp;基本信息
        </el-divider>

        <el-form-item label="员工姓名" prop="employeeName" size="small" required>
          <el-autocomplete
            v-model="form.employeeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="员工姓名"
            @select="handleSelect"
            :disabled="mask || !isAdd"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="员工编号" prop="employeeNumber" size="small">
          <el-input v-model="form.employeeNumber" placeholder="员工编号，自动填充" disabled></el-input>
        </el-form-item>

        <el-form-item label="证书名称" prop="certName" size="small">
          <el-input placeholder="证书名称" v-model="form.certName" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="注册证书编号" prop="registerCardNo" size="small">
          <el-input placeholder="注册证书编号" v-model="form.registerCardNo" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="注册编号" prop="registerNo" size="small">
          <el-input placeholder="注册编号" v-model="form.registerNo" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="执业资质证书管理号" prop="qualificationManageNo" size="small">
          <el-input placeholder="资格证书管理号" v-model="form.qualificationManageNo" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="执业资质证书编号" prop="qualificationNo" size="small">
          <el-input placeholder="资格证书编号" v-model="form.qualificationNo" :disabled="mask"></el-input>
        </el-form-item>


        <el-form-item label="注册专业一" size="small" prop="majorOne">
          <el-select v-model="form.majorOne" placeholder="注册专业一" :disabled="mask">
            <el-option
              v-for="item in dictMap.em_register_major"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册专业二" size="small" prop="majorTwo" >
          <el-select v-model="form.majorTwo" placeholder="注册专业二" :disabled="mask">
            <el-option
              v-for="item in dictMap.em_register_major"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="签发日期" size="small" prop="issueDate">
          <el-date-picker
            v-model="form.issueDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="签发日期"
            :disabled="mask"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="注册有效期" size="small" prop="validityDate">
          <el-date-picker
            v-model="form.validityDate"
            type="date"
            placeholder="注册有效期"
            value-format="yyyy-MM-dd"
            :disabled="mask"
          ></el-date-picker>
        </el-form-item>


        <el-form-item label="注册单位" prop="registerUnit" size="small">
          <el-input placeholder="注册单位" v-model="form.registerUnit" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="原件存放部门" prop="originalStorageLocation" size="small">
          <el-input placeholder="原件存放部门" v-model="form.originalStorageLocation" :disabled="mask"></el-input>
        </el-form-item>

        <el-form-item label="是否有原件" prop="original" size="small">
          <el-switch v-model="form.original" active-value="1" inactive-value="0" :disabled="mask"></el-switch>
        </el-form-item>

        <el-form-item label="是否有扫描件" prop="scan" size="small">
          <el-switch v-model="form.scan" active-value="1" inactive-value="0" :disabled="mask"></el-switch>
        </el-form-item>

        <el-form-item label="备注" prop="remark" size="small">
          <el-input placeholder="备注" v-model="form.remark" :disabled="mask"></el-input>
        </el-form-item>

        <el-divider content-position="left">
          <i class="el-icon-s-home"></i>&nbsp;&nbsp;&nbsp;&nbsp;附件信息
        </el-divider>

        <!-- 文件上传 -->
        <el-upload
          ref="upload"
          style="margin-bottom: 10px"
          multiple
          :action="$upload + 'attachment'"
          :headers="header_token"
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
        >
          <!-- slot="trigger" 触发目标 -->
          <el-button slot="trigger" size="mini" type="primary" round plain>添加附件</el-button>
          <el-button size="mini" round type="primary" @click="clearAttachments" plain>清空附件</el-button>
        </el-upload>

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
                  <span class="item-delete" v-if="!mask">
                    <!-- 删除 -->
                    <i class="el-icon-delete" @click="fileRemove(file, index)"></i>
                  </span>
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
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="doSubmit" type="primary" :disabled="mask">确 定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>

  import { add, edit, info } from '@/api/employee/register'
  import { search, infoByNumber } from '@/api/employee/employee'

  export default {
    name: 'FormEdit',
    props: {
      isAdd: {
        type: Boolean,
        required: true
      },
      dictMap: {
        em_qualification: Object,                   // 资质名称
        em_register_major: Object,                  // 注册专业
        em_register_status: Object                 // 注册状态
      },
      companyId: String
    },
    data() {
      return {
        mask: false,
        form: {

          id: null,
          companyId: null,
          employeeId: null,
          employeeNumber: null,
          employeeName: null,

          certName: null,
          qualificationManageNo: null,
          qualificationNo: null,
          registerCardNo: null,
          registerNo: null,
          majorOne: null,
          majorTwo: null,
          issueDate: null,
          validityDate: null,

          registerUnit: null,
          originalStorageLocation: null,
          remark: null,
          original: null,
          scan: null,

          enclosures: []
        },
        dialog: false,
        rules: {
          // employeeNumber: [
          //   { required: true, message: '请输入' },
          // ],
          employeeName: [
            { required: true, message: '请输入' }
          ],

          qualification: [
            { required: true, message: '请输入' }
          ],
          certName: [
            { required: true, message: '请输入' }
          ],
          registerCardNo: [
            { required: true, message: '请输入' }
          ],
          registerNo: [
            { required: true, message: '请输入' }
          ],
          issueDate: [
            { required: true, message: '请选择签发日期' }
          ],
          validityDate: [
            { required: true, message: '请选择注册有效期' }
          ]
        },
        preview: {
          files: [],
          visible: false,
          url: ''
        }
      }
    },
    methods: {
      editInfo(id) {
        info(id).then(res => {
          if (res.code === 0) {
            // 表单数据
            this.form = res.data

            // 特殊处理
            this.form.majorOne = this.form.majorOne ? this.form.majorOne + '' : null
            this.form.majorTwo = this.form.majorTwo ? this.form.majorTwo + '' : null
            this.form.scan = this.form.scan + ''
            this.form.original = this.form.original + ''


            // 附件处理
            this.form.enclosures.forEach(item => {
              this.setFileInfo(item)
              this.preview.files.push(item)
            })

          } else {
            this.$message({ message: this.$utils.formatMsg(res.msg), type: 'warning' })
          }
        })
      },
      doSubmit() {
        // 表单校验
        this.form.companyId = this.companyId
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 校验员工姓名与员工编号对应姓名是否一致
            infoByNumber(this.form.employeeNumber).then(res => {
              if (res.code === 0) {
                if (res.data.employeeName === this.form.employeeName) {

                  // 注册证模块 特殊处理
                  if (this.form.qualificationManageNo === '') {
                    this.form.qualificationManageNo = null
                  }
                  if (this.form.qualificationNo === ''){
                    this.form.qualificationNo = null
                  }

                  if (this.isAdd) {
                    this.doAdd()
                  } else {
                    this.doEdit()
                  }
                } else {
                  this.$message({ message: '员工姓名与员工编号对应关系不一致', type: 'warning' })
                }
              } else {
                this.$message({ message: res.msg, type: 'warning' })
              }
            })
          } else {
            return false
          }
        })
      },
      cancel() {
        this.mask = false
        this.dialog = false
        this.resetForm()
      },
      doAdd() {
        add(this.form).then(res => {
          if (res.code === 0) {
            this.dialog = false
            this.resetForm()
            this.$notify({
              message: '添加成功',
              type: 'success',
              duration: 2500
            })
            // 调用父组件方法 刷新页面
            this.$emit('refreshPage')
          } else {
            this.$message({ message: this.$utils.formatMsg(res.msg), type: 'warning' })
          }
        })
      },
      doEdit() {
        edit(this.form).then(res => {


          console.log(res)
          if (res.code === 0) {
            this.dialog = false
            this.resetForm()
            this.$notify({
              message: '修改成功',
              type: 'success',
              duration: 2500
            })
            // 调用父组件方法 刷新页面
            this.$emit('refreshPage')
          } else {
            this.$message({ message: this.$utils.formatMsg(res.msg), type: 'warning' })
          }
        })
      },
      resetForm() {
        setTimeout(() => {
          this.form = {

            id: null,
            companyId: null,
            employeeId: null,
            employeeNumber: null,
            employeeName: null,

            certName: null,
            qualificationManageNo: null,
            qualificationNo: null,
            registerCardNo: null,
            registerNo: null,
            majorOne: null,
            majorTwo: null,
            issueDate: null,
            validityDate: null,

            registerUnit: null,
            originalStorageLocation: null,
            remark: null,
            original: null,
            scan: null,

            enclosures: []
          }
          this.preview.files = []
          this.clearAttachments()
          this.$refs.form.resetFields()
        }, 200)
      },
      /** 员工模糊搜索 **/
      querySearchAsync(queryString, cb) {

        if (queryString === '' || queryString == null) {
          return
        }

        // 模糊查询
        search(this.companyId, this.form.employeeName).then(res => {
          if (res.code === 0) {
            let results = queryString ? res.data.filter(this.createStateFilter(queryString)) : res.data
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              cb(results)
            }, 1000 * Math.random())
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
        this.form.employeeId = item.employeeId
        this.form.employeeNumber = item.employeeNumber
      },
      /** 图片附件 上传 **/
      // 图片上传成功
      handleSuccess(response) {

        // 上传成功返回文件信息
        let file = response.data
        // 设置文件信息
        this.setFileInfo(file)

        // 添加至 表单附件参数列表、文件预览列表
        this.form.enclosures.push(file)
        this.preview.files.push(file)

      },
      handleError(err, file, fileList) {
        if (err.status === 504) {
          this.$message({ message: '上传超时', type: 'warning' })
        } else {
          this.$message({ message: '网络异常', type: 'warning' })
        }
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
          // 文档、音频、视频 暂不处理
        }
      },
      fileDownload(file) {
        window.open(this.$filePrefix + file.link)
      },
      fileRemove(file, index) {
        // 删除预览文件列表对应文件
        let fileList = this.preview.files
        fileList.splice(index, 1)

        // 重新设置表单附件列表主键
        this.form.enclosures = []
        this.preview.files.forEach(item => {
          this.form.enclosures.push(item)
        })
      },
      // 清空附件列表
      clearAttachments() {
        let fileList = this.$refs.upload.uploadFiles
        let i = fileList.length
        while (i--) {
          if (fileList[i].percentage == 100) {
            fileList.splice(i, 1)
          }
        }
        this.preview.files = []
        this.form.enclosures = []
      }
    }
  }
</script>

<style scoped>
  .attachments {
    margin: 0 auto;
    padding-top: 15px;
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
