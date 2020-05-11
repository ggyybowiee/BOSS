<template>
  <div class="show-detail">
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('默认账号')">
            <el-input v-model="ruleForm.userId" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('邀请码')">
            <el-input v-model="ruleForm.inviteCode" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('所属用户体系')">
            <el-input v-model="ruleForm.appCodeName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('账号类型')">
            <el-input v-model="ruleForm.accountTypeName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <hr class="hr" />

      <div v-if="type == 1">
        <p class="title">{{$t('邀请码被兑换使用记录')}}</p>

        <div class="form-check">
          <label>
            {{$t('账号类型')}}：
            <div>
              <template>
                <el-select v-model="params.inviteeAccountType" filterable @change="search">
                  <el-option
                    v-for="item in accountOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </div>
          </label>

          <label>
            {{$t('邀请码兑换入口')}}：
            <div>
              <template>
                <el-select v-model="params.appId" filterable @change="search">
                  <el-option
                    v-for="item in appIds"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </div>
          </label>

          <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
          <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
        </div>

        <el-table
          ref="multipleTable"
          :data="list"
          border
          tooltip-effect="dark"
          style="width: 100%"
          v-loading.lock="loading"
          :element-loading-text="$t('拼命加载中')"
          key="table1"
        >
          <el-table-column fixed :resizable="false" :label="$t('序号')" type="index" width="70"></el-table-column>

          <el-table-column
            :label="$t('受邀人默认账号')"
            show-overflow-tooltip
            prop="inviteeUserId"
            min-width="100"
          ></el-table-column>

          <el-table-column :label="$t('账号类型')" show-overflow-tooltip min-width="70">
            <template scope="scope">
              <p>{{commonFilter(scope.row.inviteeAccountType, accountOptions)}}</p>
            </template>
          </el-table-column>

          <el-table-column :label="$t('邀请码兑换入口')" show-overflow-tooltip min-width="70">
            <template scope="scope">
              <p>{{commonFilter(scope.row.appId, appIds)}}</p>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('兑换时间')"
            show-overflow-tooltip
            prop="createTime"
            min-width="130"
          ></el-table-column>

          <el-table-column :label="$t('兑换地点')" show-overflow-tooltip min-width="70">
            <template scope="scope">
              <p
                v-show="scope.row.country && scope.row.city"
              >{{scope.row.country}}, {{scope.row.city}}</p>
            </template>
          </el-table-column>

          <el-table-column :label="$t('兑换IP')" show-overflow-tooltip prop="ip" min-width="130"></el-table-column>
        </el-table>

        <!--分页部分-->
        <v-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-number="params.pageNum"
          :page-size="params.pageSize"
        ></v-pagination>
      </div>

      <div v-if="type == 2">
        <p class="title">{{$t('邀请奖励记录')}}</p>

        <el-table
          ref="multipleTable"
          :data="list"
          border
          tooltip-effect="dark"
          style="width: 100%"
          v-loading.lock="loading"
          :element-loading-text="$t('拼命加载中')"
          key="table2"
        >
          <el-table-column fixed :resizable="false" :label="$t('序号')" type="index" width="70"></el-table-column>

          <el-table-column :label="$t('奖励详情')" show-overflow-tooltip prop="reward" min-width="150"></el-table-column>

          <el-table-column
            :label="$t('奖励时间')"
            show-overflow-tooltip
            prop="createTime"
            min-width="130"
          ></el-table-column>
        </el-table>

        <!--分页部分-->
        <v-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-number="params.pageNum"
          :page-size="params.pageSize"
        ></v-pagination>
      </div>

      <div v-if="type == 3">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('邀请人账号')">
              <el-input v-model="invideCodePrizeObj.inviterUserId" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('邀请人邀请码')">
              <el-input v-model="invideCodePrizeObj.inviteCode" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('兑换时间')">
              <el-input v-model="invideCodePrizeObj.createTime" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('兑换地点')">
              <el-input v-model="invideCodePrizeObj.checkAddress" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('被邀请奖励')">
              <el-input type="textarea" v-model="invideCodePrizeObj.reward" readonly :rows="5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script src="./showDetail.js"></script>

<style lang="less" scoped>
.hr {
  border-top: 1px solid #bfcbd9;
  margin: 20px 0;
  margin-top: 8px;
  width: 100%;
}

.title {
  margin: 0;
  color: #000;
  font-weight: bold;
  margin-bottom: 5px;
}
</style>
