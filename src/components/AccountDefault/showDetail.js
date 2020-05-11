import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj", "appIds", "appCodeOptions"],
  data() {
    return {
      ruleForm: {},
      list: [],
      loading: false,
      type: sessionStorage.getItem('type'),
      TerTypeList: [{
          label: this.$t('自有终端'),
          value: "1"
        }, {
          label: this.$t('三方终端'),
          value: "2"
        },
        {
          label: this.$t('手机移动端'),
          value: "3"
        }
      ],
      accountOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('TV'),
          value: "1"
        },
        {
          label: this.$t('手机'),
          value: "2"
        }
      ],
      statusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('禁用'),
          value: "0"
        },
        {
          label: this.$t('启用'),
          value: "1"
        }
      ],
      hasPayOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('未付费'),
          value: "0"
        },
        {
          label: this.$t('已付费'),
          value: "1"
        }
      ],
      bindStatusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('未绑定'),
          value: "0"
        },
        {
          label: this.$t('已绑定'),
          value: "1"
        }
      ],
    };
  },
  mounted: function () {
    this._ready();
  },
  watch: {
    "showDetailTime": "_ready"
  },
  methods: {
    _ready() {
      this.type = sessionStorage.getItem('type');
      this.ruleForm = this.detailsObj;
      this.ruleForm.appCodeName = this.commonFilter(this.ruleForm.appCode, this.appCodeOptions);
      this.ruleForm.typeName = this.commonFilter(this.ruleForm.type, this.TerTypeList);
      this.ruleForm.statusName = this.commonFilter(this.ruleForm.status, this.statusOptions);
      this.ruleForm.hasPayName = this.commonFilter(this.ruleForm.hasPay, this.hasPayOptions);
      this.ruleForm.bindMobileStatusName = this.ruleForm.mobile ? this.$t('已绑定') : this.$t('未绑定');
      this.ruleForm.bindMailStatusName = this.commonFilter(this.ruleForm.bindMailStatus, this.bindStatusOptions);
      this.ruleForm.restrictedStatusName = this.ruleForm.restrictedStatus == '0' ? this.$t('未开启') : this.$t('开启');

      if (this.type == 1) {
        this.getAuthInfo();
      }
    },
    getAuthInfo() {
      let _self = this;
      let params = {
        sn: this.ruleForm.sn
      }
      _self.loading = true;

      //搜索部分
      this.$http
        .get(api.getAuthInfo(), {
          params
        })
        .then((response) => {
          _self.loading = false;
          if (response.data.returnCode == 0) {
            _self.list = response.data.authInfoList;
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          _self.loading = false;
        });
    },
    commonFilter(value, options) {
      let label = '';
      _.forEach(options, (item) => {
        if (item.value == value) {
          label = item.label;
        }
      });
      return label;
    }
  }
}
