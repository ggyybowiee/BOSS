import api from "../../api/api";

'use strict';
export default {
  props: ["addPolicyTime", "addPolicyInterfaceTime"],
  data() {
    return {
      ruleForm: {
        policyType: '',
        policyIdentify: '',
        remark: ''
      },
      clickNetObj: sessionStorage.getItem("clickNetObj") ? JSON.parse(sessionStorage.getItem("clickNetObj")) : {},
      clickType: sessionStorage.getItem("clickType") ? sessionStorage.getItem("clickType") : '1',
      oneClick: false,
      list: [],
      policyTypeOptions: [{
        label: this.$t('按内容提供商'),
        value: "1"
      }, {
        label: this.$t('按接口同步'),
        value: "2"
      }],
      rules: {
        policyType: [{
          required: true,
          message: this.$t('请选择策略类型'),
          trigger: 'blur'
        }],
        policyIdentify: [{
          required: true,
          message: this.$t('请输入策略标识'),
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
    "addPolicyTime": "_ready",
    "addPolicyInterfaceTime": "handleInterfaceDate"
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
      if (this.clickType != '1') {
        this.ruleForm.policyType = this.Trim(this.clickNetObj.policyType);
        this.ruleForm.remark = this.clickNetObj.remark;
        this.ruleForm.policyIdentify = this.Trim(this.clickNetObj.policyIdentify);
      }
    },
    handleInterfaceDate() {
      let interfaceId = JSON.parse(sessionStorage.getItem("interfaceId"));
      this.ruleForm.policyIdentify = interfaceId.join(',');
      this.$refs['ruleForm'].validateField('policyIdentify');
    },
    _ready() {
      this.clickType = sessionStorage.getItem("clickType") ? sessionStorage.getItem("clickType") : '1';
      this.clickNetObj = sessionStorage.getItem("clickNetObj") ? JSON.parse(sessionStorage.getItem("clickNetObj")) : {};
      this.resetForm('ruleForm');

      let _self = this;
      if (this.clickType == '3') {
        if (_self.ruleForm.policyType == '2') {
          let searchData = {
            id: `[${_.get(_self.clickNetObj, 'policyIdentify').split(',')}]`,
            pageNum: 1,
            pageSize: 1000
          };

          this.$http.get(api.netApi(), {
              params: searchData
            })
            .then(function (response) {
              if (response.data.returnCode == '0') {
                _self.list = response.data.neApiList;
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
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll(".add-policy button.el-dialog__headerbtn")[0].click();
    },
    // 选择策略标识
    choiseInterface(e) {
      e.target.blur();
      if (this.clickType == '1') {
        sessionStorage.setItem("interfaceId", JSON.stringify([]));
      } else if (this.clickType == '2') {
        let policyIdentify = this.ruleForm.policyIdentify.split(',');
        sessionStorage.setItem("interfaceId", JSON.stringify(policyIdentify));
      }
      this.$emit('getPolicyIdentify', new Date());
    },
    submit() {
      let _self = this;
      let data = {};

      _.forEach(_self.ruleForm, (value, key) => {
        data[key] = _self.Trim(value);
      });
      data['neId'] = this.clickNetObj.neId;

      this.oneClick = true;

      if (this.clickType == '1') { // 新增
        this.$http.post(api.neSyncPolicy(), data)
          .then(function (response) {
            _self.oneClick = false;
            if (response.data.returnCode == '0') {
              _self.message('success', _self.$t('新增成功！'));
              _self.$emit('reloadPolicyList', new Date());
              _self.cancel();
            } else {
              _self.message('error', response.data.errorMessage);
            }
          })
          .catch(function (error) {
            _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          });
      } else if (this.clickType == '2') { // 修改
        data['id'] = this.clickNetObj.id;
        this.$http.put(api.neSyncPolicy(), data)
          .then(function (response) {
            _self.oneClick = false;
            if (response.data.returnCode == '0') {
              _self.message('success', _self.$t('修改成功！'));
              _self.$emit('reloadPolicyList', new Date());
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
