<template>
  <div class="show-detail">
    <el-form :model="ruleForm" ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item>
        <el-button @click="ref('1')" type="warning">{{$t('关联')}}</el-button>
        <el-button @click="ref('2')" type="warning">{{$t('取消关联')}}</el-button>
      </el-form-item>

      <el-form-item :label="$t('机顶盒终端ID')" prop="inviteCodeList">
        <el-input type="textarea" style="width:580px;" v-model="ruleForm.snStr" :rows="7"
          :placeholder="$t('请输入终端ID（多个用回车分隔）')"></el-input>
      </el-form-item>
    </el-form>

  </div>
</template>
<script src="./showDetail.js"></script>
