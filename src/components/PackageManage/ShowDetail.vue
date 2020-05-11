<template>
  <div class="show-detail">
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('套餐名称')">
            <el-input v-model="ruleForm.packageName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('套餐编码')">
            <el-input v-model="ruleForm.packageCode" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('状态')">
            <el-input v-model="ruleForm.statusName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" v-if="ruleForm.chargeType != '1'">
        <el-col :span="12">
          <el-form-item :label="$t('计费周期')">
            <el-input v-model="ruleForm.chargeCycleName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('价格($)')">
            <el-input v-model="ruleForm.price" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('生效日期')">
            <el-input v-model="ruleForm.effectDate" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('失效日期')">
            <el-input v-model="ruleForm.invalidDate" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="24">
          <el-form-item :label="$t('备注')">
            <el-input type="textarea" v-model="ruleForm.remark" readonly :rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

  </div>
</template>
<script src="./showDetail.js"></script>

<style lang="less" scoped>
  .hr {
    border-top: 1px solid #bfcbd9;
    margin: 20px 0;
    margin-top: 8px;
    width: 100%;
  }

  .title {
    margin: 0;
    color: #000;
    font-weight: bold;
    margin-bottom: 5px;
  }

</style>
