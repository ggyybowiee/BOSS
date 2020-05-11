import api from "../../api/api";

'use strict';
export default {
  props: ["showDetailTime", "detailsObj"],
  data() {
    return {
      ruleForm: {
        addType: '3',
        snStr: ''
      }
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
      this.ruleForm.authPolicyId = [this.detailsObj.id];
      this.ruleForm.snStr = '';
    },
    ref(refType) {
      let _self = this;
      this.ruleForm.refType = refType;
      this.$http.post(api.authPolicyRefTerminal(), this.ruleForm)
        .then(function (response) {
          if (response.data.returnCode == '0') {
            _self.message('success', _self.$t('亲，操作成功！异步任务处会显示结果！'));
            _self.$emit('message', new Date());
            _self.$emit('close', new Date());
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
