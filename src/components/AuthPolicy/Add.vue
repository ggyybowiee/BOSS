<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('授权名称')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('状态')" prop="status">
            <el-select v-model="ruleForm.status" filterable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
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

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('授权周期')" prop="authCycle">
            <el-row type="flex" justify="space-between" :gutter="10">
              <el-col :span="16">
                <el-input v-model.number="ruleForm.authCycle"
                  onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" :placeholder="$t('请输入大于0的整数')">
                </el-input>
              </el-col>
              <el-col :span="8">
                <el-select v-model="ruleForm.authUnit" filterable>
                  <el-option v-for="item in chargeUnitOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="24">
          <el-form-item :label="$t('所属客户')">
            <el-select v-model="customers" multiple filterable :disabled="operatorType == '3'">
              <el-option v-show="!all" :label="$t('全选')" value="all"></el-option>
              <el-option v-show="all" :label="$t('取消全选')" value="cancleAll"></el-option>
              <el-option v-for="item in customerList" :key="item.operatorName" :label="item.operatorName"
                :value="item.operatorName">
              </el-option>
            </el-select>

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
