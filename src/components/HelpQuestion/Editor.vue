<template>
  <div class="editorBox">
    <!-- 调用富文本编辑器 -->
    <quill-editor ref="myText" v-model="note" :config="editorOption" class="editor" @ready="onEditorReady($event)">
    </quill-editor>

    <div class="tool">
      <el-button type="primary" @click="submit()">{{$t('确定')}}</el-button>
      <el-button @click="cancel()">{{$t('取消')}}</el-button>
    </div>
  </div>
</template>
<script src="./editor.js"></script>
<style lang="less" scoped>
  .editorBox {
    .tool {
      margin: 0;
      text-align: center;
      margin-top: 20px;
    }
  }

</style>
