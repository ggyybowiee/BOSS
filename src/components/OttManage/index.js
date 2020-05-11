import api from "../../api/api";
import Add from "./Add.vue";
import ShowDetail from "./ShowDetail.vue";
import OttBindTerminal from "./OttBindTerminal.vue";

'use strict';
let that;
export default {
  data() {
    return {
      params: {
        userName: "", // 用户名
        area: "", // 归属区域
        source: "", // 数据来源
        status: "", // 状态
        beginCreateTime: "",
        endCreateTime: "",
        pageNum: 1,
        pageSize: 10
      },
      searchData: {},
      loading: true,
      oneClick: false,
      dialogTableVisible: false,
      addTime: '',
      ottBindTerminalTime: '',
      showDetailTime: '',
      updateSnTime: '',
      detailVisible: false,
      ottBindTerminalVisible: false,
      title: '',
      list: [],
      time: [],
      sourceOptions: [{
        label: this.$t('全部'),
        value: ""
      }, {
        label: "BOSS",
        value: "1"
      }, {
        label: "AAA",
        value: "2"
      }],
      statusOptions: [{
          label: this.$t('全部'),
          value: ""
        }, {
          label: this.$t('禁用'),
          value: "0"
        },
        {
          label: this.$t('启用'),
          value: "1"
        }
      ],
      pickerOptions: {
        shortcuts: [{
            text: this.$t('最近一周'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t('最近一个月'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t('最近三个月'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      selectedData: [],
      title: '', // 弹框标题
      detailsObj: null, // 添加/修改对象
      power: {
        "boss_check_ottmanage": false,
        "boss_create_ottmanage": false, // 新增OTT用户暂时不用了，需要的时候在cas权限树新增该资源编码，代码暂时保留新增功能
        "boss_update_ottmanage": false,
        "boss_synchro_ottmanage": false
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
    addOrUpdate(row) {
      if (!row) {
        this.title = this.$t('新增OTT用户');
      } else {
        this.title = this.$t('修改OTT用户');
      }
      this.addTime = new Date();
      this.detailsObj = _.cloneDeep(row);
      this.dialogTableVisible = true;
    },
    // 查看
    details(row, type) {
      if (type == 'sn') {
        this.title = this.$t('详情');
      } else {
        this.title = this.$t('查看OTT用户');
      }
      sessionStorage.setItem('type', type);
      this.detailsObj = _.cloneDeep(row);
      this.showDetailTime = new Date();
      this.detailVisible = true;
    },
    synchro() {
      let _self = this;
      let params = {
        type: "2",
        typeId: []
      };

      if (_self.selectedData.length == 0) {
        _self.message('info', _self.$t('请先勾选需要同步的数据！'));
        return;
      }

      _.forEach(_self.selectedData, (item) => {
        params.typeId.push(item.userCode);
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
    reset() {
      this.params = {
        userName: "", // 用户名
        area: "", // 归属区域
        source: "", // 数据来源
        status: "", // 状态
        beginCreateTime: "",
        endCreateTime: "",
        pageNum: 1,
        pageSize: 10
      };
      this.time = [];

      this.search();
    },
    search() {
      let _self = this;

      if (this.time && this.time.length > 0 && this.time[0]) {
        this.params["beginCreateTime"] = _self.moment(_.get(_self, 'time[0]')).utc().format('YYYY-MM-DD HH:mm:ss');
        this.params["endCreateTime"] = _self.moment(_.get(_self, 'time[1]')).utc().format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.params["beginCreateTime"] = "";
        this.params["endCreateTime"] = "";
      }

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
        .get(api.ottAccount(), {
          params: _self.searchData
        })
        .then((response) => {
          _self.loading = false;
          _self.oneClick = false;
          if (response.data.returnCode == 0) {
            _.forEach(response.data.ottAccountInfoList, (item) => {
              let offSet = _self.moment().utcOffset(); // 时差
              let formatArrProperty = ["createTime"];

              _.forEach(formatArrProperty, (property) => {
                if (item[property]) {
                  item[property] = _self.moment(item[property]).add(offSet, 'm').format(
                    'YYYY-MM-DD HH:mm:ss');
                }
              });
            });

            _self.list = response.data.ottAccountInfoList;
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
    showOttBindTerminal() {
      this.title = this.$t('OTT账户绑定终端信息');
      this.ottBindTerminalTime = new Date();
      this.ottBindTerminalVisible = true;
    },
    setSn() {
      this.updateSnTime = new Date();
      this.ottBindTerminalVisible = false;
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
    filterStatusOptions(status) {
      let label = '';
      _.forEach(that.statusOptions, (item) => {
        if (item.value == status) {
          label = item.label;
        }
      });
      return label;
    }
  },
  components: {
    Add,
    ShowDetail,
    OttBindTerminal
  }
};
