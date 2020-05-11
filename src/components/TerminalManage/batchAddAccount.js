import api from "../../api/api";

'use strict';
let that;
export default {
  props: ["addTime", "updateCustomerTime", "cities", "terminalStatusOptions", "accountSystemOptions"],
  data() {
    return {
      batchAddRuleForm: {
        appCode: '',
        registerTerminalType: '',
        accountType: '',
        accountCount: 0,
        customer: '',
        crossAllow: '1',
        useStatus: '1',
        status: '1',
        whiteSealEffTime: '',
        whiteSealFailTime: '',
        blackSealEffTime: '',
        blackSealFailTime: '',
        remark: ''
      },
      useStatusOptions: [{
          label: this.$t('禁用'),
          value: "2"
        },
        {
          label: this.$t('启用'),
          value: "1"
        }
      ],
      registerTerminalTypeOptions: [{
        label: this.$t('三方终端'),
        value: "2"
      }, {
        label: this.$t('手机移动端'),
        value: "3"
      }],
      accountTypeOptions: [{
        label: this.$t('TV'),
        value: "1"
      }, {
        label: this.$t('手机'),
        value: "2"
      }],
      tmlcrossAllowList: [{
        label: this.$t('允许'),
        value: "1"
      }, {
        label: this.$t('不允许'),
        value: "0"
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
      city: [],
      all: false,
      oneClick: false,
      loading: false,
      authPolicyList: [],
      selectedData: [],
      rules: {
        appCode: [{
          required: true,
          message: this.$t('请选择所属用户体系'),
          trigger: 'blur'
        }],
        registerTerminalType: [{
          required: true,
          message: this.$t('请选择注册终端类型'),
          trigger: 'blur'
        }],
        accountType: [{
          required: true,
          message: this.$t('请选择账号类型'),
          trigger: 'blur'
        }],
        accountCount: [{
          type: 'number',
          required: true,
          message: this.$t('请输入账号数量'),
          trigger: 'blur'
        }],
        customer: [{
          required: true,
          message: this.$t('请选择所属客户'),
          trigger: 'blur'
        }],
        crossAllow: [{
          required: true,
          message: this.$t('请选择跨区域'),
          trigger: 'blur'
        }],
        useStatus: [{
          required: true,
          message: this.$t('请选择市场状态'),
          trigger: 'blur'
        }]
      }
    };
  },
  beforeCreate: function () {
    that = this;
  },
  mounted: function () {
    this._ready();
  },
  watch: {
    "addTime": "_ready",
    "updateCustomerTime": "updateCustomer",
    city(val, oldval) {
      //如果新的选择里有勾选了选择所有, 则勾选整个选项
      if (val.indexOf('all') != -1 && oldval.indexOf('all') == -1 && val.length != this.cities.length) {
        this.city = [];
        _.forEach(this.cities, item => {
          this.city.push(item.value);
        });
        this.all = true;
      }
      //如果操作前有勾选了多项且当前也选中了取消所有且勾选数量大于等于1则取消勾选所有
      else if (val.indexOf('cancleAll') != -1 && oldval.indexOf('cancleAll') == -1 & oldval.length >= 1) {
        this.all = false;
        this.city = [];
      }
    }
  },
  methods: {
    crossAllowChange(crossAllow) {
      this.city = [];
      this.all = false;
      let arr = [];

      if (crossAllow == '1') {
        arr = ["whiteSealEffTime", "whiteSealFailTime"];
      } else {
        arr = ["blackSealEffTime", "blackSealFailTime"];
      }

      _.forEach(arr, (key) => {
        this.batchAddRuleForm[key] = "";
      });
    },
    //多选
    handleSelectionChange(val) {
      this.selectedData = val;
    },
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
      this.city = [];
      this.all = false;
    },
    updateCustomer() {
      let selectCustomerObj = sessionStorage.getItem('selectCustomerObj') ? JSON.parse(sessionStorage.getItem('selectCustomerObj')) : {};
      this.batchAddRuleForm.customer = _.get(selectCustomerObj, 'operatorName');
      this.$refs['batchAddRuleForm'].validateField('customer');

      this.getAuthPolicyList(this.batchAddRuleForm.customer);
    },
    _ready() {
      this.resetForm('batchAddRuleForm');
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll(".batch-add-account button.el-dialog__headerbtn")[0].click();
    },
    showCustomerInfo(e) {
      e.target.blur();
      sessionStorage.setItem('selectCustomer', this.batchAddRuleForm.customer);
      this.$emit('showCustomer', new Date());
    },
    getAuthPolicyList(customer) {
      let _self = this;

      let params = {
        relateType: 1,
        pageNum: 1,
        pageSize: 100,
        customer: customer
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
    submit() {
      let _self = this;
      let data = _.cloneDeep(_self.batchAddRuleForm);

      _.forEach(data, (value, key) => {
        data[key] = _self.Trim(value);
        if (!data[key]) {
          delete data[key];
        }
      });

      if (data.crossAllow == '1') { // 允许，则黑名单显示
        if (data.blackSealEffTime && data.blackSealFailTime) {
          let startSeconds = new Date(data.blackSealEffTime).getTime();
          let endSeconds = new Date(data.blackSealFailTime).getTime();
          let diffDay = _self.moment(startSeconds).diff(_self.moment(endSeconds), 'days');

          if (diffDay > 0) {
            _self.message('error', _self.$t('生效日期不能大于或等于失效日期！'));
            return;
          }

          data.blackSealEffTime = _self.moment(data.blackSealEffTime).format('YYYY-MM-DD');
          data.blackSealFailTime = _self.moment(data.blackSealFailTime).format('YYYY-MM-DD');
        }

        delete data.whiteSealEffTime;
        delete data.whiteSealFailTime;

        if (_self.city.length > 0) {
          data.blackSealArea = _self.city.join(",");
        }

      } else { // 不允许，则白名单显示
        if (data.whiteSealEffTime && data.whiteSealFailTime) {
          let startSeconds = new Date(data.whiteSealEffTime).getTime();
          let endSeconds = new Date(data.whiteSealFailTime).getTime();
          let diffDay = _self.moment(startSeconds).diff(_self.moment(endSeconds), 'days');

          if (diffDay > 0) {
            _self.message('error', _self.$t('生效日期不能大于或等于失效日期！'));
            return;
          }
          data.whiteSealEffTime = _self.moment(data.whiteSealEffTime).format('YYYY-MM-DD');
          data.whiteSealFailTime = _self.moment(data.whiteSealFailTime).format('YYYY-MM-DD');
        }

        delete data.blackSealEffTime;
        delete data.blackSealFailTime;

        if (_self.city.length > 0) {
          data.whiteSealArea = _self.city.join(",");
        }
      }

      if (this.selectedData.length > 0) {
        data.authPolicyIdArr = [];
        _.forEach(this.selectedData, item => {
          data.authPolicyIdArr.push(item.id);
        });
      }

      data.accountCount = Number(data.accountCount);
      this.oneClick = true;

      this.$http.post(api.accountBatchAdd(), data)
        .then(function (response) {
          _self.oneClick = false;
          if (response.data.returnCode == '0') {
            _self.message('success', _self.$t('操作成功！可在异步任务处查看进度！'));
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
