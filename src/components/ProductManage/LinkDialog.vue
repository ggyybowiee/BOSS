<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('未关联套餐')" name="nLink">
        <template>
          <el-button @click="ref(1)" v-show="power['boss_product_relate_package']" type="warning">{{$t('关联')}}
          </el-button>
          <div class="form-check">
            <label>{{$t('套餐名称')}}：
              <div>
                <el-input @keyup.enter.native="getList(nLink.params)" v-model="nLink.params.packageName"
                  :placeholder="$t('模糊搜索')"></el-input>
              </div>
            </label>

            <label>{{$t('套餐编码')}}：
              <div>
                <el-input @keyup.enter.native="getList(nLink.params)" v-model="nLink.params.packageCode"
                  :placeholder="$t('精确搜索')"></el-input>
              </div>
            </label>

            <label>
              {{$t('状态')}}：
              <div>
                <template>
                  <el-select v-model="nLink.params.status" filterable @change="getList(nLink.params)">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </div>
            </label>
            <el-button :disabled="oneClick" @click="getList(nLink.params)" type="warning">{{$t('查询')}}
            </el-button>
            <el-button :disabled="oneClick" @click="reset_search()" type="warning">{{$t('重置')}}</el-button>
          </div>

          <el-table class="select-table" ref="multipleTable" :data="nLink.list" border tooltip-effect="dark"
            style="width: 100%" @selection-change="handleSelectionChange" v-loading.lock="loading"
            :element-loading-text="$t('拼命加载中')">

            <el-table-column type="selection" width="33"></el-table-column>

            <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

            <el-table-column :label="$t('套餐名称')" show-overflow-tooltip prop="packageName" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('套餐编码')" show-overflow-tooltip prop="packageCode" min-width="200">
            </el-table-column>

            <el-table-column :label="$t('计费周期')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p>{{scope.row.chargeCycle}}{{scope.row.chargeUnit | filterChargeUnitOptions}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('价格($)')" show-overflow-tooltip prop="price" min-width="70">
            </el-table-column>

            <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
                <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
              </template>
            </el-table-column>

          </el-table>

          <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-number="nLink.params.pageNum" :page-size="nLink.params.pageSize"></v-pagination>

        </template>
      </el-tab-pane>

      <el-tab-pane :label="$t('已关联套餐')" name="yLink">
        <template>
          <el-button @click="ref(0)" v-show="power['boss_product_unrelate_package']" type="warning">{{$t('取消关联')}}
          </el-button>
          <div class="form-check">
            <label>{{$t('套餐名称')}}：
              <div>
                <el-input @keyup.enter.native="getList(yLink.params)" v-model="yLink.params.packageName"
                  :placeholder="$t('模糊搜索')"></el-input>
              </div>
            </label>

            <label>{{$t('套餐编码')}}：
              <div>
                <el-input @keyup.enter.native="getList(yLink.params)" v-model="yLink.params.packageCode"
                  :placeholder="$t('精确搜索')"></el-input>
              </div>
            </label>

            <label>
              {{$t('状态')}}：
              <div>
                <template>
                  <el-select v-model="yLink.params.status" filterable @change="getList(yLink.params)">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </div>
            </label>
            <el-button :disabled="oneClick" @click="getList(yLink.params)" type="warning">{{$t('查询')}}
            </el-button>
            <el-button :disabled="oneClick" @click="reset_search()" type="warning">{{$t('重置')}}</el-button>
          </div>

          <el-table class="select-table" ref="multipleTable" :data="yLink.list" border tooltip-effect="dark"
            style="width: 100%" @selection-change="handleSelectionChange" v-loading.lock="loading"
            :element-loading-text="$t('拼命加载中')">

            <el-table-column type="selection" width="33"></el-table-column>

            <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

            <el-table-column :label="$t('套餐名称')" show-overflow-tooltip prop="packageName" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('套餐编码')" show-overflow-tooltip prop="packageCode" min-width="200">
            </el-table-column>

            <el-table-column :label="$t('计费周期')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p>{{scope.row.chargeCycle}}{{scope.row.chargeUnit | filterChargeUnitOptions}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('价格($)')" show-overflow-tooltip prop="price" min-width="70">
            </el-table-column>

            <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
                <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
              </template>
            </el-table-column>

          </el-table>

          <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-number="yLink.params.pageNum" :page-size="yLink.params.pageSize"></v-pagination>

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
