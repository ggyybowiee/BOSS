import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj", "appIdOptions", "zhClassifyNameOptions"],
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
    }
  }
}
