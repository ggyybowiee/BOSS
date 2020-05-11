import api from "../../api/api";

'use strict';
export default {
  props: ["addTime", "detailsObj", "zhClassifyNameOptions", "appIdOptions", "updateTextTime"],
  data() {
    return {
      ruleForm: {
        pkg: '',
        type_zh: '',
        sort_num: 0,
        zh_question: '',
        en_question: '',
        pt_question: '',
        es_question: '',
        zh_answer: '',
        en_answer: '',
        pt_answer: '',
        es_answer: '',
      },
      filterZhClassifyNameOptions: [],
      oneClick: false,
      currentEditParam: '',
      rules: {
        pkg: [{
          required: true,
          message: this.$t('请选择所属应用'),
          trigger: 'blur'
        }],
        type_zh: [{
          required: true,
          message: this.$t('请选择所属分类'),
          trigger: 'blur'
        }],
        sort_num: [{
          type: 'number',
          required: true,
          message: this.$t('请输入显示顺序'),
          trigger: 'blur'
        }],
        zh_question: [{
          required: true,
          message: this.$t('中文') + this.$t('问题不能为空 '),
          trigger: 'blur'
        }],
        en_question: [{
          required: true,
          message: this.$t('英语') + this.$t('问题不能为空 '),
          trigger: 'blur'
        }],
        pt_question: [{
          required: true,
          message: this.$t('葡语') + this.$t('问题不能为空 '),
          trigger: 'blur'
        }],
        es_question: [{
          required: true,
          message: this.$t('西语') + this.$t('问题不能为空 '),
          trigger: 'blur'
        }],
        zh_answer: [{
          required: true,
          message: this.$t('中文') + this.$t('答案不能为空 '),
          trigger: 'blur'
        }],
        en_answer: [{
          required: true,
          message: this.$t('英语') + this.$t('答案不能为空 '),
          trigger: 'blur'
        }],
        pt_answer: [{
          required: true,
          message: this.$t('葡语') + this.$t('答案不能为空 '),
          trigger: 'blur'
        }],
        es_answer: [{
          required: true,
          message: this.$t('西语') + this.$t('答案不能为空 '),
          trigger: 'blur'
        }],
      }
    };
  },
  mounted: function () {
    this._ready();
  },
  watch: {
    "addTime": "_ready",
    "updateTextTime": "updateText"
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
        this.ruleForm.sort_num = Number(_.get(this.detailsObj, 'sort_num'));
      }
    },
    _ready() {
      this.resetForm('ruleForm');
    },
    updateText() {
      let note = sessionStorage.getItem('note') ? sessionStorage.getItem('note') : '';
      this.ruleForm[this.currentEditParam] = note;
      this.$refs['ruleForm'].validateField(this.currentEditParam);
    },
    pkgChange(pkg) {
      if (pkg != _.get(this.detailsObj, 'pkg')) {
        this.ruleForm.type_zh = '';
      }

      this.filterZhClassifyNameOptions = _.filter(this.zhClassifyNameOptions, item => {
        return pkg === item.pkg;
      });
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll("button.el-dialog__headerbtn")[0].click();
    },
    showEditor(param) {
      this.currentEditParam = param;
      sessionStorage.setItem('note', this.ruleForm[param]);
      this.$emit('showEditor', new Date());
    },
    submit() {
      let _self = this;
      let data = {};

      _.forEach(_self.ruleForm, (value, key) => {
        data[key] = _self.Trim(value);
      });

      this.oneClick = true;

      if (!this.detailsObj) {
        this.$http.post(api.getHelpQuestion(), data)
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
        this.$http.put(api.getHelpQuestion(), data)
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
