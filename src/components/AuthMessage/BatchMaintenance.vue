<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('终端ID')" prop="snStr">
            <el-input type="textarea" v-model="ruleForm.snStr" :rows="4" :placeholder="$t('请输入终端ID（多个用回车分隔）')">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('授权类型')" prop="authType">
            <el-select v-model="ruleForm.authType" @change="search">
              <el-option v-for="item in authTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
        <el-col :span="12">
          <el-form-item :label="$t('授权天数填充')" prop="authDay">
            <el-input type="number" v-model.number="ruleForm.authDay" @change="authDayChange"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('授权操作')" prop="authOperate">
            <el-select v-model="ruleForm.authOperate">
              <el-option v-for="item in authOperateOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
        max-height="240" v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" v-show="ruleForm.authType == 1"
        @selection-change="handleSelectionChange">

        <el-table-column type="selection" width='33'></el-table-column>
        <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

        <el-table-column :label="$t('产品名称')" show-overflow-tooltip prop="productName" min-width="120"></el-table-column>

        <el-table-column :label="$t('产品编码')" show-overflow-tooltip prop="productCode" min-width="180">
        </el-table-column>

        <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
          <template scope="scope">
            <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
            <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
          </template>
        </el-table-column>

        <el-table-column :label="$t('当前授权时间')" prop="currentAuthDate" show-overflow-tooltip min-width="130">
        </el-table-column>

        <el-table-column :label="$t('授权天数')" show-overflow-tooltip prop="authDay" min-width="100">
        </el-table-column>

      </el-table>

      <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
        max-height="240" v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" v-show="ruleForm.authType == 2"
        @selection-change="handleSelectionChange">

        <el-table-column type="selection" width='33'></el-table-column>
        <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

        <el-table-column :label="$t('套餐名称')" show-overflow-tooltip prop="packageName" min-width="120"></el-table-column>

        <el-table-column :label="$t('套餐编码')" show-overflow-tooltip prop="packageCode" min-width="180">
        </el-table-column>

        <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
          <template scope="scope">
            <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
            <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
          </template>
        </el-table-column>

        <el-table-column :label="$t('当前授权时间')" prop="currentAuthDate" show-overflow-tooltip min-width="130">
        </el-table-column>

        <el-table-column :label="$t('授权天数')" show-overflow-tooltip prop="authDay" min-width="100">
        </el-table-column>

      </el-table>


      <div style="text-align: center; margin-top: 20px;">
        <el-button :disabled='oneClick' type="primary" @click="submitForm('ruleForm')">{{$t('确定')}}</el-button>
        <el-button @click="cancel()">{{$t('取消')}}</el-button>
      </div>

    </el-form>
  </div>
</template>
<script src="./batchMaintenance.js"></script>
<style>
</style>
