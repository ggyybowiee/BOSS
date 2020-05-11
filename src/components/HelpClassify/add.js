import api from "../../api/api";

'use strict';
export default {
  props: ["addTime", "detailsObj", "appIdOptions", "typeOptions"],
  data() {
    return {
      ruleForm: {
        belong_type: '',
        pkg: '',
        type_zh: '',
        type_en: '',
        type_pt: '',
        type_es: '',
        sort_num: 0
      },
      oneClick: false,
      rules: {
        belong_type: [{
          required: true,
          message: this.$t('请选择所属类型'),
          trigger: 'blur'
        }],
        pkg: [{
          required: true,
          message: this.$t('请选择所属应用'),
          trigger: 'blur'
        }],
        type_zh: [{
          required: true,
          message: this.$t('请输入分类名称(中文)'),
          trigger: 'blur'
        }],
        type_en: [{
          required: true,
          message: this.$t('请输入分类名称(英语)'),
          trigger: 'blur'
        }],
        type_pt: [{
          required: true,
          message: this.$t('请输入分类名称(葡语)'),
          trigger: 'blur'
        }],
        type_es: [{
          required: true,
          message: this.$t('请输入分类名称(西语)'),
          trigger: 'blur'
        }],
        sort_num: [{
          type: 'number',
          required: true,
          message: this.$t('请输入显示顺序'),
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
          if (!this.detailsObj[key]) {
            this.ruleForm[key] = "";
          } else {
            this.ruleForm[key] = this.detailsObj[key];
          }
        });
      }

      if (_.get(this.detailsObj, 'sort_num')) {
        this.ruleForm.sort_num = Number(_.get(this.detailsObj, 'sort_num'));
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
        this.$http.post(api.getHelpClassify(), data)
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
        this.$http.put(api.getHelpClassify(), data)
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
