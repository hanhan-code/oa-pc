import { get, getDictMap } from "@/api/dictDetail";

export default {
  data() {
    return {
      dicts: [],
      dictMap: {}
    };
  },
  computed: {
    // app=contaniner 继承父级高度
    getHeight() {
      let container = document.getElementById("app-container");
      let main = document.getElementsByClassName("app-main")[0].clientHeight;
      container.style.height = main + "px";
      return "";
    }
  },
  mounted() {
    this.getHeight;
  },
  methods: {
    async getDict(name) {
      return new Promise((resolve, reject) => {
        get(name)
          .then(res => {
            this.dicts = res.data.list;
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 多个字典查询时使用逗号拼接， 如：
    // 加载多个数据字典，如何调用如下：
    // this.getDict('
    //
    //
    // ,job_status')
    // 在vue中使用加载出来的字典：
    // dictMap.[字典名称] 如：dictMap.user_status、 dictMap.job_status
    async getDictMap(names) {
      // 优先放入到dictMap中，避免页面加载时 undefined
      const arr = names.split(",");
      for (let i = 0; i < arr.length; i++) {
        this.dictMap[arr[i]] = [];
      }
      return new Promise((resolve, reject) => {
        getDictMap(names)
          .then(res => {
            this.dictMap = res.data;
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
