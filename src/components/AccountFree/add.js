import api from "../../api/api";

'use strict';
export default {
  props: ["addTime", "detailsObj", "appIdOptions", "productCodeOptions", "areaOptions"],
  data() {
    return {
      ruleForm: {
        appId: "", // 应用ID
        status: "", // 状态
        productCode: "", // 产品编码
        preAuthDays: "", // 免费试用天数
        area: "" // 区域范围
      },
      oneClick: false,
      statusOptions: [{
          "value": "0",
          "label": this.$t('禁用')
        },
        {
          "value": "1",
          "label": this.$t('启用')
        }
      ],
      rules: {
        appId: [{
          required: true,
          message: this.$t('请选择应用ID'),
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: this.$t('请选择状态'),
          trigger: 'blur'
        }],
        productCode: [{
          required: true,
          message: this.$t('请选择产品名称'),
          trigger: 'blur'
        }],
        preAuthDays: [{
          type: 'number',
          required: true,
          message: this.$t('请输入免费试用天数'),
          trigger: 'blur'
        }],
        area: [{
          required: true,
          message: this.$t('请选择区域范围'),
          trigger: 'blur'
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
        _.forEach(this.ruleForm, (value, key) => {
          this.ruleForm[key] = this.detailsObj[key];
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
        if (key == 'preAuthDays') {
          data[key] = Number(value);
        } else {
          data[key] = _self.Trim(value);
        }
      });

      this.oneClick = true;

      if (!this.detailsObj) {
        this.$http.post(api.freeProduct(), data)
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
        this.$http.put(api.freeProduct(), data)
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
