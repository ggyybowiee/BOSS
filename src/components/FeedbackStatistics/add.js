import api from "../../api/api";

'use strict';
export default {
  props: ["selectedDatas", "addTime", "searchData"],
  data() {
    return {
      ruleForm: {
        downloadType: '0'
      },
      oneClick: false,
      downloadUrl: '',
      downloadTypeOptions: [{
          "value": "0",
          "label": this.$t('当前条件下的全部记录')
        },
        {
          "value": "1",
          "label": this.$t('所选记录')
        }
      ],
      rules: {}
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
      this.resetForm('ruleForm');
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll(".export-dialog button.el-dialog__headerbtn")[0].click();
    },
    submit() {
      let _self = this;

      let data = _.assign(_self.searchData, {
        downloadType: _self.ruleForm.downloadType,
        idList: []
      });
      delete data.pageNum;
      delete data.pageSize;

      if (_self.ruleForm.downloadType == 1 && _self.selectedDatas.length === 0) {
        _self.message('info', _self.$t('亲，请选择反馈信息记录再进行导出操作'));
        return;
      }

      _.forEach(_self.selectedDatas, (item) => {
        data.idList.push(item.id);
      });

      this.oneClick = true;
      this.$http.post(api.download(), data)
        .then(function (response) {
          _self.oneClick = false;
          if (response.data.returnCode == '0') {
            _self.downloadUrl = response.data.filePath;
            setTimeout(() => {
              _self.$refs.elementA.click();
              _self.message('success', _self.$t('导出成功！'));
              _self.cancel();
            }, 0);
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
