<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/usertable">用户管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" class="btnadd" @click="btnadd">
      <i class="el-icon-circle-plus"></i> 添加
    </el-button>

    <el-table :data="users" border stripe>
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" label="序号" width="70px" sortable></el-table-column>
      <el-table-column prop="account" label="用户帐号"></el-table-column>
      <el-table-column prop="name" label="用户姓名"></el-table-column>
      <el-table-column prop="status" label="锁定状态" :formatter="getstatus"></el-table-column>
      <el-table-column prop="createDate" label="添加日期" sortable></el-table-column>
      <el-table-column prop="models" label="用户权限列表" :formatter="getfor"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" class="btnmini">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <!-- 修改用户-->
          <el-dialog title="修改用户" :visible.sync="UpdFormVisible">
            <div slot="header" class="clearfix">
              <span>修改用户</span>
            </div>
            <div>
              <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户帐号" prop="account">
                  <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="passWord">
                  <el-input v-model="form.passWord" type="passWord"></el-input>
                </el-form-item>
                <el-form-item label="添加日期" prop="date">
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
                  <el-button type="primary" :plain="true" @click="submitForm('form')">确认保存</el-button>
                  <el-button @click="resetForm('form')">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
          <!--  -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next,jumper"
      :total="total"
      :current-page="pageNum"
      @current-change="goPage"
      class="pp"
    ></el-pagination>
  </div>
</template>
<script>
import axios from "axios";
// import Vuex from "vuex";
// Vue.use(Vuex)
export default {
  data() {
    return {
      users: [],
      total: 0,
      pageNum: 0,
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
      },
      UpdFormVisible: false //是否显示修改页面的弹窗
    };
  },
  methods: {
    //获取分页的数据
    goPage(currPage) {
      axios.post(`/api/main/system/user/show?page=${currPage}`).then(resp => {
        this.users = resp.data.list;
        console.log(resp.data);
        //当页码改变数据也随着改变
      });
    },
    //修改
    handleEdit(index, row) {
      // console.log(this.form.status);
      this.UpdFormVisible = true;
      this.form.passWord = row.passWord; //把原来信息传入修改表单
      this.form.account = row.account;
      this.form.name = row.name;
      this.form.status = row.status == 0 ? "否" : "是";

      let arr = [];
      for (let i = 0; i < row.models.length; i++) {
        arr.push(row.models[i].modelCode.toString());
      }
      this.form.modelcodes = arr;
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // modelcodes
          console.log("提交", this.form.modelcodes);
          let arr = [...this.form.modelcodes];
          let modelcodes = arr.map(Number); //把数组中的字符串转化成数字类型
          let status = this.form.status == "否" ? 0 : 1;
          axios
            .post(
              "/api/main/system/user/update",
              `account=${this.form.account}&name=${this.form.name}&passWord=${
                this.form.passWord
              }&createDate=${
                this.form.date
              }&status=${status}&modelcodes=${modelcodes}`
            )
            .then(resp => {
                  console.log(1111,resp);
              if (resp.data.status == 2) {
                // console.log(resp.data.data.list); //这里的数据只有两行
                //重新回到第一页
                axios
                  .post(`/api/main/system/user/show`, `page=1`)
                  .then(resp => {
                    this.users = resp.data.list;
                    this.total = resp.data.total;
                    this.pageNum = resp.data.pageNum;
                  });
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.UpdFormVisible = false;
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(form) {
      this.UpdFormVisible = false;
      this.$refs[form].resetFields();
    },
    //删除
    handleDelete(index, row) {
      this.$confirm(
        "如果是请点击确定按钮 ，否则请点取消",
        "是否确认对信息的修改？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          axios
            .post(
              `/api/main/system/user/delete`,
              `account=${row.account}&page=1`
            )
            .then(resp => {
              console.log(resp.data.data.list);
              this.users = resp.data.data.list;
              this.total = resp.data.data.total;
              this.pageNum = resp.data.data.pageNum;
              console.log(resp.data);
            });

          this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //添加
    btnadd() {
      this.$router.push({ path: "/adduser" });
    },
    getfor(row, column) {
      var roleName = [];
      for (var i = 0; i < row.models.length; i++) {
        roleName.push(row.models[i].modelName);
      }
      return roleName.join(" ");
    },
    getstatus(row, column) {
      //  console.log(row);
      return row.status == 0 ? "未锁定" : "已锁定";
    }
  },
  //创建时获取第一页的数据
  created() {
    axios.post(`/api/main/system/user/show`, `page=1`).then(resp => {
      this.users = resp.data.list;
      this.total = resp.data.total;
      this.pageNum = resp.data.pageNum;
    });

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
.btnadd {
  margin: 10px 0;
  margin-top: 10px !important
}
.el-icon-circle-plus {
  font-size: 15px;
}
</style>
