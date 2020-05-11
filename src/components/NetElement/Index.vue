<template>
  <div class="index-page" v-show="power['boss_check_netelement']">
    <el-button v-show="power['boss_create_netelement']" @click="addOrUpdateNet()" type="warning">{{$t('新增网元')}}
    </el-button>
    <el-button v-show="power['boss_delete_netelement']" @click="deleteNet()" type="warning">{{$t('删除网元')}}</el-button>
    <div class="form-check">
      <label>
        {{$t('网元名称')}}：
        <div>
          <el-input @keyup.enter.native="search" v-model="params.neName" :placeholder="$t('模糊搜索')"></el-input>
        </div>
      </label>

      <label>
        {{$t('网元状态')}}：
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
    <el-table class="select-table" ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%;"
      v-loading.lock="loading" :element-loading-text="$t('拼命加载中')" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width='33' v-show="power['boss_delete_netelement']"></el-table-column>
      <el-table-column :resizable="false" fixed :label="$t('序号')" type="index" width="70"></el-table-column>

      <el-table-column :label="$t('网元名称')" show-overflow-tooltip prop="neName" min-width="120"></el-table-column>

      <el-table-column :label="$t('交互地址')" show-overflow-tooltip prop="neSyncUrl" min-width="150"></el-table-column>

      <el-table-column :label="$t('网元状态')" show-overflow-tooltip min-width="120">
        <template scope="scope">
          <p v-show="scope.row.status=='0'" style="color: rgb(220, 20, 60);">{{$t('不可用')}}</p>
          <p v-show="scope.row.status=='1'" style="color: rgb(0, 255, 0);">{{$t('可用')}}</p>
        </template>
      </el-table-column>

      <el-table-column :label="$t('描述')" show-overflow-tooltip min-width="80">
        <template scope="scope">
          <el-button @click="details(scope.row)" type="text" size="small">{{$t('查看')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('创建用户')" show-overflow-tooltip prop="creater" min-width="120">
      </el-table-column>

      <el-table-column :label="$t('最后修改用户')" show-overflow-tooltip prop="updater" min-width="140">
      </el-table-column>

      <el-table-column :label="$t('最后修改时间')" show-overflow-tooltip prop="updateTime" min-width="130">
      </el-table-column>

      <el-table-column :label="$t('操作')" show-overflow-tooltip fixed="right" min-width="80">
        <template scope="scope">
          <el-button v-show="power['boss_update_netelement']" @click="addOrUpdateNet(scope.row)" type="text"
            size="small">
            {{$t('修改')}}
          </el-button>
          <el-button v-show="power['boss_check_neSyncPolicy']" @click="linkPolicy(scope.row)" type="text" size="small">
            {{$t('关联')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页部分-->
    <v-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-number="params.pageNum"
      :page-size="params.pageSize"></v-pagination>

    <!--新增修改部分-->
    <div class="model-heard" style="position:relative;">
      <el-dialog :title="title" v-model="dialogTableVisible">
        <Add :detailsObj="detailsObj" :addTime="addTime" :clickShowRemark="clickShowRemark" v-on:message="search"></Add>
      </el-dialog>
    </div>

    <el-dialog :title="linkPolicyNeName" v-model="linkPolicyVisible" customClass="custom-dialog-width">
      <Policy :detailsObj="detailsObj" :power="power" :policyTime="policyTime" v-on:addPolicy="addPolicyModel"></Policy>
    </el-dialog>

    <div class="model-heard" style="position:relative;">
      <el-dialog :title="policyTitle" v-model="addPolicyTableVisible" customClass="add-policy">
        <AddPolicy :addPolicyTime="addPolicyTime" v-on:reloadPolicyList="getPolicy"
          :addPolicyInterfaceTime="addPolicyInterfaceTime" v-on:getPolicyIdentify="getPolicyIdentify"></AddPolicy>
      </el-dialog>
    </div>

    <el-dialog v-model="interfaceVisible" customClass="custom-dialog-width interface-policy">
      <Interface :interfaceTime="interfaceTime" v-on:setPolicyIdentify="setPolicyIdentify"></Interface>
    </el-dialog>
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
