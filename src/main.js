import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router/routers'
import permission from './components/permission'
import store from './store'

import '@/icons' // icon
import './router/index' // permission control

import moment from 'moment'  // 时间格式化工具

// 融合 == 全局文件上传 Headers 设置
import uploadHeaders from './utils/uploadHeaders'

Vue.mixin(uploadHeaders)

Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

// Vue.prototype.$filePrefix = 'http://192.168.0.180/'                                 // 文件访问前缀
// Vue.prototype.$network = 'http://192.168.0.185:9999/'                               // 全局网关地址
// Vue.prototype.$upload = 'http://192.168.0.185:10005/'                               // 全局文件上传地址（绕过网关）
//TODO: 附件上传 this.$upload + 'attachment'    云盘中心文件上传 this.$upload + 'file'

Vue.prototype.$filePrefix = 'http://fdfs.jsztgj.com/'
Vue.prototype.$network = 'http://api.jsztgj.com/'
Vue.prototype.$upload = 'http://upload.jsztgj.com/'

Vue.prototype.$moment = moment   // 添加Vue属性
Vue.prototype.$utils = {
  parseDate(str) {
    if (typeof str == 'string') {
      var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/)
      if (results && results.length > 3) {
        return new Date(parseInt(results[1]), parseInt(results[2]) - 1, parseInt(results[3]))
      }
      results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/)
      if (results && results.length > 6) {
        return new Date(parseInt(results[1]), parseInt(results[2]) - 1, parseInt(results[3]), parseInt(results[4]), parseInt(results[5]), parseInt(results[6]))
      }
      results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/)
      if (results && results.length > 7) {
        return new Date(parseInt(results[1]), parseInt(results[2]) - 1, parseInt(results[3]), parseInt(results[4]), parseInt(results[5]), parseInt(results[6]), parseInt(results[7]))
      }
    }
    return null
  },
  clone: function(obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  getSize: function(size) {
    if (size < 1024) {
      return '1KB'
    }
    if (size > 1024 && size < 1024 * 1024) {
      return parseInt(size / 1024) + 'KB'
    }
    if (size > 1024 * 1024 && size < 1024 * 1024 * 1024) {
      return (size / 1024 / 1024).toFixed(2) + 'MB'
    }
  },
  getSuffix: function(filename) {
    var index = filename.lastIndexOf('.')
    if (index >= 0) {
      return filename.substring(index + 1, filename.length).toLowerCase()
    } else {
      return null
    }
  },
  getThumbnail: function(link) {
    let args = link.split('.')
    return Vue.prototype.$filePrefix + args[0] + '_150x150.' + args[1]
  },
  getIcon: function(filename) {

    var suffix = this.getSuffix(filename)
    let document = ['log', 'txt', 'md', 'html']                               // 文档类型
    let video = ['avi', 'mpg', 'mov', 'swf', 'rmvb', 'rm', 'FLV', 'mp4']          // 视频类型
    let audio = ['mp3', 'wma', 'wav', 'midi', 'flac', 'aif', 'ram', 'au']         // 音频类型

    if ('pdf' === suffix) {
      return 'icon-pdf'
    } else if ('doc' === suffix || 'docx' === suffix) {
      return 'icon-word'
    } else if ('pptx' === suffix || 'ppt' === suffix) {
      return 'icon-ppt'
    } else if ('xls' === suffix || 'xlsx' === suffix) {
      return 'icon-excel'
    } else if (this.containsIgnoreCase(document, suffix)) {
      return 'icon-document'
    } else if (this.containsIgnoreCase(video, suffix)) {
      return 'icon-video'
    } else if (this.containsIgnoreCase(audio, suffix)) {
      return 'icon-audio'
    } else {
      return 'icon-other-file'
    }
  },
  getDiskIcon: function(file) {

    if (file.dataType === 0) {
      return 'icon-folder'
    } else if (file.dataType === 1) {
      return 'icon-picture'
    } else if (file.dataType === 2) {
      return 'icon-video'
    } else if (file.dataType === 3) {
      return 'icon-audio'
    } else if (file.dataType === 4) {
      if ('pdf' === file.ext) {
        return 'icon-pdf'
      } else if ('doc' === file.ext || 'docx' === file.ext) {
        return 'icon-word'
      } else if ('pptx' === file.ext || 'ppt' === file.ext) {
        return 'icon-ppt'
      } else if ('xls' === file.ext || 'xlsx' === file.ext) {
        return 'icon-excel'
      } else {
        return 'icon-document'
      }
    } else {
      return 'icon-other-file'
    }
  },
  containsIgnoreCase(arr, obj) {
    var i = arr.length
    while (i--) {
      if (arr[i].toLowerCase() === obj.toLowerCase() && arr[i].length === obj.length) {
        return true
      }
    }
    return false
  },
  contains(arr, obj) {
    var i = arr.length
    while (i--) {
      if (arr[i] === obj) {
        return true
      }
    }
    return false
  },
  formatMsg(msg) {
    return msg.toString().replace(new RegExp('[a-zA-Z.:]', 'gm'), '')
  },
  unique: function(arr) {
    return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
  }
}

require('babel-polyfill')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
