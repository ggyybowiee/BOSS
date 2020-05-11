<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">

      <el-form-item :label="$t('字典类型')" prop="dictType">
        <el-select v-model="ruleForm.dictType" filterable :disabled="!detailsObj ==''">
          <el-option v-for="item in dictTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('字典key')" prop="dictName">
        <el-input type="input" style="width:580px;" v-model="ruleForm.dictName"
          :placeholder="$t('字典key需要校验唯一性，请先选择字典类型')">
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('字典值')" prop="dictValue">
        <el-input type="input" style="width:580px;" v-model="ruleForm.dictValue"></el-input>
      </el-form-item>

      <el-form-item :label="$t('是否固定')" prop="isfixed">
        <el-select v-model="ruleForm.isfixed">
          <el-option v-for="item in fixOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('备注')" prop="note">
        <el-input type="textarea" style="width:580px;" v-model="ruleForm.note" :rows="7"></el-input>
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
