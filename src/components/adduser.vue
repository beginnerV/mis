<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/usertable' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/adduser">添加新用户</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片  -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" >
            <el-form-item label="用户帐号" prop="account" style="width:400px">
              <el-input v-model="form.account" ></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" prop="name" style="width:400px">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="passWord" style="width:400px">
              <el-input v-model="form.passWord" type="passWord"></el-input>
            </el-form-item>
            <el-form-item label="添加日期" prop="date" style="width:400px">
              <el-input v-model="form.date" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="锁定状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="权限">
              <el-checkbox-group v-model="form.modelcodes">
                <el-checkbox label="1" name="modelcodes">采购管理</el-checkbox>
                <el-checkbox label="2" name="modelcodes">销售管理</el-checkbox>
                <el-checkbox label="3" name="modelcodes">系统管理</el-checkbox>
                <el-checkbox label="4" name="modelcodes">财务管理</el-checkbox>
                <el-checkbox label="5" name="modelcodes">仓库管理</el-checkbox>
                <el-checkbox label="6" name="modelcodes">业务报表</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">确认保存</el-button>
              <el-button @click="resetForm('form')">取消</el-button>
            </el-form-item>
          </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        account: "",
        name: "",
        passWord: "",
        createDate: "",
        status: "否",
        modelcodes: [],
        date: "" //自定义日期
      },
      rules: {
        account: [
          { required: true, message: "请输入用户帐号", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "请输入3-12个字符的用户账号",
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请输入用户姓名", trigger: "blur" }],
        passWord: [
          { required: true, message: "请输入用户密码", trigger: "blur" }
        ],
        modelcodes: [
          { required: true, message: "请至少选择一个权限", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //确认保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let status = this.form.status == "否" ? 0 : 1;
          console.log("保存成功!");
          console.log(this.form.date);
          let arr = [...this.form.modelcodes];
          let modelcodes = arr.map(Number); //把数组中的字符串转化成数字类型

          axios
            .post(
              "/api/main/system/user/add",
              `account=${this.form.account}&name=${this.form.name}&passWord=${
                this.form.passWord
              }&createDate=${
                this.form.date
              }&status=${status}&modelcodes=${modelcodes}`
            )
            .then(resp => {
              console.log(resp.data);
              if (resp.data.status == 2) {
                this.$router.push({ path: "/usertable" });
              }
            });
        } else {
          let arr = [...this.form.modelcodes];
          let modelcodes = arr.map(Number);

          console.log(123, arr.map(Number));
          console.log();
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created: function() {
    //设置函数进行过滤
    //创建一个函数来增加月日小于10前面加0
    var padaDate = function(value) {
      return value < 10 ? "0" + value : value;
    };
    //创建日期对象
    var date = new Date();
    var year = date.getFullYear(); //年
    var month = padaDate(date.getMonth() + 1); //月
    var day = padaDate(date.getDate()); //日
    //  console.log(year + "/" + month + "/" + day)
    //返回格式化后的日期
    this.form.date = year + "-" + month + "-" + day;
  }
};
</script>

<style scoped>
.bread {
  margin-bottom: 15px;
}
</style>
