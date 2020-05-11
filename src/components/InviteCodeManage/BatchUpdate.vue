<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">

      <el-form-item :label="$t('邀请码')" prop="inviteCodeList">
        <el-input type="textarea" style="width:580px;" v-model="ruleForm.inviteCodeList" :rows="7"
          :placeholder="$t('请输入多个邀请码（多个用回车分隔）')"></el-input>
      </el-form-item>

      <el-form-item :label="$t('状态')" prop="inviteCodeStatus">
        <el-select v-model="ruleForm.inviteCodeStatus">
          <el-option v-for="item in inviteCodeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <div>
        <el-form-item>
          <el-button :disabled='oneClick' type="primary" @click="submitForm('ruleForm')">{{$t('确定')}}</el-button>
          <el-button @click="cancel()">{{$t('取消')}}</el-button>
        </el-form-item>
      </div>

    </el-form>
  </div>
</template>
<script src="./batchUpdate.js"></script>
<style>
</style>
