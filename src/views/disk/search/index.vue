<template>
  <div class="app-container">
    <!-- 搜索框、工具 -->
    <div class="head">
      <el-input v-model="pageParams.keyword" clearable placeholder="请输入关键字" class="keyword"></el-input>
      <el-select style="width: 112px" v-model="pageParams.bizType" placeholder="请选择">
        <el-option label="全部文件" value="0"></el-option>
        <el-option label="公司文件" value="1"></el-option>
        <!--        <el-option label="项目文件" value="2"></el-option>-->
        <el-option label="个人文件" value="3"></el-option>
      </el-select>
      <el-button type="primary" style="border-radius: 10px" @click="search">搜索</el-button>
    </div>
    <!-- 搜素显示内容 -->
    <div class="content" style="margin-top: 60px; ">

      <div style="text-align: center; width: 100%">
        <!-- 搜索结果为空处理 -->
        <h4 v-if="pageData.searchNothing">
          暂未搜索到任何内容，请重新选择搜索条件
        </h4>
      </div>
      <el-row>
        <!-- 搜索结果展示 遍历处理 -->
        <el-col :span="20" :offset="2" style="margin-bottom: 30px;" v-for="(doc, index) in pageData.data"
                :key="doc.id">
          <el-card>
            <h4 v-html="doc.fileName"></h4>
            <p style="font-size: 14px;" v-html="doc.content"></p>
            <div style="font-size: 12px;margin-top: 10px;">
              <!-- 文档类型 -->
              <span style="margin-top: 20px;display: inline-block">文档类型:{{doc.ext}}</span>
              <!-- 文档大小 -->
              <span
                style="margin-top: 20px; margin-left: 10px;display: inline-block">文档大小:{{$utils.getSize(doc.size)}}</span>
              <div class="bottom clearfix">

                <!-- 上传时间 格式化-->
                <span style="float: left;margin-top: 10px;">文档上传时间: {{$moment(doc.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>

                <!-- 文件来源 -->
                <span style="float: left;margin-top: 5px; margin-left: 20px">
                  <el-tag size="mini" type="success" v-if="doc.bizType == 1">公司文件</el-tag>
                  <el-tag size="mini" v-else-if="doc.bizType == 2">项目文件</el-tag>
                  <el-tag size="mini" v-else>个人文件</el-tag>
                </span>

                <el-button type="text" size="middle"
                           style="float: right;margin-left: 20px;" @click="fileDown(doc)" class="button">下载原文档
                </el-button>
                <el-button type="text" size="middle"
                           style="float: right" @click="filePreview(doc)" class="button">预览
                </el-button>

              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 底部工具 -->
      <div class="footer" style="margin-bottom: 20px">
        <!--分页组件-->
        <el-pagination
          style="margin-top: 8px;"
          @size-change="sizeChange"
          @current-change="pageChange"
          :total="pageData.total"
          layout="total, prev, pager, next"
        />
      </div>
    </div>
  </div>
</template>

<script>

  import { fullPage, fileDownload, preview, fileAuth } from '@/api/file/file'

  export default {
    name: 'index',
    data() {
      return {
        // 高级搜索分页查询参数
        pageParams: {
          bizType: '0',         // 业务类型  0：全部 1：公司 2：项目 3：个人  默认为全部
          keyword: null,        // 搜索关键字
          pageSize: 10,         // 每页数量
          pageNum: 0            // 当前页数
        },
        // 参数返回数据
        pageData: {
          data: [],             // 列表
          total: 0,             // 总数
          searchNothing: false, // 搜索结果是否为空
        },
        // 权限字典
        power: {
          upload: 1,          // 上传
          download: 2,        // 下载
          preview: 3,         // 预览
          delete: 4,          // 删除
          rename: 5,          // 重命名
          folder: 6,          // 创建文件夹
          move: 7             // 移动
        }
      }
    },
    methods: {

      // 搜索
      search() {

        fullPage(this.pageParams).then(res => {
          if (res.code === 0) {

            this.pageData.data = res.data.hit
            this.pageData.total = Number.parseInt(res.data.total)

            // 暂未搜索到
            if (this.pageData.total == 0) {
              this.pageData.searchNothing = true
            } else {
              this.pageData.searchNothing = false
            }

          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      },

      // 文件预览
      filePreview(file) {
        // 如果文件类型为 公司文件，文件预览、下载操作需要鉴权
        if (file.bizType === 1) {
          let ids = [file.id]
          // 权限校验
          fileAuth(ids, this.power.preview).then(res => {
            if (res.code === 0) {

              preview(file.id).then(res => {
                if (res.code === 0) {

                  if (file.dataType === 1) {

                  } else if (file.dataType === 2) {

                  } else if (file.dataType === 3) {

                  } else {

                    if ('pdf' === file.ext) {

                      let pdfUrl = this.$network + 'file/files/preview/down?id=' + file.id
                      console.log(pdfUrl)
                      window.open('/static/pdf/viewer.html?pdfUrl=' + encodeURIComponent(pdfUrl))
                    } else if ('doc' === file.ext || 'docx' === file.ext || 'pptx' === file.ext || 'ppt' === file.ext || 'xls' === file.ext || 'xlsx' === file.ext) {
                      // 预览地址

                      let url = this.$filePrefix + res.data
                      console.log(url)

                      let previewUrl = 'http://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(this.$filePrefix + res.data)

                      console.log(previewUrl)
                      window.open(previewUrl, '_blank')
                    } else {
                      this.$message({ message: '该类型文件暂不支持预览!', type: 'warning' })
                    }
                  }
                } else {
                  this.$message({ message: res.msg, type: 'warning' })
                }
              })

            } else {
              this.$message({ message: res.msg, type: 'warning' })
            }
          })
        } else {
          preview(file.id).then(res => {
            if (res.code === 0) {

              console.log(res)
              let ext = this.$utils.getSuffix(file.fileName)

              if ('pdf' === ext) {
                let pdfUrl = this.$network + 'file/files/preview/down?id=' + file.id
                console.log(pdfUrl)
                window.open('/static/pdf/viewer.html?pdfUrl=' + encodeURIComponent(pdfUrl))

              } else if ('doc' === ext || 'docx' === ext || 'pptx' === ext || 'ppt' === ext || 'xls' === ext || 'xlsx' === ext) {
                // 预览地址
                let url = this.$filePrefix + res.data
                let previewUrl = 'http://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(this.$filePrefix + res.data)
                window.open(previewUrl, '_blank')
              } else {
                this.$message({ message: '该类型文件暂不支持预览!', type: 'warning' })
              }

            } else {
              this.$message({ message: res.msg, type: 'warning' })
            }
          })
        }
      },
      // 文件下载
      fileDown(file) {

        // 处理高亮显示 文件名称
        let name = file.fileName.toString().replace('<em>', '').replace('</em>', '')

        // 如果文件类型为 公司文件，文件预览、下载操作需要鉴权
        if (file.bizType === 1) {
          let ids = [file.id]
          // 权限校验
          fileAuth(ids, this.power.download).then(res => {
            if (res.code === 0) {

              // 发起请求
              fileDownload(file.id).then(res => {
                let blob = new Blob([res])
                let url = URL.createObjectURL(blob)
                let link = document.createElement('a')
                link.download = name
                link.href = url
                link.click()
              })

            } else {
              this.$message({ message: res.msg, type: 'warning' })
            }
          })
        } else {
          // 发起请求
          fileDownload(file.id).then(res => {
            let blob = new Blob([res])
            let url = URL.createObjectURL(blob)
            let link = document.createElement('a')
            link.download = name
            link.href = url
            link.click()
          })
        }

      },

      // 分页事件
      pageChange(page) {
        this.pageParams.pageNum = page - 1
        this.search()
      },
      sizeChange(size) {
        this.pageParams.pageSize = size
        this.search()
      }
    }
  }
</script>

<style scoped>

  .head {
    height: 20%;
    width: 100%;
    text-align: center;
    margin-top: 20px;
  }

  .keyword {
    width: 25%;
  }

  /deep/ em {
    color: red;
    font-style: normal;
    font-weight: bold;
  }
</style>
