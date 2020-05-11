import api from "../../api/api";
import Add from "./Add.vue";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        type_zh: "",
        belong_type: '',
        public_status: '',
        pkg: '',
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      typeOptions: [],
      appIdOptions: [],
      releaseStatusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('未发布'),
          value: "0"
        },
        {
          label: this.$t('已发布'),
          value: "1"
        }
      ],
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      list: [],
      selectedData: [],
      title: '', // 弹框标题
      addTime: '', // 监听时间变化
      detailsObj: null, // 添加/修改字典对象
      power: {
        "boss_check_help_classify": false,
        "boss_delete_help_classify": false,
        "boss_release_help_classify": false,
        "boss_update_help_classify": false,
        "boss_create_help_classify": false
      }
    };
  },
  beforeCreate: function () {
    that = this;
  },
  mounted() {
    document.title = this.$t("ues");
    let _self = this;
    this.tree();

    setTimeout(() => {
      _self.search();
    }, 100);

    this.getDictionaryList();
    this.getAppIdList();
  },
  methods: {
    // 获取appId列表
    getAppIdList() {
      let _self = this;

      this.$http
        .get(api.getAppIdList())
        .then((response) => {
          if (response.data.returnCode == 0) {
            _.forEach(response.data.data, item => {
              _self.appIdOptions.push({
                label: item.pkg,
                value: item.pkg
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
    // 获取字典
    getDictionaryList() {
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
              return (item.dictType).replace(/\s+/g, "") == '19';
            });

            _.forEach(arr, item => {
              _self.typeOptions.push({
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
        type_zh: "",
        belong_type: '',
        public_status: '',
        pkg: '',
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
        .get(api.getHelpClassify(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _self.list = response.data.data;
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
    addOrUpdate(row) {
      if (!row) {
        this.title = this.$t('新增分类');
      } else {
        this.title = this.$t('修改分类');
      }
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    remove() {
      let _self = this;
      let ids = [];
      let names = [];

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选删除数据！'));
        return;
      }

      let toDeleteIds = []
      _.forEach(_self.selectedData, (item) => {
        if (item.public_status != 1) {
          toDeleteIds.push(item);
        }
      });

      if (toDeleteIds.length === 0) {
        _self.message('error', _self.$t('没有可删除的分类，请勾选未发布的分类再执行删除操作'));
        return;
      }

      _.forEach(toDeleteIds, (item) => {
        ids.push(item.id);
        names.push(item.type_zh);
      });

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t('提示'),
        message: h('p', null, [
          h('span', null, `${this.$t('分类删除后，其关联的所有帮助问题将会删除，请确认是否删除以下分类？')}`),
          h('p', {
            style: 'color: teal; margin-top: 10px'
          }, `${names.join(', ')}`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .delete(`${api.getHelpClassify()}?id_list=[${ids}]`)
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
    release(type) { //1:发布，0：取消发布
      let _self = this;
      let params = {
        id_list: [],
        release_status: type
      }

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        params.id_list.push(item.id);
      });

      this.$http.put(api.releaseType(), params)
        .then(function (response) {
          if (response.data.returnCode == '0') {
            _self.message('success', _self.$t('操作成功！'));
            _self.search();
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch(function (error) {
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
        });
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
  filters: {
    filterTypeOptions(type) {
      let label = '';
      _.forEach(that.typeOptions, (item) => {
        if (item.value == type) {
          label = item.label;
        }
      });
      return label;
    }
  },
  components: {
    Add: Add
  }
};
