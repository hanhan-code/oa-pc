<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-tools">
      <!-- 路径 -->
      <div>
        <span v-if="pathFiles.length !== 1" @click="backLast" class="back-last">返回上一级 /&nbsp;</span>
        <el-breadcrumb style="float:left;" separator="/">
          <el-breadcrumb-item v-for="file in pathFiles" :key="file.id">
            <a @click="pathSkip(file)">{{file.fileName}}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 文件操作 -->
      <div class="file-create">
        <el-input
          clearable
          placeholder="文件名称"
          v-model="pageParams.keyword"
          size="small"
          style="width: 180px;margin-right: 10px"
          class="filter-item"
        />
        <el-button
          class="filter-item"
          size="small"
          type="success"
          icon="el-icon-search"
          @click="search"
        >搜索</el-button>
        <el-button size="small" @click="folder.visible = true" type="primary">创建文件夹</el-button>
        <!-- 文件上传 -->
        <el-upload
          style="display: inline-block; margin-left: 10px"
          ref="upload"
          :headers="header_token"
          :show-file-list="false"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :http-request="handleRequest"
          action="#"
          multiple
        >
          <el-button type="primary" size="small">文件上传</el-button>
        </el-upload>
        <el-button size="small" @click="deleteBatch" type="primary">批量删除</el-button>
      </div>
    </div>

    <!-- 数据内容 -->
    <div class="table-content">
      <!-- 表格数据 -->
      <div class="content" style="margin-top: 10px;">
        <el-table
          size="small"
          style="width: 100%;"
          :data="pageData.data"
          @selection-change="handleSelectionChange"
          :fit="true"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column prop="fileName" min-width="300" label="文件名称">
            <template slot-scope="scope">
              <svg-icon
                :icon-class="$utils.getDiskIcon(scope.row)"
                style="width: 30px; height: 35px"
              />
              <span
                v-if="scope.row.dataType === 0"
                @click="enterFolder(scope.row)"
                style="position: absolute; margin-top: 10px"
              >&emsp; {{scope.row.fileName}}</span>
              <span
                v-else
                @click="filePreview(scope.row)"
                style="position: absolute; margin-top: 10px"
              >&emsp; {{scope.row.fileName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="文件大小">
            <template slot-scope="scope">
              <span v-if="scope.row.dataType !== 0">{{$utils.getSize(scope.row.size)}}</span>
              <span v-else>&nbsp;——</span>
            </template>
          </el-table-column>
          <el-table-column prop="createUser" label="创建者" />
          <el-table-column prop="createTime" min-width="120" label="创建日期">
            <template slot-scope="scope">
              <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="160">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="showRename(scope.row)">重命名</el-button>
              <el-button type="primary" plain @click="fileDown(scope.row)" size="mini">下载</el-button>
              <el-button type="primary" plain @click="moveProp(scope.row)" size="mini">移动</el-button>
              <el-button type="primary" @click="deleteFile(scope.row.id)" plain size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 底部工具 -->
      <div class="footer" style="margin-bottom: 20px">
        <!--分页组件-->
        <el-pagination
          style="margin-top: 8px;"
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="pageParams.pageNum"
          :total="pageData.total"
          layout="total, prev, pager, next, sizes"
        />
      </div>
    </div>

    <!-- 模态框 -->
    <div>
      <!-- 创建文件夹 -->
      <el-dialog
        title="创建文件夹"
        :modal-append-to-body="false"
        :visible.sync="folder.visible"
        width="20%"
        center
      >
        <el-input v-model="folder.params.folderName" placeholder="请输入文件夹名称"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" style="width: 97%" @click="saveFolder">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 重命名 -->
      <el-dialog
        title="重命名"
        :modal-append-to-body="false"
        :visible.sync="rename.visible"
        width="30%"
        center
      >
        <el-input v-model="rename.params.name" placeholder="请输入文件夹名称"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" style="width: 97%" @click="saveRename">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 移动 -->
      <el-dialog
        title="移动"
        :modal-append-to-body="false"
        :visible.sync="move.visible"
        width="30%"
        center
      >
        <el-tree
          :data="treeData"
          node-key="id"
          accordion
          :load="loadNode"
          lazy
          highlight-current
          expand-on-click-node
          @node-click="doExpand"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" style="width: 97%" @click="fileMove">移 动</el-button>
        </span>
      </el-dialog>

      <!-- 上传进度条 -->
      <el-dialog
        title="上传进度"
        :visible="progress.upload.visible"
        :modal="false"
        width="36%"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
      >
        <div class="progress-list">
          <div class="progress-item" v-for="(file, index) in progress.upload.files" :key="index">
            <span>{{file.name}} ( {{file.size}} )</span>
            <el-progress :percentage="file.percent"></el-progress>
          </div>
        </div>
      </el-dialog>

      <!-- 下载进度条 -->
      <el-dialog
        title="下载进度"
        :visible="progress.down.visible"
        :modal="false"
        width="36%"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
      >
        <div class="progress-list">
          <span>{{progress.down.fileName}} ( {{progress.down.fileSize}} )</span>
          <el-progress :percentage="progress.down.percent"></el-progress>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import {
  filePage,
  addFolder,
  rename,
  move,
  tree,
  preview,
  deleteByIds,
  checkDupFileName
} from '@/api/file/file'
import initDict from '@/mixins/initDict'
import { getEmployeeId, getCompanyId, getToken } from '@/utils/auth'
import axios from 'axios'

export default {
  name: 'index',
  mixins: [initDict],
  data () {
    return {
      // 当前行数据-通用
      row: null,
      nodes: [], // 保存树结构懒加载数据
      resolves: [], // 保存树结构懒加载数据
      // 树结构数据
      treeData: [],
      // 分页查询返回数据
      pageData: {
        data: [],           // 列表数据
        total: 10           // 查询总数
      },
      // 分页查询参数
      pageParams: {
        bizId: getEmployeeId(),       // 业务主键  当前为员工主键
        bizType: 3,                   // 业务类型   1: 公司文件  2: 项目文件  3: 个人文件
        keyword: null,                // 查询关键字
        pageSize: 10,                 // 每页个数
        pageNum: 0,                   // 当前页数
        parentId: 0                   // 查询所属父文件夹主键  默认为 0，根目录
      },
      // 文件上传参数
      uploadParams: {
        bizId: getEmployeeId(),
        bizType: 3,
        parentId: 0
      },
      // 创建文件夹参数
      folder: {
        params: {
          bizId: getEmployeeId(),
          bizType: 3,
          parentId: 0,
          folderName: null
        },
        visible: false                // 创建文件夹 对话框显示隐藏
      },
      // 重命名参数
      rename: {
        params: {
          id: null,
          name: null
        },
        visible: false                // 重命名 对话框显示隐藏
      },
      // 移动参数
      move: {
        params: {
          bizId: getEmployeeId(),
          bizType: 3,
          originalId: null,
          targetId: null,
        },
        visible: false                // 移动 对话框显示隐藏
      },
      treeParams: {                   // 树结构数据
        bizId: getEmployeeId(),        // 公司ID  项目ID  员工ID
        bizType: 3,                   // 1:公司文件  2：项目文件  3：个人文件
        parentId: 0,                  // 最外层文件夹id
        isDir: 1                      // 是否为 文件夹树形列表 是：1 否：任意
      },
      // 文件路径 列表集合，默认根目录
      pathFiles: [{ id: 0, fileName: '个人文件' }],
      // 文件上传组件 绑定当前所选文件列表 用于清除已选文件集合
      fileList: [],
      // 进度条参数
      progress: {
        upload: {
          files: [],
          visible: false,
          size: 0        // 同时上传数量
        },
        down: {
          visible: false,
          fileSize: 0,        // 文件大小
          fileName: '',
          percent: 0
        }
      },
      load: null,
      // 表格选择事件  所选中的数据列表
      selects: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {

    init () {
      filePage(this.pageParams).then(res => {
        if (res.code === 0) {
          this.pageData.data = res.data.records
          this.pageData.total = Number.parseInt(res.data.total)

          // 清除查询条件 console.log(this.$refs.tree.getCheckedKeys());
          this.pageParams.keyword = ''
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },

    /** 表格数据 行选择处理事件 **/
    handleSelectionChange (values) {
      // 记录选中行数据
      this.selects = values
    },

    // 搜索按钮事件
    search () {
      this.pageParams.pageNum = 0
      this.init()
    },

    // 创建文件夹
    saveFolder () {
      addFolder(this.folder.params).then(res => {
        this.lazy = true
        if (res.code === 0) {
          this.resetLazy()
          this.init()
          this.folder.visible = false
          this.folder.params.folderName = null
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },
    // 删除文件
    deleteFile (id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 请求参数
        let ids = [id]

        // 文件删除
        deleteByIds(ids).then(res => {
          if (res.code === 0) {
            this.init()
            this.$message({ message: '删除成功', type: 'success' })
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

    },
    // 批量删除文件
    deleteBatch () {
      if (this.selects.length === 0) {
        this.$message({ message: '请选择删除文件选项', type: 'warning' })
      } else {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          // 请求参数
          let ids = []
          this.selects.forEach(item => {
            ids.push(item.id)
          })

          // 文件删除
          deleteByIds(ids).then(res => {
            if (res.code === 0) {
              this.init()
              this.$message({ message: '删除成功', type: 'success' })
            } else {
              this.$message({ message: res.msg, type: 'warning' })
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 进入文件夹
    enterFolder (file) {
      this.setCurrentParentId(file.id)
      this.pathFiles.push(file)

      // 初始化 分页参数
      this.pageParams.pageNum = 0
      this.pageParams.keyword = ''

      this.init()
    },
    // 显示重命名对话框
    showRename (file) {
      this.rename.params.id = file.id
      this.rename.params.name = file.fileName
      this.rename.visible = true
    },
    // 重命名请求提交
    saveRename () {
      rename(this.rename.params).then(res => {
        if (res.code === 0) {
          this.init()
          this.resetLazy()
          this.rename.visible = false
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },
    // 文件预览
    filePreview (file) {

      if (file.dataType === 0 || file.dataType === 5 || file.dataType === 1) {
        this.$message({ message: '该类型文件暂不支持预览!', type: 'warning' })
        return
      }

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
    },

    // 文件下载
    fileDown (file) {

      // 创建 axios
      let http = axios.create()

      // 目录 不显示进度条，当前没有处理 获取目录大小，需要后台接口递归查询
      if (file.dataType !== 0) {

        // 显示下载进度条
        this.progress.down.visible = true
        this.progress.down.fileName = file.fileName
        this.progress.down.fileSize = this.$utils.getSize(file.size)
        this.progress.down.percent = 0

        // 下载进度事件
        http = axios.create({
          onDownloadProgress: progressEvent => {
            // 计算进度
            let percent = Number((progressEvent.loaded / file.size * 100).toFixed(1))
            this.progress.down.percent = percent
            // 下载完成隐藏进度条
            if (percent === 100) {
              this.progress.down.visible = false
              this.$message({ message: '下载成功', type: 'success' })

            }
          }
        })

      } else {
        this.$message({ message: '正在打包下载，，，请稍等', type: 'success' })
      }

      // 设置token
      http.interceptors.request.use(
        config => {
          if (getToken()) {
            config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
          }
          return config
        }
      )

      // 文件上传请求
      http({
        url: this.$upload + '/files/down?id=' + file.id,
        method: 'get',
        responseType: 'blob' //application/octet-stream
      }).then(res => {

        // TODO: 此处创建 blob 对象，需要用 res.data
        let blob = new Blob([res.data])
        let url = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.download = file.fileName + '.zip'

        // 目录下载 打包下载
        if (file.dataType === 0) {
          link.download = file.fileName + '.zip'
        } else {
          link.download = file.fileName
        }

        link.href = url
        link.click()
      })

    },
    // 重新加载树结构
    resetLazy () {
      // 创建新的文件夹后重新执行懒加载树结构
      this.$set(this.nodes, 'childNodes', [])
      this.loadNode(this.nodes, this.resolves)
    },
    // 懒加载树结构数据
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.nodes = node
        this.resolves = resolve
        return resolve([{ id: '0', label: '全部文件', name: '全部文件', children: [] }]);
      }
      setTimeout(() => {
        this.doNode(resolve)
      }, 500);
    },
    // 获取加载数据
    doNode (resolve) {
      tree(this.treeParams).then((res) => {
        if (res.code === 0) {
          let data = JSON.parse(JSON.stringify(res.data))
          data.forEach(p => {
            p.name = p.label
          })
          const list = data
          resolve(list)
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },
    // 展开事件
    doExpand (option, node, data) {
      this.row = option
      this.$set(this.treeParams, 'parentId', option.id)

    },
    // 文件移动弹窗
    moveProp (file) {
      this.move.params.originalId = file.id
      this.move.visible = true
    },
    // 文件移动
    fileMove () {
      let row = this.row
      let ids = [row.id]
      this.move.params.targetId = row.id
      move(this.move.params).then(res => {
        if (res.code === 0) {
          this.init()
          this.move.visible = false
          this.resetLazy()
          this.$message({ message: '移动成功', type: 'success' })
        } else {
          this.$message({ message: res.msg, type: 'warning' })
        }
      })
    },
    // 设置当前所属文件夹主键
    setCurrentParentId (id) {
      this.uploadParams.parentId = id
      this.folder.params.parentId = id
      this.pageParams.parentId = id
    },
    // 路径跳转
    pathSkip (file) {

      // 获取当前元素坐标
      let index = null
      let i = this.pathFiles.length
      while (i--) {
        if (this.pathFiles[i] === file) {
          index = i
        }
      }

      // 删除当前坐标之后所有元素
      this.pathFiles.splice(index + 1, this.pathFiles.length)

      // 初始化 分页参数
      this.pageParams.pageNum = 0
      this.pageParams.keyword = ''

      // 跳转路径，页面刷新
      this.setCurrentParentId(file.id)
      this.init()

    },
    // 返回上一级逻辑处理
    backLast () {
      // 删除当前最后一个元素
      this.pathFiles.pop()
      // 获取删除后最后一个元素
      let lastFile = this.pathFiles.slice(-1)

      // 跳转路径，页面刷新
      this.setCurrentParentId(lastFile[0].id)
      this.init()
    },

    // 文件上传之前
    beforeUpload (file) {

      // 进度条显示参数
      let data = {
        uid: file.uid,
        name: file.name,
        size: this.$utils.getSize(file.size),
        percent: 0
      }

      this.progress.upload.files.push(data)
      this.progress.upload.size = this.progress.upload.size + 1

    },
    // 自定义上传请求
    handleRequest (data) {

      // 请求参数
      let dupParams = {
        folderName: data.file.name,
        bizId: this.uploadParams.bizId,
        bizType: this.uploadParams.bizType,
        parentId: this.uploadParams.parentId
      }

      checkDupFileName(dupParams).then(res => {
        if (res.code === 0) {
          // 请求参数
          let form = new FormData()
          form.append('file', data.file)
          form.append('bizId', this.uploadParams.bizId)
          form.append('bizType', this.uploadParams.bizType)
          form.append('parentId', this.uploadParams.parentId)

          // 显示进度条
          this.progress.upload.visible = true

          // 上传配置
          const config = {
            headers: {
              'Authorization': 'Bearer ' + getToken()
            },
            onUploadProgress: progressEvent => {
              // progressEvent.loaded:已上传文件大小
              // progressEvent.total:被上传文件的总大小
              let percent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(1))
              this.setFilePercentByUid(data.file.uid, percent)
            }
          }

          // 文件上传请求
          axios.post(this.$upload + '/file', form, config).then(res => {

            if (res.data.code === 0) {
              // 刷新页面
              this.init()
              // 清除,避免再次上传无法触发接口请求
              this.$refs.upload.clearFiles()

            } else {
              this.$message({ message: res.data.msg, type: 'warning' })
            }

            // 处理进度条显示逻辑
            this.progress.upload.size = this.progress.upload.size - 1
            if (this.progress.upload.size === 0) {
              this.progress.upload.files = []
              this.progress.upload.visible = false

              if (res.data.code === 0) {
                this.$message({ message: '上传成功', type: 'success' })
              }
            }
          })

        } else {
          this.$message({ message: res.msg, type: 'warning' })
          this.progress.upload.size = this.progress.upload.size - 1
          // 删除最后一个元素
          this.progress.upload.files.pop()
          this.$message({ message: res.msg, type: 'warning' })
          return false
        }
      })

    },

    // 设置对应文件 进度
    setFilePercentByUid (uid, percent) {
      this.progress.upload.files.forEach(file => {
        if (file.uid === uid) {
          file.percent = percent
        }
      })
    },

    pageChange (page) {
      this.pageParams.pageNum = page
      this.init()
    },
    sizeChange (size) {
      this.pageParams.pageSize = size
      this.init()
    }
  }
}
</script>

<style scoped>
.head-tools {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}

.head-tools:hover {
  border: 1px solid #ccc;
}

.file-create {
  margin-right: 10px;
}

.back-last {
  float: left;
  color: #606266;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.1;
  text-decoration: none;
}

.back-last:hover {
  color: #1890ff;
}
</style>
