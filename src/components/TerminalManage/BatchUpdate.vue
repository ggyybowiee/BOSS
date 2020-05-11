<template>
  <div>
    <el-form :model="batchUpdateRuleForm" :rules="rules" ref="batchUpdateRuleForm" label-width="130px"
      class="demo-batchUpdateRuleForm">

      <el-form-item :label="$t('终端ID')" prop="snStr">
        <el-input type="textarea" style="width:580px;" v-model="batchUpdateRuleForm.snStr" :rows="7"
          :placeholder="$t('请输入终端ID（多个用回车分隔）')"></el-input>
      </el-form-item>

      <el-form-item :label="$t('市场状态')" prop="useStatus" v-show="batchUpdateType == 1">
        <el-select v-model="batchUpdateRuleForm.useStatus">
          <el-option v-for="item in useStatusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('终端状态')" prop="status" v-show="batchUpdateType == 2">
        <el-select v-model="batchUpdateRuleForm.status" filterable :disabled="batchUpdateRuleForm.status == 2">
          <el-option v-for="item in terminalStatusOptions" :key="item.value" :label="item.label"
            :disabled="item.disabled" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('所属客户')" prop="customer" v-show="batchUpdateType == 3">
        <div @click="showCustomerInfo($event)">
          <el-input v-model="batchUpdateRuleForm.customer" readonly>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item :label="$t('授权策略')" v-show="batchUpdateType == 4">
        <el-table class="select-table" ref="multipleTable" :data="authPolicyList" border tooltip-effect="dark"
          style="width: 100%;" max-height="240" v-loading.lock="loading" :element-loading-text="$t('拼命加载中')"
          @selection-change="handleSelectionChange">

          <el-table-column type="selection" width='33'></el-table-column>

          <el-table-column :label="$t('序号')" type="index" width="70"></el-table-column>

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
      </el-form-item>

      <div>
        <el-form-item>
          <el-button :disabled='oneClick' type="primary" @click="submitForm('batchUpdateRuleForm')">{{$t('确定')}}
          </el-button>
          <el-button @click="cancel()">{{$t('取消')}}</el-button>
        </el-form-item>
      </div>

    </el-form>
  </div>
</template>
<script src="./batchUpdate.js"></script>
<style>
</style>
