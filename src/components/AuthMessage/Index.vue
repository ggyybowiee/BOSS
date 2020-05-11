<template>
  <div class="index-page" v-show="power['boss_check_authInfo']">
    <div class="form-check">
      <label>
        {{$t('终端ID')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.sn" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('客户')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.customer" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('产品名称')}}：
        <div>
          <template>
            <el-select v-model="params.productCode" filterable @change="search">
              <el-option v-for="item in productCodeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label class="product-code" v-if="operatorType == 1">
        {{$t('产品编码')}}：
        <div>
          <el-input v-model="params.productCode" :placeholder="$t('精确搜索')" disabled></el-input>
        </div>
      </label>

      <label>
        {{$t('授权状态')}}：
        <div>
          <template>
            <el-select v-model="params.status" filterable @change="search">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('支付状态')}}：
        <div>
          <template>
            <el-select v-model="params.payStatus" filterable @change="search">
              <el-option v-for="item in payStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('数据来源')}}：
        <div>
          <template>
            <el-select v-model="params.source" filterable @change="search">
              <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('订购日期')}}：
        <div style="width: 350px;">
          <div class="block">
            <el-date-picker v-model="subTime" type="datetimerange" :picker-options="pickerOptions"
              :placeholder="$t('选择时间范围')" align="right" @change="search"></el-date-picker>
          </div>
        </div>
      </label>

      <label>
        {{$t('失效日期')}}：
        <div style="width: 350px;">
          <div class="block">
            <el-date-picker v-model="invalidTime" type="datetimerange" :picker-options="pickerOptions"
              :placeholder="$t('选择时间范围')" align="right" @change="search"></el-date-picker>
          </div>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>

    <div class="button-group" v-if="operatorType == 1">
      <el-button v-show="power['boss_authinfo_batch_bmt']" @click="batchMaintenance()" type="warning">{{$t('授权信息批量维护')}}
      </el-button>
      <el-button v-show="power['boss_batch_authInfoStatus_authInfo']" @click="batchUpdate()" type="warning">
        {{$t('批量修改授权状态')}}</el-button>
      <el-button v-show="power['boss_synchro_authInfo']" @click="synchro()" type="warning">{{$t('同步')}}</el-button>
      <el-button v-show="power['boss_authinfo_download_for_excel']" @click="exportExcel()" type="warning">
        {{$t('导出授权信息')}}</el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange"
      v-if="operatorType == 1">

      <el-table-column type="selection" width="33"></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('终端ID')" show-overflow-tooltip prop="sn" min-width="100"></el-table-column>

      <el-table-column :label="$t('客户')" show-overflow-tooltip prop="customer" min-width="70">
      </el-table-column>

      <el-table-column :label="$t('产品名称')" show-overflow-tooltip min-width="100">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text">
            {{scope.row.productName}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('授权状态')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('支付状态')" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <p>{{scope.row.payStatus | filterPayStatusOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('生效时间')" show-overflow-tooltip prop="effectTime" min-width="130">
      </el-table-column>

      <el-table-column :label="$t('失效时间')" show-overflow-tooltip prop="invalidTime" min-width="130">
      </el-table-column>

      <el-table-column :label="$t('订购日期')" show-overflow-tooltip prop="subTime" min-width="130">
      </el-table-column>

      <el-table-column :label="$t('数据来源')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p v-show="scope.row.source==1">BOSS</p>
          <p v-show="scope.row.source==2">AAA</p>
        </template>
      </el-table-column>

    </el-table>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange"
      v-if="operatorType == 3">

      <el-table-column type="selection" width="33"></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('终端ID')" show-overflow-tooltip prop="sn" min-width="100"></el-table-column>

      <el-table-column :label="$t('产品名称')" show-overflow-tooltip prop="productName" min-width="100"></el-table-column>

      <el-table-column :label="$t('授权状态')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('生效时间')" show-overflow-tooltip prop="effectTime" min-width="130">
      </el-table-column>

      <el-table-column :label="$t('失效时间')" show-overflow-tooltip prop="invalidTime" min-width="130">
      </el-table-column>

    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

    <!--批量修改-->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="dialogTableVisible">
        <BatchUpdate :selectedData="selectedData" :addTime="addTime" v-on:message="search"></BatchUpdate>
      </el-dialog>
    </div>

    <!-- 查看产品 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="detailVisible" customClass="custom-dialog-width">
        <ShowDetail :detailsObj="detailsObj" :showDetailTime="showDetailTime" :statusOptions="statusOptions">
        </ShowDetail>
      </el-dialog>
    </div>

    <!-- 导出授权信息 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="exportExcelVisible" customClass="export-dialog">
        <ExportExcel :addTime="addTime" :params="params"></ExportExcel>
      </el-dialog>
    </div>

    <!-- 授权信息批量维护 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="maintenanceVisible" customClass="custom-dialog-width maintenance-dialog">
        <BatchMaintenance :selectedData="selectedData" :addTime="addTime" v-on:message="search">
        </BatchMaintenance>
      </el-dialog>
    </div>

  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
  .index-page {
    .dialog-form {
      margin-top: 20px;
    }

    .button-group {
      padding: 5px 0px 10px 0px;
      overflow: hidden;
      width: 100%;
    }
  }

</style>
