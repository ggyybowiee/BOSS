import api from "../../api/api";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        userName: "", // 用户名
        operationService: "", //操作业务
        operation: "", // 操作
        operationResult: "", // 结果
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        pageNum: 1,
        pageSize: 10
      },
      time: [this.moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), this.moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss')],
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      list: [],
      operationOptions: [{
          label: this.$t('全部'),
          value: ""
        },
        {
          label: this.$t('增加'),
          value: "1"
        },
        {
          label: this.$t('修改'),
          value: "2"
        },
        {
          label: this.$t('删除'),
          value: "3"
        },
        {
          label: this.$t('导入'),
          value: "4"
        },
        {
          label: this.$t('导出'),
          value: "5"
        },
        {
          label: this.$t('其他'),
          value: "99"
        }
      ],
      operationResultOptions: [{
          label: this.$t('全部'),
          value: ""
        },
        {
          label: this.$t('成功'),
          value: "1"
        },
        {
          label: this.$t('失败'),
          value: "0"
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
      dialogTableData: [],
      dialogData: {},
      power: {
        "boss_check_bosslogsuite": false
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
        userName: "", // 用户名
        operationService: "", //操作业务
        operation: "", // 操作
        operationResult: "", // 结果
        startTime: "", // 开始时间
        endTime: "", // 结束时间
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
        this.params["startTime"] = _self.moment().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["endTime"] = _self.moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.params["startTime"] = _self.moment(_.get(_self, 'time[0]')).utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["endTime"] = _self.moment(_.get(_self, 'time[1]')).utc().format('YYYY-MM-DD HH:mm:ss');
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
        .get(api.operation(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.operationLogList, (item) => {
              let offSet = _self.moment().utcOffset(); //时差

              let formatArrProperty = ["operationTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = response.data.operationLogList;
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
    // 详情
    details(row) {
      this.dialogTableData = [];
      this.dialogData = _.cloneDeep(row);
      this.dialogData.requestBody = this.formatJson(row.requestBody);
      this.dialogTableData.push(row);
      this.dialogTableVisible = true;
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
    filterOperationOptions(status) {
      let label = '';
      _.forEach(that.operationOptions, (item) => {
        if (item.value == Number(status)) {
          label = item.label;
        }
      });
      return label;
    },
    filterOperationResultOptions(status) {
      let label = '';
      _.forEach(that.operationResultOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    },
  }
};
