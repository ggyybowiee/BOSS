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
          name: '',
          status: '',
          relateType: 7,
          typeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      yLinkAuthPolicy: {
        list: [],
        selectedData: [],
        params: {
          name: '',
          status: '',
          relateType: 6,
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
          relateType: 2,
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
          relateType: 3,
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
      let exceptAttr = ["name", "status"];

      if (this.activeName == 'yLinkProduct' || this.activeName == 'nLinkProduct') {
        exceptAttr = ["productName", "productCode", "status"];
      }

      for (let key in _self[type].params) {
        if (exceptAttr.indexOf(key) > -1) {
          _self[type].params[key] = '';
        }
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
          .get(api.authPolicy(), {
            params: searchData
          })
          .then((response) => {
            _self.loading = false;
            _self.oneClick = false;
            if (response.data.returnCode == 0) {
              _self[_self.activeName].list = response.data.authPolicyInfoList;
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
        packageId: [this.detailsObj['id']]
      }

      if (this.activeName == 'yLinkProduct' || this.activeName == 'nLinkProduct') { // 关联/取消关联产品
        params.productId = [];
        _.forEach(this[this.activeName].selectedData, (item) => {
          params.productId.push(item.id);
        });

        if (type === 0) {
          params.packageId = JSON.stringify(params.packageId);
          params.productId = JSON.stringify(params.productId);

          this.$http.delete(api.packageRefProduct(), {
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
          this.$http.post(api.packageRefProduct(), params)
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
        params.authPolicyId = [];
        _.forEach(this[this.activeName].selectedData, (item) => {
          params.authPolicyId.push(item.id);
        });
        if (type === 0) {
          params.packageId = JSON.stringify(params.packageId);
          params.authPolicyId = JSON.stringify(params.authPolicyId);

          this.$http.delete(api.authPolicyRefPackage(), {
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
          this.$http.post(api.authPolicyRefPackage(), params)
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
  },
  filters: {
    filterChargeUnitOptions(status) {
      let label = '';
      _.forEach(that.chargeUnitOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    },
  }
}
