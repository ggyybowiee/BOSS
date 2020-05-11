<template>
  <div>
    <el-button @click="ref()" type="warning">{{$t('关联')}}
    </el-button>
    <div class="form-check">
      <label>SN：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.sn" :placeholder="$t('模糊搜索')">
          </el-input>
        </div>
      </label>

      <label>MAC：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.macAddr" :placeholder="$t('精确搜索')">
          </el-input>
        </div>
      </label>

      <label>
        {{$t('终端状态')}}：
        <div>
          <template>
            <el-select v-model="params.status" filterable @change="search">
              <el-option v-for="item in terminalStatusOptions" :key="item.value" :label="item.label"
                :value="item.value">
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

      <el-table-column label="SN" show-overflow-tooltip prop="sn" min-width="120">
      </el-table-column>

      <el-table-column label="MAC" show-overflow-tooltip prop="macAddr" min-width="160">
      </el-table-column>

      <el-table-column :label="$t('终端状态')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <p>{{scope.row.status | filterTerminalStatusOptions}}</p>
        </template>
      </el-table-column>
    </el-table>

    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

  </div>
</template>
<script src="./ottBindTerminal.js"></script>
<style>
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #1f2d3d;
    background: #1f2d3d;
  }

  td.el-table_1_column_11 label.el-radio {
    margin-left: -3px;
  }

</style>
