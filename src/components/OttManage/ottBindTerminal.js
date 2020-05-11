import api from "../../api/api";

'use strict';
let that;
export default {
  props: ["ottBindTerminalTime"],
  data() {
    return {
      params: {
        sn: '',
        macAddr: '',
        status: '',
        relateType: 3,
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      selectObj: '',
      dialogTableVisible: false,
      terminalStatusOptions: [{
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
    "ottBindTerminalTime": "reset_search"
  },
  methods: {
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.params.pageNum = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.getList();
    },
    //多选
    handleSelectionChange(val) {
      this.selectObj = val;
    },
    reset_search() {
      this.params = {
        sn: '',
        macAddr: '',
        status: '',
        relateType: 3,
        pageNum: 1,
        pageSize: 10
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

      _self.searchData['pageSize'] = _self.params['pageSize'];
      _self.searchData['pageNum'] = _self.params['pageNum'];

      //搜索部分
      this.$http
        .get(api.terminal(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.list = response.data.terminalInfoList;

            _self.$nextTick(() => {
              let sn = sessionStorage.getItem('selectSn');
              let index = _.findIndex(_self.list, item => {
                return item.sn == sn;
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
      sessionStorage.setItem('selectSnObj', JSON.stringify(this.selectObj));
      this.$emit('setSn', new Date());
    },
  },
  filters: {
    filterTerminalStatusOptions(status) {
      let label = '';
      _.forEach(that.terminalStatusOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    },
  }
}
