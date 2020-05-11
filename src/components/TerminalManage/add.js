import api from "../../api/api";

'use strict';
let that;
export default {

  props: ["addTime", "detailsObj", "updateSnTime", "tmodelOptions", "cities"],
  data() {
    return {
      addRuleForm: {
        type: '1',
        tmodel: '',
        addType: '1',
        sn: '',
        macAddr: '',
        snStr: '',
        macAddrStr: '',
        snPrefix: '',
        macAddrPrefix: '',
        snSuffixStart: '',
        macAddrSuffixStart: '',
        snSuffixEnd: '',
        macAddrSuffixEnd: '',
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
      useStatusOptions: [{
          label: this.$t('禁用'),
          value: "2"
        },
        {
          label: this.$t('启用'),
          value: "1"
        }
      ],
      typeOptions: [{
        label: this.$t('终端自产'),
        value: "1"
      }, {
        label: this.$t('终端代产'),
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
        type: [{
          required: true,
          message: this.$t('请选择类型'),
          trigger: 'blur'
        }],
        tmodel: [{
          required: true,
          message: this.$t('请选择机型'),
          trigger: 'blur'
        }],
        sn: [{
          pattern: /^[a-zA-Z0-9]{2}\.[a-zA-Z0-9]{2}-\d{2}\.\d{2}-\d{8}$/,
          required: true,
          message: this.$t('请输入正确格式的终端ID'),
          trigger: 'blur,change'
        }],
        snStr: [{
          required: true,
          message: this.$t('请输入终端ID（多个用回车分隔）'),
          trigger: 'blur'
        }],
        snPrefix: [{
          pattern: /^[a-zA-Z0-9]{2}\.[a-zA-Z0-9]{2}-\d{2}\.\d{2}$/,
          required: true,
          message: this.$t('请输入正确格式的终端ID前缀'),
          trigger: 'blur,change'
        }],
        snSuffixStart: [{
          pattern: /^\d{8}$/,
          required: true,
          message: this.$t('请输入正确格式的终端ID后缀起始值'),
          trigger: 'blur,change'
        }],
        snSuffixEnd: [{
          pattern: /^\d{8}$/,
          required: true,
          message: this.$t('请输入正确格式的终端ID后缀结束值'),
          trigger: 'blur,change'
        }],
        macAddr: [{
          pattern: /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
          required: true,
          message: this.$t('请输入正确格式的MAC'),
          trigger: 'blur,change'
        }],
        macAddrStr: [{
          required: true,
          message: this.$t('请输入MAC（多个用回车分隔）'),
          trigger: 'blur'
        }],
        macAddrPrefix: [{
          pattern: /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
          required: true,
          message: this.$t('请输入正确格式的MAC前缀'),
          trigger: 'blur,change'
        }],
        macAddrSuffixStart: [{
          pattern: /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
          required: true,
          message: this.$t('请输入正确格式的MAC后缀起始值'),
          trigger: 'blur,change'
        }],
        macAddrSuffixEnd: [{
          pattern: /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
          required: true,
          message: this.$t('请输入正确格式的MAC后缀结束值'),
          trigger: 'blur,change'
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
    "updateSnTime": "updateCustomer",
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
    radioChange(addType) {
      let arr = [];
      if (addType == '1') {
        arr = ["snStr", "macAddrStr", "snPrefix", "macAddrPrefix", "snSuffixStart", "macAddrSuffixStart", "snSuffixEnd", "macAddrSuffixEnd"];
      } else if (addType == '3') {
        arr = ["sn", "macAddr", "snPrefix", "macAddrPrefix", "snSuffixStart", "macAddrSuffixStart", "snSuffixEnd", "macAddrSuffixEnd"];
      } else {
        arr = ["sn", "macAddr", "snStr", "macAddrStr"];
      }

      _.forEach(arr, (key) => {
        this.addRuleForm[key] = "";
      });
    },
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
        this.addRuleForm[key] = "";
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
      this.note = '';

      if (this.detailsObj) {
        _.forEach(this.addRuleForm, (value, key) => {
          this.addRuleForm[key] = this.detailsObj[key] ? this.detailsObj[key] : '';

          if ((key == 'blackSealEffTime' || key == 'blackSealFailTime' || key == 'whiteSealEffTime' || key == 'whiteSealFailTime') && !!this.detailsObj[key]) {
            this.addRuleForm[key] = new Date(this.detailsObj[key]);
          }
        });

        if (this.detailsObj.crossAllow == '1') { // 黑名单区域
          this.city = this.detailsObj.blackSealArea ? this.detailsObj.blackSealArea.split(",") : [];
        } else {
          this.city = this.detailsObj.whiteSealArea ? this.detailsObj.whiteSealArea.split(",") : [];
        }

        if (this.city.length === this.cities.length) {
          this.all = true;
        } else {
          this.all = false;
        }
      } else {
        this.addRuleForm.addType = '1';
      }
    },
    updateCustomer() {
      let selectCustomerObj = sessionStorage.getItem('selectCustomerObj') ? JSON.parse(sessionStorage.getItem('selectCustomerObj')) : {};
      this.addRuleForm.customer = _.get(selectCustomerObj, 'operatorName');
      this.$refs['addRuleForm'].validateField('customer');

      if (!this.detailsObj) {
        this.getAuthPolicyList(this.addRuleForm.customer);
      }

    },
    _ready() {
      this.resetForm('addRuleForm');
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll("button.el-dialog__headerbtn")[0].click();
    },
    showCustomerInfo(e) {
      e.target.blur();
      sessionStorage.setItem('selectCustomer', this.addRuleForm.customer);
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
      let data = _.cloneDeep(_self.addRuleForm);

      _.forEach(data, (value, key) => {
        data[key] = _self.Trim(value);
        if (!data[key]) {
          delete data[key];
        }
      });

      if (data.type == '1') { // 终端自产时
        delete data.macAddr;
        delete data.macAddrStr;
        delete data.macAddrPrefix;
        delete data.macAddrSuffixStart;
        delete data.macAddrSuffixEnd;
      } else if (data.type == '2') { // 终端代产
        delete data.sn;
        delete data.snStr;
        delete data.snPrefix;
        delete data.snSuffixStart;
        delete data.snSuffixEnd;
      }

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

      this.oneClick = true;

      if (!this.detailsObj) {
        this.$http.post(api.terminal(), data)
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
      } else {
        data['id'] = this.detailsObj.id;
        this.$http.put(api.terminal(), data)
          .then(function (response) {
            _self.oneClick = false;
            if (response.data.returnCode == '0') {
              _self.message('success', _self.$t('修改成功！'));
              _self.$emit('message', new Date());
              sessionStorage.setItem('selectCustomerObj', '');
              document.querySelectorAll("button.el-dialog__headerbtn")[0].click();
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
