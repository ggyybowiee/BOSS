<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item :label="$t('所属类型')" prop="belong_type">
        <el-select v-model="ruleForm.belong_type" filterable>
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('所属应用')" prop="pkg">
        <el-select v-model="ruleForm.pkg" filterable>
          <el-option v-for="item in appIdOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('分类名称(中文)')" prop="type_zh">
        <el-input type="input" style="width:580px;" v-model="ruleForm.type_zh">
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('分类名称(英语)')" prop="type_en">
        <el-input type="input" style="width:580px;" v-model="ruleForm.type_en">
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('分类名称(葡语)')" prop="type_pt">
        <el-input type="input" style="width:580px;" v-model="ruleForm.type_pt">
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('分类名称(西语)')" prop="type_es">
        <el-input type="input" style="width:580px;" v-model="ruleForm.type_es">
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('显示顺序')" prop="sort_num">
        <el-input type="input" style="width:580px;" v-model.number="ruleForm.sort_num"
          onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
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
