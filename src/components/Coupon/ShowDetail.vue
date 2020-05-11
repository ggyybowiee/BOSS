<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      class="detail-form"
    >
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券策略名称')" prop="name">
            <el-input v-model="ruleForm.name" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('优惠券编码')" prop="couponCode">
            <el-input v-model="ruleForm.couponCode" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券类型')" prop="couponType">
            <el-radio-group v-model="ruleForm.couponType" disabled>
              <el-radio
                v-for="item in couponTypeOptions"
                :key="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.couponType == 2">
          <el-form-item :label="$t('折扣')" prop="discountRate">
            <el-input v-model.number="ruleForm.discountRate" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" v-if="ruleForm.couponType == 1">
        <el-col :span="12">
          <el-form-item :label="$t('抵扣金额(R$)')" prop="brl">
            <el-input v-model.number="ruleForm.brl" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('抵扣金额($)')" prop="usd">
            <el-input v-model.number="ruleForm.usd" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券标题(英语)')" prop="couponTitleEn">
            <el-input v-model="ruleForm.couponTitleEn" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('优惠券标题(葡语)')" prop="couponTitlePt">
            <el-input v-model="ruleForm.couponTitlePt" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券标题(西语)')" prop="couponTitleEs">
            <el-input v-model="ruleForm.couponTitleEs" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('优惠券有效期类型')" prop="couponEffectType">
            <el-radio-group v-model="ruleForm.couponEffectType" disabled>
              <el-radio
                v-for="item in couponEffectTypeOptions"
                :key="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.couponEffectType == 2">
          <el-form-item :label="$t('领取后生效天数')" prop="afterDay">
            <el-input v-model.number="ruleForm.afterDay" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row
        type="flex"
        justify="space-between"
        :gutter="20"
        class="product-date"
        v-if="ruleForm.couponEffectType == 1"
      >
        <el-col :span="12">
          <el-form-item :label="$t('生效日期')" prop="effectTime">
            <el-input v-model.number="ruleForm.effectTime" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('失效日期')" prop="invalidTime">
            <el-input v-model.number="ruleForm.invalidTime" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('应用名称')" prop="appId">
            <el-select v-model="ruleForm.appId" filterable disabled>
              <el-option
                v-for="item in appIdOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('套餐名称')" prop="packageCode">
            <el-select v-model="ruleForm.packageCode" filterable disabled>
              <el-option
                v-for="item in packageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('参与方式')" prop="partakeType">
            <el-select v-model="ruleForm.partakeType" filterable disabled>
              <el-option
                v-for="item in partakeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('操作员')" prop="operator" required>
            <el-input v-model="ruleForm.operator" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script src="./showDetail.js"></script>
<style>
</style>
