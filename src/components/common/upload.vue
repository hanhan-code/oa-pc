<template>
  <div v-show="flag">
    <span
      v-for="(item, i) in file.fileList"
      :key="i"
      v-show="file.fileList.length > 0"
      class="upload"
    >
      <img
        src="@/assets/common/close.png"
        class="upload-close"
        v-show="!readonly"
        @click="doDelete(item)"
      />
      <img
        :src="item.src"
        @click="doClickImg(item)"
      />
    </span>
    <input
      type="file"
      ref="upload"
      class="upload-hide"
      :disabled="disabled"
      :multiple="multiple"
      :accept="accept"
      @change="doChange"
    />
    <img
      src="@/assets/common/upload.png"
      class="upload-create"
      v-show="!readonly"
      @click="doUpload"
    />
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
  </div>
</template>

<script>
import comMixins from "@/mixins/comMixins";
import { Dialog } from "vant";
import axios from "axios";

export default {
  name: "upload", // 上传管理
  mixins: [comMixins],
  data() {
    return {
      show: false,
    };
  },
  watch: {
    num() {
      // 当点击文字触发上传时使用
      this.$refs.upload.click();
    }
  },
  props: {
    num: {
      // 更新上传状态 以便下一次可以点击上传
      default: 0
    },
    flag: {
      // 如果只需要通过外部文字或者按钮使用上传，flag值为false即可
      default: true,
      type: Boolean
    },
    file: {
      default: () => {
        return {
          fileList: [] // 文件列表 已有文件或者新添加的文件都可以   必传
        };
      }
    },
    multiple: {
      // 多选
      default: true,
      type: Boolean
    },
    accept: {
      // 接收的文件类型 accept="image/*, .pdf"
      default: "",
      type: String
    },
    disabled: {
      // 是否禁用
      default: false,
      type: Boolean
    },
    readonly: {
      // 是否只读  不显示删除按钮 和上传按钮
      default: false,
      type: Boolean
    }
  },
  mounted() {},
  methods: {
    // 点击上传
    doUpload() {
      if (this.android) {
        this.show = true;
      } else {
        this.$refs.upload.click();
        this.show = false;
      }
    },
    // 点击图片进行相关操作
    doClickImg(file) {
      this.$emit("fileClick", file);
    },
    // 文件删除
    doDelete(file) {
      Dialog.confirm({
        title: "",
        message: "此操作将永久删除该记录, 是否继续?"
      }).then(() => {
        this.$emit("fileDelete", file);
      });
    },
    doChange(e) {
      let num = e.target.files.length + this.file.fileList.length > 5;
      if (num) {
        Dialog.alert({ message: "文件已上传数量不能超过5个" });
        return;
      }
      if (!this.flag) {
        this.$emit("fileData", e.target.files);
      } else {
        this.doBefore(e.target.files);
      }
    },
    // 上传图片之前
    doBefore(file) {
      let reg = /pdf|image/i;
      if (file.length > 1) {
        for (let i = 0; i < file.length; i++) {
          let flag = reg.test(file[i].type);
          if (!flag) {
            Dialog.alert({ message: "仅支持图片和pdf文件上传" });
            return;
          }
        }
      } else {
        console.log(file[0]);
        let flag = reg.test(file[0].type);
        if (!flag) {
          Dialog.alert({ message: "仅支持图片和pdf文件上传" });
          return;
        }
      }
      this.doAfter(file);
    },
    // 上传之后
    doAfter(files) {
      let file = files,
        percent,
        uploadNum = 0, // 用来多文件上传判定条件
        arr = []; // 用来多文件上传进度条
      if (file.length === 0) {
        return;
      }
      for (let i = 0; i < file.length; i++) {
        let form = new FormData();
        form.append("file", file[i]);
        const http = axios.create({
          headers: {
            Authorization: "Bearer " + this.getToken
          },
          onUploadProgress: progressEvent => {
            this.doUploading(false);
            // 计算进度
            let value = Math.floor(
              Number((progressEvent.loaded / file[i].size) * 100)
            );
            if (file.length === 1) {
              this.doUploading(true, value);
            } else {
              arr[i] = value;
              if (arr.length > 0) {
                percent = Math.floor(
                  arr.reduce(function(value, oldValue) {
                    return (value + oldValue) / file.length;
                  })
                );
                this.doUploading(true, percent);
              }
            }
          }
        });
        http.post(this.$network + "file/attachment", form).then(res => {
          let data = res.data;
          if (data.code === 0) {
            uploadNum++;
            // 如果上传文件数量大于1 手动计算进度条进度
            if (
              (file.length > 1 && uploadNum === file.length) ||
              file.length === 1
            ) {
              this.doUploading(false);
              Dialog.alert({ message: "上传成功" });
              this.$emit("fileData", data);
            }
          } else {
            if (file.length === 1 && data.code >= 1 && data.code <= 10) {
              Dialog.alert({ message: data.msg });
              this.doUploading(false);
            } else if (file.length === 1 && data.code > 10) {
              Dialog.alert({ message: "系统异常,请稍后再试" });
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="stylus">
.upload {
  position: relative;
  width: 80px;
  height: 80px;
  margin-top: 0.3rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;

  .upload-close {
    position: absolute;
    top: -0.3rem;
    right: -0.4rem;
    width: 0.6rem;
    height: 0.6rem;
    margin: 0;
  }

  img {
    width: 80px;
    height: 80px;
    margin-right: 0.5rem;
    margin-bottom: 0.7rem;
  }
}

.upload-create {
  width: 80px;
  height: 80px;
  margin-bottom: 0.5rem;
}

.upload-hide {
  display: none;
}

.choose {
  height: 1.5rem;
  line-height: 1.5rem;
  width: 150px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
</style>
