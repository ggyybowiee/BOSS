import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj", "statusOptions", "chargeUnitOptions"],
  data() {
    return {
      ruleForm: {}
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
