import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj", "useStatusOptions", "tmodelOptions", "terminalStatusOptions"],
  data() {
    return {
      showDetailRuleForm: {},
      type: sessionStorage.getItem('type') ? sessionStorage.getItem('type') : 'ott',
      typeOptions: [{
        label: this.$t('终端自产'),
        value: "1"
      }, {
        label: this.$t('终端代产'),
        value: "2"
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
      this.showDetailRuleForm = this.detailsObj;
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
