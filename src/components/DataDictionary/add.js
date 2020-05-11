import api from "../../api/api";

'use strict';
export default {
  props: ["addTime", "detailsObj", "dictTypeOptions"],
  data() {
    return {
      ruleForm: {
        dictType: '',
        dictName: '',
        dictValue: '',
        isfixed: '',
        note: ''
      },
      oneClick: false,
      fixOptions: [{
          "value": "0",
          "label": this.$t('不固定')
        },
        {
          "value": "1",
          "label": this.$t('固定')
        }
      ],
      rules: {
        dictType: [{
          required: true,
          message: this.$t('请选择字典类型'),
          trigger: 'blur'
        }],
        dictName: [{
          required: true,
          message: this.$t('请输入字典key'),
          trigger: 'blur'
        }],
        dictValue: [{
          required: true,
          message: this.$t('请输入字典值'),
          trigger: 'blur'
        }],
        isfixed: [{
          required: true,
          message: this.$t('请选择是否固定'),
          trigger: 'blur'
        }],
        note: [{
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
        this.ruleForm.dictType = this.detailsObj.dictType.toString();
        this.ruleForm.dictName = this.detailsObj.dictName;
        this.ruleForm.dictValue = this.detailsObj.dictValue;
        this.ruleForm.isfixed = this.detailsObj.isfixed.toString();
        this.ruleForm.note = this.detailsObj.note;
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
        this.$http.post(api.dictionary(), data)
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
        this.$http.put(api.dictionary(), data)
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
