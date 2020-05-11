import api from "../../api/api";
import Add from "./Add.vue";

'use strict';
export default {
  data() {
    return {
      params: {
        appId: "", // 应用ID
        status: "", // 状态
        productCode: "", // 产品编码
        area: "", // 区域范围
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      appIdOptions: [],
      statusOptions: [{
          label: this.$t('全部'),
          value: ""
        },
        {
          label: this.$t('禁用'),
          value: "0"
        },
        {
          label: this.$t('启用'),
          value: "1"
        }
      ],
      productCodeOptions: [],
      areaOptions: [],
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      list: [],
      selectedData: [],
      title: '', // 弹框标题
      addTime: '', // 监听时间变化
      detailsObj: null, // 添加/修改
      power: {
        "boss_check_free": false,
        "boss_delete_free": false,
        "boss_update_free": false,
        "boss_synchro_free": false,
        "boss_add_free": false
      }
    };
  },
  mounted() {
    document.title = this.$t("ues");
    let _self = this;
    this.tree();

    setTimeout(() => {
      _self.search();
    }, 100);

    this.getAppId();
    this.getProductList();
    this.getAreaList();
  },
  methods: {
    // 获取应用ID
    getAppId() {
      let _self = this;

      this.$http
        .get(api.portalInfo())
        .then((response) => {
          if (response.data.returnCode == 0) {
            _.forEach(response.data.portalInfoList, item => {
              _self.appIdOptions.push({
                label: item.appId,
                value: item.appId
              });
            });
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
    // 获取产品列表
    getProductList() {
      let _self = this;

      let params = {
        pageNum: 1,
        pageSize: 1000,
        relateType: 1
      };

      this.$http
        .get(api.product(), {
          params
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            _.forEach(response.data.data, item => {
              _self.productCodeOptions.push({
                value: item.productCode,
                label: item.productName
              });
            });
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
    // 查询字典国家类型
    getAreaList() {
      let _self = this;

      let field = {
        flag: 0
      };

      this.$http
        .get(api.dictionary(), {
          params: field
        })
        .then((response) => {
          if (response.data.returnCode == 0) {
            let arr = _.filter(response.data.dictInfoList, function (item) {
              return (item.dictType).replace(/\s+/g, "") == '17';
            });

            _.forEach(arr, item => {
              _self.areaOptions.push({
                label: item.dictValue,
                value: item.dictName
              });
            });
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
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
    reset() {
      this.params = {
        appId: "", // 应用ID
        status: "", // 状态
        productCode: "", // 产品编码
        area: "", // 区域范围
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
        .get(api.freeProduct(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.list = response.data.freeProductInfoList;
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
    addOrUpdateFree(row) {
      if (!row) {
        this.title = this.$t('新增');
      } else {
        this.title = this.$t('修改');
      }
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    synchroFree() {
      let _self = this;
      let params = {
        type: "8",
        typeId: []
      };

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选需要同步的数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        params.typeId.push(item.id);
      });

      this.$http
        .post(api.noticeSyncMetadata(), params)
        .then((response) => {
          if (response.data.returnCode == 0) {
            _self.message('success', _self.$t('同步成功！'));
            _self.search();
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
    },
    deleteFree(row) {
      let _self = this;
      this.$confirm(this.$t('删除数据后不可恢复，是否确认删除？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        // 删除字典
        this.$http
          .delete(`${api.freeProduct()}?id=${row.id}`)
          .then((response) => {
            if (response.data.returnCode == 0) {
              _self.message('success', _self.$t('删除成功！'));
              _self.search();
            } else {
              _self.message('error', response.data.errorMessage);
            }
          })
          .catch((error) => {
            _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          });
      }).catch(() => {});
    },
    tree() {
      let _self = this;
      let tree = [];
      this.getResourceTree((data) => {
        if (data !== "error") {
          _self.Refining(data, tree, "boss");
          for (let key in _self.power) {
            _self.power[key] = _self.InArray(tree, key);
          }
        }
      });
    },
    Refining(arJsonNesting, arJson, str) {
      for (let i = 0, j = arJson.length; i < arJsonNesting.length; i++) {
        if (arJsonNesting[i].resourceCode !== null) {
          if (arJsonNesting[i].resourceCode.indexOf(str) !== -1) {
            arJson.push(arJsonNesting[i].resourceCode);
          }
        }
        j++;
        if (arJsonNesting[i].children) {
          this.Refining(arJsonNesting[i].children, arJson, str);
        }
      }
    }
  },
  components: {
    Add: Add
  }
};
