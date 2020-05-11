<template>
  <div style="margin-top: -10px;" v-show="power['boss_check_neSyncPolicy']">
    <div style="margin-bottom: 20px;">
      <el-button v-show="power['boss_create_neSyncPolicy']" @click="addOrUpdatePolicy()" type="warning">{{$t('新增策略')}}
      </el-button>
      <el-button v-show="power['boss_delete_neSyncPolicy']" @click="deletePolicy()" type="warning">{{$t('删除策略')}}
      </el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33' v-show="power['boss_delete_neSyncPolicy']"></el-table-column>

      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('策略类型')" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <p v-show="scope.row.policyType==1">{{$t('按内容提供商')}}</p>
          <p v-show="scope.row.policyType==2">{{$t('按接口同步')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('策略标识')" show-overflow-tooltip prop="policyIdentify" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('描述')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text" size="small">{{$t('查看')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('创建用户')" show-overflow-tooltip prop="creater" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('创建时间')" show-overflow-tooltip prop="createTime" min-width="130">
      </el-table-column>

      <el-table-column :label="$t('最后修改用户')" show-overflow-tooltip prop="updater" min-width="140">
      </el-table-column>

      <el-table-column :label="$t('最后修改时间')" show-overflow-tooltip prop="updateTime" min-width="130">
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_update_neSyncPolicy']" @click="addOrUpdatePolicy(scope.row)" type="text"
            size="small">
            {{$t('修改')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>
  </div>
</template>
<script src="./policy.js"></script>
<style>
</style>
