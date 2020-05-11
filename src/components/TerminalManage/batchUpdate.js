import api from "../../api/api";

'use strict';
let that;
export default {
  props: ["addTime", "batchUpdateCustomerTime", "selectedData"],
  data() {
    return {
      batchUpdateRuleForm: {
        customer: '',
        useStatus: '1',
        status: '1',
        snStr: ''
      },
      oneClick: false,
      loading: false,
      useStatusOptions: [{
          "value": "2",
          "label": this.$t('禁用')
        },
        {
          "value": "1",
          "label": this.$t('启用')
        }
      ],
      terminalStatusOptions: [{
        label: this.$t('未激活'),
        value: "1"
      }, {
        label: this.$t('已激活'),
        value: "2",
        disabled: true
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
      batchUpdateType: 1,
      selectedAuthData: [],
      authPolicyList: [],
      rules: {
        useStatus: [{
          required: true,
          message: this.$t('请选择市场状态'),
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: this.$t('请选择终端状态'),
          trigger: 'blur'
        }],
        snStr: [{
          required: true,
          message: this.$t('请输入终端ID（多个用回车分隔）'),
          trigger: 'blur'
        }]
      }
    };
  },
  mounted: function () {
    this._ready();
  },
  beforeCreate: function () {
    that = this;
  },
  watch: {
    "addTime": "_ready",
    "batchUpdateCustomerTime": "updateCustomer",
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submit();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.batchUpdateRuleForm.customer = '';
      if (this.selectedData.length > 0) {
        let arr = [];
        _.forEach(this.selectedData, item => {
          arr.push(item.sn);
        });
        this.batchUpdateRuleForm.snStr = arr.join('\n');
      }
    },
    //多选
    handleSelectionChange(val) {
      this.selectedAuthData = val;
    },
    _ready() {
      this.resetForm('batchUpdateRuleForm');
      this.batchUpdateType = sessionStorage.getItem('batchUpdateType') ? sessionStorage.getItem('batchUpdateType') : 1;
      if (this.batchUpdateType == 4) {
        this.getAuthPolicyList();
      }
    },
    getAuthPolicyList() {
      let _self = this;

      let params = {
        relateType: 1,
        pageNum: 1,
        pageSize: 100
      };

      this.loading = true;

      //搜索部分
      this.$http
        .get(api.authPolicy(), {
          params
        })
        .then((response) => {
          this.loading = false;
          if (response.data.returnCode == 0) {
            _self.authPolicyList = response.data.authPolicyInfoList;
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          this.loading = false;
        });
    },
    updateCustomer() {
      let selectCustomerObj = sessionStorage.getItem('selectCustomerObj') ? JSON.parse(sessionStorage.getItem('selectCustomerObj')) : {};
      this.batchUpdateRuleForm.customer = _.get(selectCustomerObj, 'operatorName');
    },
    showCustomerInfo(e) {
      e.target.blur();
      sessionStorage.setItem('selectCustomer', this.batchUpdateRuleForm.customer);
      this.$emit('showCustomer', new Date());
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll(".batch-update button.el-dialog__headerbtn")[0].click();
    },
    submit() {
      let _self = this;
      let data = {};

      _.forEach(_self.batchUpdateRuleForm, (value, key) => {
        data[key] = _self.Trim(value);
      });

      this.$confirm(this.$t('请确认是否进行批量操作？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.oneClick = true;

        // 1，市场状态
        if (this.batchUpdateType == 1) {
          let params = {
            useStatus: data.useStatus,
            type: "3",
            snStr: data.snStr,
          };

          this.$http.post(api.terminalInfoStatus(), params)
            .then(function (response) {
              _self.oneClick = false;
              if (response.data.returnCode == '0') {
                _self.message('success', _self.$t('修改成功！'));
                _self.$emit('message', new Date());
                _self.cancel();
              } else {
                _self.message('error', response.data.errorMessage);
              }
            })
            .catch(function (error) {
              _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            });
        }

        // 2，终端状态
        if (this.batchUpdateType == 2) {
          let params = {
            status: data.status,
            type: "3",
            snStr: data.snStr,
          };
          this.$http.post(api.terminalInfoTerStatus(), params)
            .then(function (response) {
              _self.oneClick = false;
              if (response.data.returnCode == '0') {
                _self.message('success', _self.$t('修改成功！'));
                _self.$emit('message', new Date());
                _self.cancel();
              } else {
                _self.message('error', response.data.errorMessage);
              }
            })
            .catch(function (error) {
              _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            });
        }

        // 3，批量修改终端ID所属客户
        if (this.batchUpdateType == 3) {
          let params = {
            type: "3",
            snStr: data.snStr,
            customer: data.customer
          };

          this.$http.post(api.terminalCustomer(), params)
            .then(function (response) {
              _self.oneClick = false;
              if (response.data.returnCode == '0') {
                _self.message('success', _self.$t('修改成功！'));
                _self.$emit('message', new Date());
                sessionStorage.setItem('selectCustomerObj', '');
                _self.cancel();
              } else {
                _self.message('error', response.data.errorMessage);
              }
            })
            .catch(function (error) {
              _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            });
        }

        // 4，授权策略
        if (this.batchUpdateType == 4) {
          let params = {
            addType: "2",
            type: "1",
            snStr: data.snStr,
            authPolicyIdArr: []
          };

          if (this.selectedAuthData.length > 0) {
            _.forEach(this.selectedAuthData, item => {
              params.authPolicyIdArr.push(item.id);
            });
          }

          this.$http.post(api.terminalMultiRelPolicy(), params)
            .then(function (response) {
              _self.oneClick = false;
              if (response.data.returnCode == '0') {
                _self.message('success', _self.$t('修改成功！'));
                _self.$emit('message', new Date());
                _self.cancel();
              } else {
                _self.message('error', response.data.errorMessage);
              }
            })
            .catch(function (error) {
              _self.message('error', `${error.response.status}: ${error.response.statusText}`);
            });
        }


      }).catch(() => {});

    }
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
