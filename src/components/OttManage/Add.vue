<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('用户名')" prop="userName">
            <el-input v-model="ruleForm.userName" :maxlength="32" :disabled="!!detailsObj"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('登录密码')" prop="password">
            <el-input v-model="ruleForm.password" type="password" :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('状态')" prop="status">
            <el-select v-model="ruleForm.status" filterable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('在线数')" prop="onlineNum">
            <el-input type="number" v-model.number="ruleForm.onlineNum"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" :maxlength="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('关联终端信息')" prop="sn">
            <div @click="showTerminalInfo($event)" v-if="!detailsObj">
              <el-input v-model="ruleForm.sn" readonly>
              </el-input>
            </div>

            <el-input v-model="ruleForm.sn" :disabled="!!detailsObj" v-if="!!detailsObj">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('电子邮箱')" prop="email">
            <el-input v-model="ruleForm.email" :disabled="!!detailsObj"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-date">
        <el-col :span="12">
          <el-form-item :label="$t('手机号码')" prop="mobile">
            <el-input v-model="ruleForm.mobile" :maxlength="32" :disabled="!!detailsObj"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('固定电话')" prop="tel">
            <el-input v-model="ruleForm.tel" :maxlength="32" :disabled="!!detailsObj"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item :label="$t('备注')" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark" :rows="5" :placeholder="$t('限制128个字符以内')" :maxlength="128">
        </el-input>
      </el-form-item>

      <el-form-item class="product-manage-dialog">
        <el-button :disabled='oneClick' type="primary" @click="submitForm('ruleForm')">{{$t('确定')}}</el-button>
        <el-button @click="cancel()">{{$t('取消')}}</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script src="./add.js"></script>
<style>
</style>
