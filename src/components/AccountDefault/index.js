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
        status: "", // 状态
        appCode: "", // 所属用户体系
        sn: "", // 终端id
        type: "", // 终端类型
        hasPay: "", // 付费状态
        customer: "", // 所属客户
        passwordStatus: "", // 密码状态
        bindMailStatus: "", // 邮箱绑定状态
        bindMobileStatus: "", // 手机绑定状态
        email: "", // 电子邮箱
        mobile: "", // 手机
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
      typeOptions: [{
        label: this.$t('全部'),
        value: ""
      }, {
        label: this.$t('自有终端'),
        value: "1"
      }, {
        label: this.$t('三方终端'),
        value: "2"
      }, {
        label: this.$t('手机移动端'),
        value: "3"
      }],
      hasPayOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('未付费'),
          value: "0"
        },
        {
          label: this.$t('已付费'),
          value: "1"
        }
      ],
      passwordStatusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('未设置'),
          value: "0"
        },
        {
          label: this.$t('已设置'),
          value: "1"
        }
      ],
      bindStatusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('未绑定'),
          value: "0"
        },
        {
          label: this.$t('已绑定'),
          value: "1"
        }
      ],
      selectedData: [],
      title: '', // 弹框标题
      showDetailTime: '',
      appIds: [], // 邀请码兑换入口
      detailsObj: null, // 添加/修改对象
      power: {
        "boss_check_account": false,
        "boss_update_account": false,
        "boss_sync_account": false,
        "boss_checkAuthInfo_account": false
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

            // 邀请码兑换入口

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
      this.title = this.$t('批量修改状态');
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    // 同步
    synchro() {
      let _self = this;
      let params = {
        type: "2",
        typeId: []
      };

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选需要同步的数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        params.typeId.push(item.userCode);
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
    details(row, type) {
      if (type == 1) {
        this.title = this.$t('查看账号权益');
      } else if (type == 2) {
        this.title = this.$t('详情');
      }
      sessionStorage.setItem('type', type);
      this.detailsObj = _.cloneDeep(row);
      this.showDetailTime = new Date();
      this.detailVisible = true;
    },
    // 重置密码
    resetPwd(row) {
      let _self = this;
      let data = {
        accounts: row.userId + '',
        password: this.$md5('88888888cloudstream')
      }
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t('提示'),
        message: h('p', null, [
          h('span', null, `${this.$t('请确认是否重置密码？')}`),
          h('br', null, null),
          h('span', {
            style: 'display: inline-block; margin-top: 10px; font-weight: bold'
          }, `${_self.$t("默认账号")}:`),
          h('span', {
            style: 'color: teal; font-weight: bold; margin-top: 10px; margin-left: 10px'
          }, `${row.userId}`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(api.defaultAccount(), data)
          .then(function (response) {
            if (response.data.returnCode == '0') {
              _self.message('success', `${_self.$t('亲，重置成功！默认账号：')}${row.userId}, ${_self.$t("密码：")}88888888`);
            } else {
              _self.message('error', response.data.errorMessage);
            }
          })
          .catch(function (error) {
            _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          });
      }).catch(() => {});

    },
    reset() {
      this.params = {
        userId: "", // 默认账号
        status: "", // 状态
        appCode: "", // 所属用户体系
        sn: "", // 终端id
        type: "", // 终端类型
        hasPay: "", // 付费状态
        customer: "", // 所属客户
        passwordStatus: "", // 密码状态
        bindMailStatus: "", // 邮箱绑定状态
        bindMobileStatus: "", // 手机绑定状态
        email: "", // 电子邮箱
        mobile: "", // 手机
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
        .get(api.defaultAccount(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.list = response.data.defaultAccountInfoList;
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
