<template>
  <div class="index-page" v-show="power['boss_check_netApi']">
    <el-button v-show="power['boss_create_netApi']" @click="addOrUpdateNeturl()" type="warning">{{$t('新增网元接口')}}
    </el-button>
    <el-button v-show="power['boss_delete_netApi']" @click="deleteNeturl()" type="warning">{{$t('删除网元接口')}}
    </el-button>
    <div class="form-check">
      <label>
        {{$t('接口名称')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.apiName" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>
    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33' v-show="power['boss_delete_netApi']"></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('接口名称')" show-overflow-tooltip prop="apiName" min-width="120"></el-table-column>

      <el-table-column :label="$t('URL接口地址')" show-overflow-tooltip prop="uri" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('创建用户')" show-overflow-tooltip prop="creater" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('最后修改用户')" show-overflow-tooltip prop="updater" min-width="140">
      </el-table-column>

      <el-table-column :label="$t('最后修改时间')" show-overflow-tooltip prop="updateTime" min-width="130">
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_update_netApi']" @click="addOrUpdateNeturl(scope.row)" type="text"
            size="small">
            {{$t('修改')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

    <!--新增修改部分-->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="dialogTableVisible">
        <Add :detailsObj="detailsObj" :addTime="addTime" v-on:message="search"></Add>
      </el-dialog>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
  .index-page {
    .dialog-form {
      margin-top: 20px;
    }
  }

</style>
