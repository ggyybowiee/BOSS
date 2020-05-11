<template>
  <div class="index-page" v-show="power['boss_check_workOrder']">
    <el-button v-show="power['boss_resend_workOrder']" @click="resend()" type="warning">{{$t('重发')}}</el-button>
    <div class="form-check">
      <label>
        {{$t('网元名称')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.neName" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('状态')}}：
        <div>
          <template>
            <el-select v-model="params.requestStatus" filterable @change="search">
              <el-option v-for="item in requestStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('请求地址')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.requestUrl" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('报文')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.requestMsg" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('时间段')}}：
        <div style="width: 350px;">
          <div class="block">
            <el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions"
              :placeholder="$t('选择时间范围')" align="right" @change="search"></el-date-picker>
          </div>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset_search" type="warning">{{$t('重置')}}</el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%"
      v-loading.lock="loading" v-loading="loading" :element-loading-text="$t('拼命加载中')"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33' :selectable="checkboxCanSelect"></el-table-column>
      <el-table-column fixed :resizable='false' :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('网元名称')" show-overflow-tooltip prop="neName" min-width="80"></el-table-column>

      <el-table-column :label="$t('请求地址')" show-overflow-tooltip prop="requestUrl" min-width="150"></el-table-column>

      <el-table-column :label="$t('请求时间')" show-overflow-tooltip prop="requestTime" min-width="130"></el-table-column>

      <el-table-column :label="$t('响应时间')" show-overflow-tooltip prop="responseTime" min-width="130"></el-table-column>

      <el-table-column :label="$t('报文')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text" size="small">{{$t('查看')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.requestStatus==0">{{$t('发送成功')}}</p>
          <p v-show="scope.row.requestStatus==1">{{$t('未发送')}}</p>
          <p style="color: rgb(255, 215, 0);" v-show="scope.row.requestStatus==2">{{$t('发送中')}}</p>
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.requestStatus==3">{{$t('发送失败')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_resend_workOrder'] && scope.row.requestStatus==3" @click="resend(scope.row)"
            type="text" size="small">{{$t('重发')}}</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

    <div class="model-heard" style="position:relative;">
      <el-dialog :title="$t('报文详情')" v-model="dialogTableVisible" customClass="custom-dialog-width">
        <el-table :data="dialogTableData" border style="width: 100%">
          <el-table-column :label="$t('网元名称')" show-overflow-tooltip prop="neName" min-width="80"></el-table-column>

          <el-table-column :label="$t('内容提供商')" show-overflow-tooltip min-width="80" prop="provider">
          </el-table-column>

          <el-table-column :label="$t('关联性标识')" show-overflow-tooltip min-width="80" prop="correlateId">
          </el-table-column>

          <el-table-column :label="$t('请求地址')" show-overflow-tooltip prop="requestUrl" min-width="150">
          </el-table-column>

          <el-table-column :label="$t('请求时间')" show-overflow-tooltip prop="requestTime" min-width="130">
          </el-table-column>

          <el-table-column :label="$t('响应时间')" show-overflow-tooltip prop="responseTime" min-width="130">
          </el-table-column>

          <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
            <template scope="scope">
              <p style="color: rgb(0, 255, 0);" v-show="scope.row.requestStatus==0">{{$t('发送成功')}}</p>
              <p v-show="scope.row.requestStatus==1">{{$t('未发送')}}</p>
              <p style="color: rgb(255, 215, 0);" v-show="scope.row.requestStatus==2">{{$t('发送中')}}</p>
              <p style="color: rgb(220, 20, 60);" v-show="scope.row.requestStatus==3">{{$t('发送失败')}}</p>
            </template>
          </el-table-column>
        </el-table>

        <el-form ref="form" label-width="80px" class="dialog-form">
          <el-form-item :label="$t('报文')">
            <el-input type="textarea" :rows="7" v-model="dialogData.requestMsg" readonly></el-input>
          </el-form-item>

          <el-form-item :label="$t('返回结果')">
            <el-input type="textarea" :rows="7" v-model="dialogData.responseMsg" readonly></el-input>
          </el-form-item>

        </el-form>

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
