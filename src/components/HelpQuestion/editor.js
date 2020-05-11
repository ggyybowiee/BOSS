import {
  addQuillTitle
} from './quill-title.js'
import {
  quillEditor
} from 'vue-quill-editor'

'use strict';
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'], //引用，代码块

  [{
    'header': 1
  }, {
    'header': 2
  }], // 标题，键值对的形式；1、2表示字体大小
  [{
    'list': 'ordered'
  }, {
    'list': 'bullet'
  }], //列表
  [{
    'script': 'sub'
  }, {
    'script': 'super'
  }], // 上下标
  [{
    'indent': '-1'
  }, {
    'indent': '+1'
  }], // 缩进
  [{
    'direction': 'rtl'
  }], // 文本方向

  [{
    'size': ['small', false, 'large', 'huge']
  }], // 字体大小
  [{
    'header': [1, 2, 3, 4, 5, 6, false]
  }], //几级标题

  [{
    'color': []
  }, {
    'background': []
  }], // 字体颜色，字体背景颜色
  [{
    'font': []
  }], //字体
  [{
    'align': []
  }], //对齐方式

  ['clean'], //清除字体样式
  ['image', 'video'] //上传图片、上传视频
];

export default {
  components: {
    quillEditor
  },
  props: ["editTime"],
  data() {
    return {
      editor: null, // 富文本编辑器对象
      note: '',
      editorOption: { //  富文本编辑器配置
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
          }
        },
        placeholder: '请输入正文...'
      },
    };
  },
  beforeDestroy: function () {
    this.editor = null;
    console.log(this.editor);
  },
  mounted: function () {
    this._ready();

  },
  watch: {
    "editTime": "_ready"
  },
  methods: {
    onEditorReady(editor) {
      editor.enable(false);
    },
    _ready() {
      this.editor = this.$refs.myText.quill;
      addQuillTitle();

      let note = sessionStorage.getItem('note') ? sessionStorage.getItem('note') : '';
      this.note = note;

      this.$nextTick(() => {
        this.$refs.myText.quill.enable(true);
        this.editor.blur();
      });
    },
    submit() {
      sessionStorage.setItem('note', this.note);
      this.$emit('setText', new Date());
      this.cancel();
    },
    //关闭增加或者修改的弹窗
    cancel() {
      document.querySelectorAll(".editor-dialog button.el-dialog__headerbtn")[0].click();
    }
  }
}
