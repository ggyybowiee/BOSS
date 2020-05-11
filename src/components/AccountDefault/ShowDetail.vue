<template>
  <div class="show-detail">
    <div v-if="type == 1">
      <el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="detail-form">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('默认账号')">
              <el-input v-model="ruleForm.userId" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('终端ID')">
              <el-input v-model="ruleForm.sn" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <hr class="hr">
      </el-form>

      <p class="title">{{$t('尊享权益')}}</p>

      <el-table ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%"
        v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" max-height="400">

        <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

        <el-table-column :label="$t('授权产品')" show-overflow-tooltip prop="productName" min-width="100">
        </el-table-column>

        <el-table-column :label="$t('体验失效时间')" show-overflow-tooltip prop="expInvalidTime" min-width="130">
        </el-table-column>

        <el-table-column :label="$t('体验剩余天数')" show-overflow-tooltip prop="expServiceDay" min-width="130">
        </el-table-column>

        <el-table-column :label="$t('会员生效时间')" show-overflow-tooltip prop="effectTime" min-width="130">
        </el-table-column>

        <el-table-column :label="$t('会员失效时间')" show-overflow-tooltip prop="invalidTime" min-width="130">
        </el-table-column>

        <el-table-column :label="$t('会员剩余天数')" show-overflow-tooltip prop="serviceNum" min-width="130">
        </el-table-column>

        <el-table-column :label="$t('会员状态')" show-overflow-tooltip min-width="70">
          <template scope="scope">
            <p style="color: rgb(220, 20, 60);" v-show="scope.row.serviceStatus==0">{{$t('过期')}}</p>
            <p style="color: rgb(0, 255, 0);" v-show="scope.row.serviceStatus==1">{{$t('正常')}}</p>
            <p style="color: #00f;" v-show="scope.row.serviceStatus==2">{{$t('未开通')}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="type == 2">
      <el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="detail-form">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('默认账号')">
              <el-input v-model="ruleForm.userId" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('终端ID')">
              <el-input v-model="ruleForm.sn" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('状态')">
              <el-input v-model="ruleForm.statusName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('所属客户')">
              <el-input v-model="ruleForm.customer" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('所属用户体系')">
              <el-input v-model="ruleForm.appCodeName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('终端类型')">
              <el-input v-model="ruleForm.typeName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('付费状态')">
              <el-input v-model="ruleForm.hasPayName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('账号创建时间')">
              <el-input v-model="ruleForm.createTime" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('限制级开关')">
              <el-input v-model="ruleForm.restrictedStatusName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <hr class="hr">

        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('绑定邮箱')">
              <el-input v-model="ruleForm.bindMailStatusName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('电子邮箱')">
              <el-input v-model="ruleForm.email" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('绑定手机')">
              <el-input v-model="ruleForm.bindMobileStatusName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('手机')">
              <el-input v-model="ruleForm.mobile" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>

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
