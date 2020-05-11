<template>
  <div>
    <el-form :model="addRuleForm" :rules="rules" ref="addRuleForm" label-width="120px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('类型')" prop="type">
            <el-select v-model="addRuleForm.type" filterable :disabled="!!detailsObj">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('机型')" prop="tmodel">
            <el-select v-model="addRuleForm.tmodel" filterable>
              <el-option v-for="item in tmodelOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div v-if="detailsObj">
        <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
          <el-col :span="12">
            <el-form-item :label="$t('终端ID')" prop="sn" v-if="addRuleForm.type == 1">
              <el-input v-model="addRuleForm.sn" disabled></el-input>
            </el-form-item>
            <el-form-item label="mac" prop="macAddr" v-if="addRuleForm.type == 2">
              <el-input v-model="addRuleForm.macAddr" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('所属客户')" prop="customer">
              <div @click="showCustomerInfo($event)">
                <el-input v-model="addRuleForm.customer" readonly></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
          <el-col :span="12">
            <el-form-item :label="$t('终端状态')" prop="status">
              <el-select v-model="addRuleForm.status" filterable :disabled="addRuleForm.status == 2">
                <el-option v-for="item in terminalStatusOptions" :key="item.value" :label="item.label"
                  :disabled="item.disabled" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('跨区域')" prop="crossAllow">
              <el-select v-model="addRuleForm.crossAllow" filterable @change="crossAllowChange()">
                <el-option v-for="item in tmlcrossAllowList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
          <el-col :span="12">
            <el-form-item :label="$t('市场状态')" prop="useStatus">
              <el-select v-model="addRuleForm.useStatus" filterable>
                <el-option v-for="item in useStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
          v-if="addRuleForm.crossAllow == '0'">
          <el-col :span="12">
            <el-form-item :label="$t('白名单销售区域')">
              <el-select v-model="city" multiple filterable>
                <el-option v-show="!all" :label="$t('全选')" value="all"></el-option>
                <el-option v-show="all" :label="$t('取消全选')" value="cancleAll"></el-option>
                <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
          v-if="addRuleForm.crossAllow == '0'">
          <el-col :span="12">
            <el-form-item :label="$t('白名单生效日期')" prop="whiteSealEffTime">
              <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="addRuleForm.whiteSealEffTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
          v-if="addRuleForm.crossAllow == '0'">
          <el-col :span="12">
            <el-form-item :label="$t('白名单失效日期')" prop="whiteSealFailTime">
              <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="addRuleForm.whiteSealFailTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
          v-if="addRuleForm.crossAllow == '1'">
          <el-col :span="12">
            <el-form-item :label="$t('黑名单销售区域')">
              <el-select v-model="city" multiple filterable>
                <el-option v-show="!all" :label="$t('全选')" value="all"></el-option>
                <el-option v-show="all" :label="$t('取消全选')" value="cancleAll"></el-option>
                <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
          v-if="addRuleForm.crossAllow == '1'">
          <el-col :span="12">
            <el-form-item :label="$t('黑名单生效日期')" prop="blackSealEffTime">
              <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="addRuleForm.blackSealEffTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
          v-if="addRuleForm.crossAllow == '1'">
          <el-col :span="12">
            <el-form-item :label="$t('黑名单失效日期')" prop="blackSealFailTime">
              <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="addRuleForm.blackSealFailTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <el-form-item v-if="!detailsObj">
        <el-row type="flex" :gutter="20">
          <el-col :span="3">
            <span @click="radioChange('1')">
              <el-radio class="radio" v-model="addRuleForm.addType" label="1">{{$t('单个')}}</el-radio>
            </span>
          </el-col>
          <el-col :span="3">
            <span @click="radioChange('2')">
              <el-radio class="radio" v-model="addRuleForm.addType" label="2">{{$t('区间')}}</el-radio>
            </span>
          </el-col>
          <el-col :span="3">
            <span @click="radioChange('3')">
              <el-radio class="radio" v-model="addRuleForm.addType" label="3">{{$t('不连续批量')}}</el-radio>
            </span>
          </el-col>
        </el-row>
      </el-form-item>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
        v-if="addRuleForm.type == '1' && addRuleForm.addType=='1'">
        <el-col :span="12">
          <el-form-item :label="$t('终端ID')" prop="sn">
            <el-input v-model="addRuleForm.sn" :placeholder="$t('请输入终端ID，如10.11-20.21-10002000')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
        v-if="addRuleForm.type == '1' && addRuleForm.addType=='3'">
        <el-col :span="12">
          <el-form-item :label="$t('终端ID')" prop="snStr">
            <el-input type="textarea" v-model="addRuleForm.snStr" :rows="4" :placeholder="$t('请输入终端ID（多个用回车分隔）')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="addRuleForm.type == '1' && addRuleForm.addType=='2'" :label="$t('终端ID')" required>
        <el-row type="flex" justify="space-between" :gutter="10" class="product-select">
          <el-col :span="7">
            <el-form-item prop="snPrefix">
              <el-input v-model="addRuleForm.snPrefix" :placeholder="$t('终端ID前缀，例如11.22-33.44')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="snSuffixStart">
              <el-input v-model="addRuleForm.snSuffixStart" :placeholder="$t('终端ID后缀起始值，例如10001000')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align: center;">~</el-col>
          <el-col :span="8">
            <el-form-item prop="snSuffixEnd">
              <el-input v-model="addRuleForm.snSuffixEnd" :placeholder="$t('终端ID后缀结束值，例如10006000')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
        v-if="addRuleForm.type == '2' && addRuleForm.addType=='1'">
        <el-col :span="12">
          <el-form-item label="MAC" prop="macAddr">
            <el-input v-model="addRuleForm.macAddr" :placeholder="$t('请输入MAC，例如00:23:5A:15:99:42')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
        v-if="addRuleForm.type == '2' && addRuleForm.addType=='3'">
        <el-col :span="12">
          <el-form-item label="MAC" prop="macAddrStr">
            <el-input type="textarea" v-model="addRuleForm.macAddrStr" :rows="4" :placeholder="$t('请输入MAC（多个用回车分隔）')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="addRuleForm.type == '2' && addRuleForm.addType=='2'" label="MAC" required>
        <el-row type="flex" justify="space-between" :gutter="10" class="product-select">
          <el-col :span="7">
            <el-form-item prop="macAddrPrefix">
              <el-input v-model="addRuleForm.macAddrPrefix" :placeholder="$t('MAC前缀，例如00:23:5A')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="macAddrSuffixStart">
              <el-input v-model="addRuleForm.macAddrSuffixStart" :placeholder="$t('MAC后缀起始值，例如15:99:42')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align: center;">~</el-col>
          <el-col :span="8">
            <el-form-item prop="macAddrSuffixEnd">
              <el-input v-model="addRuleForm.macAddrSuffixEnd" :placeholder="$t('MAC后缀结束值，例如15:99:89')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-row type="flex" justify="space-between" :gutter="20" v-if="!detailsObj">
        <el-col :span="12">
          <el-row type="flex" justify="space-between" :gutter="20">
            <el-col :span="24">
              <el-form-item :label="$t('所属客户')" prop="customer">
                <div @click="showCustomerInfo($event)">
                  <el-input v-model="addRuleForm.customer" readonly></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
            <el-col :span="24">
              <el-form-item :label="$t('跨区域')" prop="crossAllow">
                <el-select v-model="addRuleForm.crossAllow" filterable
                  @change="crossAllowChange(addRuleForm.crossAllow)">
                  <el-option v-for="item in tmlcrossAllowList" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
            <el-col :span="24">
              <el-form-item :label="$t('市场状态')" prop="useStatus">
                <el-select v-model="addRuleForm.useStatus" filterable>
                  <el-option v-for="item in useStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
            v-show="addRuleForm.crossAllow == '0'">
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
            v-show="addRuleForm.crossAllow == '0'">
            <el-col :span="24">
              <el-form-item :label="$t('白名单生效日期')" prop="whiteSealEffTime">
                <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="addRuleForm.whiteSealEffTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
            v-show="addRuleForm.crossAllow == '0'">
            <el-col :span="24">
              <el-form-item :label="$t('白名单失效日期')" prop="whiteSealFailTime">
                <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="addRuleForm.whiteSealFailTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-select"
            v-show="addRuleForm.crossAllow == '1'">
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
            v-show="addRuleForm.crossAllow == '1'">
            <el-col :span="24">
              <el-form-item :label="$t('黑名单生效日期')" prop="blackSealEffTime">
                <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="addRuleForm.blackSealEffTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20" class="product-date"
            v-show="addRuleForm.crossAllow == '1'">
            <el-col :span="24">
              <el-form-item :label="$t('黑名单失效日期')" prop="blackSealFailTime">
                <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="addRuleForm.blackSealFailTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" v-if="addRuleForm.customer && authPolicyList.length > 0">
          <p style="font-weight: bold; margin-top: 0;">{{$t("授权策略")}}：</p>

          <el-table class="select-table" ref="multipleTable" :data="authPolicyList" border tooltip-effect="dark"
            style="width: 100%;" max-height="280" v-loading.lock="loading" :element-loading-text="$t('拼命加载中')"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="33"></el-table-column>

            <el-table-column :label="$t('序号')" type="index" width="70"></el-table-column>

            <el-table-column :label="$t('策略名称')" show-overflow-tooltip prop="name" min-width="100"></el-table-column>

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
        <el-input type="textarea" v-model="addRuleForm.remark" :rows="3" :placeholder="$t('限制128个字符以内')"
          :maxlength="128"></el-input>
      </el-form-item>

      <el-form-item class="product-manage-dialog">
        <el-button :disabled="oneClick" type="primary" @click="submitForm('addRuleForm')">{{$t('确定')}}</el-button>
        <el-button @click="cancel()">{{$t('取消')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script src="./add.js"></script>
<style>
</style>
