<template>
<div  id="i">
  <div id="home">
    <img src="../assets/logo.png">
    <el-form :model="user" :rules="rules" ref="regForm"  label-width="127px" class="form">
    <el-form-item label="" prop="username">
      <el-input type="text" v-model="user.username" placeholder="账号">
      </el-input>
    </el-form-item>
     <el-form-item label="" prop="password">
      <el-input type="password" v-model="user.password" placeholder="密码"></el-input>
    </el-form-item>
  <el-form-item label="" prop="delivery">
      <el-tooltip content="是用工作人员登录吗？"  placement="right-start" effect="light">
    <el-switch v-model="user.role"></el-switch>
    </el-tooltip>
  </el-form-item>

      <el-button type="primary" @click="logCheck" class="bt">登录</el-button>
 
    </el-form>

  </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
const qs = require("querystring"); //json 转 字符串

export default {
  data() {
    return {
      user: { username: "", password: "" ,role : false}, //创建个空对象用于存放帐号和密码
      rules: {
        //   （1）添加验证的选项规则
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        // （2）自定义验证的函数
        // account: [{validator: checkAccount, trigger: 'blur'}]
        password: [
            {required: true, message: "请输入密码", trigger: 'blur'},
            {pattern: /^\d{1,}$/, message: "密码要求是数字", trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    logCheck() {
      //把值传入store的login函数里面，获得回调响应
      this.$store.dispatch({
          type: "login",
          username: this.user.username,
          password: this.user.password,
          role: this.user.role
        }).then(resolve => {
          this.$router.push({ path: "/home" });
        }).catch(err => {
           //报的是服务器异常或者是账户密码错误
        
            if(err){
        this.$message({
          message: err,
          type: 'warning'
        });
        }

        });

    }
  }
};
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
.err {
  color: red;
}
.bt {
  width: 160px;
  margin-left: 122px;
}
#home {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  width: 500px;
  margin: 60px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;

}
#i{
    background-image: url("../img/324855.jpg");
    width: 1366px;
    height: 768px;
}
.form{
  width: 380px;
  margin: 10px 0;
  margin-right: 121px;
}

</style>