import api from "../../api/api";

'use strict';
export default {
  props: ["addTime", "selectedData"],
  data() {
    return {
      ruleForm: {
        authType: '1',
        authOperate: '1',
        authDay: 0,
        snStr: ''
      },
      list: [],
      selectedTableData: [],
      loading: false,
      oneClick: false,
      authTypeOptions: [{
          "value": "1",
          "label": this.$t('产品')
        },
        {
          "value": "2",
          "label": this.$t('套餐')
        }
      ],
      authOperateOptions: [{
          "value": "1",
          "label": this.$t('增加授权')
        },
        {
          "value": "2",
          "label": this.$t('重新授权')
        }, {
          "value": "3",
          "label": this.$t('删除授权')
        }, {
          "value": "4",
          "label": this.$t('减少授权')
        }
      ],
      rules: {
        snStr: [{
          required: true,
          message: this.$t('请输入终端ID（多个用回车分隔）'),
          trigger: 'blur'
        }],
        authType: [{
          required: true,
          trigger: 'blur'
        }],
        authOperate: [{
          required: true,
          trigger: 'blur'
        }],
        authDay: [{
          type: 'number',
          message: this.$t('请输入授权天数'),
          required: true,
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

      this.ruleForm.authType = '1';
      this.ruleForm.authOperate = '1';
    },
    _ready() {
      this.resetForm('ruleForm');
      this.search();
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll(".maintenance-dialog button.el-dialog__headerbtn")[0].click();
    },
    //多选
    handleSelectionChange(val) {
      _.forEach(this.list, item => {
        item.authDay = 0;
      });

      _.forEach(val, item => {
        item.authDay = this.ruleForm.authDay;
      });

      this.list = _.assign(this.list, ...val);

      this.selectedTableData = val;

    },
    // 授权天数发生改变时
    authDayChange() {
      _.forEach(this.selectedTableData, item => {
        item.authDay = this.ruleForm.authDay;
      });

      this.list = _.assign(this.list, ...this.selectedTableData);
    },
    // 获取产品信息
    getProductInfo() {
      let _self = this;

      let params = {
        pageNum: 1,
        pageSize: 10000,
        relateType: 1
      };

      this.$http
        .get(api.product(), {
          params
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            _.forEach(response.data.data, item => {
              item.authDay = 0;
              item.currentAuthDate = _self.moment(new Date()).format('YYYY-MM-DD');
            });

            _self.list = response.data.data;
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
    // 获取套餐信息
    getPackageInfo() {
      let _self = this;

      let params = {
        pageNum: 1,
        pageSize: 10000,
        relateType: 1
      };

      this.$http
        .get(api.package(), {
          params
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            _.forEach(response.data.packageInfoList, item => {
              item.authDay = 0;
              item.currentAuthDate = _self.moment(new Date()).format('YYYY-MM-DD');
            });

            _self.list = response.data.packageInfoList;
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
    search() {
      if (this.ruleForm.authType == 1) {
        this.getProductInfo();
      } else {
        this.getPackageInfo();
      }
    },
    submit() {
      let _self = this;
      let data = {};

      _.forEach(_self.ruleForm, (value, key) => {
        data[key] = _self.Trim(value);
      });

      let params = {
        addType: '3',
        authMethod: data.authType,
        operatorMethod: data.authOperate,
        snStr: data.snStr
      };

      if (data.authType == '1') {
        params.productMesList = [];
        _.forEach(this.selectedTableData, item => {
          params.productMesList.push({
            productCode: item.productCode,
            authDay: item.authDay
          });
        });
      } else {
        params.packageMesList = [];
        _.forEach(this.selectedTableData, item => {
          params.packageMesList.push({
            packageCode: item.packageCode,
            authDay: item.authDay
          });
        });
      }

      this.$confirm(this.$t('请确认是否进行批量操作？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.oneClick = true;
        this.$http.post(api.authInfoBatchBmt(), params)
          .then(function (response) {
            _self.oneClick = false;
            if (response.data.returnCode == '0') {
              _self.message('success', _self.$t('操作成功！可在异步任务处查看进度！'));
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
