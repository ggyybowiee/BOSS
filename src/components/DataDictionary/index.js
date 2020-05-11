import api from "../../api/api";
import Add from "./Add.vue";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        dictName: "", // 字典key
        dictType: "" // 字典类型
      },
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      list: [],
      dictTypeOptions: [{
          "value": "1",
          "label": this.$t("系统参数")
        },
        {
          "value": "2",
          "label": this.$t("影片产地")
        },
        {
          "value": "3",
          "label": this.$t("声道类型")
        },
        {
          "value": "4",
          "label": this.$t("视频类型")
        },
        {
          "value": "5",
          "label": this.$t("屏幕格式")
        },
        {
          "value": "6",
          "label": this.$t("编码格式")
        },
        {
          "value": "7",
          "label": this.$t("码率")
        },
        {
          "value": "8",
          "label": this.$t("节目题材")
        },
        {
          "value": "9",
          "label": this.$t("影片语言")
        },
        {
          "value": "10",
          "label": this.$t("缩放比例")
        },
        {
          "value": "11",
          "label": this.$t("节目类型")
        },
        {
          "value": "12",
          "label": this.$t("机型")
        },
        {
          "value": "13",
          "label": this.$t("域名")
        },
        {
          "value": "14",
          "label": this.$t("套餐")
        },
        {
          "value": "15",
          "label": this.$t("加密规则")
        },
        {
          "value": "16",
          "label": this.$t("所属用户体系")
        },
        {
          "value": "17",
          "label": this.$t("国家")
        },
        {
          "value": "18",
          "label": this.$t("应用名称")
        },
        {
          "value": "19",
          "label": this.$t("问题类型")
        }
      ],
      selectedData: [],
      title: '', // 弹框标题
      addTime: '', // 监听时间变化
      detailsObj: null, // 添加/修改字典对象
      power: {
        "boss_check_dictionaryboss": false,
        "boss_delete_dictionaryboss": false,
        "boss_update_dictionaryboss": false,
        "boss_create_dictionaryboss": false
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
  },
  methods: {
    //多选
    handleSelectionChange(val) {
      this.selectedData = val;
    },
    checkboxCanSelect(row) {
      if (row.isfixed == '1') {
        return false;
      } else {
        return true;
      }
    },
    reset() {
      this.params = {
        dictName: "", // 字典key
        dictType: "" // 字典类型
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

      //搜索部分
      this.$http
        .get(api.dictionary(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.dictInfoList, (item) => {
              item.dictType = _self.Trim(item.dictType);
              item.isfixed = _self.Trim(item.isfixed);

              let offSet = _self.moment().utcOffset(); // 时差
              let formatArrProperty = ["updateTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = response.data.dictInfoList;
          } else {
            _self.message('error', response.data.errorMessage);
          }
        })
        .catch((error) => {
          console.log(error);
          _self.message('error', `${error.response.status}: ${error.response.statusText}`);
          _self.loading = false;
          _self.oneClick = false;
        });
    },
    addOrUpdateDic(row) {
      if (!row) {
        this.title = this.$t('新增字典');
      } else {
        this.title = this.$t('修改字典');
      }
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    deleteDic() {
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
          .delete(`${api.dictionary()}?id=[${ids}]`)
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
  filters: {
    filterDictTypeOptions(status) {
      let label = '';
      _.forEach(that.dictTypeOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    },
  },
  components: {
    Add: Add
  }
};
