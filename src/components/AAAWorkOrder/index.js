import api from "../../api/api";

'use strict';
export default {
  data() {
    return {
      params: {
        neName: "", // 网元名称
        requestUrl: "", // 请求地址
        requestStatus: "", // 状态
        requestMsg: "", // 报文
        startRequestTime: "", // 开始时间
        endRequestTime: "", // 结束时间
        pageNum: 1,
        pageSize: 10
      },
      resendDatas: [], // 需要重发的数组
      time: [this.moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), this.moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss')],
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      dialogTableData: [],
      dialogData: {},
      list: [],
      requestStatusOptions: [{
          label: this.$t('全部'),
          value: ""
        },
        {
          label: this.$t('发送成功'),
          value: "0"
        },
        {
          label: this.$t('未发送'),
          value: "1"
        },
        {
          label: this.$t('发送中'),
          value: "2"
        },
        {
          label: this.$t('发送失败'),
          value: "3"
        }
      ],
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
        "boss_check_aaawk": false,
        "boss_resend_aaawk": false
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
      this.resendDatas = val;
    },
    // 详情
    details(row) {
      this.dialogTableData = [];
      this.dialogData = _.cloneDeep(row);
      this.dialogData.requestMsg = this.formatJson(row.requestMsg);
      this.dialogTableData.push(row);
      this.dialogTableVisible = true;
    },
    // 重发
    resend(row) {
      let _self = this;
      let arr = [];

      if (row) {
        arr.push(row.id);
      } else {
        if (_self.resendDatas.length == 0) {
          _self.message('info', _self.$t('亲，请选择要重发的工单！'));
          return;
        }

        _.forEach(_self.resendDatas, (item) => {
          arr.push(item.id);
        });
      }
      // 重发
      this.$http
        .put(api.aaaWorkOrder(), {
          id: arr
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            _self.message('success', _self.$t('亲，工单重发成功！'));
            _self.search();
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
    // 校验是否能够选中
    checkboxCanSelect(row) {
      if (row.requestStatus == 3) {
        return true;
      }

      return false
    },
    reset_search() {
      this.params = {
        neName: "", // 网元名称
        requestUrl: "", // 请求地址
        requestStatus: "", // 状态
        requestMsg: "", // 报文
        startRequestTime: "", // 开始时间
        endRequestTime: "", // 结束时间
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
        this.params["startRequestTime"] = _self.moment().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["endRequestTime"] = _self.moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.params["startRequestTime"] = _self.moment(_.get(_self, 'time[0]')).utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["endRequestTime"] = _self.moment(_.get(_self, 'time[1]')).utc().format('YYYY-MM-DD HH:mm:ss');
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
        .get(api.aaaWorkOrder(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.workOrderList, (item) => {
              let offSet = _self.moment().utcOffset(); //时差

              let formatArrProperty = ["requestTime", "responseTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = response.data.workOrderList;
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
  }
};
