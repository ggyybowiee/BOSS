// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App'
import router from './router'
import md5 from 'js-md5'
import qs from 'qs'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import esLocale from 'element-ui/lib/locale/lang/es'
import ElementLocale from 'element-ui/lib/locale'
import lang from './assets/i18n/language'
import common from './common'
import Pagination from "./components/Pagination/Index"
import Viewer from 'v-viewer' // 用户反馈页面，查看图片
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './assets/icon/iconfont.css'
import 'viewerjs/dist/viewer.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$md5 = md5
Vue.prototype.moment = moment
Vue.prototype._ = _
Vue.prototype.qs = qs;
Vue.use(common)

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    title: false
  }
})

Vue.use({
  install: function (Vue) {
    Vue.component('v-pagination', Pagination)
  }
})

const messages = {
  'zh-cn': {
    ...lang['zh-cn'],
    ...zhLocale
  },
  'en-au': {
    ...lang['en-au'],
    ...enLocale
  },
  'sp-la': {
    ...lang['sp-la'],
    ...esLocale
  },
}

// 使用多语言
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh-cn', // 语言标识
  messages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  components: {
    App
  },
  template: '<App/>'
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(function (data) {
    // 对响应数据做点什么
    if (data.config.url === '/api/cas/resourceTree') {
      return data;
    }

    let returnMsg = {
      '-1': '网络异常',
      '3': '亲，该账户已被禁用！',
      '500': '系统内部错误！',
      '400': '亲，输入的参数错误！',
      '1000': '数据库错误！',
      '1001': '数据库查询无数据！',
      '1002': '同步生成工单失败！',
      'cas100000': '亲，用户名或密码错误！',
      'cas100001': '登录已失效，请重新登录！',
      'cas100002': '无操作权限！',
      'cas100003': 'CAS认证失败，请重新登录！',
      'cas100004': 'CAS认证异常！',
      'boss100000': '终端信息sn已存在！',
      'boss100001': '终端信息macAddr已存在！',
      'boss100002': '批处理文件格式错误！',
      'boss100003': '终端信息不存在！',
      'boss100004': 'OTT用户名已存在！',
      'boss100005': 'OTT账户不存在！',
      'boss100006': '下载的批处理文件不存在！',
      'boss100007': '下载的结果文件不存在！',
      'boss100008': '异步任务状态不允许重置！',
      'boss100009': '产品编码已存在！',
      'boss100010': '产品信息不存在！',
      'boss100011': '套餐编码已存在！',
      'boss100012': '套餐信息不存在！',
      'boss100013': '授权策略名称已存在！',
      'boss100014': '授权策略不存在！',
      'boss100015': '支付请求兑换码认证失败！',
      'boss100016': '支付失败！',
      'boss100017': '授权信息不存在！',
      'boss100018': '同步信息失败！',
      'boss100019': '该字典key已存在！',
      'boss100020': '模板文件不存在！',
      'boss100021': '文件上传失败！',
      'boss100022': '授权信息中存在免费的产品！',
      'boss100023': '该产品已失效！',
      'boss100024': '结果导出文件不存在！',
      'boss100025': '兑换码对应客户不存在，兑换失败！',
      'boss100026': '已经坏机的终端无法更新为启用！',
      'boss100027': '该用户已被禁用，请联系管理员！',
      'boss100028': '兑换内容所属客户不存在于兑换码的所属客户，兑换失败！'
    };

    //当cookie失效后，返回登录页面重新登录
    let expireArr = ["cas100001", "cas100003", "cas100004", "-1"];
    if (expireArr.indexOf(data.data.returnCode) > -1) {
      //设定时2秒后在跳出登录页
      setTimeout(function () {
        // 将http:%2F%2F192.168.10.126:8089%2F#%2Flogin 特殊字符转义(%2F就是斜杆‘/’, %3A就是冒号:)，并跳转
        parent.window.location.href = sessionStorage.getItem('loginUrl').replace(/%3A/g, ":").replace(/%2F/g, '/'); // 服务器环境
      }, 2000)
    }

    if (returnMsg[data.data.returnCode] !== undefined) {
      ELEMENT.Message({
        type: 'error',
        message: returnMsg[data.data.returnCode],
        duration: 2000
      });
    }

    return data;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  });
