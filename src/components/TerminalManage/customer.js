import api from "../../api/api";

'use strict';
let that;
export default {
  props: ["customerTime"],
  data() {
    return {
      params: {
        operatorName: '',
        status: '',
        operatorType: 3,
        page: 1,
        results_per_page: 10
      },
      list: [],
      selectObj: '',
      dialogTableVisible: false,
      statusOptions: [{
        label: this.$t('全部'),
        value: ""
      }, {
        label: this.$t('启用'),
        value: "1"
      }, {
        label: this.$t('禁用'),
        value: "0"
      }],
      oneClick: false,
      loading: false
    };
  },
  beforeCreate: function () {
    that = this;
  },
  mounted: function () {
    this.reset_search();
  },
  watch: {
    "customerTime": "reset_search"
  },
  methods: {
    handleSizeChange(val) {
      this.params.results_per_page = val;
      this.params.page = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
    //多选
    handleSelectionChange(val) {
      this.selectObj = val;
    },
    reset_search() {
      this.params = {
        operatorName: '',
        status: '',
        operatorType: 3,
        page: 1,
        results_per_page: 10
      };
      this.search();
    },
    search() {
      let _self = this;

      _self.searchData = _.cloneDeep(this.params);
      _.forEach(_self.searchData, (value, key) => {
        _self.searchData[key] = _self.Trim(value);
        if (!_self.searchData[key]) {
          delete _self.searchData[key];
        }
      });

      _self.getList();
    },
    getList() {
      let _self = this;
      _self.loading = true;
      _self.oneClick = true;

      _self.searchData['results_per_page'] = _self.params['results_per_page'];
      _self.searchData['page'] = _self.params['page'];

      //搜索部分
      this.$http
        .get(api.operator(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.list = response.data.objects;

            _self.$nextTick(() => {
              let customer = sessionStorage.getItem('selectCustomer');
              let index = _.findIndex(_self.list, item => {
                return item.operatorName == customer;
              });

              if (index > -1) {
                _self.$refs.singleTable.setCurrentRow(_self.list[index]);
              }
            });

          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          _self.loading = false;
          _self.oneClick = false;
        });
    },
    ref() {
      let _self = this;

      if (!this.selectObj) {
        _self.message('info', _self.$t('请先点击表中行数据'));
        return;
      }
      sessionStorage.setItem('selectCustomerObj', JSON.stringify(this.selectObj));
      this.$emit('setCustomer', new Date());
    },
  }
}
