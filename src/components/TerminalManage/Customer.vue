<template>
  <div>
    <el-button @click="ref()" type="warning">{{$t('关联')}}
    </el-button>
    <div class="form-check">
      <label>{{$t('用户名')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.operatorName" :placeholder="$t('模糊搜索')">
          </el-input>
        </div>
      </label>

      <label>
        {{$t('状态')}}：
        <div>
          <template>
            <el-select v-model="params.status" filterable @change="search">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>
      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}
      </el-button>
      <el-button :disabled="oneClick" @click="reset_search()" type="warning">{{$t('重置')}}</el-button>
    </div>

    <el-table ref="singleTable" :data="list" border tooltip-effect="dark" highlight-current-row style="width: 100%"
      v-loading.lock="loading" @current-change="handleSelectionChange" :element-loading-text="$t('拼命加载中')">

      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('角色名称')" show-overflow-tooltip prop="roleName" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('用户名')" show-overflow-tooltip prop="operatorName" min-width="160">
      </el-table-column>

      <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>
    </el-table>

    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.page"
      :page-size="params.results_per_page"></v-pagination>

  </div>
</template>
<script src="./customer.js"></script>
<style>
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #1f2d3d;
    background: #1f2d3d;
  }

  td.el-table_1_column_11 label.el-radio {
    margin-left: -3px;
  }

</style>
