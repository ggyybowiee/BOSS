<template>
  <div class="index-page" v-show="power['boss_check_package']">
    <el-button v-show="power['boss_create_package']" @click="addOrUpdate()" type="warning">{{$t('新增套餐')}}
    </el-button>
    <el-button v-show="power['boss_synchro_package']" @click="synchro()" type="warning">
      {{$t('同步')}}
    </el-button>
    <el-button style="margin-bottom: 5px;" v-show="power['boss_delete_package']" @click="remove()" type="warning">
      {{$t('删除')}}
    </el-button>
    <div class="form-check">
      <label>
        {{$t('套餐名称')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.packageName" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label class="product-code">
        {{$t('套餐编码')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.packageCode" :placeholder="$t('精确搜索')"></el-input>
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

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33'></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('套餐名称')" show-overflow-tooltip prop="packageName" min-width="100"></el-table-column>

      <el-table-column :label="$t('套餐编码')" show-overflow-tooltip prop="packageCode" min-width="200"></el-table-column>

      <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('计费周期')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <p>{{scope.row.chargeCycle}}{{scope.row.chargeUnit | filterChargeUnitOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('价格($)')" show-overflow-tooltip prop="price" min-width="80"></el-table-column>

      <el-table-column :label="$t('生效日期')" show-overflow-tooltip prop="effectDate" min-width="100"></el-table-column>

      <el-table-column :label="$t('失效日期')" show-overflow-tooltip prop="invalidDate" min-width="100"></el-table-column>

      <el-table-column :label="$t('详情')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text" size="small">{{$t('查看')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button @click="link(scope.row)" type="text" size="small">
            {{$t('关联')}}</el-button>
          <el-button v-show="power['boss_update_package']" @click="addOrUpdate(scope.row)" type="text" size="small">
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
      <el-dialog :title="title" v-model="dialogTableVisible" customClass="custom-dialog-width">
        <Add :detailsObj="detailsObj" :addTime="addTime" v-on:message="search" :chargeUnitOptions="chargeUnitOptions">
        </Add>
      </el-dialog>
    </div>

    <!-- 关联 -->
    <div class="mode-ref" style="position:relative;">
      <el-dialog :title="title" v-model="linkVisible">
        <LinkDialog :detailsObj="detailsObj" :power="power" :linkTime="linkTime">
        </LinkDialog>
      </el-dialog>
    </div>

    <!-- 查看详情 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="detailVisible" customClass="custom-dialog-width">
        <ShowDetail :detailsObj="detailsObj" :showDetailTime="showDetailTime" :statusOptions="statusOptions"
          :chargeUnitOptions="chargeUnitOptions">
        </ShowDetail>
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
