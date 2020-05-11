<template>
  <div class="show-detail">
    <el-form ref="showDetailRuleForm" :model="showDetailRuleForm" label-width="120px" class="detail-form"
      v-show="type == 'ott'">
      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('类型')">
            <el-select v-model="showDetailRuleForm.type" disabled>
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('机型')">
            <el-select v-model="showDetailRuleForm.tmodel" disabled>
              <el-option v-for="item in tmodelOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('终端ID')">
            <el-input v-model="showDetailRuleForm.sn" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="MAC">
            <el-input v-model="showDetailRuleForm.macAddr" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('所属客户')">
            <el-input v-model="showDetailRuleForm.customer" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('终端状态')">
            <el-select v-model="showDetailRuleForm.status" disabled>
              <el-option v-for="item in terminalStatusOptions" :key="item.value" :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('跨区域')">
            <el-select v-model="showDetailRuleForm.crossAllow" disabled>
              <el-option v-for="item in tmlcrossAllowList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('市场状态')">
            <el-select v-model="showDetailRuleForm.useStatus" disabled>
              <el-option v-for="item in useStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="24">
          <el-form-item :label="$t('白名单销售区域')">
            <el-input type="textarea" v-model="showDetailRuleForm.whiteSealArea" readonly :rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="24">
          <el-form-item :label="$t('黑名单销售区域')">
            <el-input type="textarea" v-model="showDetailRuleForm.blackSealArea" readonly :rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="24">
          <el-form-item :label="$t('备注')">
            <el-input type="textarea" v-model="showDetailRuleForm.remark" readonly :rows="3"></el-input>
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
