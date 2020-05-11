<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">

      <el-form-item :label="$t('应用ID')" prop="appId">
        <el-select v-model="ruleForm.appId" filterable :disabled="!detailsObj ==''">
          <el-option v-for="item in appIdOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('状态')" prop="status">
        <el-select v-model="ruleForm.status">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('产品名称')" prop="productCode">
        <el-select v-model="ruleForm.productCode" filterable :disabled="!detailsObj ==''">
          <el-option v-for="item in productCodeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('产品编码')" prop="productCode">
        <el-input type="input" style="width:580px;" v-model="ruleForm.productCode" disabled></el-input>
      </el-form-item>

      <el-form-item :label="$t('免费试用天数')" prop="preAuthDays">
        <el-input type="input" style="width:580px;" v-model.number="ruleForm.preAuthDays"
          onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
      </el-form-item>

      <el-form-item :label="$t('区域范围')" prop="area">
        <el-select v-model="ruleForm.area">
          <el-option v-for="item in areaOptions" :key="item.value" :label="item.label" :value="item.value">
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
<script src="./add.js"></script>
<style>
</style>
