<template>
  <div class="index-page" v-show="power['boss_getInviteRules']">
    <div class="form-check">
      <label>
        {{$t('奖励规则名称')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.name" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('发布状态')}}：
        <div>
          <template>
            <el-select v-model="params.releaseStatus" filterable @change="search">
              <el-option v-for="item in releaseStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
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
        {{$t('邀请人账号类型')}}：
        <div>
          <template>
            <el-select v-model="params.inviterAccountType" filterable @change="search">
              <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('受邀人账号类型')}}：
        <div>
          <template>
            <el-select v-model="params.inviteeAccountType" filterable @change="search">
              <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>

    <div class="button-group">
      <el-button v-show="power['boss_addInviteRules']" @click="addOrUpdate()" type="warning">
        {{$t('新增')}}
      </el-button>
      <el-button v-show="power['boss_releaseInviteRules']" @click="release(2)" type="warning">{{$t('发布')}}
      </el-button>
      <el-button v-show="power['boss_releaseInviteRules']" @click="release(3)" type="warning">{{$t('取消发布')}}
      </el-button>
      <el-button v-show="power['boss_deleteInviteRules']" @click="remove()" type="warning">
        {{$t('删除')}}
      </el-button>
      <el-button v-show="power['boss_noticeSyncMetadata']" @click="synchro()" type="warning">
        {{$t('同步')}}
      </el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33'></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('奖励规则名称')" show-overflow-tooltip prop="name" min-width="100"></el-table-column>

      <el-table-column :label="$t('奖励规则描述')" show-overflow-tooltip prop="detail" min-width="100"></el-table-column>

      <el-table-column :label="$t('发布状态')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <p style="color: rgb(255, 215, 0);" v-show="scope.row.releaseStatus==1">{{$t('未发布')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.releaseStatus==2">{{$t('已发布')}}</p>
          <p style="color: rgb(220, 20, 60)" v-show="scope.row.releaseStatus==3">{{$t('取消发布')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('应用名称')" show-overflow-tooltip min-width="100">
        <template scope="scope">
          <p>{{scope.row.appId | filterAppIdOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('生效日期')" show-overflow-tooltip prop="effectTime" min-width="100">
      </el-table-column>

      <el-table-column :label="$t('失效日期')" show-overflow-tooltip prop="invalidTime" min-width="100">
      </el-table-column>

      <el-table-column :label="$t('邀请人账号类型')" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <p>{{scope.row.inviterAccountType | filterAccountOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('受邀人账号类型')" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <p>{{scope.row.inviteeAccountType | filterAccountOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('邀请人奖励配置')" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <el-button @click="link(scope.row, 1)" type="text" size="small">{{$t('关联')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('受邀人奖励配置')" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <el-button @click="link(scope.row, 2)" type="text" size="small">{{$t('关联')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_updateInviteRules']" @click="addOrUpdate(scope.row)" type="text" size="small"
            :disabled="scope.row.releaseStatus == 2">
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
        <Add :detailsObj="detailsObj" :addTime="addTime" v-on:message="search" :accountOptions="accountOptions"
          :appIdOptions="appIdOptions"></Add>
      </el-dialog>
    </div>

    <!-- 关联 -->
    <div class="mode-ref" style="position:relative;">
      <el-dialog :title="title" v-model="linkVisible">
        <LinkDialog :detailsObj="detailsObj" :power="power" :linkTime="linkTime">
        </LinkDialog>
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
