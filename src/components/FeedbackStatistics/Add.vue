<template>
  <div>
    <!-- 隐形的a标签，用于下载 -->
    <a :href="downloadUrl" ref="elementA"></a>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">

      <el-form-item :label="$t('导出范围')" prop="downloadType">
        <el-select v-model="ruleForm.downloadType" filterable>
          <el-option v-for="item in downloadTypeOptions" :key="item.value" :label="item.label" :value="item.value">
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
