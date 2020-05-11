<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('产品名称')" prop="productName">
            <el-input v-model="ruleForm.productName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('产品编码')" prop="productCode">
            <el-tooltip class="item" effect="dark" :content="$t('产品编码可修改，最好与产品名称相同，方便在授权信息处查询！')" placement="top"
              v-show="!detailsObj">
              <el-input v-model="ruleForm.productCode" @blur="checkProductCode(ruleForm.productCode)"
                :disabled="!!detailsObj"></el-input>
            </el-tooltip>

            <el-input v-model="ruleForm.productCode" @blur="checkProductCode(ruleForm.productCode)"
              v-show="!!detailsObj" :disabled="!!detailsObj"></el-input>
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
          <el-form-item :label="$t('计费类型')" prop="chargeType">
            <el-select v-model="ruleForm.chargeType" filterable :disabled="!!detailsObj">
              <el-option v-for="item in chargeTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('计费周期')" prop="chargeCycle">
            <el-row type="flex" justify="space-between" :gutter="10">
              <el-col :span="16">
                <el-input v-model.number="ruleForm.chargeCycle"
                  onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" :placeholder="$t('请输入大于0的整数')">
                </el-input>
              </el-col>
              <el-col :span="8">
                <el-select v-model="ruleForm.chargeUnit" filterable>
                  <el-option v-for="item in chargeUnitOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('价格($)')" prop="price">
            <el-input v-model.number="ruleForm.price" :placeholder="$t('请输入大于0的数字')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-date">
        <el-col :span="12">
          <el-form-item :label="$t('生效日期')" prop="effectDate">
            <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="ruleForm.effectDate">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('失效日期')" prop="invalidDate">
            <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="ruleForm.invalidDate">
            </el-date-picker>
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
