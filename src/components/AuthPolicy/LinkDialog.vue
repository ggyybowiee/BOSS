<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('未关联终端信息')" name="nLinkAuthPolicy">
        <template>
          <el-button @click="ref(1)" v-show="power['boss_authpolicy_relate_terminal']" type="warning">{{$t('关联')}}
          </el-button>
          <div class="form-check">
            <label>{{$t('机顶盒终端ID')}}：
              <div>
                <el-input @keyup.enter.native="getList(nLinkAuthPolicy.params)" v-model="nLinkAuthPolicy.params.sn"
                  :placeholder="$t('模糊搜索')"></el-input>
              </div>
            </label>

            <label>{{$t('MAC地址')}}：
              <div>
                <el-input @keyup.enter.native="getList(nLinkAuthPolicy.params)" v-model="nLinkAuthPolicy.params.macAddr"
                  :placeholder="$t('精确搜索')"></el-input>
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

            <el-table-column :label="$t('机顶盒终端ID')" show-overflow-tooltip prop="sn" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('MAC地址')" show-overflow-tooltip prop="macAddr" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('终端状态')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p>{{scope.row.status | filterTerminalStatusptions}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('所属客户')" show-overflow-tooltip prop="customer" min-width="100">
            </el-table-column>
          </el-table>

          <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-number="nLinkAuthPolicy.params.pageNum" :page-size="nLinkAuthPolicy.params.pageSize"></v-pagination>

        </template>
      </el-tab-pane>

      <el-tab-pane :label="$t('已关联终端信息')" name="yLinkAuthPolicy">
        <template>
          <el-button @click="ref(0)" v-show="power['boss_authpolicy_unrelate_terminal']" type="warning">{{$t('取消关联')}}
          </el-button>
          <el-button @click="synchro()" style="margin-bottom: 5px;" v-show="power['boss_synchro_authpolicy']"
            type="warning">{{$t('同步')}}
          </el-button>
          <div class="form-check">
            <label>{{$t('机顶盒终端ID')}}：
              <div>
                <el-input @keyup.enter.native="getList(yLinkAuthPolicy.params)" v-model="yLinkAuthPolicy.params.sn"
                  :placeholder="$t('模糊搜索')"></el-input>
              </div>
            </label>

            <label>{{$t('MAC地址')}}：
              <div>
                <el-input @keyup.enter.native="getList(yLinkAuthPolicy.params)" v-model="yLinkAuthPolicy.params.macAddr"
                  :placeholder="$t('精确搜索')"></el-input>
              </div>
            </label>

            <label>
              {{$t('状态')}}：
              <div>
                <template>
                  <el-select v-model="yLinkAuthPolicy.params.status" filterable
                    @change="getList(yLinkAuthPolicy.params)">
                    <el-option v-for="item in terminalStatus" :key="item.value" :label="item.label" :value="item.value">
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

            <el-table-column :label="$t('机顶盒终端ID')" show-overflow-tooltip prop="sn" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('MAC地址')" show-overflow-tooltip prop="macAddr" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('终端状态')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p>{{scope.row.status | filterTerminalStatusptions}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('所属客户')" show-overflow-tooltip prop="customer" min-width="100">
            </el-table-column>
          </el-table>

          <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-number="yLinkAuthPolicy.params.pageNum" :page-size="yLinkAuthPolicy.params.pageSize"></v-pagination>

        </template>
      </el-tab-pane>

      <el-tab-pane :label="$t('未关联产品')" name="nLinkProduct">
        <template>
          <el-button @click="ref(1)" v-show="power['boss_authpolicy_relate_product']" type="warning">{{$t('关联')}}
          </el-button>
          <div class="form-check">
            <label>{{$t('产品名称')}}：
              <div>
                <el-input @keyup.enter.native="getList(nLinkProduct.params)" v-model="nLinkProduct.params.productName"
                  :placeholder="$t('模糊搜索')"></el-input>
              </div>
            </label>

            <label>{{$t('产品编码')}}：
              <div>
                <el-input @keyup.enter.native="getList(nLinkProduct.params)" v-model="nLinkProduct.params.productCode"
                  :placeholder="$t('精确搜索')"></el-input>
              </div>
            </label>

            <label>
              {{$t('状态')}}：
              <div>
                <template>
                  <el-select v-model="nLinkProduct.params.status" filterable @change="getList(nLinkProduct.params)">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </div>
            </label>
            <el-button :disabled="oneClick" @click="getList(nLinkProduct.params)" type="warning">{{$t('查询')}}
            </el-button>
            <el-button :disabled="oneClick" @click="reset_search()" type="warning">{{$t('重置')}}</el-button>
          </div>

          <el-table class="select-table" ref="multipleTable" :data="nLinkProduct.list" border tooltip-effect="dark"
            style="width: 100%" @selection-change="handleSelectionChange" v-loading.lock="loading"
            :element-loading-text="$t('拼命加载中')">

            <el-table-column type="selection" width="33"></el-table-column>

            <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

            <el-table-column :label="$t('产品名称')" show-overflow-tooltip prop="productName" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('产品编码')" show-overflow-tooltip prop="productCode" min-width="200">
            </el-table-column>

            <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
                <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('计费类型')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p>{{scope.row.chargeType | filterChargeTypeOptions}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('计费周期')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p>{{scope.row.chargeCycle}}{{scope.row.chargeUnit | filterChargeUnitOptions}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('价格($)')" show-overflow-tooltip prop="price" min-width="70">
            </el-table-column>

            <el-table-column :label="$t('授权天数')" min-width="70">
              <template scope="scope">
                <el-input type="input" v-model.number="scope.row.authDay" size="mini"
                  onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                  :disabled="detailsObj.releaseStatus == 2"></el-input>
              </template>
            </el-table-column>

          </el-table>

          <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-number="nLinkProduct.params.pageNum" :page-size="nLinkProduct.params.pageSize"></v-pagination>

        </template>
      </el-tab-pane>

      <el-tab-pane :label="$t('已关联产品')" name="yLinkProduct">
        <template>
          <el-button @click="ref(0)" v-show="power['boss_authpolicy_unrelate_product']" type="warning">{{$t('取消关联')}}
          </el-button>
          <div class="form-check">
            <label>{{$t('产品名称')}}：
              <div>
                <el-input @keyup.enter.native="getList(yLinkProduct.params)" v-model="yLinkProduct.params.productName"
                  :placeholder="$t('模糊搜索')"></el-input>
              </div>
            </label>

            <label>{{$t('产品编码')}}：
              <div>
                <el-input @keyup.enter.native="getList(yLinkProduct.params)" v-model="yLinkProduct.params.productCode"
                  :placeholder="$t('精确搜索')"></el-input>
              </div>
            </label>

            <label>
              {{$t('状态')}}：
              <div>
                <template>
                  <el-select v-model="yLinkProduct.params.status" filterable @change="getList(yLinkProduct.params)">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </div>
            </label>
            <el-button :disabled="oneClick" @click="getList(yLinkProduct.params)" type="warning">{{$t('查询')}}
            </el-button>
            <el-button :disabled="oneClick" @click="reset_search()" type="warning">{{$t('重置')}}</el-button>
          </div>

          <el-table class="select-table" ref="multipleTable" :data="yLinkProduct.list" border tooltip-effect="dark"
            style="width: 100%" @selection-change="handleSelectionChange" v-loading.lock="loading"
            :element-loading-text="$t('拼命加载中')">

            <el-table-column type="selection" width="33"></el-table-column>

            <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

            <el-table-column :label="$t('产品名称')" show-overflow-tooltip prop="productName" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('产品编码')" show-overflow-tooltip prop="productCode" min-width="200">
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
            :page-number="yLinkProduct.params.pageNum" :page-size="yLinkProduct.params.pageSize"></v-pagination>

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
