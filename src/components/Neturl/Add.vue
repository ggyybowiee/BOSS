<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">

      <el-form-item :label="$t('接口名称')" prop="apiName">
        <el-input type="input" style="width:580px;" v-model="ruleForm.apiName">
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('URL接口地址')" prop="uri">
        <el-input type="input" style="width:580px;" v-model="ruleForm.uri"></el-input>
      </el-form-item>

      <el-form-item :label="$t('描述信息')" prop="remark">
        <el-input type="textarea" style="width:580px;" v-model="ruleForm.remark" :rows="7"></el-input>
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
<script src="./add.js"></script>
<style>
</style>
