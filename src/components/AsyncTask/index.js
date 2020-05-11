import api from "../../api/api";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        type: "", // 类型
        status: "", // 状态
        pageNum: 1,
        pageSize: 10
      },
      timer: null,
      searchData: {},
      loading: true,
      oneClick: false,
      list: [],
      typeOptions: [{
          "label": this.$t('全部'),
          "value": ""
        }, {
          "value": "0",
          "label": this.$t("授权信息批量维护")
        }, {
          "value": "1",
          "label": this.$t("终端信息")
        },
        {
          "value": "2",
          "label": this.$t("客户关联终端")
        },
        {
          "value": "3",
          "label": this.$t("授权策略关联终端")
        },
        {
          "value": "4",
          "label": this.$t("授权信息状态")
        },
        {
          "value": "5",
          "label": this.$t("终端信息状态")
        },
        {
          "value": "6",
          "label": this.$t("批量新增授权信息")
        },
        {
          "value": "7",
          "label": this.$t("套餐编码授权信息")
        },
        {
          "value": "8",
          "label": this.$t("终端信息批量下载")
        },
        {
          "value": "9",
          "label": this.$t("授权信息批量下载")
        },
        {
          "value": "10",
          "label": this.$t("终端批量修改关联预授权策略")
        }
      ],
      statusOptions: [{
          label: this.$t('全部'),
          value: ""
        },
        {
          label: this.$t('批量文件等待上传'),
          value: "1"
        },
        {
          label: this.$t('批量文件上传中'),
          value: "2"
        },
        {
          label: this.$t('批量文件上传失败'),
          value: "3"
        }, {
          label: this.$t('初始化'),
          value: "4"
        }, {
          label: this.$t('执行中'),
          value: "5"
        }, {
          label: this.$t('执行失败'),
          value: "6"
        }, {
          label: this.$t('执行完成'),
          value: "7"
        }
      ],
      downloadUrl: '',
      power: {
        "boss_check_asynctask": false,
        "boss_reset_asynctask": false,
        "boss_batch_download": false,
        "boss_result_download": false
      }
    };
  },
  mounted() {
    document.title = this.$t("ues");
    let _self = this;
    this.tree();

    setTimeout(() => {
      _self.search();
    }, 100);


    if (!this.timer) {
      //开始自动刷新
      this.timer = setInterval(() => {
        _self.search();
      }, 3000);
    }
  },
  beforeCreate: function () {
    that = this;
  },
  beforeDestroy() {
    this.stopRefresh();
  },
  methods: {
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.params.pageNum = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.getList();
    },
    reset() {
      this.params = {
        type: "", // 类型
        status: "", // 状态
        pageNum: 1,
        pageSize: 10
      };
      this.search();
    },
    search() {
      let _self = this;

      _self.searchData = _.cloneDeep(this.params);
      _.forEach(_self.searchData, (value, key) => {
        _self.searchData[key] = _self.Trim(value);
        if (!_self.searchData[key]) {
          delete _self.searchData[key];
        }
      });

      _self.getList();
    },
    getList() {
      let _self = this;
      _self.loading = true;
      _self.oneClick = true;

      _self.searchData['pageSize'] = _self.params['pageSize'];
      _self.searchData['pageNum'] = _self.params['pageNum'];

      //搜索部分
      this.$http
        .get(api.asyncTask(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.asyncTaskInfoList, (item) => {
              let offSet = _self.moment().utcOffset(); // 时差

              let formatArrProperty = ["beginTime", "endTime", "updateTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = response.data.asyncTaskInfoList;
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          _self.loading = false;
          _self.oneClick = false;
        });
    },
    stopRefresh() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    downloadFile(row, type) {
      // type: 1，批存储路径；2，结果存储路径
      let _self = this;
      this.downloadUrl = `/api/boss/downloadAsyncTaskFile?type=${type}&id=${row.id}`;
      this.$http.get(this.downloadUrl)
        .then((response) => {
          if (typeof _.get(response, 'data') == 'string') {
            _self.$refs.elementA.click();
          }
        });
    },
    tree() {
      let _self = this;
      let tree = [];
      this.getResourceTree((data) => {
        if (data !== "error") {
          _self.Refining(data, tree, "boss");
          for (let key in _self.power) {
            _self.power[key] = _self.InArray(tree, key);
          }
        }
      });
    },
    Refining(arJsonNesting, arJson, str) {
      for (let i = 0, j = arJson.length; i < arJsonNesting.length; i++) {
        if (arJsonNesting[i].resourceCode !== null) {
          if (arJsonNesting[i].resourceCode.indexOf(str) !== -1) {
            arJson.push(arJsonNesting[i].resourceCode);
          }
        }
        j++;
        if (arJsonNesting[i].children) {
          this.Refining(arJsonNesting[i].children, arJson, str);
        }
      }
    }
  },
  filters: {
    filterStatusOptions(status) {
      let label = '';
      _.forEach(that.statusOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    },
    filterTypeOptions(type) {
      let label = '';
      _.forEach(that.typeOptions, (item) => {
        if (item.value == type) {
          label = item.label;
        }
      });
      return label;
    }
  }
};
