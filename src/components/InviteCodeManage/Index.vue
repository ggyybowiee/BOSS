<template>
  <div class="index-page" v-show="power['boss_getInviteCode']">
    <div class="form-check">
      <label>
        {{$t('默认账号')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.userId" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('所属用户体系')}}：
        <div>
          <template>
            <el-select v-model="params.appCode" filterable @change="search">
              <el-option v-for="item in appCodeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('邀请码')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.inviteCode" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('邀请码状态')}}：
        <div>
          <template>
            <el-select v-model="params.inviteCodeStatus" filterable @change="search">
              <el-option v-for="item in inviteCodeStatusOptions" :key="item.value" :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('是否已使用过邀请码')}}：
        <div>
          <template>
            <el-select v-model="params.invitedStatus" filterable @change="search">
              <el-option v-for="item in invitedStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>

    <div class="button-group">
      <el-button v-show="power['boss_batchUpdateInviteCode']" @click="batchUpdate()" type="warning">
        {{$t('批量修改邀请码状态')}}
      </el-button>
      <el-button v-show="power['boss_syncInviteCode']" @click="synchro()" type="warning">
        {{$t('同步')}}
      </el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33'></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70" key="1"></el-table-column>

      <el-table-column :label="$t('默认账号')" show-overflow-tooltip prop="userId" min-width="100" key="2">
      </el-table-column>

      <el-table-column :label="$t('所属用户体系')" show-overflow-tooltip min-width="120" key="3">
        <template scope="scope">
          <p>{{scope.row.appCode | filterAppCodeOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('账号类型')" show-overflow-tooltip min-width="70" key="4">
        <template scope="scope">
          <p>{{commonFilter(scope.row.accountType, accountOptions)}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('邀请码')" show-overflow-tooltip prop="inviteCode" min-width="70" key="5">
      </el-table-column>

      <el-table-column :label="$t('邀请码状态')" show-overflow-tooltip min-width="70" key="6">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.inviteCodeStatus==0">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.inviteCodeStatus==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('邀请记录')" show-overflow-tooltip min-width="120"
        v-if="power['boss_inviteCode_inviterInviteRecord']" key="7">
        <template scope="scope">
          <el-button @click="details(scope.row, 1)" type="text" size="small" :disabled="!scope.row.inviteCode">
            {{$t('查看')}}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('邀请奖励记录')" show-overflow-tooltip min-width="120"
        v-if="power['boss_inviteCode_inviterRewardRecord']" key="8">
        <template scope="scope">
          <el-button @click="details(scope.row, 2)" type="text" size="small" :disabled="!scope.row.inviteCode">
            {{$t('查看')}}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('是否已使用过邀请码')" show-overflow-tooltip min-width="120" key="9">
        <template scope="scope">
          <p>{{scope.row.invitedStatus == 1 ? $t('是') : $t('否')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('被邀请奖励')" show-overflow-tooltip min-width="100"
        v-if="power['boss_inviteCode_inviteeRewardRecord']" key="10">
        <template scope="scope">
          <el-button @click="details(scope.row, 3)" type="text" size="small" :disabled="scope.row.invitedStatus != 1">
            {{$t('查看')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

    <!--批量修改-->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="dialogTableVisible">
        <BatchUpdate :selectedData="selectedData" :addTime="addTime" v-on:message="search">
        </BatchUpdate>
      </el-dialog>
    </div>

    <!-- 查看详情 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="detailVisible" customClass="custom-dialog-width">
        <ShowDetail :detailsObj="detailsObj" :showDetailTime="showDetailTime" :appIds="appIds"
          :appCodeOptions="appCodeOptions">
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

    .button-group {
      padding: 5px 0px 10px 0px;
      overflow: hidden;
      width: 100%;
    }
  }

</style>
