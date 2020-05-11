import api from "../../api/api";
import Add from './Add.vue'

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        uidType: "0", // 账号查询类型
        userId: "", // 默认账号
        feedbackInfo: "", // 反馈内容
        feedbackType: "", // 反馈类型
        feedbackPlatform: "", // 反馈平台
        portalCode: "", // 应用名称
        apkVer: "", // 版本
        country: "", // 版本
        feedbackStartTime: "", // 开始时间
        feedbackEndTime: "", // 结束时间
        pageNum: 1,
        pageSize: 10
      },
      addTime: '',
      exportDialogVisible: false,
      uidTypeOptions: [{
          label: this.$t('账号模糊搜索'),
          value: "0"
        },
        {
          label: this.$t('账号精确搜索'),
          value: "1"
        }
      ],
      selectedDatas: [], // 需要重发的数组
      time: [this.moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), this.moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss')],
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      dialogData: {},
      list: [],
      feedbackTypeOptions: [{
          label: this.$t('全部'),
          value: ""
        },
        {
          label: this.$t('建议'),
          value: "1"
        },
        {
          label: this.$t('问题'),
          value: "2"
        },
        {
          label: this.$t('其他'),
          value: "3"
        },
        {
          label: this.$t('内容'),
          value: "4"
        },
        {
          label: this.$t('支付'),
          value: "5"
        }
      ],
      feedbackPlatformOptions: [{
        label: this.$t('tv'),
        value: "tv"
      }, {
        label: this.$t('phone'),
        value: "phone"
      }, {
        label: this.$t('web'),
        value: "web"
      }],
      portalCodeOptions: [{
        dictVale: this.$t('全部'),
        dictName: ""
      }],
      pickerOptions: {
        shortcuts: [{
            text: this.$t('最近一周'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t('最近一个月'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t('最近三个月'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      power: {
        "boss_getFeedbackInfo": false,
        "boss_exportFeedbackInfo": false
      }
    };
  },
  beforeCreate: function () {
    that = this;
  },
  mounted() {
    document.title = this.$t("ues");
    let _self = this;
    this.tree();

    setTimeout(() => {
      _self.search();
    }, 100);


    // 查询应用名称列表
    let tempParam = {
      flag: 0
    };

    this.portalCodeOptions = [{
      dictValue: _self.$t('全部'),
      dictName: ""
    }];

    this.$http
      .get(api.dictionary(), {
        params: tempParam
      })
      .then((response) => {
        if (response.data.returnCode == 0) {
          let arr = _.filter(response.data.dictInfoList, function (item) {
            return (item.dictType).replace(/\s+/g, "") == '18';
          });

          _.forEach(arr, item => {
            _self.portalCodeOptions.push({
              dictValue: item.dictValue,
              dictName: item.dictName
            });
          });
        } else {
          _self.message('error', response.data.errorMessage);
        }
      })
      .catch((error) => {
        _self.message('error', `${error.response.status}: ${error.response.statusText}`);
      });

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
    //多选
    handleSelectionChange(val) {
      this.selectedDatas = val;
    },
    // 详情
    details(row) {
      this.dialogData = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    // 导出反馈信息
    exportFeedbackInfo() {
      let _self = this;
      if (!this.time || this.time[0] == null) {
        this.params["feedbackStartTime"] = _self.moment().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["feedbackEndTime"] = _self.moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.params["feedbackStartTime"] = _self.moment(_.get(_self, 'time[0]')).utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["feedbackEndTime"] = _self.moment(_.get(_self, 'time[1]')).utc().format('YYYY-MM-DD HH:mm:ss');
      }

      _self.searchData = _.cloneDeep(this.params);
      _.forEach(_self.searchData, (value, key) => {
        _self.searchData[key] = _self.Trim(value);
        if (!_self.searchData[key]) {
          delete _self.searchData[key];
        }
      });

      this.exportDialogVisible = true;
      this.addTime = new Date();
    },
    reset_search() {
      this.params = {
        uidType: "0", // 账号查询类型
        userId: "", // 默认账号
        feedbackInfo: "", // 反馈内容
        feedbackType: "", // 反馈类型
        feedbackPlatform: "", // 反馈平台
        portalCode: "", // 应用名称
        apkVer: "", // 版本
        country: "", // 版本
        feedbackStartTime: "", // 开始时间
        feedbackEndTime: "", // 结束时间
        pageNum: 1,
        pageSize: 10
      };
      this.time = [this.moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), this.moment(new Date())
        .format(
          'YYYY-MM-DD HH:mm:ss')
      ];
      this.search();
    },
    search() {
      let _self = this;
      if (!this.time || this.time[0] == null) {
        this.params["feedbackStartTime"] = _self.moment().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["feedbackEndTime"] = _self.moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.params["feedbackStartTime"] = _self.moment(_.get(_self, 'time[0]')).utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["feedbackEndTime"] = _self.moment(_.get(_self, 'time[1]')).utc().format('YYYY-MM-DD HH:mm:ss');
      }

      _self.searchData = _.cloneDeep(this.params);
      _.forEach(_self.searchData, (value, key) => {
        _self.searchData[key] = _self.Trim(value);
        if (!_self.searchData[key]) {
          delete _self.searchData[key];
        }
      });

      this.handleCurrentChange(1);
      let obj = document.querySelectorAll("li.number")[0];
      if (obj) {
        obj.click();
      }
    },
    getList() {
      let _self = this;
      _self.loading = true;
      _self.oneClick = true;

      _self.searchData['pageSize'] = _self.params['pageSize'];
      _self.searchData['pageNum'] = _self.params['pageNum'];

      //搜索部分
      this.$http
        .get(api.userFeedback(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.data, (item) => {
              let offSet = _self.moment().utcOffset(); //时差

              let formatArrProperty = ["feedbackTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = response.data.data;
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
    filterFeedbackTypeOptions(status) {
      let label = '';
      _.forEach(that.feedbackTypeOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    },
    filterPortalCodeOptions(pkg) {
      let label = '';
      _.forEach(that.portalCodeOptions, (item) => {
        if (item.dictName == pkg) {
          label = item.dictValue;
        }
      });
      return label;
    }
  },
  components: {
    Add
  }
};
