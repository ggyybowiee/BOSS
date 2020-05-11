import api from "../../api/api";

'use strict';
let that;
export default {
  props: ["addTime", "detailsObj", "appIdOptions"],
  data() {
    return {
      ruleForm: {
        name: '',
        couponCode: '',
        couponType: '1',
        couponEffectType: '2',
        discountRate: '',
        brl: '',
        usd: '',
        couponTitleEn: '',
        couponTitlePt: '',
        couponTitleEs: '',
        afterDay: '',
        effectTime: '',
        invalidTime: '',
        partakeType: '1',
        operator: sessionStorage.getItem('tokenUserName') ? sessionStorage.getItem('tokenUserName') : '',
        appId: '',
        packageCode: ''
      },
      couponTypeOptions: [{
          disabled: false,
          label: this.$t('抵扣金额'),
          value: "1"
        },
        {
          disabled: true,
          label: this.$t('折扣'),
          value: "2"
        }
      ],
      partakeTypeOptions: [{
          disabled: false,
          label: this.$t('参与活动领取'),
          value: "1"
        },
        {
          disabled: true,
          label: this.$t('针对指定用户系统下发'),
          value: "2"
        }
      ],
      couponEffectTypeOptions: [{
        disabled: true,
        label: this.$t('指定日期'),
        value: "1"
      }, {
        disabled: false,
        label: this.$t('领取后生效'),
        value: "2"
      }],
      packageOptions: [],
      oneClick: false,
      rules: {
        name: [{
          required: true,
          message: this.$t('请输入优惠券名称'),
          trigger: 'blur'
        }],
        couponCode: [{
          required: true,
          message: this.$t('请输入优惠券编码'),
          trigger: 'blur'
        }],
        discountRate: [{
          type: 'number',
          required: true,
          message: this.$t('请输入正确格式的折扣'),
          trigger: 'blur'
        }, {
          validator(rule, value, callback) {
            let reg = /^(([0-9]+)|([0-9]+\.[0-9]{1,2}))$/;
            if (reg.test(value) && value > 0 && value < 10) {
              callback()
            } else {
              callback(new Error(that.$t('请输入大于0，小于10的数，最多保留两位小数')))
            }
          },
          trigger: 'blur'
        }],
        brl: [{
          type: 'number',
          required: true,
          message: this.$t('请输入抵扣金额(R$)'),
          trigger: 'blur'
        }, {
          validator(rule, value, callback) {
            let reg = /^(([0-9]+)|([0-9]+\.[0-9]{1}))$/;
            if (reg.test(value) && value > 0) {
              callback()
            } else {
              callback(new Error(that.$t('请输入大于0的数，最多保留一位小数')))
            }
          },
          trigger: 'blur'
        }],
        usd: [{
          type: 'number',
          required: true,
          message: this.$t('请输入抵扣金额($)'),
          trigger: 'blur'
        }, {
          validator(rule, value, callback) {
            let reg = /^(([0-9]+)|([0-9]+\.[0-9]{1}))$/;
            if (reg.test(value) && value > 0) {
              callback()
            } else {
              callback(new Error(that.$t('请输入大于0的数，最多保留一位小数')))
            }
          },
          trigger: 'blur'
        }],
        couponTitleEn: [{
          required: true,
          message: this.$t('请输入优惠券标题(英语)'),
          trigger: 'blur'
        }],
        couponTitlePt: [{
          required: true,
          message: this.$t('请输入优惠券标题(葡语)'),
          trigger: 'blur'
        }],
        couponTitleEs: [{
          required: true,
          message: this.$t('请输入优惠券标题(西语)'),
          trigger: 'blur'
        }],
        afterDay: [{
          type: 'number',
          required: true,
          message: this.$t('请输入领取后生效天数'),
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
        }],
        invalidTime: [{
          type: 'date',
          required: true,
          message: this.$t('请输入失效日期'),
          trigger: 'blur'
        }],
        appId: [{
          required: true,
          message: this.$t('请选择应用名称'),
          trigger: 'blur'
        }],
        packageCode: [{
          required: true,
          message: this.$t('请选择套餐名称'),
          trigger: 'blur'
        }],
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
    "addTime": "_ready"
  },
  methods: {
    // 获取套餐列表
    getPackageList() {
      let _self = this;
      let params = {
        pageNum: 1,
        pageSize: 1000
      }

      this.$http
        .get(api.getPackageList(), {
          params
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            _.forEach(response.data.data, item => {
              _self.packageOptions.push({
                label: item.packageName,
                value: item.packageCode
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
      this.ruleForm.couponCode = this.getUuid();
      if (this.detailsObj) {
        _.forEach(this.ruleForm, (value, key) => {
          this.ruleForm[key] = this.detailsObj[key] ? this.detailsObj[key] : '';

          if ((key == 'effectTime' || key == 'invalidTime') && !!this.detailsObj[key]) {
            this.ruleForm[key] = new Date(this.detailsObj[key]);
          }
        });

        let arr = ["couponType", "couponEffectType", "partakeType"];

        _.forEach(arr, (key) => {
          if (!this.ruleForm[key]) {
            this.ruleForm[key] = '1';
          }
        });
      }
    },
    _ready() {
      this.resetForm('ruleForm');
      this.getPackageList();
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll("button.el-dialog__headerbtn")[0].click();
    },
    submit() {
      let _self = this;
      let data = {};

      _.forEach(_self.ruleForm, (value, key) => {
        data[key] = _self.Trim(value);
      });

      if (data.effectTime && data.invalidTime) {
        let startSeconds = new Date(data.effectTime).getTime();
        let endSeconds = new Date(data.invalidTime).getTime();
        let diffDay = _self.moment(startSeconds).diff(_self.moment(endSeconds), 'days');

        if (diffDay > 0) {
          _self.message('error', _self.$t('生效日期不能大于或等于失效日期！'));
          return;
        }
      }

      if (data.effectTime) {
        data.effectTime = _self.moment(data.effectTime).format('YYYY-MM-DD');
      }

      if (data.invalidTime) {
        data.invalidTime = _self.moment(data.invalidTime).format('YYYY-MM-DD');
      }

      if (data.couponType == 1) {
        delete data.discountRate;
      } else if (data.couponType == 2) {
        delete data.brl;
        delete data.usd;
      }

      if (data.couponEffectType == 1) {
        delete data.afterDay;
      } else if (data.couponEffectType == 2) {
        delete data.effectTime;
        delete data.invalidTime;
      }

      data.brl = Number(data.brl)
      data.usd = Number(data.usd)
      data.afterDay = Number(data.afterDay)
      data.discountRate = Number(data.discountRate)
      this.oneClick = true;

      data.packageName = _.get(_.find(this.packageOptions, (item) => item.value === data.packageCode), 'label');

      if (!this.detailsObj) {
        this.$http.post(api.couponRules(), data)
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
        this.$http.put(api.couponRules(), data)
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
