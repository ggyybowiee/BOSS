<template>
  <div class="index-page" v-show="power['boss_check_dictionaryboss']">
    <el-button v-show="power['boss_create_dictionaryboss']" @click="addOrUpdateDic()" type="warning">
      {{$t('新增字典')}}
    </el-button>
    <el-button v-show="power['boss_delete_dictionaryboss']" @click="deleteDic()" type="warning">
      {{$t('删除字典')}}
    </el-button>

    <div class="form-check">
      <label>
        {{$t('字典类型')}}：
        <div>
          <template>
            <el-select v-model="params.dictType" filterable @change="search">
              <el-option v-for="item in dictTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </label>

      <label>
        {{$t('字典key')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.dictName" :placeholder="$t('精确搜索')"></el-input>
        </div>
      </label>

      <el-button :disabled="oneClick" @click="search" type="warning">{{$t('查询')}}</el-button>
      <el-button :disabled="oneClick" @click="reset" type="warning">{{$t('重置')}}</el-button>
    </div>
    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      max-height="700" v-loading.lock="loading" :element-loading-text="$t('拼命加载中')"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33' :selectable="checkboxCanSelect"
        v-show="power['boss_delete_dictionaryboss	']"></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('字典类型')" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <p>{{scope.row.dictType | filterDictTypeOptions}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('字典key')" show-overflow-tooltip prop="dictName" min-width="120"></el-table-column>

      <el-table-column :label="$t('字典值')" show-overflow-tooltip prop="dictValue" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('是否固定')" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <p v-show="scope.row.isfixed==0">×</p>
          <p v-show="scope.row.isfixed==1">√</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('创建用户')" show-overflow-tooltip prop="creater" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('最后修改用户')" show-overflow-tooltip prop="updater" min-width="140">
      </el-table-column>

      <el-table-column :label="$t('最后修改时间')" show-overflow-tooltip prop="updateTime" min-width="130">
      </el-table-column>

      <el-table-column :label="$t('备注')" show-overflow-tooltip prop="note" min-width="100">
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_update_dictionaryboss']" @click="addOrUpdateDic(scope.row)" type="text"
            size="small" :disabled="scope.row.isfixed=='1'">
            {{$t('修改')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增修改部分-->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="dialogTableVisible">
        <Add :detailsObj="detailsObj" :addTime="addTime" v-on:message="search" :dictTypeOptions="dictTypeOptions"></Add>
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
