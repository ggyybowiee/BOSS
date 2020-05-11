<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('未关联授权策略')" name="nLinkAuthPolicy">
        <template>
          <el-button @click="ref(1)" v-show="power['boss_terminal_relate_authpolicy']" type="warning">{{$t('关联')}}
          </el-button>
          <div class="form-check">
            <label>{{$t('策略名称')}}：
              <div>
                <el-input @keyup.enter.native="getList(nLinkAuthPolicy.params)" v-model="nLinkAuthPolicy.params.name"
                  :placeholder="$t('模糊搜索')"></el-input>
              </div>
            </label>

            <label>
              {{$t('状态')}}：
              <div>
                <template>
                  <el-select v-model="nLinkAuthPolicy.params.status" filterable
                    @change="getList(nLinkAuthPolicy.params)">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </div>
            </label>
            <el-button :disabled="oneClick" @click="getList(nLinkAuthPolicy.params)" type="warning">{{$t('查询')}}
            </el-button>
            <el-button :disabled="oneClick" @click="reset_search()" type="warning">{{$t('重置')}}</el-button>
          </div>

          <el-table class="select-table" ref="multipleTable" :data="nLinkAuthPolicy.list" border tooltip-effect="dark"
            style="width: 100%" @selection-change="handleSelectionChange" v-loading.lock="loading"
            :element-loading-text="$t('拼命加载中')">

            <el-table-column type="selection" width="33"></el-table-column>

            <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

            <el-table-column :label="$t('策略名称')" show-overflow-tooltip prop="name" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('周期')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p>{{scope.row.authCycle}}{{scope.row.authUnit | filterChargeUnitOptions}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
                <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
              </template>
            </el-table-column>
          </el-table>

          <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-number="nLinkAuthPolicy.params.pageNum" :page-size="nLinkAuthPolicy.params.pageSize"></v-pagination>

        </template>
      </el-tab-pane>

      <el-tab-pane :label="$t('已关联授权策略')" name="yLinkAuthPolicy">
        <template>
          <el-button @click="ref(0)" v-show="power['boss_terminal_unrelate_authpolicy']" type="warning">{{$t('取消关联')}}
          </el-button>
          <div class="form-check">
            <label>{{$t('策略名称')}}：
              <div>
                <el-input @keyup.enter.native="getList(yLinkAuthPolicy.params)" v-model="yLinkAuthPolicy.params.name"
                  :placeholder="$t('模糊搜索')"></el-input>
              </div>
            </label>

            <label>
              {{$t('状态')}}：
              <div>
                <template>
                  <el-select v-model="yLinkAuthPolicy.params.status" filterable
                    @change="getList(yLinkAuthPolicy.params)">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </div>
            </label>
            <el-button :disabled="oneClick" @click="getList(yLinkAuthPolicy.params)" type="warning">{{$t('查询')}}
            </el-button>
            <el-button :disabled="oneClick" @click="reset_search()" type="warning">{{$t('重置')}}</el-button>
          </div>

          <el-table class="select-table" ref="multipleTable" :data="yLinkAuthPolicy.list" border tooltip-effect="dark"
            style="width: 100%" @selection-change="handleSelectionChange" v-loading.lock="loading"
            :element-loading-text="$t('拼命加载中')">

            <el-table-column type="selection" width="33"></el-table-column>

            <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

            <el-table-column :label="$t('策略名称')" show-overflow-tooltip prop="name" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('周期')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p>{{scope.row.authCycle}}{{scope.row.authUnit | filterChargeUnitOptions}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
                <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
              </template>
            </el-table-column>
          </el-table>

          <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-number="yLinkAuthPolicy.params.pageNum" :page-size="yLinkAuthPolicy.params.pageSize"></v-pagination>

        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script src="./linkDialog.js"></script>
<style>
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #1f2d3d;
    background: #1f2d3d;
  }

  td.el-table_1_column_11 label.el-radio {
    margin-left: -3px;
  }

</style>
