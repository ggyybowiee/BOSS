import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj", "statusOptions"],
  data() {
    return {
      ruleForm: {},
      chargeTypeOptions: [{
          label: this.$t('免费'),
          value: "1"
        }, {
          label: this.$t('包时段'),
          value: "2"
        },
        {
          label: this.$t('单片按次'),
          value: "3"
        },
        {
          label: this.$t('整包按次'),
          value: "4"
        }
      ],
      chargeUnitOptions: [{
          label: this.$t('月'),
          value: "1"
        }, {
          label: this.$t('天'),
          value: "2"
        },
        {
          label: this.$t('时'),
          value: "3"
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
      this.getProductInfo();
    },
    // 获取产品信息
    getProductInfo() {
      let _self = this;

      let params = {
        pageNum: 1,
        pageSize: 1000,
        productCode: this.detailsObj.productCode,
        relateType: 1
      };

      this.$http
        .get(api.product(), {
          params
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            _self.ruleForm = _.get(response.data.data, '[0]');
            _self.ruleForm.statusName = _self.commonFilter(_self.ruleForm.status, _self.statusOptions);
            _self.ruleForm.chargeTypeName = _self.commonFilter(_self.ruleForm.chargeType, _self.chargeTypeOptions);
            _self.ruleForm.chargeCycleName = _self.ruleForm.chargeCycle + _self.commonFilter(_self.ruleForm.chargeUnit, _self.chargeUnitOptions);
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
