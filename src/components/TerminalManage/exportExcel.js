import api from "../../api/api";

'use strict';
export default {
  props: ["addTime", "params"],
  data() {
    return {
      exportExcelRuleForm: {
        pageNum: '1',
        pageSize: '10',
        relateType: '1'
      },
      oneClick: false,
      rules: {
        pageNum: [{
          required: true,
          message: this.$t('请输入当前页数'),
          trigger: 'blur'
        }],
        pageSize: [{
          required: true,
          message: this.$t('请输入每页导出条数'),
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
    },
    _ready() {
      this.resetForm('exportExcelRuleForm');
      if (this.params) {
        this.exportExcelRuleForm.pageNum = String(this.params.pageNum);
        this.exportExcelRuleForm.pageSize = String(this.params.pageSize);
      }
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll(".export-dialog button.el-dialog__headerbtn")[0].click();
    },
    submit() {
      let _self = this;
      let data = this.exportExcelRuleForm;

      this.oneClick = true;
      this.$http.get(api.downloadTerminalForExcel(), {
          params: data
        })
        .then(function (response) {
          _self.oneClick = false;
          if (response.data.returnCode == '0') {
            _self.message('success', _self.$t('操作成功！可在异步任务处查看进度！'));
            _self.cancel();
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
