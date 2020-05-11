<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券策略名称')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('优惠券编码')" prop="couponCode">
            <el-input v-model="ruleForm.couponCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券类型')" prop="couponType" required>
            <el-radio-group v-model="ruleForm.couponType">
              <el-radio v-for="item in couponTypeOptions" :key="item.value" :label="item.value"
                :disabled="item.disabled">
                {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.couponType == 2">
          <el-form-item :label="$t('折扣')" prop="discountRate">
            <el-input v-model.number="ruleForm.discountRate" :placeholder="$t('请输入大于0，小于10的数字')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" v-if="ruleForm.couponType == 1">
        <el-col :span="12">
          <el-form-item :label="$t('抵扣金额(R$)')" prop="brl">
            <el-input v-model.number="ruleForm.brl" :placeholder="$t('请输入大于0的数字')">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('抵扣金额($)')" prop="usd">
            <el-input v-model.number="ruleForm.usd" :placeholder="$t('请输入大于0的数字')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券标题(英语)')" prop="couponTitleEn">
            <el-input v-model="ruleForm.couponTitleEn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('优惠券标题(葡语)')" prop="couponTitlePt">
            <el-input v-model="ruleForm.couponTitlePt"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券标题(西语)')" prop="couponTitleEs">
            <el-input v-model="ruleForm.couponTitleEs"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券有效期类型')" prop="couponEffectType" required>
            <el-radio-group v-model="ruleForm.couponEffectType">
              <el-radio v-for="item in couponEffectTypeOptions" :key="item.value" :label="item.value"
                :disabled="item.disabled">
                {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.couponEffectType == 2">
          <el-form-item :label="$t('领取后生效天数')" prop="afterDay">
            <el-input v-model.number="ruleForm.afterDay"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" :placeholder="$t('请输入大于0的整数')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
        v-if="ruleForm.couponEffectType == 1">
        <el-col :span="12">
          <el-form-item :label="$t('生效日期')" prop="effectTime">
            <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="ruleForm.effectTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('失效日期')" prop="invalidTime">
            <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="ruleForm.invalidTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('应用名称')" prop="appId">
            <el-select v-model="ruleForm.appId" filterable>
              <el-option v-for="item in appIdOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('套餐名称')" prop="packageCode">
            <el-select v-model="ruleForm.packageCode" filterable>
              <el-option v-for="item in packageOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('参与方式')" prop="partakeType" required>
            <el-select v-model="ruleForm.partakeType" filterable>
              <el-option v-for="item in partakeTypeOptions" :key="item.value" :label="item.label" :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('操作员')" prop="operator" required>
            <el-input v-model="ruleForm.operator" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

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
