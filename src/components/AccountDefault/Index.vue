<template>
  <div class="index-page" v-show="power['boss_check_account']">
    <div class="form-check">
      <label>
        {{$t('默认账号')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.userId" :placeholder="$t('模糊搜索')"></el-input>
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
        {{$t('终端ID')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.sn" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>


      <label>
        {{$t('终端类型')}}：
        <div>
          <template>
            <el-select v-model="params.type" filterable @change="search">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('付费状态')}}：
        <div>
          <template>
            <el-select v-model="params.hasPay" filterable @change="search">
              <el-option v-for="item in hasPayOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('所属客户')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.customer" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('密码状态')}}：
        <div>
          <template>
            <el-select v-model="params.passwordStatus" filterable @change="search">
              <el-option v-for="item in passwordStatusOptions" :key="item.value" :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('邮箱绑定状态')}}：
        <div>
          <template>
            <el-select v-model="params.bindMailStatus" filterable @change="search">
              <el-option v-for="item in bindStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('电子邮箱')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.email" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('手机绑定状态')}}：
        <div>
          <template>
            <el-select v-model="params.bindMobileStatus" filterable @change="search">
              <el-option v-for="item in bindStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('手机')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.mobile" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>

    <div class="button-group">
      <el-button v-show="power['boss_update_account']" @click="batchUpdate()" type="warning">
        {{$t('批量修改状态')}}
      </el-button>
      <el-button v-show="power['boss_sync_account']" @click="synchro()" type="warning">
        {{$t('同步')}}
      </el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33'></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70" key="1"></el-table-column>

      <el-table-column :label="$t('默认账号')" show-overflow-tooltip prop="userId" min-width="80" key="2">
      </el-table-column>

      <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="60" key="3">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('所属用户体系')" show-overflow-tooltip min-width="100" key="4">
        <template scope="scope">
          <p>{{scope.row.appCode | filterAppCodeOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('账号权益')" show-overflow-tooltip min-width="70"
        v-if="power['boss_checkAuthInfo_account']" key="5">
        <template scope="scope">
          <el-button @click="details(scope.row, 1)" type="text" size="small">
            {{$t('查看')}}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('付费状态')" show-overflow-tooltip min-width="70" key="6">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.hasPay==0">{{$t('未付费')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.hasPay==1">{{$t('已付费')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('终端ID')" show-overflow-tooltip prop="sn" min-width="120" key="7">
      </el-table-column>

      <el-table-column :label="$t('所属客户')" show-overflow-tooltip prop="customer" min-width="90" key="8">
      </el-table-column>

      <el-table-column :label="$t('密码状态')" show-overflow-tooltip min-width="70" key="9">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="!scope.row.password">{{$t('未设置')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.password">{{$t('已设置')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('电子邮箱')" show-overflow-tooltip prop="email" min-width="140" key="10">
      </el-table-column>

      <el-table-column :label="$t('手机')" show-overflow-tooltip prop="mobile" min-width="70" key="11">
      </el-table-column>

      <el-table-column :label="$t('更多信息')" show-overflow-tooltip min-width="80" key="12">
        <template scope="scope">
          <el-button @click="details(scope.row, 2)" type="text" size="small">
            {{$t('查看')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" fixed="right" show-overflow-tooltip min-width="80" key="13">
        <template scope="scope">
          <el-button @click="resetPwd(scope.row)" type="text" size="small" :disabled="scope.row.password == null">
            {{$t('重置密码')}}</el-button>
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
