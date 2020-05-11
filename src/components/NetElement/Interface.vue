<template>
  <div style="margin-top: -20px;">
    <div style="margin-bottom: 20px;">
      <el-button @click="confirm()" type="warning">{{$t('确定')}}
      </el-button>
      <div class="form-check">
        <label>{{$t('接口名称')}}：
          <div>
            <el-input @keyup.enter.native="search" v-model="params.apiName" :placeholder="$t('模糊搜索')">
            </el-input>
          </div>
        </label>
        <el-button @click="search" :disabled="oneClick" type="warning">{{$t('查询')}}</el-button>
        <el-button @click="reset" :disabled="oneClick" type="warning">{{$t('重置')}}</el-button>
      </div>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33'></el-table-column>

      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('接口名称')" show-overflow-tooltip prop="apiName" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('URL接口地址')" show-overflow-tooltip prop="uri" min-width="200">
      </el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>
  </div>
</template>
<script src="./interface.js"></script>
<style>
</style>
