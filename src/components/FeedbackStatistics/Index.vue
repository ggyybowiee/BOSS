<template>
  <div class="index-page" v-show="power['boss_getFeedbackInfo']">
    <el-button style="margin-bottom: 5px;" v-show="power['boss_exportFeedbackInfo']" @click="exportFeedbackInfo()"
      type="warning">{{$t('导出反馈信息')}}</el-button>

    <div class="form-check">
      <label>
        <div>
          <el-select v-model="params.uidType" filterable @change="search">
            <el-option v-for="item in uidTypeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </label>

      <label>
        <span v-if="params.uidType == '1'" class="red">*</span>
        {{$t('默认账号')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.userId"></el-input>
        </div>
      </label>

      <label>
        {{$t('反馈内容')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.feedbackInfo" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('反馈类型')}}：
        <div>
          <template>
            <el-select v-model="params.feedbackType" filterable @change="search">
              <el-option v-for="item in feedbackTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('反馈平台')}}：
        <div>
          <template>
            <el-select v-model="params.feedbackPlatform" filterable @change="search">
              <el-option v-for="item in feedbackPlatformOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('应用名称')}}：
        <div>
          <template>
            <el-select v-model="params.portalCode" filterable @change="search">
              <el-option v-for="item in portalCodeOptions" :key="item.dictName" :label="item.dictValue"
                :value="item.dictName"></el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('版本')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.apkVer" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('国家')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.country" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('反馈时间')}}：
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
      <el-table-column type="selection" width="33"></el-table-column>
      <el-table-column fixed :resizable="false" :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('默认账号')" show-overflow-tooltip prop="userId" min-width="80"></el-table-column>

      <el-table-column :label="$t('已绑邮箱')" show-overflow-tooltip prop="bindEmail" min-width="100"></el-table-column>

      <el-table-column :label="$t('已绑手机号')" show-overflow-tooltip prop="bindMobile" min-width="100"></el-table-column>

      <el-table-column :label="$t('联系方式')" show-overflow-tooltip prop="concaction" min-width="100"></el-table-column>

      <el-table-column :label="$t('反馈类型')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p>{{scope.row.feedbackType | filterFeedbackTypeOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('反馈内容')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text">{{scope.row.feedbackInfo}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('是否有图')" show-overflow-tooltip min-width="70">
        <template scope="scope">
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.isImage == 1">{{$t('有')}}</p>
          <p v-show="scope.row.isImage != 1">{{$t('没有')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('应用名称')" show-overflow-tooltip min-width="100">
        <template scope="scope">
          <p>{{scope.row.pkg | filterPortalCodeOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('版本')" show-overflow-tooltip prop="apkVer" min-width="70"></el-table-column>

      <el-table-column :label="$t('反馈时间')" show-overflow-tooltip prop="feedbackTime" min-width="130"></el-table-column>

      <el-table-column :label="$t('国家')" show-overflow-tooltip prop="country" min-width="70"></el-table-column>

      <el-table-column :label="$t('城市')" show-overflow-tooltip prop="city" min-width="70"></el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

    <div class="model-heard" style="position:relative;">
      <el-dialog :title="$t('反馈内容详情')" v-model="dialogTableVisible" customClass="custom-dialog-width">
        <h3 style="text-align: left; padding: 0px 30px;margin: 0">{{dialogData.feedbackInfo}}</h3>

        <div class="image-zoom">
          <viewer :images="dialogData.imageList">
            <img v-for="src in dialogData.imageList" :src="src" :key="src" :title="$t('点击查看大图')" width="200">
          </viewer>
        </div>
      </el-dialog>
    </div>

    <!--导出-->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="$t('导出反馈信息')" v-model="exportDialogVisible" customClass="export-dialog">
        <Add :selectedDatas="selectedDatas" :searchData="searchData" :addTime="addTime"></Add>
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

    .red {
      color: #f00;
    }

    .image-zoom {
      text-align: center;

      img {
        cursor: pointer;
      }
    }
  }

</style>
