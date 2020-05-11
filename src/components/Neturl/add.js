import api from "../../api/api";

'use strict';
export default {
  props: ["addTime", "detailsObj"],
  data() {
    return {
      ruleForm: {
        apiName: '',
        uri: '',
        remark: ''
      },
      oneClick: false,
      rules: {
        apiName: [{
          required: true,
          message: this.$t('请输入接口名称'),
          trigger: 'blur'
        }],
        uri: [{
          required: true,
          message: this.$t('请输入URL接口地址'),
          trigger: 'blur'
        }],
        remark: [{
          required: false,
          message: ''
        }]
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
        this.ruleForm.apiName = this.detailsObj.apiName.toString();
        this.ruleForm.uri = this.detailsObj.uri;
        this.ruleForm.remark = this.detailsObj.remark;
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

      this.oneClick = true;

      if (!this.detailsObj) {
        this.$http.post(api.netApi(), data)
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
        this.$http.put(api.netApi(), data)
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
