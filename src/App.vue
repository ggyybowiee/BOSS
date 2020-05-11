<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import api from "./api/api";
  export default {
    name: "App",
    data() {
      return {};
    },
    created() {
      let urlParams = this.getUrlParams(window.location.href);

      for (let i in urlParams) {
        sessionStorage.setItem(i, urlParams[i]);
      }

      this.setCookie('token', sessionStorage.getItem("token"));
      this.setCookie('tokenUserName', sessionStorage.getItem("tokenUserName"));
      sessionStorage.setItem('provider', urlParams["tokenUserName"]);

      let langArr = ["zh-cn", "en-au", "sp-la"];

      if (langArr.indexOf(sessionStorage.getItem("lang")) > -1) {
        this.$i18n.locale = sessionStorage.getItem("lang");
      } else {
        this.$i18n.locale = "zh-cn";
      }
    },
    mounted: function () {}
  };

</script>

<style lang="css">
  @import "./app.css";

</style>
