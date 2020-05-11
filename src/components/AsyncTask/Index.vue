<template>
  <div class="index-page" v-show="power['boss_check_asynctask']">

    <el-button @click="stopRefresh()" type="warning">{{$t('手动刷新')}}
    </el-button>
    <!-- 隐形的a标签，用于下载 -->
    <a :href="downloadUrl" ref="elementA"></a>

    <div class="form-check">
      <label>
        {{$t('类型')}}：
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

    <el-table ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%" v-loading.lock="loading"
      :element-loading-text="$t('拼命加载中')">

      <el-table-column fixed :resizable="false" :label="$t('序号')" type="index" width="70" key="1">
      </el-table-column>

      <el-table-column :label="$t('类型')" show-overflow-tooltip min-width="120" key="2">
        <template scope="scope">
          <p>{{scope.row.type | filterTypeOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('批存储路径')" show-overflow-tooltip min-width="120" key="3"
        v-if="power['boss_batch_download']">
        <template scope="scope">
          <el-button @click="downloadFile(scope.row, 1)" type="text" :disabled="Number(scope.row.status) < 4">
            {{scope.row.sourceFile}}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('状态')" show-overflow-tooltip min-width="70" key="4">
        <template scope="scope">
          <p>{{scope.row.status | filterStatusOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('进度(%)')" show-overflow-tooltip prop="process" min-width="70" key="5">
      </el-table-column>

      <el-table-column :label="$t('结果存储路径')" show-overflow-tooltip min-width="120" v-if="power['boss_result_download']"
        key="6">
        <template scope="scope">
          <el-button @click="downloadFile(scope.row, 2)" type="text" :disabled="Number(scope.row.status) < 4">
            {{scope.row.resultFile}}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('开始时间')" show-overflow-tooltip prop="beginTime" min-width="130" key="7">
      </el-table-column>

      <el-table-column :label="$t('结束时间')" show-overflow-tooltip prop="endTime" min-width="130" key="8">
      </el-table-column>

      <el-table-column :label="$t('创建用户')" show-overflow-tooltip prop="creater" min-width="70" key="9">
      </el-table-column>

      <el-table-column :label="$t('最后修改时间')" show-overflow-tooltip prop="updateTime" min-width="130" key="10">
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80" key="11"
        v-if="power['boss_reset_asynctask']">
        <template scope="scope">
          <el-button @click="addOrUpdateNeturl(scope.row)" type="text" size="small" :disabled="scope.row.status != '6'">
            {{$t('重置')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>
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
