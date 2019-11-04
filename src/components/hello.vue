<template>
  <div>
    <p><i class="el-icon-s-promotion"> </i> hello, {{account}}! 欢迎使用信息管理系统</p>
    <p><i class="el-icon-watch"> </i> 您登录的时间： {{date}}</p>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      date: new Date()
    };
  },
  computed: {
    ...mapState(["account"])
  },
  //登录时间
  mounted() {
    let _this = this;
     _this.date = new Date().toLocaleString();
  }
};
</script>
<style>

</style>
