import api from "../../api/api";
import ShowDetail from "./ShowDetail.vue";
import BatchUpdate from "./BatchUpdate.vue";
import ExportExcel from "./ExportExcel.vue";
import BatchMaintenance from "./BatchMaintenance.vue";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        sn: "", // 终端ID
        productCode: "", // 产品编码
        customer: "", // 客户
        status: "", // 授权状态
        payStatus: "", // 支付状态
        source: "", // 数据来源
        beginInvalidTime: "",
        endInvalidTime: "",
        beginSubTime: "",
        endSubTime: "",
        pageNum: 1,
        pageSize: 10
      },
      operatorType: '',
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      detailVisible: false,
      exportExcelVisible: false,
      maintenanceVisible: false,
      addTime: '',
      title: '',
      list: [],
      productCodeOptions: [],
      payStatusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('管理授权'),
          value: "0",
        },
        {
          label: this.$t('待支付'),
          value: "1"
        },
        {
          label: this.$t('支付中'),
          value: "2",
        },
        {
          label: this.$t('支付失败'),
          value: "3",
        },
        {
          label: this.$t('支付成功'),
          value: "4"
        },
        {
          label: this.$t('兑换码兑换'),
          value: "5"
        }
      ],
      statusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('禁用'),
          value: "0"
        },
        {
          label: this.$t('启用'),
          value: "1"
        }
      ],
      sourceOptions: [{
        label: this.$t('全部'),
        value: ""
      }, {
        label: "BOSS",
        value: "1"
      }, {
        label: "AAA",
        value: "2"
      }],
      subTime: [],
      invalidTime: [],
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
      selectedData: [],
      title: '', // 弹框标题
      showDetailTime: '',
      detailsObj: null, // 添加/修改对象
      power: {
        "boss_check_authInfo": false,
        "boss_authinfo_batch_bmt": false, // 授权信息批量维护
        "boss_batch_authInfoStatus_authInfo": false, // 批量修改授权状态
        "boss_synchro_authInfo": false,
        "boss_authinfo_download_for_excel": false // 导出授权信息
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
    // 获取产品列表
    getProductList() {
      let _self = this;

      let params = {
        pageNum: 1,
        pageSize: 1000,
        relateType: 1
      };

      this.$http
        .get(api.product(), {
          params
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            _.forEach(response.data.data, item => {
              _self.productCodeOptions.push({
                value: item.productCode,
                label: item.productName
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
      this.selectedData = val;
    },
    // 授权信息批量维护
    batchMaintenance() {
      this.title = this.$t('授权信息批量维护');
      this.addTime = new Date();
      this.maintenanceVisible = true;
    },
    // 导出授权信息
    exportExcel() {
      this.title = this.$t('导出授权信息');
      this.addTime = new Date();
      this.exportExcelVisible = true;
    },
    // 批量修改授权状态
    batchUpdate() {
      this.title = this.$t('批量修改授权状态');
      this.addTime = new Date();
      this.dialogTableVisible = true;
    },
    // 同步
    synchro() {
      let _self = this;
      let params = {
        type: "6",
        typeId: []
      };

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选需要同步的数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        params.typeId.push(item.authCode);
      });

      this.$http
        .post(api.noticeSyncMetadata(), params)
        .then((response) => {
          if (response.data.returnCode == 0) {
            _self.message('success', _self.$t('同步成功！'));
            _self.search();
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
    // 查看
    details(row) {
      this.title = this.$t('查看产品');
      this.detailsObj = _.cloneDeep(row);
      this.showDetailTime = new Date();
      this.detailVisible = true;
    },
    reset() {
      this.params = {
        sn: "", // 终端ID
        productCode: "", // 产品编码
        customer: "", // 客户
        status: "", // 授权状态
        payStatus: "", // 支付状态
        source: "", // 数据来源
        beginInvalidTime: "",
        endInvalidTime: "",
        beginSubTime: "",
        endSubTime: "",
        pageNum: 1,
        pageSize: 10
      };
      this.invalidTime = [];
      this.subTime = [];

      this.search();
    },
    search() {
      let _self = this;

      if (this.subTime && this.subTime.length > 0 && this.subTime[0]) {
        this.params["beginSubTime"] = _self.moment(_.get(_self, 'subTime[0]')).utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["endSubTime"] = _self.moment(_.get(_self, 'subTime[1]')).utc().format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.params["beginSubTime"] = "";
        this.params["endSubTime"] = "";
      }

      if (this.invalidTime && this.invalidTime.length > 0 && this.invalidTime[0]) {
        this.params["beginInvalidTime"] = _self.moment(_.get(_self, 'invalidTime[0]')).utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["endInvalidTime"] = _self.moment(_.get(_self, 'invalidTime[1]')).utc().format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.params["beginInvalidTime"] = "";
        this.params["endInvalidTime"] = "";
      }

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
        .get(api.authInfo(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.authInfoList, (item) => {
              let offSet = _self.moment().utcOffset(); // 时差

              let formatArrProperty = ["effectTime", "invalidTime", "subTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = response.data.authInfoList;

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
        _self.operatorType = sessionStorage.getItem('operatorType') ? sessionStorage.getItem('operatorType') : '';

        if (this.operatorType == 1) {
          this.getProductList();
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
    filterPayStatusOptions(status) {
      let label = '';
      _.forEach(that.payStatusOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    }
  },
  components: {
    BatchUpdate,
    ShowDetail,
    ExportExcel,
    BatchMaintenance
  }
};
