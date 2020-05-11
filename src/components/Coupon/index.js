import api from "../../api/api";
import Add from "./Add.vue";
import ShowDetail from "./ShowDetail.vue";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        name: "",
        couponCode: "",
        couponType: '',
        status: '',
        appId: '',
        relateType: 1,
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      couponTypeOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('抵扣金额'),
          value: "1"
        },
        {
          label: this.$t('折扣'),
          value: "2"
        }
      ],
      appIdOptions: [],
      statusOptions: [{
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
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      showDetailTime: false,
      detailVisible: false,
      list: [],
      selectedData: [],
      title: '', // 弹框标题
      addTime: '', // 监听时间变化
      detailsObj: null, // 添加/修改字典对象
      power: {
        "boss_check_coupon": false,
        "boss_release_coupon": false,
        "boss_update_coupon": false,
        "boss_create_coupon": false,
        "boss_noticeSyncMetadata_coupon": false
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

    this.getCouponAppIdList();
  },
  methods: {
    // 获取appId列表
    getCouponAppIdList() {
      let _self = this;

      this.$http
        .get(api.getCouponAppIdList())
        .then((response) => {
          if (response.data.returnCode == 0) {
            _.forEach(response.data.data, item => {
              _self.appIdOptions.push({
                label: item.name,
                value: item.appId
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
    reset() {
      this.params = {
        name: "",
        couponCode: "",
        couponType: '',
        status: '',
        appId: '',
        relateType: 1,
        pageNum: 1,
        pageSize: 10
      };

      this.search();
    },
    // 查看
    details(row) {
      this.detailsObj = _.cloneDeep(row);
      this.showDetailTime = new Date();
      this.detailVisible = true;
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
        .get(api.couponRules(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(_.get(response.data.data, 'couponRulesList'), (item) => {
              let offSet = _self.moment().utcOffset(); //时差

              let formatArrProperty = ["createTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });

              if (item.effectTime) {
                item.effectTime = _self.moment(item.effectTime).add(offSet, 'm').format(
                  'YYYY-MM-DD');
              }

              if (item.invalidTime) {
                item.invalidTime = _self.moment(item.invalidTime).add(offSet, 'm').format(
                  'YYYY-MM-DD');
              }

            });
            _self.list = _.get(response.data.data, 'couponRulesList');
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
    addOrUpdate(row) {
      if (!row) {
        this.title = this.$t('新增优惠券策略');
      } else {
        this.title = this.$t('修改优惠券策略');
      }
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    synchro() {
      let _self = this;
      let params = {
        type: "10",
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
    release(type) { //1:发布，0：取消发布
      let _self = this;
      let params = {
        couponIdList: [],
        status: type
      }

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        params.couponIdList.push(item.id);
      });

      this.$http.put(api.couponRulesRelease(), params)
        .then(function (response) {
          if (response.data.returnCode == '0') {
            _self.message('success', _self.$t('操作成功！'));
            _self.search();
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch(function (error) {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
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
    filterAppIdOptions(appId) {
      let label = '';
      _.forEach(that.appIdOptions, (item) => {
        if (item.value == appId) {
          label = item.label;
        }
      });
      return label;
    },
  },
  components: {
    Add: Add,
    ShowDetail
  }
};
