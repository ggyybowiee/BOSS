import api from "../../api/api";

'use strict';
let that;
export default {
  props: ["detailsObj", "power", "linkTime"],
  data() {
    return {
      activeName: 'nCoupon',
      yLink: {
        list: [],
        selectedData: [],
        params: {
          productName: '',
          productCode: '',
          status: '',
          relateType: 7,
          chargeType: '2',
          typeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      nLink: {
        list: [],
        selectedData: [],
        params: {
          productName: '',
          productCode: '',
          status: '',
          chargeType: '2',
          relateType: 8,
          typeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      nCoupon: {
        list: [],
        selectedData: [],
        params: {
          name: '',
          couponCode: '',
          status: '',
          relateType: 3,
          typeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      yCoupon: {
        list: [],
        selectedData: [],
        params: {
          name: '',
          couponCode: '',
          status: '',
          relateType: 2,
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
      releaseStatusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('未发布'),
          value: "1"
        },
        {
          label: this.$t('已发布'),
          value: "2"
        },
        {
          label: this.$t('取消发布'),
          value: "3"
        }
      ],
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
      type: sessionStorage.getItem("clickType"),
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
      this.activeName = 'nCoupon';
      this.type = sessionStorage.getItem("clickType");
      this.reset_search();
    },
    reset_search() {
      let _self = this;
      let type = this.activeName;

      if (type === 'yLink' || type === 'nLink') {
        for (let key in _self[type].params) {
          if (["productName", "productCode", "status"].indexOf(key) > -1) {
            _self[type].params[key] = '';
          }
        }
      } else if (type === 'yCoupon' || type === 'nCoupon') {
        for (let key in _self[type].params) {
          if (["name", "couponCode", "status"].indexOf(key) > -1) {
            _self[type].params[key] = '';
          }
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

      if (this.type == 1) { // 邀请人
        let relateTypeDic = {
          'yLink': 7,
          'nLink': 8,
          'yCoupon': 2,
          'nCoupon': 3
        };

        searchData.relateType = relateTypeDic[this.activeName];
      } else if (this.type == 2) { //受邀人
        let relateTypeDic = {
          'yLink': 9,
          'nLink': 10,
          'yCoupon': 4,
          'nCoupon': 5
        };

        searchData.relateType = relateTypeDic[this.activeName];
      }

      if (this.activeName == 'yLink' || this.activeName == 'nLink') {
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
      } else if (this.activeName == 'yCoupon' || this.activeName == 'nCoupon') {
        //搜索部分
        this.$http
          .get(api.couponRules(), {
            params: searchData
          })
          .then((response) => {
            _self.loading = false;
            _self.oneClick = false;
            if (response.data.returnCode == 0) {
              _self[_self.activeName].list = _.get(response.data.data, 'couponRulesList');
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
        inviteId: this.detailsObj['id'],
        type: this.type,
        productObjList: []
      }

      _.forEach(this[this.activeName].selectedData, (item) => {
        params.productObjList.push({
          productId: item.id,
          authDay: item.authDay
        });
      });

      if (type === 0) {
        delete params.productObjList;
        params.productIdList = [];

        _.forEach(this[this.activeName].selectedData, (item) => {
          params.productIdList.push(item.id);
        });

        this.$http.delete(api.inviteRulesRefProduct(), {
            data: params
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
        this.$http.post(api.inviteRulesRefProduct(), params)
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
    },
    // 0：取消关联，1：关联
    refCoupon(type) {
      let _self = this;

      if (this[this.activeName].selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选数据！'));
        return;
      }

      let params = {
        inviteId: this.detailsObj['id'],
        type: this.type,
        couponIdList: []
      }

      _.forEach(this[this.activeName].selectedData, (item) => {
        params.couponIdList.push(item.id);
      });

      if (type === 0) {
        this.$http.delete(api.inviteRulesRefCoupon(), {
            data: params
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
        this.$http.post(api.inviteRulesRefCoupon(), params)
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
    },
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
  }
}
