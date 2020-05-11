import api from "../../api/api";

'use strict';
export default {
  props: ["addTime", "detailsObj", "accountOptions", "appIdOptions"],
  data() {
    return {
      ruleForm: {
        name: '',
        detail: '',
        effectTime: '',
        invalidTime: '',
        inviterAccountType: '',
        inviteeAccountType: '',
        appId: ''
      },
      oneClick: false,
      rules: {
        name: [{
          required: true,
          message: this.$t('请输入奖励规则名称'),
          trigger: 'blur'
        }],
        detail: [{
          required: true,
          message: this.$t('请输入奖励规则描述'),
          trigger: 'blur'
        }],
        inviterAccountType: [{
          required: true,
          message: this.$t('请选择邀请人账号类型'),
          trigger: 'blur'
        }],
        inviteeAccountType: [{
          required: true,
          message: this.$t('请选择受邀人账号类型'),
          trigger: 'blur'
        }],
        appId: [{
          required: true,
          message: this.$t('请选择应用名称'),
          trigger: 'blur'
        }],
        invalidTime: [{
          type: 'date',
          required: true,
          message: this.$t('请输入失效日期'),
          trigger: 'blur'
        }],
      }
    };
  },
  mounted: function () {
    this._ready();
  },
  watch: {
    "addTime": "_ready"
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
      if (this.detailsObj) {
        _.forEach(this.ruleForm, (value, key) => {
          this.ruleForm[key] = this.detailsObj[key] ? this.detailsObj[key] : '';

          if ((key == 'effectTime' || key == 'invalidTime') && this.detailsObj[key]) {
            this.ruleForm[key] = new Date(this.detailsObj[key]);
          }
        });
      }
    },
    _ready() {
      this.resetForm('ruleForm');
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

      this.oneClick = true;

      if (!this.detailsObj) {
        this.$http.post(api.inviteRules(), data)
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
        this.$http.put(api.inviteRules(), data)
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
