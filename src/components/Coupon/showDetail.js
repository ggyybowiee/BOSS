import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj", "appIdOptions"],
  data() {
    return {
      ruleForm: {},
      packageOptions: [],
      couponTypeOptions: [{
          disabled: false,
          label: this.$t('抵扣金额'),
          value: "1"
        },
        {
          disabled: true,
          label: this.$t('折扣'),
          value: "2"
        }
      ],
      partakeTypeOptions: [{
          disabled: false,
          label: this.$t('参与活动领取'),
          value: "1"
        },
        {
          disabled: true,
          label: this.$t('针对指定用户系统下发'),
          value: "2"
        }
      ],
      couponEffectTypeOptions: [{
        disabled: true,
        label: this.$t('指定日期'),
        value: "1"
      }, {
        disabled: false,
        label: this.$t('领取后生效'),
        value: "2"
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
      this.ruleForm = this.detailsObj;
      this.getPackageList();
    },
    // 获取套餐列表
    getPackageList() {
      let _self = this;
      let params = {
        pageNum: 1,
        pageSize: 1000
      }

      this.$http
        .get(api.getPackageList(), {
          params
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            _.forEach(response.data.data, item => {
              _self.packageOptions.push({
                label: item.packageName,
                value: item.packageCode
              });
            });
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
  }
}
