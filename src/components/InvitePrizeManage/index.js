import api from "../../api/api";
import LinkDialog from "./LinkDialog.vue";
import Add from "./Add.vue";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        name: "", // 奖励规则名称
        releaseStatus: "", // 发布状态
        appId: "", // 应用名称
        inviteeAccountType: "", // 受邀人账号类型
        inviterAccountType: "", // 邀请人账号类型
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      linkVisible: false,
      addTime: '',
      title: '',
      list: [],
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
      ],
      appIdOptions: [],
      selectedData: [],
      title: '', // 弹框标题
      linkTime: '',
      detailsObj: null, // 添加/修改对象
      power: {
        "boss_getProduct": false,
        "boss_unLinkProduct": false,
        "boss_linkProduct": false,
        "boss_unLinkCoupon": false,
        "boss_linkCoupon": false,
        "boss_releaseInviteRules": false,
        "boss_noticeSyncMetadata": false,
        "boss_deleteInviteRules": false,
        "boss_addInviteRules": false,
        "boss_getInviteRules": false,
        "boss_updateInviteRules": false
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

    this.getPortalCodeList();
  },
  methods: {
    // 获取应用名称列表
    getPortalCodeList() {
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
              return (item.dictType).replace(/\s+/g, "") == '18';
            });

            _.forEach(arr, item => {
              _self.appIdOptions.push({
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
        this.title = this.$t('新增奖励规则');
      } else {
        this.title = this.$t('修改奖励规则');
      }
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    remove() {
      let _self = this;
      let ids = [];
      let names = [];

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选删除数据！'));
        return;
      }

      let toDeleteIds = []
      _.forEach(_self.selectedData, (item) => {
        if (item.releaseStatus != 2) {
          toDeleteIds.push(item);
        }
      });

      if (toDeleteIds.length === 0) {
        _self.message('error', _self.$t('没有可删除的奖励规则，请勾选未发布的奖励规则再执行删除操作'));
        return;
      }

      _.forEach(toDeleteIds, (item) => {
        ids.push(item.id);
        names.push(item.name);
      });

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t('提示'),
        message: h('p', null, [
          h('span', null, `${this.$t('请确认是否删除以下奖励规则？')}`),
          h('p', {
            style: 'color: teal; margin-top: 10px'
          }, `${names.join(', ')}`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .delete(`${api.inviteRules()}?inviteIdList=[${ids}]`)
          .then((response) => {
            if (response.data.returnCode == 0) {
              _self.message('success', _self.$t('删除成功！'));
              _self.search();
            } else {
              _self.message('error', response.data.errorMessage);
            }
          })
          .catch((error) => {
            _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          });
      }).catch(() => {});
    },
    release(releaseStatus) {
      let _self = this;
      let params = {
        releaseStatus: releaseStatus,
        inviteIdList: []
      };

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选需要发布或取消发布的数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        params.inviteIdList.push(item.id);
      });

      this.$http
        .post(api.inviteRulesRelease(), params)
        .then((response) => {
          if (response.data.returnCode == 0) {
            _self.message('success', _self.$t('操作成功！'));
            _self.search();
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
    synchro() {
      let _self = this;
      let params = {
        type: "9",
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
        name: "", // 奖励规则名称
        releaseStatus: "", // 发布状态
        appId: "", // 应用名称
        inviteeAccountType: "", // 受邀人账号类型
        inviterAccountType: "", // 邀请人账号类型
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
        .get(api.inviteRules(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.list = _.get(response.data.data, 'inviteRulesList');
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
    link(row, clickType) {
      sessionStorage.setItem("clickType", clickType);
      this.title = _.get(row, 'name');
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
    filterAppIdOptions(releaseStatus) {
      let label = '';
      _.forEach(that.appIdOptions, (item) => {
        if (item.value == releaseStatus) {
          label = item.label;
        }
      });
      return label;
    },
    filterAccountOptions(releaseStatus) {
      let label = '';
      _.forEach(that.accountOptions, (item) => {
        if (item.value == releaseStatus) {
          label = item.label;
        }
      });
      return label;
    }
  },
  components: {
    Add,
    LinkDialog
  }
};
