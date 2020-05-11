import api from "../../api/api";
import Add from "./Add.vue";
import ShowDetail from "./ShowDetail.vue";
import Customer from "./Customer.vue";
import ExportExcel from "./ExportExcel.vue";
import LinkDialog from "./LinkDialog.vue";
import BatchAddAccount from "./BatchAddAccount.vue";
import BatchUpdate from "./BatchUpdate.vue";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        sn: "", // 终端ID
        macAddr: "", // MAC
        type: "", // 类型
        status: "", // 终端状态
        useStatus: "", // 市场状态
        customer: "", // 所属客户
        whtieSealArea: "", // 白名单销售区域
        blackSealArea: "", // 黑名单销售区域
        tmodel: "", // 机型
        beginActiveTime: "",
        endActiveTime: "",
        relateType: '1',
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      operatorType: '',
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      exportExcelVisible: false,
      batchUpdateVisible: false,
      linkVisible: false,
      linkTime: '',
      addTime: '',
      customerTime: '',
      showDetailTime: '',
      updateSnTime: '',
      detailVisible: false,
      customerVisible: false,
      batchAddAccountVisible: false,
      customerTitle: '',
      list: [],
      time: [],
      tmodelOptions: [],
      accountSystemOptions: [],
      cities: [],
      terminalStatusOptions: [{
        label: this.$t('未激活'),
        value: "1"
      }, {
        label: this.$t('已激活'),
        value: "2"
      }, {
        label: this.$t('非法机'),
        value: "3"
      }, {
        label: this.$t('坏机'),
        value: "4"
      }, {
        label: this.$t('禁用'),
        value: "5"
      }],
      typeOptions: [{
        label: this.$t('全部'),
        value: ""
      }, {
        label: this.$t('终端自产'),
        value: "1"
      }, {
        label: this.$t('终端代产'),
        value: "2"
      }],
      useStatusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('禁用'),
          value: "2"
        },
        {
          label: this.$t('启用'),
          value: "1"
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
      selectedData: [],
      title: '', // 弹框标题
      detailsObj: null, // 添加/修改对象
      power: {
        "boss_check_terminal": false,
        "boss_create_terminal": false,
        "boss_delete_terminal": false,
        "boss_update_terminal": false,
        "boss_synchro_terminal": false,
        "boss_terminal_relate_authpolicy": false, // 关联授权策略
        "boss_terminal_unrelate_authpolicy": false, // 取消关联授权策略
        "boss_batch_terminal": false, // 批量修改市场状态
        "boss_batch_update_terminal_status": false, // 批量修改终端状态
        "boss_batch_update_terminal_customer": false, // 批量修改终端ID所属客户
        "boss_batch_update_terminal_policy": false, // 批量修改终端关联策略
        "boss_Exportfile_terminal": false, // 导出终端信息
        "boss_account_terminal": false // 批量生成账号
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

    this.getDictionary();
  },
  methods: {
    // 获取字典
    getDictionary() {
      let _self = this;

      let field = {
        flag: 0
      };

      this.$http
        .get(api.dictionary(), {
          params: field
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            let arr = _.filter(response.data.dictInfoList, function (item) {
              return (item.dictType).replace(/\s+/g, "") == '12';
            });

            _.forEach(arr, item => {
              _self.tmodelOptions.push({
                label: item.dictValue,
                value: item.dictName
              });
            });

            let arr2 = _.filter(response.data.dictInfoList, function (item) {
              return (item.dictType).replace(/\s+/g, "") == '2';
            });

            _.forEach(arr2, item => {
              _self.cities.push({
                label: item.dictValue,
                value: item.dictName
              });
            });

            let arr3 = _.filter(response.data.dictInfoList, function (item) {
              return (item.dictType).replace(/\s+/g, "") == '16';
            });

            _.forEach(arr3, item => {
              _self.accountSystemOptions.push({
                label: item.dictValue,
                value: item.dictName
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
    addOrUpdate(row) {
      if (!row) {
        this.title = this.$t('新增终端用户');
      } else {
        this.title = this.$t('修改终端用户');
      }
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    batchAddAccount() {
      this.title = this.$t('批量生成账号');
      this.addTime = new Date();
      this.batchAddAccountVisible = true;
    },
    // 批量修改状态
    batchUpdate(type) {
      if (type == 2) {
        let hasActiveItem = false;
        _.forEach(this.selectedData, item => {
          if (item.status == '2') {
            hasActiveItem = true;
            return;
          }
        });

        if (hasActiveItem) {
          this.message('error', this.$t('已激活的终端ID不能修改终端状态，请重新选择！'));
          return;
        }
      }

      let dicObj = {
        1: this.$t('批量修改市场状态'),
        2: this.$t('批量修改终端状态'),
        3: this.$t('批量修改终端ID所属客户'),
        4: this.$t('批量修改终端关联策略'),
      };

      this.title = dicObj[type];
      sessionStorage.setItem('batchUpdateType', type);
      this.addTime = new Date();
      this.batchUpdateVisible = true;
    },
    // 查看
    details(row) {
      this.title = this.$t('详情');
      this.detailsObj = _.cloneDeep(row);
      this.showDetailTime = new Date();
      this.detailVisible = true;
    },
    remove() {
      let _self = this;
      let ids = [];

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选删除数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        ids.push(item.id);
      });

      this.$confirm(this.$t('删除所选中的终端用户信息，将会删除与之的关联关系，是否确认删除？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        // 删除字典
        this.$http
          .delete(`${api.terminal()}?id=[${ids}]`)
          .then((response) => {
            if (response.data.returnCode == 0) {
              _self.message('success', _self.$t('删除成功！'));
              _self.getList();
            } else {
              _self.message('error', response.data.errorMessage);
            }
          })
          .catch((error) => {
            _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          });
      }).catch(() => {});
    },
    synchro() {
      let _self = this;
      let params = {
        type: "1",
        typeId: []
      };

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选需要同步的数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        params.typeId.push(item.id);
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
    // 导出终端信息
    exportExcel() {
      this.title = this.$t('导出终端信息');
      this.addTime = new Date();
      this.exportExcelVisible = true;
    },
    link(row) {
      this.title = _.get(row, 'sn');
      this.linkTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.linkVisible = true;
    },
    reset() {
      this.params = {
        sn: "", // 终端ID
        macAddr: "", // MAC
        type: "", // 类型
        status: "", // 终端状态
        useStatus: "", // 市场状态
        customer: "", // 所属客户
        whtieSealArea: "", // 白名单销售区域
        blackSealArea: "", // 黑名单销售区域
        tmodel: "", // 机型
        beginActiveTime: "",
        endActiveTime: "",
        relateType: '1',
        pageNum: 1,
        pageSize: 10
      };
      this.time = [];

      this.search();
    },
    search() {
      let _self = this;

      if (this.time && this.time.length > 0 && this.time[0]) {
        this.params["beginActiveTime"] = _self.moment(_.get(_self, 'time[0]')).utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["endActiveTime"] = _self.moment(_.get(_self, 'time[1]')).utc().format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.params["beginActiveTime"] = "";
        this.params["endActiveTime"] = "";
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
        .get(api.terminal(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.terminalInfoList, (item) => {
              let offSet = _self.moment().utcOffset(); // 时差
              let formatArrProperty = ["activeTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });

            _self.list = response.data.terminalInfoList;
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
    showCustomer() {
      this.customerTitle = this.$t('客户信息');
      this.customerTime = new Date();
      this.customerVisible = true;
    },
    setCustomer() {
      this.updateSnTime = new Date();
      this.customerVisible = false;
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
    filterTerminalStatusOptions(status) {
      let label = '';
      _.forEach(that.terminalStatusOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    },
    filterTmodelOptions(status) {
      let label = '';
      _.forEach(that.tmodelOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    },
  },
  components: {
    Add,
    ShowDetail,
    ExportExcel,
    LinkDialog,
    BatchAddAccount,
    BatchUpdate,
    Customer
  }
};
