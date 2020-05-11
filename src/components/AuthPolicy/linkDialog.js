import api from "../../api/api";

'use strict';
let that;
export default {
  props: ["detailsObj", "power", "linkTime"],
  data() {
    return {
      activeName: 'nLinkAuthPolicy',
      nLinkAuthPolicy: {
        list: [],
        selectedData: [],
        params: {
          macAddr: '',
          sn: '',
          status: '1',
          relateType: 5,
          typeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      yLinkAuthPolicy: {
        list: [],
        selectedData: [],
        params: {
          macAddr: '',
          sn: '',
          status: '',
          relateType: 4,
          typeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      yLinkProduct: {
        list: [],
        selectedData: [],
        params: {
          productName: '',
          productCode: '',
          status: '',
          chargeType: 2,
          relateType: 4,
          typeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      nLinkProduct: {
        list: [],
        selectedData: [],
        params: {
          productName: '',
          productCode: '',
          status: '',
          chargeType: 2,
          relateType: 5,
          typeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      dialogTableVisible: false,
      statusOptions: [{
          label: this.$t('启用'),
          value: "1"
        },
        {
          label: this.$t('禁用'),
          value: "0"
        }
      ],
      terminalStatus: [{
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
      chargeTypeOptions: [{
          label: this.$t('免费'),
          value: "1"
        }, {
          label: this.$t('包时段'),
          value: "2"
        },
        {
          label: this.$t('单片按次'),
          value: "3"
        },
        {
          label: this.$t('整包按次'),
          value: "4"
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
      oneClick: false,
      loading: false
    };
  },
  beforeCreate: function () {
    that = this;
  },
  mounted: function () {
    this.resetActiveName();
  },
  watch: {
    "linkTime": "resetActiveName"
  },
  methods: {
    handleSizeChange(val) {
      this[this.activeName].params.pageSize = val;
      this[this.activeName].params.pageNum = 1;
      this.getList(this[this.activeName].params);
    },
    handleCurrentChange(val) {
      this[this.activeName].params.pageNum = val;
      this.getList(this[this.activeName].params);
    },
    //多选
    handleSelectionChange(val) {
      this[this.activeName].selectedData = val;
    },
    handleClick(tab, event) { //点击区分区域
      this.activeName = tab.name;
      this.reset_search();
    },
    resetActiveName() {
      this.activeName = 'nLinkAuthPolicy';
      this.reset_search();
    },
    reset_search() {
      let _self = this;
      let type = this.activeName;
      let exceptAttr = ["macAddr", "sn", "status"];

      if (this.activeName == 'yLinkProduct' || this.activeName == 'nLinkProduct') {
        exceptAttr = ["productName", "productCode", "status"];
      }

      for (let key in _self[type].params) {
        if (exceptAttr.indexOf(key) > -1) {
          _self[type].params[key] = '';
        }
      }

      if (this.activeName == 'nLinkAuthPolicy') {
        _self[type].params['status'] = '1';
      }

      this[type].params.typeId = this.detailsObj['id'];
      this[type].params.pageNum = 1;
      this[type].params.pageSize = 10;
      this[type].selectedData = [];
      this.getList(this[type].params);
    },
    getList(params) {
      let _self = this;
      _self.loading = true;
      _self.oneClick = true;

      let searchData = _.cloneDeep(params);

      _.forEach(searchData, (value, key) => {
        searchData[key] = _self.Trim(value);
        if (!searchData[key]) {
          delete searchData[key];
        }
      });

      searchData['pageSize'] = params['pageSize'];
      searchData['pageNum'] = params['pageNum'];

      if (this.activeName == 'yLinkProduct' || this.activeName == 'nLinkProduct') {
        //搜索部分
        this.$http
          .get(api.product(), {
            params: searchData
          })
          .then((response) => {
            _self.loading = false;
            _self.oneClick = false;
            if (response.data.returnCode == 0) {
              _.forEach(response.data.data, function (item) {
                item.authDay = item.authDay ? item.authDay : 0;
              });
              _self[_self.activeName].list = response.data.data;
            } else {
              _self.message('error', response.data.errorMessage);
            }
          })
          .catch((error) => {
            _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            _self.loading = false;
            _self.oneClick = false;
          });
      } else {
        //搜索部分
        this.$http
          .get(api.terminal(), {
            params: searchData
          })
          .then((response) => {
            _self.loading = false;
            _self.oneClick = false;
            if (response.data.returnCode == 0) {
              _self[_self.activeName].list = response.data.terminalInfoList;
            } else {
              _self.message('error', response.data.errorMessage);
            }
          })
          .catch((error) => {
            _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            _self.loading = false;
            _self.oneClick = false;
          });
      }


    },
    // 0：取消关联，1：关联
    ref(type) {
      let _self = this;

      if (this[this.activeName].selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选数据！'));
        return;
      }

      let params = {
        authPolicyId: [this.detailsObj['id']]
      }

      if (this.activeName == 'yLinkProduct' || this.activeName == 'nLinkProduct') { // 关联/取消关联产品
        params.productList = [];
        _.forEach(this[this.activeName].selectedData, (item) => {
          params.productList.push({
            productId: item.id,
            authDay: item.authDay
          });
        });

        if (type === 0) {
          params.authPolicyId = JSON.stringify(params.authPolicyId);
          params.productId = _.chain(params.productList)
            .map(item => item.productId)
            .value();

          delete params.productList;
          params.productId = JSON.stringify(params.productId);

          this.$http.delete(api.authPolicyRefProduct(), {
              params
            })
            .then(function (response) {
              if (response.data.returnCode == '0') {
                _self.message('success', _self.$t('取消关联成功！'));
                _self.getList(_self[_self.activeName].params);
              } else {
                _self.message('error', response.data.errorMessage);
              }
            })
            .catch(function (error) {
              _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            });
        } else {
          this.$http.post(api.authPolicyRefProduct(), params)
            .then(function (response) {
              if (response.data.returnCode == '0') {
                _self.message('success', _self.$t('关联成功！'));
                _self.getList(_self[_self.activeName].params);
              } else {
                _self.message('error', response.data.errorMessage);
              }
            })
            .catch(function (error) {
              _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            });
        }
      } else { // 关联/取消关联授权策略
        params.terminalId = _.chain(this[this.activeName].selectedData)
          .map(item => item.id)
          .value();

        if (type === 0) {
          params.terminalId = JSON.stringify(params.terminalId);
          params.authPolicyId = JSON.stringify(params.authPolicyId);

          this.$http.delete(api.authPolicyRefTerminal(), {
              params
            })
            .then(function (response) {
              if (response.data.returnCode == '0') {
                _self.message('success', _self.$t('取消关联成功！'));
                _self.getList(_self[_self.activeName].params);
              } else {
                _self.message('error', response.data.errorMessage);
              }
            })
            .catch(function (error) {
              _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            });
        } else {
          params.addType = '1';
          this.$http.post(api.authPolicyRefTerminal(), params)
            .then(function (response) {
              if (response.data.returnCode == '0') {
                _self.message('success', _self.$t('关联成功！'));
                _self.getList(_self[_self.activeName].params);
              } else {
                _self.message('error', response.data.errorMessage);
              }
            })
            .catch(function (error) {
              _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            });
        }
      }

    },

    // 同步
    synchro() {
      let _self = this;

      let params = {
        id: this.detailsObj['id'],
        type: "7",
        typeId: []
      };

      if (this[this.activeName].selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选需要同步的数据！'));
        return;
      }

      _.forEach(this[this.activeName].selectedData, (item) => {
        params.typeId.push(item.id);
      });

      this.$http
        .post(api.noticeSyncMetadata(), params)
        .then((response) => {
          if (response.data.returnCode == 0) {
            _self.message('success', _self.$t('同步成功！'));
            _self.getList(_self[_self.activeName].params);
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    }
  },
  filters: {
    filterChargeTypeOptions(status) {
      let label = '';
      _.forEach(that.chargeTypeOptions, (item) => {
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
    },
    filterTerminalStatusptions(status) {
      let label = '';
      _.forEach(that.terminalStatus, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    },
  }
}
