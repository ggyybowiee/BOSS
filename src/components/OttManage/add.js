import api from "../../api/api";

'use strict';
let that;
export default {
  props: ["addTime", "detailsObj", "updateSnTime"],
  data() {
    return {
      ruleForm: {
        userName: '',
        password: '',
        status: '1',
        onlineNum: 3,
        sn: '',
        email: '',
        mobile: '',
        tel: '',
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
      oneClick: false,
      rules: {
        userName: [{
          required: true,
          message: this.$t('请输入用户名'),
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: this.$t('请输入登录密码'),
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: this.$t('请选择状态'),
          trigger: 'blur'
        }],
        onlineNum: [{
          type: 'number',
          required: true,
          message: this.$t('请输入在线数'),
          trigger: 'blur'
        }],
        sn: [{
          required: true,
          message: this.$t('请选择关联终端信息'),
          trigger: 'blur'
        }],
        email: [{
          type: "email",
          message: this.$t("邮箱格式不正确"),
          trigger: ["blur", "change"]
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
    "updateSnTime": "updateSn"
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
          this.ruleForm[key] = this.detailsObj[key];
        });
      }
    },
    updateSn() {
      let selectSnObj = sessionStorage.getItem('selectSnObj') ? JSON.parse(sessionStorage.getItem('selectSnObj')) : {};
      this.ruleForm.sn = _.get(selectSnObj, 'sn');
      this.$refs['ruleForm'].validateField('sn');
    },
    _ready() {
      this.resetForm('ruleForm');
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll("button.el-dialog__headerbtn")[0].click();
    },
    showTerminalInfo(e) {
      e.target.blur();
      sessionStorage.setItem('selectSn', this.ruleForm.sn);
      this.$emit('showOttBindTerminal', new Date());
    },
    submit() {
      let _self = this;
      let data = {};

      _.forEach(_self.ruleForm, (value, key) => {
        data[key] = _self.Trim(value);
      });

      delete data.sn;

      let selectSnObj = sessionStorage.getItem('selectSnObj') ? JSON.parse(sessionStorage.getItem('selectSnObj')) : {};

      data.terminalId = _.get(selectSnObj, 'id');
      data.onlineNum = Number(data.onlineNum);
      data.password = this.$md5(data.password).toUpperCase();
      this.oneClick = true;

      if (!this.detailsObj) {
        this.$http.post(api.ottAccount(), data)
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
        data['userCode'] = this.detailsObj.userCode;
        this.$http.put(api.ottAccount(), data)
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
