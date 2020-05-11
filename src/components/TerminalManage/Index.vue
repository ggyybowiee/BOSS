<template>
  <div class="index-page" v-show="power['boss_check_terminal']">
    <div class="form-check">
      <label>
        {{$t('终端ID')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.sn" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label v-if="operatorType == 1">
        MAC：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.macAddr" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('类型')}}：
        <div>
          <template>
            <el-select v-model="params.type" filterable @change="search">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('终端状态')}}：
        <div>
          <template>
            <el-select v-model="params.status" filterable @change="search">
              <el-option :label="$t('全部')" value=""></el-option>
              <el-option v-for="item in terminalStatusOptions" :key="item.value" :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('所属客户')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.customer" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('白名单销售区域')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.whtieSealArea" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('黑名单销售区域')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.blackSealArea" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('市场状态')}}：
        <div>
          <template>
            <el-select v-model="params.useStatus" filterable @change="search">
              <el-option v-for="item in useStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label v-if="operatorType == 1">
        {{$t('机型')}}：
        <div>
          <template>
            <el-select v-model="params.tmodel" filterable @change="search">
              <el-option v-for="item in tmodelOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('激活时间')}}：
        <div style="width: 350px;">
          <div class="block">
            <el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions"
              :placeholder="$t('选择时间范围')" align="right" @change="search"></el-date-picker>
          </div>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>

    <div class="button-group" v-if="operatorType == 1">
      <el-button v-show="power['boss_create_terminal']" @click="addOrUpdate('')" type="warning">{{$t('新增终端用户')}}
      </el-button>
      <el-button v-show="power['boss_batch_terminal']" @click="batchUpdate(1)" type="warning">
        {{$t('批量修改市场状态')}}
      </el-button>
      <el-button v-show="power['boss_batch_update_terminal_status']" @click="batchUpdate(2)" type="warning">
        {{$t('批量修改终端状态')}}
      </el-button>
      <el-button v-show="power['boss_batch_update_terminal_customer']" @click="batchUpdate(3)" type="warning">
        {{$t('批量修改终端ID所属客户')}}
      </el-button>
      <el-button v-show="power['boss_batch_update_terminal_policy']" @click="batchUpdate(4)" type="warning">
        {{$t('批量修改终端关联策略')}}
      </el-button>
      <el-button v-show="power['boss_synchro_terminal']" @click="synchro()" type="warning">
        {{$t('同步')}}
      </el-button>
      <el-button v-show="power['boss_Exportfile_terminal']" @click="exportExcel()" type="warning">
        {{$t('导出终端信息')}}
      </el-button>
      <el-button v-show="power['boss_delete_terminal']" @click="remove()" type="warning">
        {{$t('删除')}}
      </el-button>
      <el-button style="margin-bottom: 5px;" v-show="power['boss_account_terminal']" @click="batchAddAccount()"
        type="warning">
        {{$t('批量生成账号')}}
      </el-button>
    </div>

    <div class="button-group" v-if="operatorType == 3">
      <el-button style="margin-bottom: 5px;" v-show="power['boss_batch_terminal']" @click="batchUpdate(1)"
        type="warning">
        {{$t('批量修改市场状态')}}
      </el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange"
      v-if="operatorType == 1">

      <el-table-column type="selection" width='33'></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('终端ID')" show-overflow-tooltip prop="sn" min-width="200"></el-table-column>

      <el-table-column :label="$t('终端状态')" show-overflow-tooltip min-width="100">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.status!=2 && scope.row.status!=1">
            {{scope.row.status | filterTerminalStatusOptions}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==2">
            {{scope.row.status | filterTerminalStatusOptions}}</p>
          <p style="color: rgb(255, 215, 0);" v-show="scope.row.status==1">
            {{scope.row.status | filterTerminalStatusOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('所属客户')" show-overflow-tooltip prop="customer" min-width="200"></el-table-column>

      <el-table-column :label="$t('激活时间')" show-overflow-tooltip prop="activeTime" min-width="180"></el-table-column>

      <el-table-column :label="$t('市场状态')" show-overflow-tooltip min-width="100">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.useStatus==2">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.useStatus==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('白名单销售区域')" show-overflow-tooltip prop="whiteSealArea" min-width="180">
      </el-table-column>

      <el-table-column :label="$t('黑名单销售区域')" show-overflow-tooltip prop="blackSealArea" min-width="180">
      </el-table-column>

      <el-table-column :label="$t('跨区域')" show-overflow-tooltip min-width="100">
        <template scope="scope">
          <p v-show="scope.row.crossAllow==0">{{$t('不允许')}}</p>
          <p v-show="scope.row.crossAllow==1">{{$t('允许')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('黑名单生效时间')" show-overflow-tooltip prop="blackSealEffTime" min-width="180">
      </el-table-column>

      <el-table-column :label="$t('黑名单失效时间')" show-overflow-tooltip prop="blackSealFailTime" min-width="180">
      </el-table-column>

      <el-table-column :label="$t('白名单生效时间')" show-overflow-tooltip prop="whiteSealEffTime" min-width="180">
      </el-table-column>

      <el-table-column :label="$t('白名单失效时间')" show-overflow-tooltip prop="whiteSealFailTime" min-width="180">
      </el-table-column>

      <el-table-column :label="$t('详情')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text" size="small">{{$t('查看')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="100">
        <template scope="scope">
          <el-button @click="link(scope.row)" type="text" size="small">
            {{$t('关联')}}
          </el-button>
          <el-button v-show="power['boss_update_terminal']" @click="addOrUpdate(scope.row)" type="text" size="small">
            {{$t('修改')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange"
      v-if="operatorType == 3">

      <el-table-column type="selection" width='33'></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('终端ID')" show-overflow-tooltip prop="sn" min-width="200"></el-table-column>

      <el-table-column :label="$t('终端状态')" show-overflow-tooltip min-width="100">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.status!=2 && scope.row.status!=1">
            {{scope.row.status | filterTerminalStatusOptions}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==2">
            {{scope.row.status | filterTerminalStatusOptions}}</p>
          <p style="color: rgb(255, 215, 0);" v-show="scope.row.status==1">
            {{scope.row.status | filterTerminalStatusOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('机型')" show-overflow-tooltip min-width="100">
        <template scope="scope">
          {{scope.row.tmodel | filterTmodelOptions}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('市场状态')" show-overflow-tooltip min-width="100">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.useStatus==2">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.useStatus==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('激活时间')" show-overflow-tooltip prop="activeTime" min-width="180"></el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

    <!--新增修改部分-->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="dialogTableVisible" customClass="custom-dialog-width">
        <Add :detailsObj="detailsObj" :addTime="addTime" v-on:message="search" :updateSnTime="updateSnTime"
          v-on:showCustomer="showCustomer" :tmodelOptions="tmodelOptions" :cities="cities">
        </Add>
      </el-dialog>
    </div>

    <!-- 查看详情 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="detailVisible" customClass="custom-dialog-width">
        <ShowDetail :detailsObj="detailsObj" :showDetailTime="showDetailTime" :useStatusOptions="useStatusOptions"
          :tmodelOptions="tmodelOptions" :terminalStatusOptions="terminalStatusOptions">
        </ShowDetail>
      </el-dialog>
    </div>

    <!-- 所属客户 -->
    <div class="model-stream" style="position:relative;">
      <el-dialog :title="customerTitle" v-model="customerVisible" customClass="custom-dialog-width">
        <Customer :customerTime="customerTime" v-on:setCustomer="setCustomer">
        </Customer>
      </el-dialog>
    </div>

    <!-- 导出终端信息 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="exportExcelVisible" customClass="export-dialog">
        <ExportExcel :addTime="addTime" :params="params"></ExportExcel>
      </el-dialog>
    </div>

    <!-- 关联 -->
    <div class="mode-ref" style="position:relative;">
      <el-dialog :title="title" v-model="linkVisible">
        <LinkDialog :detailsObj="detailsObj" :power="power" :linkTime="linkTime">
        </LinkDialog>
      </el-dialog>
    </div>

    <!-- 批量生成账号 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="batchAddAccountVisible" customClass="custom-dialog-width batch-add-account">
        <BatchAddAccount :addTime="addTime" v-on:message="search" :updateCustomerTime="updateSnTime"
          v-on:showCustomer="showCustomer" :cities="cities" :accountSystemOptions="accountSystemOptions"
          :terminalStatusOptions="terminalStatusOptions">
        </BatchAddAccount>
      </el-dialog>
    </div>

    <!--批量修改状态-->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="batchUpdateVisible" customClass="batch-update">
        <BatchUpdate :selectedData="selectedData" :addTime="addTime" v-on:message="search"
          :batchUpdateCustomerTime="updateSnTime" v-on:showCustomer="showCustomer">
        </BatchUpdate>
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
      padding: 0px 0px 10px 0px;
      overflow: hidden;
      width: 100%;

      button {
        margin-top: 5px;
      }
    }
  }

</style>
