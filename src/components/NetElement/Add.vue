<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">

      <el-form-item :label="$t('网元名称')" prop="neName">
        <el-input type="input" style="width:580px;" v-model="ruleForm.neName"
          :disabled="!detailsObj =='' || clickShowRemark">
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('交互地址')" prop="neSyncUrl">
        <el-input type="input" style="width:580px;" v-model="ruleForm.neSyncUrl" :disabled="clickShowRemark">
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('描述信息')" prop="remark">
        <el-input type="textarea" style="width:580px;" v-model="ruleForm.remark" :rows="7" :disabled="clickShowRemark"
          :placeholder="!clickShowRemark? $t('限制128个字符以内') : ''" :maxlength="128"></el-input>
      </el-form-item>

      <div v-show="!clickShowRemark">
        <el-form-item>
          <el-button :disabled='oneClick' type="primary" @click="submitForm('ruleForm')">{{$t('确定')}}</el-button>
          <el-button @click="cancel()">{{$t('取消')}}</el-button>
        </el-form-item>
      </div>

    </el-form>
  </div>
</template>
<script src="./add.js"></script>
<style>
</style>
