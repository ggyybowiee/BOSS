<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('策略类型')" prop="policyType">
        <el-select v-model="ruleForm.policyType" filterable :disabled="clickType == '3'">
          <el-option
            v-for="item in policyTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('策略标识')" prop="policyIdentify">
        <el-input
          type="input"
          style="width:580px;"
          v-model="ruleForm.policyIdentify"
          :disabled="clickType == '3'"
          v-show="ruleForm.policyType != 2"
        ></el-input>

        <div @click="choiseInterface($event)" v-show="ruleForm.policyType == 2 && clickType != '3'">
          <el-input v-model="ruleForm.policyIdentify"></el-input>
        </div>

        <el-table
          :data="list"
          border
          style="width: 92%"
          v-show="ruleForm.policyType == 2 && clickType == '3'"
          max-height="200"
        >
          <el-table-column :label="$t('接口ID')" show-overflow-tooltip prop="id" min-width="70"></el-table-column>

          <el-table-column :label="$t('接口名称')" show-overflow-tooltip min-width="120" prop="apiName"></el-table-column>

          <el-table-column :label="$t('URL接口地址')" show-overflow-tooltip prop="uri" min-width="150"></el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item :label="$t('描述信息')" prop="remark">
        <el-input
          type="textarea"
          style="width:580px;"
          v-model="ruleForm.remark"
          :rows="7"
          :disabled="clickType == '3'"
          :placeholder="clickType != '3' ? $t('限制128个字符以内'): ''"
          :maxlength="128"
        ></el-input>
      </el-form-item>

      <div v-show="clickType != '3'">
        <el-form-item>
          <el-button
            :disabled="oneClick"
            type="primary"
            @click="submitForm('ruleForm')"
          >{{$t('确定')}}</el-button>
          <el-button @click="cancel()">{{$t('取消')}}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script src="./addPolicy.js"></script>
<style>
</style>
