<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('奖励规则名称')" prop="name">
        <el-input type="input" style="width:580px;" v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item :label="$t('奖励规则描述')" prop="detail">
        <el-input type="textarea" style="width:580px;" v-model="ruleForm.detail" :rows="5"></el-input>
      </el-form-item>

      <el-form-item :label="$t('生效日期')" prop="effectTime" class="invite-prize-date">
        <el-date-picker
          type="date"
          :placeholder="$t('选择日期')"
          v-model="ruleForm.effectTime"
          style="width: 260px;"
        ></el-date-picker>
      </el-form-item>

      <el-form-item :label="$t('失效日期')" prop="invalidTime" class="invite-prize-date">
        <el-date-picker
          type="date"
          :placeholder="$t('选择日期')"
          v-model="ruleForm.invalidTime"
          style="width: 260px;"
        ></el-date-picker>
      </el-form-item>

      <el-form-item :label="$t('邀请人账号类型')" prop="inviterAccountType">
        <el-select v-model="ruleForm.inviterAccountType" filterable>
          <el-option
            v-for="item in accountOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('受邀人账号类型')" prop="inviteeAccountType">
        <el-select v-model="ruleForm.inviteeAccountType" filterable>
          <el-option
            v-for="item in accountOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('应用名称')" prop="appId">
        <el-select v-model="ruleForm.appId" filterable>
          <el-option
            v-for="item in appIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="oneClick" type="primary" @click="submitForm('ruleForm')">{{$t('确定')}}</el-button>
        <el-button @click="cancel()">{{$t('取消')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script src="./add.js"></script>
<style>
</style>
