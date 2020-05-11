import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj", "statusOptions", "chargeUnitOptions"],
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
      ]
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
      this.ruleForm.statusName = this.commonFilter(this.ruleForm.status, this.statusOptions);
      this.ruleForm.chargeTypeName = this.commonFilter(this.ruleForm.chargeType, this.chargeTypeOptions);
      this.ruleForm.chargeCycleName = this.ruleForm.chargeCycle + this.commonFilter(this.ruleForm.chargeUnit, this.chargeUnitOptions);
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
