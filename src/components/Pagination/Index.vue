<template>
  <div class="el-pagination">
    <span class="el-pagination__sizes">
      <el-select v-model="pageSize" @change="changeSize(pageSize)">
        <el-option v-for="item in sizeGroup" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </span>
    <span :class="{'disabled': pageNumber == 1}" @click="prevPage">
      <i class="el-icon el-icon-arrow-left"></i>
    </span>
    <span class="currentPage">{{pageNumber}}</span>
    <span @click="nextPage" class="right-icon">
      <i class="el-icon el-icon-arrow-right"></i>
    </span>
    <span class="ml20 jump-to">{{$t('前往')}}</span>
    <input class="el-pagination__editor" type="type" v-model="jumpPageNumber" @keyup.enter="goPage(jumpPageNumber)" />
    <span class="page-style">{{$t('页')}}</span>
    <span class="jump-go-btn" @click="goPage(jumpPageNumber)">{{$t('GO')}}</span>
  </div>
</template>

<script>
  export default {
    name: "pageHelper",
    data() {
      return {
        jumpPageNumber: null,
        showPrevMore: false,
        showNextMore: false,
        sizeGroup: [{
            label: '10' + this.$t('条/页'),
            value: 10
          },
          {
            label: '20' + this.$t('条/页'),
            value: 20
          },
          {
            label: '50' + this.$t('条/页'),
            value: 50
          },
          {
            label: '100' + this.$t('条/页'),
            value: 100
          }
        ]
      };
    },
    //   获取父组件传入的数据
    props: {
      pageNumber: {
        //当前页面
        type: Number,
        default: 1
      },
      pageGroup: {
        //连续页码个数
        type: Number,
        default: 5
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },
    computed: {},
    methods: {
      prevPage() {
        if (this.pageNumber > 1) {
          this.jumpPage(this.pageNumber - 1);
        }
      },
      nextPage() {
        this.jumpPage(this.pageNumber + 1);
      },

      jumpPage(pageNumber) {
        this.$emit("current-change", pageNumber);
      },
      changeSize(pageSize) {
        this.$emit("size-change", pageSize);
      },
      goPage(val) {
        // 输入正整数
        var reg = /^[1-9]\d*$/;
        if (!reg.test(val)) {
          this.jumpPageNumber = "";
        }

        if (Number(this.jumpPageNumber) <= 0) {
          return;
        }
        this.jumpPage(Number(this.jumpPageNumber));
      }
    }
  };

</script>

<style scoped>
  .input {
    width: 36px;
    height: 46px;
    font-size: 18px;
    border: 1px solid #aaa;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    text-align: center;
  }

  .page-select {
    border: 1px solid #aaa;
    padding: 5px 8px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
    margin-left: 5px;
  }

  .page-list .disabled {
    color: #c0c0c0;
    cursor: not-allowed;
  }

  .page-list .page-current {
    cursor: default;
    color: #fff;
    background: #d0121b;
    border-color: #d0121b;
  }

  .total-content {
    margin-right: 22px;
  }

  .page-style {
    text-align: left;
    min-width: 20px;
  }

  .currentPage {
    color: #20a0ff;
    text-align: center;
  }

  .el-pagination span {
    cursor: pointer;
  }

  .el-pagination span.disabled {
    cursor: not-allowed;
    color: #e4e4e4;
  }

  .right-icon {
    text-align: left;
  }

</style>
