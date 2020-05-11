<template>
  <div class="index-page" v-show="power['boss_check_ottmanage']">
    <div class="form-check">
      <label>
        {{$t('用户名')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.userName" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('归属区域')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.area" :placeholder="$t('精确搜索')"></el-input>
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
        {{$t('数据来源')}}：
        <div>
          <template>
            <el-select v-model="params.source" filterable @change="search">
              <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('创建时间')}}：
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

    <div class="button-group">
      <el-button style="margin-bottom: 5px;" v-show="power['boss_synchro_ottmanage']" @click="synchro()" type="warning">
        {{$t('同步')}}
      </el-button>

      <!-- 新增OTT用户暂时不用了，需要的时候在cas权限树新增该资源编码，代码暂时保留新增功能 -->
      <el-button v-show="power['boss_create_ottmanage']" @click="addOrUpdate()" type="warning">{{$t('新增OTT用户')}}
      </el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33'></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('用户名')" show-overflow-tooltip prop="userName" min-width="100"></el-table-column>

      <el-table-column :label="$t('归属区域')" show-overflow-tooltip prop="area" min-width="80"></el-table-column>

      <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.status==0">{{$t('禁用')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.status==1">{{$t('启用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('数据来源')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <p v-show="scope.row.source==1">BOSS</p>
          <p v-show="scope.row.source==2">AAA</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('在线数')" show-overflow-tooltip prop="onlineNum" min-width="70"></el-table-column>

      <el-table-column label="SN or MAC" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <el-button @click="details(scope.row, 'sn')" type="text">{{scope.row.sn}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('创建用户')" show-overflow-tooltip prop="creater" min-width="80"></el-table-column>

      <el-table-column :label="$t('创建时间')" show-overflow-tooltip prop="createTime" min-width="130"></el-table-column>

      <el-table-column :label="$t('详情')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <el-button @click="details(scope.row, 'ott')" type="text" size="small">{{$t('查看')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_update_ottmanage']" @click="addOrUpdate(scope.row)" type="text" size="small">
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
        <Add :detailsObj="detailsObj" :addTime="addTime" v-on:message="search" :updateSnTime="updateSnTime"
          v-on:showOttBindTerminal="showOttBindTerminal">
        </Add>
      </el-dialog>
    </div>

    <!-- 查看详情 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="detailVisible" customClass="custom-dialog-width">
        <ShowDetail :detailsObj="detailsObj" :showDetailTime="showDetailTime" :statusOptions="statusOptions">
        </ShowDetail>
      </el-dialog>
    </div>

    <!-- OTT账户绑定终端信息 -->
    <div class="model-stream" style="position:relative;">
      <el-dialog :title="title" v-model="ottBindTerminalVisible" customClass="custom-dialog-width">
        <OttBindTerminal :ottBindTerminalTime="ottBindTerminalTime" v-on:setSn="setSn">
        </OttBindTerminal>
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
