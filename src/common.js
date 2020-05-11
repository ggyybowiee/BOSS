import api from './api/api'
export default {
  install(Vue) {
    //获取url地址参数
    Vue.prototype.getUrlParams = function (url) {
      var params = {}
      var arr = url.split('?')
      if (arr.length <= 1) {
        return params
      }
      arr = arr[1].split('&')
      for (var i = 0; i < arr.length; i++) {
        var a = arr[i].split('=')
        params[a[0]] = a[1]
      }
      return params
    };


    // 字符串时间转换成时间戳,并计算距离当前的时间（天数）
    Vue.prototype.changeTimeStr = function (timeStr) {
      timeStr = timeStr.substring(0, 19)
      let date = timeStr.replace(/-/g, '/')

      let endTime = new Date(date).getTime()
      let beginTime = new Date().getTime()

      let timeDiff = endTime - beginTime
      let dayDiff = Math.floor(timeDiff / (24 * 3600 * 1000))
      return dayDiff
    };

    // YYYY-MM-DD转化成英文显示
    Vue.prototype.changeTimeToEn = function (timeStr) {
      let date = new Date(timeStr.replace(/-/g, '/'));
      let dateString = date.toDateString();
      let dateArray = dateString.split(' ');
      return `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`;
    };

    //生成uuid
    Vue.prototype.getUuid = function () {
      var len = 32; //32长度
      var radix = 16; //16进制
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var uuid = [],
        i;
      radix = radix || chars.length;
      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      return uuid.join('');
    }

    /*
    时间搓转日期
    日期格式：2017-9-30 9:46:48；
    ns：int
    */
    Vue.prototype.GetLocalTime = function (nS) {
      let now = new Date(nS);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let second = now.getSeconds();
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
    }


    //json格式化
    Vue.prototype.formatJson = function (json) {
        var reg = null,
          formatted = '',
          pad = 0,
          PADDING = '    ';
        if (typeof json !== 'string') {
          json = JSON.stringify(json);
        } else {
          json = JSON.parse(json);
          json = JSON.stringify(json);
        }
        reg = /([\{\}])/g;
        json = json.replace(reg, '\r\n$1\r\n');
        reg = /([\[\]])/g;
        json = json.replace(reg, '\r\n$1\r\n');
        reg = /((\"|null|\d|\]\r\n)\,)/g;
        json = json.replace(reg, '$1\r\n');
        reg = /(\r\n\r\n)/g;
        json = json.replace(reg, '\r\n');
        reg = /\r\n\,/g;
        json = json.replace(reg, ',');
        $.each(json.split('\r\n'), function (index, node) {
          var i = 0,
            indent = 0,
            padding = '';
          if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
          } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
              pad -= 1;
            }
          } else {
            indent = 0;
          }
          for (i = 0; i < pad; i++) {
            padding += PADDING;
          }
          formatted += padding + node + '\r\n';
          pad += indent;
        });
        return formatted;
      },

      /*
      Trim去前后空格
      str：string
      */
      Vue.prototype.Trim = function (str) {
        if (str == null) {
          return '';
        }
        str = str.toString();
        return str.replace(/(^\s*)|(\s*$)/g, '');
      }

    Vue.prototype.setCookie = function (key, value) {
      document.cookie = key + '=' + value;
    };

    Vue.prototype.getCookie = function (key) {
      let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
      if (arr != null) return unescape(arr[2]);
      return null;
    };
    /*
    判断数组是否包含某个字符串
    arr：数组
    str：字符串
    */
    Vue.prototype.InArray = function (arr, str) {
      let i = arr.length;
      while (i--) {
        if (arr[i] == str) {
          return true;
        }
      }
      return false;
    }

    /*
    数组去空
    array:数组对象
    */
    Vue.prototype.clearNull = function (array) {
      let newArr = [];
      let k = 0;
      for (let i = 0; i < array.length; i++) {
        if (array[i] !== '' && array[i] !== undefined) {
          newArr[k] = array[i];
          k++;
        }
      }
      return newArr;
    }

    Vue.prototype.getObject = function (array, key) {
      var o;
      array.some(function iter(a) {
        if (a[key]) {
          o = a;
          return true;
        }
        return Array.isArray(a.children) && a.children.some(iter);
      });
      return o;
    };
    // 弹框定义错误消息
    Vue.prototype.message = function (type, msg) {
      this.$message({
        type: type,
        message: msg,
        duration: 2000
      });
    };

    Vue.prototype.getResourceTree = function (callback = function () {}) {
      let _self = this;

      this.$http.get(api.resourceTree())
        .then(function (response) {
          if (response.data.returnCode.toString() === '0') {
            sessionStorage.setItem('operatorType', response.data.operatorType);
            callback(response.data.resourceTree.children)
          } else if (response.data.returnCode.toString() === '500') {
            _self.message('error', 'CAS权限错误，请重新登录！');
            if (sessionStorage.getItem('loginUrl')) {
              //设定时2秒后在跳出登录页
              setTimeout(function () {
                // 将http:%2F%2F192.168.10.126:8089%2F#%2Flogin 特殊字符转义(%2F就是斜杆‘/’, %3A就是冒号:)，并跳转
                parent.window.location.href = sessionStorage.getItem('loginUrl').replace(/%3A/g, ":").replace(/%2F/g, '/'); // 服务器环境
              }, 2000)
            };
            document.getElementById('app').innerHTML = null;
            callback('error');
          }
        })
        .catch(function (error) {
          console.error(error);
          document.getElementById('app').innerHTML = null;
          callback('error');
        })
    }
  }
}
