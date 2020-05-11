import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj", "statusOptions"],
  data() {
    return {
      ruleForm: {},
      type: sessionStorage.getItem('type') ? sessionStorage.getItem('type') : 'ott',
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
      terminalStatus: [{
        label: this.$t('未激活'),
        value: "1"
      }, {
        label: this.$t('已激活'),
        value: "2"
      }, {
        label: this.$t('非法机'),
        value: "3"
      }, {
        label: this.$t('坏机'),
        value: "4"
      }, {
        label: this.$t('禁用'),
        value: "5"
      }],
      tmlcrossAllowList: [{
        label: this.$t('允许'),
        value: "1"
      }, {
        label: this.$t('不允许'),
        value: "0"
      }]
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
      this.ruleForm = {};
      this.type = sessionStorage.getItem('type') ? sessionStorage.getItem('type') : 'ott';
      if (this.type == 'sn') {
        this.getSnInfo();
      } else {
        this.ruleForm = this.detailsObj;
        this.ruleForm.statusName = this.commonFilter(this.ruleForm.status, this.statusOptions);
      }
    },
    getSnInfo() {
      let _self = this;

      let searchData = {
        pageNum: 1,
        relateType: 1,
        sn: this.detailsObj.sn
      };

      //搜索部分
      this.$http
        .get(api.terminal(), {
          params: searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.ruleForm = _.get(response.data.terminalInfoList, '[0]');
            this.ruleForm.typeName = this.commonFilter(this.ruleForm.type, this.TerTypeList);
            this.ruleForm.statusName = this.commonFilter(this.ruleForm.status, this.terminalStatus);
            this.ruleForm.crossAllowName = this.commonFilter(this.ruleForm.crossAllow, this.tmlcrossAllowList);
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
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
