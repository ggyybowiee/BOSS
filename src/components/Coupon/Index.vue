<template>
  <div class="index-page" v-show="power['boss_check_coupon']">
    <div class="form-check">
      <label>
        {{$t('优惠券策略名称')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.name" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label class="product-code">
        {{$t('优惠券编码')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.couponCode" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('应用名称')}}：
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
        {{$t('发布状态')}}：
        <div>
          <template>
            <el-select v-model="params.status" filterable @change="search">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('优惠券类型')}}：
        <div>
          <template>
            <el-select v-model="params.couponType" filterable @change="search">
              <el-option v-for="item in couponTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>
    <div class="button-group">
      <el-button v-show="power['boss_noticeSyncMetadata_coupon']" @click="synchro()" type="warning">{{$t('同步')}}
      </el-button>
      <el-button v-show="power['boss_release_coupon']" @click="release('2')" type="warning">{{$t('发布')}}</el-button>
      <el-button style="margin-bottom: 5px;" v-show="power['boss_release_coupon']" @click="release('3')" type="warning">
        {{$t('取消发布')}}</el-button>
      <el-button v-show="power['boss_create_coupon']" @click="addOrUpdate()" type="warning">{{$t('新增')}}</el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="33"></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('优惠券策略名称')" show-overflow-tooltip prop="name" min-width="120"></el-table-column>

      <el-table-column :label="$t('优惠券编码')" show-overflow-tooltip prop="couponCode" min-width="140"></el-table-column>

      <el-table-column :label="$t('应用名称')" show-overflow-tooltip min-width="140">
        <template scope="scope">
          <p>{{scope.row.appId | filterAppIdOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('套餐名称')" show-overflow-tooltip prop="packageName" min-width="80"></el-table-column>

      <el-table-column :label="$t('发布状态')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <p style="color: rgb(255, 215, 0);" v-show="scope.row.status==1">{{$t('未发布')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==2">{{$t('已发布')}}</p>
          <p style="color: rgb(220, 20, 60)" v-show="scope.row.status==3">{{$t('取消发布')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('生效日期')" show-overflow-tooltip prop="effectTime" min-width="100"></el-table-column>

      <el-table-column :label="$t('失效日期')" show-overflow-tooltip prop="invalidTime" min-width="100"></el-table-column>

      <el-table-column :label="$t('创建时间')" show-overflow-tooltip prop="createTime" min-width="130"></el-table-column>

      <el-table-column :label="$t('详情')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text" size="small">{{$t('查看')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_update_coupon']" @click="addOrUpdate(scope.row)" type="text"
            :disabled="scope.row.status == 2" size="small">{{$t('修改')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

    <!--新增修改部分-->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="dialogTableVisible" customClass="custom-dialog-width">
        <Add :detailsObj="detailsObj" :addTime="addTime" v-on:message="search" :appIdOptions="appIdOptions"></Add>
      </el-dialog>
    </div>

    <!-- 查看详情 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="$t('查看详情')" v-model="detailVisible" customClass="custom-dialog-width">
        <ShowDetail :detailsObj="detailsObj" :showDetailTime="showDetailTime" :appIdOptions="appIdOptions"></ShowDetail>
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

    .button-group {
      padding: 5px 0px 10px 0px;
      overflow: hidden;
      width: 100%;
    }
  }

</style>
