import api from "../../api/api";
import LinkDialog from "./LinkDialog.vue";
import Add from "./Add.vue";
import ShowDetail from "./ShowDetail.vue";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        name: "", // 策略名称
        status: "", // 状态
        relateType: '1',
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      operatorType: sessionStorage.getItem('operatorType') ? sessionStorage.getItem('operatorType') : '',
      customerList: [],
      linkVisible: false,
      addTime: '',
      showDetailTime: '',
      detailVisible: false,
      title: '',
      list: [],
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
      chargeUnitOptions: [{
          label: this.$t('月'),
          value: "1"
        }, {
          label: this.$t('天'),
          value: "2"
        },
        {
          label: this.$t('时'),
          value: "3"
        }
      ],
      selectedData: [],
      title: '', // 弹框标题
      linkTime: '',
      detailsObj: null, // 添加/修改对象
      power: {
        "boss_check_authpolicy": false,
        "boss_create_authpolicy": false,
        "boss_update_authpolicy": false,
        "boss_delete_authpolicy": false,
        "boss_synchro_authpolicy": false,
        "boss_import_authpolicy": false,
        "boss_authpolicy_relate_terminal": false,
        "boss_authpolicy_unrelate_terminal": false,
        "boss_authpolicy_relate_product": false,
        "boss_authpolicy_unrelate_product": false
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

    this.getCustomerList();
  },
  methods: {
    getCustomerList() {
      let _self = this;

      let params = {
        operatorType: 3, //只要求客户类型的。
        page: 1,
        results_per_page: 1000,
        operatorName: ""
      };

      //搜索部分
      this.$http
        .get(api.operator(), {
          params
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            _self.customerList = response.data.objects;
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
        this.title = this.$t('新增授权策略');
      } else {
        this.title = this.$t('修改授权策略');
      }
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    // 查看
    batchLink(row) {
      this.title = this.$t('不连续批量关联');
      this.detailsObj = _.cloneDeep(row);
      this.showDetailTime = new Date();
      this.detailVisible = true;
    },
    closeDetail() {
      this.detailVisible = false;
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

      this.$confirm(this.$t('删除所选中的策略信息，将会删除与之的关联关系，是否确认删除？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        // 删除字典
        this.$http
          .delete(`${api.authPolicy()}?id=[${ids}]`)
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
        type: "5",
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
    reset() {
      this.params = {
        packageName: "", // 套餐名称
        packageCode: "", // 套餐编码
        status: "", // 状态
        relateType: '1',
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
        .get(api.authPolicy(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.list = response.data.authPolicyInfoList;
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
    link(row) {
      this.title = _.get(row, 'packageName');
      this.linkTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.linkVisible = true;
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
    filterChargeUnitOptions(status) {
      let label = '';
      _.forEach(that.chargeUnitOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    }
  },
  components: {
    Add,
    LinkDialog,
    ShowDetail
  }
};
