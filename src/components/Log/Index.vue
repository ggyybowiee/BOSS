<template>
  <div class="index-page" v-show="power['boss_check_bosslogsuite']">
    <div class="form-check">
      <label>
        {{$t('用户名')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.userName" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('操作业务')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.operationService" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('操作')}}：
        <div>
          <template>
            <el-select v-model="params.operation" filterable @change="search">
              <el-option v-for="item in operationOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('结果')}}：
        <div>
          <template>
            <el-select v-model="params.operationResult" filterable @change="search">
              <el-option v-for="item in operationResultOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </template>
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
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>
    <el-table ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%" v-loading.lock="loading"
      :element-loading-text="$t('拼命加载中')">
      <el-table-column fixed :resizable="false" :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('用户名')" show-overflow-tooltip prop="userName" min-width="120"></el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <p>{{scope.row.operation | filterOperationOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作业务')" show-overflow-tooltip min-width="200" prop="operationService">
      </el-table-column>

      <el-table-column label="IP" show-overflow-tooltip prop="operationIp" min-width="120"></el-table-column>

      <el-table-column :label="$t('耗时(ms)')" show-overflow-tooltip prop="executeTime" min-width="80"></el-table-column>

      <el-table-column :label="$t('结果')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p>{{scope.row.operationResult | filterOperationResultOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('结果描述')" show-overflow-tooltip prop="operationMessage" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('操作时间')" show-overflow-tooltip prop="operationTime" min-width="130"></el-table-column>

      <el-table-column :label="$t('查看详情')" show-overflow-tooltip fixed="right" min-width="120">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text" size="small">{{$t('查看')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

    <div class="model-heard" style="position:relative;">
      <el-dialog :title="$t('查看详情')" v-model="dialogTableVisible" customClass="custom-dialog-width">
        <el-table :data="dialogTableData" border style="width: 100%">
          <el-table-column :label="$t('用户名')" show-overflow-tooltip prop="userName" min-width="120"></el-table-column>

          <el-table-column :label="$t('操作')" show-overflow-tooltip min-width="80">
            <template scope="scope">
              <p v-show="scope.row.operation==1">{{$t('增加')}}</p>
              <p v-show="scope.row.operation==2">{{$t('修改')}}</p>
              <p v-show="scope.row.operation==3">{{$t('删除')}}</p>
              <p v-show="scope.row.operation==4">{{$t('导入')}}</p>
              <p v-show="scope.row.operation==5">{{$t('导出')}}</p>
              <p v-show="scope.row.operation==99">{{$t('其他')}}</p>
            </template>
          </el-table-column>

          <el-table-column :label="$t('操作业务')" show-overflow-tooltip min-width="200" prop="operationService">
          </el-table-column>

          <el-table-column label="IP" show-overflow-tooltip prop="operationIp" min-width="120"></el-table-column>

          <el-table-column :label="$t('耗时(ms)')" show-overflow-tooltip prop="executeTime" min-width="80">
          </el-table-column>

          <el-table-column :label="$t('结果')" show-overflow-tooltip min-width="70">
            <template scope="scope">
              <p v-show="scope.row.operationResult=='0'">{{$t('失败')}}</p>
              <p v-show="scope.row.operationResult=='1'">{{$t('成功')}}</p>
              <p v-show="scope.row.operationResult==''">{{$t('未知')}}</p>
            </template>
          </el-table-column>

          <el-table-column :label="$t('结果描述')" show-overflow-tooltip prop="operationMessage" min-width="120">
          </el-table-column>

          <el-table-column :label="$t('操作时间')" show-overflow-tooltip prop="operationTime" min-width="130">
          </el-table-column>

        </el-table>

        <el-form ref="form" label-width="80px" class="dialog-form">
          <el-form-item :label="$t('Get参数')">
            <el-input type="textarea" :rows="7" v-model="dialogData.requsetArgs" readonly></el-input>
          </el-form-item>

          <el-form-item :label="$t('Body')">
            <el-input type="textarea" :rows="7" v-model="dialogData.requestBody" readonly></el-input>
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
