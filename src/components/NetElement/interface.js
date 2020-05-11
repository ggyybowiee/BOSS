import api from "../../api/api";

'use strict';
export default {
  props: ["interfaceTime"],
  data() {
    return {
      params: {
        apiName: '', // 网元名称
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      searchData: {},
      selectedData: [],
      loading: false,
      oneClick: false
    };
  },
  mounted: function () {
    this.getList();
  },
  watch: {
    "interfaceTime": "reset"
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
      let _self = this;
      let interfaceId = JSON.parse(sessionStorage.getItem("interfaceId"));

      _self.selectedData = [];

      _.forEach(val, (item) => {
        _self.selectedData.push(item.id);
      });

      _.forEach(this.list, (item, index) => {
        if (_self.InArray(_self.selectedData, item.id)) {
          // 不存在session.interfaceId里面就保存到session.interfaceId
          if (!_self.InArray(interfaceId, item.id)) {
            interfaceId.push(item.id);
          }
        } else {
          //session.get_service里面存在没有选中的service_id就清除此service_id
          _.forEach(interfaceId, (subItem, j) => {
            if (subItem == item.id) {
              delete interfaceId[j];
            }
          });
        }
      });

      interfaceId = this.clearNull(interfaceId);
      sessionStorage.setItem("interfaceId", JSON.stringify(interfaceId));
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    confirm() {
      this.$emit('setPolicyIdentify', new Date());
    },
    reset() {
      this.params = {
        apiName: '', // 网元名称
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
        .get(api.netApi(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.list = response.data.neApiList;

            let interfaceId = JSON.parse(sessionStorage.getItem("interfaceId"));
            let obj = [];

            _.forEach(response.data.neApiList, (item) => {
              if (_self.InArray(interfaceId, item.id)) {
                obj.push(item);
              }
            });

            setTimeout(function () {
              _self.toggleSelection(obj);
            }, 0);
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          _self.loading = false;
          _self.oneClick = false;
        });
    }
  }
}
