import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj", "appIds", "appCodeOptions"],
  data() {
    return {
      ruleForm: {},
      params: {
        inviteeAccountType: "", // 账号类型
        appId: "", // 邀请码兑换入口
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      loading: false,
      oneClick: false,
      list: [],
      invideCodePrizeObj: {},
      type: sessionStorage.getItem('type'),
      TerTypeList: [{
          label: this.$t('自有终端'),
          value: "1"
        }, {
          label: this.$t('三方终端'),
          value: "2"
        },
        {
          label: this.$t('手机移动端'),
          value: "3"
        }
      ],
      accountOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('TV'),
          value: "1"
        },
        {
          label: this.$t('手机'),
          value: "2"
        }
      ]
    };
  },
  mounted: function () {
    this._ready();
  },
  watch: {
    "showDetailTime": "_ready"
  },
  methods: {
    _ready() {
      this.type = sessionStorage.getItem('type');
      this.ruleForm = this.detailsObj;
      this.ruleForm.appCodeName = this.commonFilter(this.ruleForm.appCode, this.appCodeOptions);
      this.ruleForm.accountTypeName = this.commonFilter(this.ruleForm.accountType, this.accountOptions);
      this.search();
    },
    reset() {
      this.params = {
        inviteeAccountType: "", // 账号类型
        appId: "", // 邀请码兑换入口
        pageNum: 1,
        pageSize: 10
      };
      this.search();
    },
    search() {
      let _self = this;
      this.params.userId = this.ruleForm.userId;
      this.list = [];
      if (this.type == 1) {
        _self.searchData = _.cloneDeep(this.params);
        _.forEach(_self.searchData, (value, key) => {
          _self.searchData[key] = _self.Trim(value);
          if (!_self.searchData[key]) {
            delete _self.searchData[key];
          }
        });
        _self.getInviterInviteRecord();
      } else if (this.type == 2) {
        _self.getInviterRewardRecord();
      } else if (this.type == 3) {
        _self.getInviteeRewardRecord();
      }
    },
    getInviterInviteRecord() {
      let _self = this;
      _self.loading = true;
      _self.oneClick = true;

      _self.searchData['pageSize'] = _self.params['pageSize'];
      _self.searchData['pageNum'] = _self.params['pageNum'];

      //搜索部分
      this.$http
        .get(api.inviterInviteRecord(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(_.get(response.data.data, 'inviterRecordList'), (item) => {
              let offSet = _self.moment().utcOffset(); //时差

              let formatArrProperty = ["createTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = _.get(response.data.data, 'inviterRecordList');
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
    getInviterRewardRecord() {
      let _self = this;
      _self.loading = true;
      _self.oneClick = true;

      let params = {
        userId: _self.params.userId,
        pageSize: _self.params['pageSize'],
        pageNum: _self.params['pageSize'],
      }

      //搜索部分
      this.$http
        .get(api.inviterRewardRecord(), {
          params
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(_.get(response.data.data, 'inviterRewardList'), (item) => {
              let offSet = _self.moment().utcOffset(); //时差

              let formatArrProperty = ["createTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = _.get(response.data.data, 'inviterRewardList');
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
    getInviteeRewardRecord() {
      let _self = this;

      let params = {
        userId: _self.params.userId,
      };
      //搜索部分
      this.$http
        .get(api.inviteeRewardRecord(), {
          params
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            if (response.data.data.createTime) {
              let offSet = _self.moment().utcOffset(); //时差
              response.data.data.createTime = _self.moment(response.data.data.createTime).add(offSet, 'm').format('YYYY-MM-DD HH:mm:ss');
            }
            _self.invideCodePrizeObj = response.data.data;
            _self.invideCodePrizeObj.checkAddress = "";

            if (_.get(response.data.data, 'country') && _.get(response.data.data, 'city')) {
              _self.invideCodePrizeObj.checkAddress = _.get(response.data.data, 'country') + ',' + _.get(response.data.data, 'city');
            }
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
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.params.pageNum = 1;
      this.search();
    },
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.search();
    },
    commonFilter(value, options) {
      let label = '';
      _.forEach(options, (item) => {
        if (item.value == value) {
          label = item.label;
        }
      });
      return label;
    }
  }
}
