<template>
  <div class="index-page" v-show="power['boss_check_help_question']">
    <el-button v-show="power['boss_create_help_question']" @click="addOrUpdate()" type="warning">{{$t('新增')}}
    </el-button>
    <el-button v-show="power['boss_delete_help_question']" @click="remove()" type="warning">{{$t('删除')}}
    </el-button>
    <el-button v-show="power['boss_release_help_question']" @click="release(1)" type="warning">{{$t('发布')}}
    </el-button>
    <el-button style="margin-bottom: 5px;" v-show="power['boss_release_help_question']" @click="release(0)"
      type="warning">
      {{$t('取消发布')}}
    </el-button>

    <div class="form-check">
      <label>
        {{$t('问题名称(中文)')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.zh_question" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('分类名称(中文)')}}：
        <div>
          <template>
            <el-select v-model="params.type_zh" filterable @change="search">
              <el-option v-for="item in zhClassifyNameOptions" :key="item.value" :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('所属类型')}}：
        <div>
          <template>
            <el-select v-model="params.belong_type" filterable @change="search">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('所属应用')}}：
        <div>
          <template>
            <el-select v-model="params.pkg" filterable @change="search">
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
            <el-select v-model="params.public_status" filterable @change="search">
              <el-option v-for="item in releaseStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>

    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33'>
      </el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('问题名称(中文)')" show-overflow-tooltip prop="zh_question" min-width="200">
      </el-table-column>

      <el-table-column :label="$t('分类名称(中文)')" show-overflow-tooltip prop="type_zh" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('所属类型')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <p>{{scope.row.belong_type | filterTypeOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('所属应用')" show-overflow-tooltip prop="pkg" min-width="140">
      </el-table-column>

      <el-table-column :label="$t('发布状态')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <p style="color: rgb(220, 20, 60);" v-show="scope.row.public_status==0">{{$t('未发布')}}</p>
          <p style="color: rgb(0, 255, 0);" v-show="scope.row.public_status==1">{{$t('已发布')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('显示顺序')" show-overflow-tooltip prop="sort_num" min-width="80">
      </el-table-column>

      <el-table-column :label="$t('详情')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text" size="small">
            {{$t('查看')}}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_update_help_question']" @click="addOrUpdate(scope.row)" type="text"
            :disabled="scope.row.public_status == 1" size="small">
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
        <Add :detailsObj="detailsObj" :addTime="addTime" v-on:message="search" :updateTextTime="updateTextTime"
          v-on:showEditor="showEditor" :zhClassifyNameOptions="zhClassifyNameOptions" :appIdOptions="appIdOptions">
        </Add>
      </el-dialog>
    </div>

    <!-- 查看详情 -->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="$t('查看详情')" v-model="detailVisible" customClass="custom-dialog-width">
        <ShowDetail :detailsObj="detailsObj" :showDetailTime="showDetailTime" :appIdOptions="appIdOptions"
          :zhClassifyNameOptions="zhClassifyNameOptions">
        </ShowDetail>
      </el-dialog>
    </div>


    <div class="model-heard" style="position:relative;">
      <el-dialog :title="$t('富文本编辑')" v-model="editorDialogVisible" customClass="editor-dialog">
        <Editor :editTime="editTime" v-on:setText="setText"></Editor>
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
