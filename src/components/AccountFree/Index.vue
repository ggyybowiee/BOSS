<template>
  <div class="index-page" v-show="power['boss_check_free']">
    <el-button v-show="power['boss_add_free']" @click="addOrUpdateFree()" type="warning">{{$t('新增')}}
    </el-button>
    <el-button style="margin-bottom: 5px;" v-show="power['boss_synchro_free']" @click="synchroFree()" type="warning">
      {{$t('同步')}}
    </el-button>
    <div class="form-check">
      <label>
        {{$t('应用ID')}}：
        <div>
          <template>
            <el-select v-model="params.appId" filterable @change="search">
              <el-option v-for="item in appIdOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('状态')}}：
        <div>
          <template>
            <el-select v-model="params.status" @change="search">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('产品名称')}}：
        <div>
          <template>
            <el-select v-model="params.productCode" filterable @change="search">
              <el-option v-for="item in productCodeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label class="product-code">
        {{$t('产品编码')}}：
        <div>
          <el-input v-model="params.productCode" :placeholder="$t('精确搜索')" disabled></el-input>
        </div>
      </label>

      <label>
        {{$t('区域范围')}}：
        <div>
          <template>
            <el-select v-model="params.area" filterable @change="search">
              <el-option v-for="item in areaOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>
    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33' v-show="power['boss_synchro_free']"></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('应用ID')" show-overflow-tooltip prop="appId" min-width="120"></el-table-column>

      <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('授权产品')" show-overflow-tooltip prop="productName" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('产品编码')" show-overflow-tooltip prop="productCode" min-width="200">
      </el-table-column>

      <el-table-column :label="$t('免费试用天数	')" show-overflow-tooltip prop="preAuthDays" min-width="100">
      </el-table-column>

      <el-table-column :label="$t('区域范围')" show-overflow-tooltip prop="area" min-width="80">
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_update_free']" @click="addOrUpdateFree(scope.row)" type="text" size="small">
            {{$t('修改')}}
          </el-button>
          <el-button v-show="power['boss_delete_free']" @click="deleteFree(scope.row)" type="text" size="small">
            {{$t('删除')}}
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
        <Add :detailsObj="detailsObj" :addTime="addTime" v-on:message="search" :appIdOptions="appIdOptions"
          :productCodeOptions="productCodeOptions" :areaOptions="areaOptions"></Add>
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
