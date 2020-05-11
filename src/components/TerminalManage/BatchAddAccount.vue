<template>
  <div>
    <el-form :model="batchAddRuleForm" :rules="rules" ref="batchAddRuleForm" label-width="120px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('所属用户体系')" prop="appCode">
            <el-select v-model="batchAddRuleForm.appCode" filterable>
              <el-option v-for="item in accountSystemOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('注册终端类型')" prop="registerTerminalType">
            <el-select v-model="batchAddRuleForm.registerTerminalType" filterable>
              <el-option v-for="item in registerTerminalTypeOptions" :key="item.value" :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('账号类型')" prop="accountType">
            <el-select v-model="batchAddRuleForm.accountType" filterable>
              <el-option v-for="item in accountTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('账号数量')" prop="accountCount">
            <el-input type="input" v-model.number="batchAddRuleForm.accountCount"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-row type="flex" justify="space-between" :gutter="20">
            <el-col :span="24">
              <el-form-item :label="$t('所属客户')" prop="customer">
                <div @click="showCustomerInfo($event)">
                  <el-input v-model="batchAddRuleForm.customer" readonly>
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
            <el-col :span="24">
              <el-form-item :label="$t('跨区域')" prop="crossAllow">
                <el-select v-model="batchAddRuleForm.crossAllow" filterable
                  @change="crossAllowChange(batchAddRuleForm.crossAllow)">
                  <el-option v-for="item in tmlcrossAllowList" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
            <el-col :span="24">
              <el-form-item :label="$t('市场状态')" prop="useStatus">
                <el-select v-model="batchAddRuleForm.useStatus" filterable>
                  <el-option v-for="item in useStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
            v-show="batchAddRuleForm.crossAllow == '0'">
            <el-col :span="24">
              <el-form-item :label="$t('白名单销售区域')">
                <el-select v-model="city" multiple filterable>
                  <el-option v-show="!all" :label="$t('全选')" value="all"></el-option>
                  <el-option v-show="all" :label="$t('取消全选')" value="cancleAll"></el-option>
                  <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
            v-show="batchAddRuleForm.crossAllow == '0'">
            <el-col :span="24">
              <el-form-item :label="$t('白名单生效日期')" prop="whiteSealEffTime">
                <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="batchAddRuleForm.whiteSealEffTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
            v-show="batchAddRuleForm.crossAllow == '0'">
            <el-col :span="24">
              <el-form-item :label="$t('白名单失效日期')" prop="whiteSealFailTime">
                <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="batchAddRuleForm.whiteSealFailTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
            v-show="batchAddRuleForm.crossAllow == '1'">
            <el-col :span="24">
              <el-form-item :label="$t('黑名单销售区域')">
                <el-select v-model="city" multiple filterable>
                  <el-option v-show="!all" :label="$t('全选')" value="all"></el-option>
                  <el-option v-show="all" :label="$t('取消全选')" value="cancleAll"></el-option>
                  <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
            v-show="batchAddRuleForm.crossAllow == '1'">
            <el-col :span="24">
              <el-form-item :label="$t('黑名单生效日期')" prop="blackSealEffTime">
                <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="batchAddRuleForm.blackSealEffTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
            v-show="batchAddRuleForm.crossAllow == '1'">
            <el-col :span="24">
              <el-form-item :label="$t('黑名单失效日期')" prop="blackSealFailTime">
                <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="batchAddRuleForm.blackSealFailTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" v-if="batchAddRuleForm.customer && authPolicyList.length > 0">
          <p style="font-weight: bold; margin-top: 0;">{{$t("授权策略")}}：</p>

          <el-table class="select-table" ref="multipleTable" :data="authPolicyList" border tooltip-effect="dark"
            style="width: 100%;" max-height="280" v-loading.lock="loading" :element-loading-text="$t('拼命加载中')"
            @selection-change="handleSelectionChange">

            <el-table-column type="selection" width='33'></el-table-column>

            <el-table-column :label="$t('序号')" type="index" width="70"></el-table-column>

            <el-table-column :label="$t('策略名称')" show-overflow-tooltip prop="name" min-width="100">
            </el-table-column>

            <el-table-column :label="$t('周期')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p>{{scope.row.authCycle}}{{scope.row.authUnit | filterChargeUnitOptions}}</p>
              </template>
            </el-table-column>

            <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
              <template scope="scope">
                <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
                <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
              </template>
            </el-table-column>
          </el-table>

        </el-col>
      </el-row>

      <el-form-item :label="$t('备注')" prop="remark">
        <el-input type="textarea" v-model="batchAddRuleForm.remark" :rows="3" :placeholder="$t('限制128个字符以内')"
          :maxlength="128">
        </el-input>
      </el-form-item>

      <el-form-item class="product-manage-dialog">
        <el-button :disabled='oneClick' type="primary" @click="submitForm('batchAddRuleForm')">{{$t('确定')}}</el-button>
        <el-button @click="cancel()">{{$t('取消')}}</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script src="./batchAddAccount.js"></script>
<style>
</style>
