import api from "../../api/api";

'use strict';
let that;
export default {
  props: ["addTime", "detailsObj", "chargeUnitOptions", "customerList", "operatorType"],
  data() {
    return {
      ruleForm: {
        name: '',
        effectDate: '',
        invalidDate: '',
        status: '1',
        authUnit: '2',
        authCycle: '',
        customer: '',
        remark: ''
      },
      statusOptions: [{
          label: this.$t('禁用'),
          value: "0"
        },
        {
          label: this.$t('启用'),
          value: "1"
        }
      ],
      customers: [],
      all: false,
      oneClick: false,
      rules: {
        name: [{
          required: true,
          message: this.$t('请输入授权名称'),
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: this.$t('请选择状态'),
          trigger: 'blur'
        }],
        authCycle: [{
          type: 'number',
          required: true,
          message: this.$t('请输入授权周期'),
          trigger: 'blur'
        }, {
          validator(rule, value, callback) {
            if (Number.isInteger(Number(value)) && Number(value) > 0) {
              callback()
            } else {
              callback(new Error(that.$t('请输入大于0的整数')))
            }
          },
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
    customers(val, oldval) {
      //如果新的选择里有勾选了选择所有, 则勾选整个选项
      if (val.indexOf('all') != -1 && oldval.indexOf('all') == -1 && val.length != this.customerList.length) {
        this.customers = [];
        _.forEach(this.customerList, item => {
          this.customers.push(item.operatorName);
        });
        this.all = true;
      }
      //如果操作前有勾选了多项且当前也选中了取消所有且勾选数量大于等于1则取消勾选所有
      else if (val.indexOf('cancleAll') != -1 && oldval.indexOf('cancleAll') == -1 & oldval.length >= 1) {
        this.all = false;
        this.customers = [];
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.ruleForm.customer = this.customers.join(',');
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
      this.customers = [];
      if (this.detailsObj) {
        _.forEach(this.ruleForm, (value, key) => {
          this.ruleForm[key] = this.detailsObj[key] ? this.detailsObj[key] : '';

          if ((key == 'effectDate' || key == 'invalidDate') && !!this.detailsObj[key]) {
            this.ruleForm[key] = new Date(this.detailsObj[key]);
          }

        });
        if (this.detailsObj.customer) {
          this.customers = this.detailsObj.customer.split(',');
        }
      }
    },
    _ready() {
      this.resetForm('ruleForm');
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll("button.el-dialog__headerbtn")[0].click();
    },
    checkProductCode(code) {
      let _self = this;
      let data = {
        keyType: '1',
        value: code
      };

      this.$http.post(api.productCheck(), data)
        .then(function (response) {
          if (response.data.returnCode != '0') {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch(function (error) {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
    submit() {
      let _self = this;
      let data = {};

      _.forEach(_self.ruleForm, (value, key) => {
        data[key] = _self.Trim(value);
      });

      if (data.effectDate && data.invalidDate) {
        let startSeconds = new Date(data.effectDate).getTime();
        let endSeconds = new Date(data.invalidDate).getTime();
        let diffDay = _self.moment(startSeconds).diff(_self.moment(endSeconds), 'days');

        if (diffDay > 0) {
          _self.message('error', _self.$t('生效日期不能大于或等于失效日期！'));
          return;
        }
      }

      if (data.effectDate) {
        data.effectDate = _self.moment(data.effectDate).format('YYYY-MM-DD');
      }

      if (data.invalidDate) {
        data.invalidDate = _self.moment(data.invalidDate).format('YYYY-MM-DD');
      }

      this.oneClick = true;

      if (!this.detailsObj) {
        this.$http.post(api.authPolicy(), data)
          .then(function (response) {
            _self.oneClick = false;
            if (response.data.returnCode == '0') {
              _self.message('success', _self.$t('新增成功！'));
              _self.$emit('message', new Date());
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
        this.$http.put(api.authPolicy(), data)
          .then(function (response) {
            _self.oneClick = false;
            if (response.data.returnCode == '0') {
              _self.message('success', _self.$t('修改成功！'));
              _self.$emit('message', new Date());
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
  }
}
