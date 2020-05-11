<template>
  <div class="show-detail">
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="detail-form" v-show="type == 'ott'">
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('用户名')">
            <el-input v-model="ruleForm.userName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('登录密码')">
            <el-input v-model="ruleForm.password" type="password" readonly></el-input>
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
          <el-form-item :label="$t('在线数')">
            <el-input v-model="ruleForm.onlineNum" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('关联终端信息')">
            <el-input v-model="ruleForm.sn" readonly></el-input>
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
          <el-form-item :label="$t('手机号码')">
            <el-input v-model="ruleForm.mobile" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('固定电话')">
            <el-input v-model="ruleForm.tel" readonly></el-input>
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

    <el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="detail-form" v-show="type == 'sn'">
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('类型')">
            <el-input v-model="ruleForm.typeName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SN">
            <el-input v-model="ruleForm.sn" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item label="MAC">
            <el-input v-model="ruleForm.macAddr" readonly></el-input>
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
          <el-form-item :label="$t('终端状态')">
            <el-input v-model="ruleForm.statusName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('跨区域操作')">
            <el-input v-model="ruleForm.crossAllowName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('白名单销售区域')">
            <el-input type="textarea" v-model="ruleForm.whiteSealArea" readonly :rows="3"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('黑名单销售区域')">
            <el-input type="textarea" v-model="ruleForm.blackSealArea" readonly :rows="3"></el-input>
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
