import api from "../../api/api";
import ShowDetail from "./ShowDetail.vue";
import BatchUpdate from "./BatchUpdate.vue";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        userId: "", // 默认账号
        appCode: "", // 所属用户体系
        inviteCode: "", // 邀请码
        inviteCodeStatus: "", // 邀请码状态
        invitedStatus: "", // 是否已使用过邀请码
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      detailVisible: false,
      addTime: '',
      title: '',
      list: [],
      appCodeOptions: [],
      accountOptions: [{
          label: this.$t('TV'),
          value: "1"
        },
        {
          label: this.$t('手机'),
          value: "2"
        }
      ],
      inviteCodeStatusOptions: [{
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
      invitedStatusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('否'),
          value: "0"
        },
        {
          label: this.$t('是'),
          value: "1"
        }
      ],
      selectedData: [],
      title: '', // 弹框标题
      showDetailTime: '',
      appIds: [], // 邀请码兑换入口
      detailsObj: null, // 添加/修改对象
      power: {
        "boss_getInviteCode": false,
        "boss_batchUpdateInviteCode": false,
        "boss_syncInviteCode": false,
        "boss_inviteCode_inviterInviteRecord": false, // 邀请记录
        "boss_inviteCode_inviterRewardRecord": false, // 邀请奖励
        "boss_inviteCode_inviteeRewardRecord": false, // 被邀请奖励
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

    this.getDictionaryList();
  },
  methods: {
    // 获取字典
    getDictionaryList() {
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
              return (item.dictType).replace(/\s+/g, "") == '16';
            });

            _.forEach(arr, item => {
              _self.appCodeOptions.push({
                label: item.dictValue,
                value: item.dictName
              });
            });

            // 邀请码兑换入口(字段的 ‘应用名称’ 类型)
            let arr2 = _.filter(response.data.dictInfoList, function (item) {
              return (item.dictType).replace(/\s+/g, "") == '18';
            });

            _.forEach(arr2, item => {
              _self.appIds.push({
                label: item.dictValue,
                value: item.dictName
              });
            })
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
    // 批量修改
    batchUpdate(row) {
      this.title = this.$t('批量修改邀请码状态');
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    // 同步
    synchro() {
      let _self = this;
      let params = {
        userIdList: []
      };

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选需要同步的数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        params.userIdList.push(item.userId);
      });

      this.$http
        .post(api.syncInviteCodeStatus(), params)
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
    details(row, type) {
      if (type == 1) {
        this.title = this.$t('邀请记录');
      } else if (type == 2) {
        this.title = this.$t('邀请奖励记录');
      } else if (type == 3) {
        this.title = this.$t('被邀请奖励');
      }
      sessionStorage.setItem('type', type);
      this.detailsObj = _.cloneDeep(row);
      this.showDetailTime = new Date();
      this.detailVisible = true;
    },
    reset() {
      this.params = {
        userId: "", // 默认账号
        appCode: "", // 所属用户体系
        inviteCode: "", // 邀请码
        inviteCodeStatus: "", // 邀请码状态
        invitedStatus: "", // 是否已使用过邀请码
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
    commonFilter(value, options) {
      let label = '';
      _.forEach(options, (item) => {
        if (item.value == value) {
          label = item.label;
        }
      });
      return label;
    },
    getList() {
      let _self = this;
      _self.loading = true;
      _self.oneClick = true;

      _self.searchData['pageSize'] = _self.params['pageSize'];
      _self.searchData['pageNum'] = _self.params['pageNum'];

      //搜索部分
      this.$http
        .get(api.inviteCode(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.list = _.get(response.data.data, 'inviteCodeList');
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
  },
  filters: {
    filterAppCodeOptions(appCode) {
      let label = '';
      _.forEach(that.appCodeOptions, (item) => {
        if (item.value == appCode) {
          label = item.label;
        }
      });
      return label;
    }
  },
  components: {
    BatchUpdate,
    ShowDetail
  }
};
