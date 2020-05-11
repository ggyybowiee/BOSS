<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="detail-form">
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="4" class="label-col"></el-col>
        <el-col :span="20">
          <el-row type="flex" justify="space-between" :gutter="20" class="product-select">
            <el-col :span="12">
              <el-form-item :label="$t('所属应用')" prop="pkg">
                <el-select v-model="ruleForm.pkg" filterable disabled>
                  <el-option v-for="item in appIdOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('分类名称(中文)')" prop="type_zh">
                <el-select v-model="ruleForm.type_zh" filterable disabled>
                  <el-option v-for="item in zhClassifyNameOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('显示顺序')" prop="sort_num">
                <el-input type="input" v-model="ruleForm.sort_num" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
        </el-col>
      </el-row>


      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="4" class="label-col">
          <label>{{$t('问题名称')}}</label>
        </el-col>
        <el-col :span="20">
          <el-row type="flex" justify="space-between" :gutter="20">
            <el-col :span="24">
              <el-form-item :label="$t('中文')" prop="zh_question">
                <el-input type="textarea" v-model="ruleForm.zh_question" :rows="2" readonly :maxlength="1024">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20">
            <el-col :span="24">
              <el-form-item :label="$t('英语')" prop="en_question">
                <el-input type="textarea" v-model="ruleForm.en_question" :rows="2" readonly :maxlength="1024">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20">
            <el-col :span="24">
              <el-form-item :label="$t('葡语')" prop="pt_question">
                <el-input type="textarea" v-model="ruleForm.pt_question" :rows="2" readonly :maxlength="1024">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" :gutter="20">
            <el-col :span="24">
              <el-form-item :label="$t('西语')" prop="es_question">
                <el-input type="textarea" v-model="ruleForm.es_question" :rows="2" readonly :maxlength="1024">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-col>
      </el-row>

      <hr class="hr" />

      <el-row type="flex" justify="space-between" :gutter="20" class="answer-row">
        <el-col :span="4" class="label-col">
          <label>{{$t('问题答案')}}</label>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('中文')" prop="zh_answer">
            <div v-html="ruleForm.zh_answer" class="html-str ql-editor"></div>
          </el-form-item>

          <el-form-item :label="$t('英语')" prop="en_answer">
            <div v-html="ruleForm.en_answer" class="html-str ql-editor"></div>
          </el-form-item>

          <el-form-item :label="$t('葡语')" prop="pt_answer">
            <div v-html="ruleForm.pt_answer" class="html-str ql-editor"></div>
          </el-form-item>

          <el-form-item :label="$t('西语')" prop="es_answer">
            <div v-html="ruleForm.es_answer" class="html-str ql-editor"></div>
          </el-form-item>

        </el-col>
      </el-row>

    </el-form>


  </div>
</template>
<script src="./showDetail.js"></script>
<style lang="less" scoped>
  .detail-form {
    .label-col {
      display: flex;
      justify-content: center;

      label {
        font-size: 20px;
      }
    }

    .hr {
      border-top: 1px solid #bfcbd9;
      margin: 20px 0;
      margin-top: 8px;
      width: 100%;
    }

    .answer-row {
      .html-str {
        display: block;
        resize: vertical;
        padding: 5px 7px;
        line-height: 1.5;
        width: 100%;
        height: 117px;
        overflow: auto;
        color: #1f2d3d;
        background-color: #fff;
        background-image: none;
        box-sizing: border-box;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
      }
    }


  }

</style>
