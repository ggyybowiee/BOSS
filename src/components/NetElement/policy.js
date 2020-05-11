import api from "../../api/api";

'use strict';
export default {
  props: ["detailsObj", "power", "policyTime"],
  data() {
    return {
      params: {
        neId: '',
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      clickShowRemark: false, // 点击查看描述信息 
      selectedData: [],
      dialogTableVisible: false,
      title: '', // 弹框标题
      policyAddTime: '', // 监听时间变化
      policyDetailsObj: {}, // 添加/修改对象
      loading: false
    };
  },
  mounted: function () {
    this.getList();
    this.policyDetailsObj.neId = _.get(this.detailsObj, 'id');
  },
  watch: {
    "policyTime": "getList"
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
      this.selectedData = val;
    },
    // 查看
    details(row) {
      sessionStorage.setItem("clickType", '3');
      this.policyDetailsObj = _.assign(this.policyDetailsObj, row);
      sessionStorage.setItem("clickNetObj", JSON.stringify(this.policyDetailsObj));
      this.$emit('addPolicy', new Date());
    },
    getList() {
      let _self = this;
      _self.loading = true;
      _self.params.neId = _.get(this.detailsObj, 'id');

      //搜索部分
      this.$http
        .get(api.neSyncPolicy(), {
          params: _self.params
        })
        .then((response) => {
          _self.loading = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.neSyncPolicyList, (item) => {
              let offSet = _self.moment().utcOffset(); // 时差
              let formatArrProperty = ["updateTime", "createTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = response.data.neSyncPolicyList;
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          _self.loading = false;
        });
    },
    addOrUpdatePolicy(row) {
      if (!row) {
        sessionStorage.setItem("clickType", '1'); // 新增
        this.policyDetailsObj = {
          neId: _.get(this.detailsObj, 'id')
        };
      } else {
        this.policyDetailsObj = _.assign(this.policyDetailsObj, row);
        sessionStorage.setItem("clickType", '2'); // 修改
      }
      sessionStorage.setItem("clickNetObj", JSON.stringify(this.policyDetailsObj));
      this.$emit('addPolicy', new Date());
    },
    deletePolicy() {
      let _self = this;
      let ids = [];

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选删除数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        ids.push(item.id);
      });

      this.$confirm(this.$t('删除数据后不可恢复，是否确认删除？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        // 删除字典
        this.$http
          .delete(`${api.neSyncPolicy()}?id=[${ids}]`)
          .then((response) => {
            if (response.data.returnCode == 0) {
              _self.message('success', _self.$t('删除成功！'));
              _self.getList();
            } else {
              _self.message('error', response.data.errorMessage);
            }
          })
          .catch((error) => {
            _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          });
      }).catch(() => {});
    }
  }
}
