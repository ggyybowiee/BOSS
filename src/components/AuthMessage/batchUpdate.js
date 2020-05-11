import api from "../../api/api";

'use strict';
export default {
  props: ["addTime", "selectedData"],
  data() {
    return {
      ruleForm: {
        status: '0',
        type: '3',
        snStr: ''
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
        status: [{
          required: true,
          message: this.$t('请选择状态'),
          trigger: 'blur'
        }],
        snStr: [{
          required: true,
          message: this.$t('请输入终端ID（多个用回车分隔）'),
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
      if (this.selectedData.length > 0) {
        let arr = [];
        _.forEach(this.selectedData, item => {
          arr.push(item.sn);
        });
        this.ruleForm.snStr = arr.join('\n');
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

      this.$confirm(this.$t('请确认是否进行批量操作？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.oneClick = true;
        this.$http.post(api.authInfoStatus(), data)
          .then(function (response) {
            _self.oneClick = false;
            if (response.data.returnCode == '0') {
              _self.message('success', _self.$t('修改成功！'));
              _self.$emit('message', new Date());
              _self.cancel();
            } else {
              _self.message('error', response.data.errorMessage);
            }
          })
          .catch(function (error) {
            _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          });
      }).catch(() => {});

    }
  }
}
