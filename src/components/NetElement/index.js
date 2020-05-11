import api from "../../api/api";
import Add from "./Add.vue";
import Policy from "./Policy.vue";
import AddPolicy from "./AddPolicy.vue";
import Interface from "./Interface.vue";

'use strict';
export default {
  data() {
    return {
      params: {
        neName: "", // 网元名称
        status: "", // 网元状态
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      linkPolicyVisible: false,
      addPolicyTableVisible: false,
      interfaceVisible: false,
      interfaceTime: '',
      addPolicyTime: '',
      addPolicyInterfaceTime: '',
      clickShowRemark: false, // 点击查看描述信息 
      linkPolicyNeName: '',
      list: [],
      statusOptions: [{
          label: this.$t('全部'),
          value: ""
        },
        {
          label: this.$t('可用'),
          value: "1"
        },
        {
          label: this.$t('不可用'),
          value: "0"
        }
      ],
      selectedData: [],
      policyTitle: '',
      title: '', // 弹框标题
      addTime: '', // 监听时间变化
      policyTime: '',
      detailsObj: null, // 添加/修改对象
      power: {
        "boss_check_neSyncPolicy": false,
        "boss_delete_neSyncPolicy": false,
        "boss_update_neSyncPolicy": false,
        "boss_create_neSyncPolicy": false,
        "boss_check_netelement": false,
        "boss_delete_netelement": false,
        "boss_update_netelement": false,
        "boss_create_netelement": false,
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
      this.title = this.$t('描述信息');
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
      this.clickShowRemark = true;
    },
    reset() {
      this.params = {
        neName: "", // 网元名称
        status: "", // 网元状态
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
        .get(api.netElementInfo(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.neInfoList, (item) => {
              let offSet = _self.moment().utcOffset(); // 时差

              let formatArrProperty = ["updateTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });
            _self.list = response.data.neInfoList;
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
    addOrUpdateNet(row) {
      if (!row) {
        this.title = this.$t('新增网元');
      } else {
        this.title = this.$t('修改网元');
      }
      this.clickShowRemark = false;
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    linkPolicy(row) {
      this.linkPolicyNeName = _.get(row, 'neName');
      this.policyTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.linkPolicyVisible = true;
    },
    deleteNet() {
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
          .delete(`${api.netElementInfo()}?id=[${ids}]`)
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
    addPolicyModel() {
      if (sessionStorage.getItem("clickType") == '1') {
        this.policyTitle = this.$t('新增策略');
      } else if (sessionStorage.getItem("clickType") == '2') {
        this.policyTitle = this.$t('修改策略');
      } else if (sessionStorage.getItem("clickType") == '3') {
        this.policyTitle = this.$t('描述信息');
      }
      this.addPolicyTableVisible = true;
      this.addPolicyTime = new Date();
    },
    getPolicy() {
      this.addPolicyTableVisible = false;
      this.policyTime = new Date();
    },
    getPolicyIdentify() {
      this.interfaceVisible = true;
      this.interfaceTime = new Date();
    },
    setPolicyIdentify() {
      this.interfaceVisible = false;
      this.addPolicyInterfaceTime = new Date();
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
    Add,
    Policy,
    AddPolicy,
    Interface
  }
};
