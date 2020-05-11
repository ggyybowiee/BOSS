<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item :label="$t('当前页数')" prop="pageNum">
        <el-input v-model="ruleForm.pageNum"></el-input>
      </el-form-item>

      <el-form-item :label="$t('每页导出条数')" prop="pageSize">
        <el-input v-model="ruleForm.pageSize"></el-input>
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
<script src="./exportExcel.js"></script>
<style>
</style>
