<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '' }">采购管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/supplier">供应商列表</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 过滤 -->
    <el-form :model="filt">
      <div class="filt">
        <el-button type="primary" class="btnadd" @click="btnadd">
          <i class="el-icon-circle-plus"></i> 添加
        </el-button>

        <el-input v-model="filt.venderCode" class="code" placeholder="供应商编号"></el-input>
        <el-input v-model="filt.name" class="filtname" placeholder="供应商名称"></el-input>
        <el-button type="primary" @click="onfilt('filt')">查找</el-button>
      </div>
    </el-form>
    <!--  -->
    <el-table :data="users" border stripe>
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" label="序号" width="50px" sortable></el-table-column>
      <el-table-column prop="venderCode" label="供应商编号"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="contactor" label="联系人"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="postCode" label="邮政编码"></el-table-column>
      <el-table-column prop="createDate" label="注册日期" sortable></el-table-column>
      <el-table-column prop="tel" label="电话"></el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope" class="btnmini">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>

          <!-- 修改用户-->
          <el-dialog title="修改用户" :visible.sync="UpdFormVisible">
            <div slot="header" class="clearfix">
              <span>修改用户</span>
            </div>
            <div>
              <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="updform">
                <div class="dender1">
                  <el-form-item label="供应商编号" prop="venderCode" class="venderCode" :disabled="true">
                    <el-input v-model="form.venderCode"></el-input>
                  </el-form-item>
                  <el-form-item label="供应商名称" prop="name" class="vendername">
                    <el-input v-model="form.name"></el-input>
                  </el-form-item>
                </div>
                <div class="dender2">
                  <el-form-item label="密码" prop="passWord" class="password">
                    <el-input v-model="form.passWord" type="passWord"></el-input>
                  </el-form-item>
                  <el-form-item label="联系人" prop="contactor" class="contactor">
                    <el-input v-model="form.contactor"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="地址" prop="address" class="address" label-width="120px">
                  <el-input v-model="form.address"></el-input>
                </el-form-item>
                <div class="postcla">
                  <el-form-item label="邮政编码" prop="postCode" class="post">
                    <el-input v-model="form.postCode"></el-input>
                  </el-form-item>
                  <el-form-item label="添加日期" prop="date" class="date" label-width="80px">
                    <el-input v-model="form.date" :disabled="true"></el-input>
                  </el-form-item>
                </div>
                <div class="call">
                  <el-form-item label="电话" prop="tel" class="tel">
                    <el-input v-model="form.tel"></el-input>
                  </el-form-item>
                  <el-form-item label="传真" prop="fax" class="fax" label-width="80px">
                    <el-input v-model="form.fax"></el-input>
                  </el-form-item>
                </div>
                <el-form-item class="footbtn">
                  <el-button type="primary" @click="submitForm('form')">确认保存</el-button>
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
export default {
  data() {
    return {
      form: {
        venderCode: "",
        name: "",
        passWord: "",
        contactor: "",
        address: "",
        postCode: "",
        createDate: "",
        tel: "",
        fax: "",
        date: "" //自定义日期
      },
      filt: {
        venderCode: "",
        name: ""
      },
      users: [],
      total: 0,
      pageNum: 1,
      UpdFormVisible: false,
      rules: {
        venderCode: [
          { required: true, message: "请输入供应商编号", trigger: "blur" },
          {
            pattern: /^\w{4,20}$/,
            message: "请输入4-20个字符的供应商编号",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "请输入3-12个字符的用户账号",
            trigger: "blur"
          }
        ],
        passWord: [
          { required: true, message: "请输入用户密码", trigger: "blur" }
        ],
        contactor: [
          { required: true, message: "请输入联系人", trigger: "change" }
        ],
        tel: [{ required: true, message: "请输入电话", trigger: "change" }]
      }
    };
  },
  methods: {
    //获取分页的数据
    goPage(currPage) {
      axios
        .post(`/api/main/purchase/vender/show?page=${currPage}`)
        .then(resp => {
          this.users = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;

          //当页码改变数据也随着改变
        });
    },
    //修改
    handleEdit(index, row) {
      // console.log(index, row);
      this.UpdFormVisible = true;
      //把该用户原信息保存到修改页面
      this.form.venderCode = row.venderCode;
      this.form.name = row.name;
      this.form.passWord = row.passWord;
      this.form.contactor = row.contactor;
      this.form.address = row.address;
      this.form.postCode = row.postCode;
      this.form.date = row.createDate;
      this.form.tel = row.tel;
      this.form.fax = row.fax;
    }, //确认保存
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          axios
            .post(
              "/api/main/purchase/vender/update",
              `venderCode=${this.form.venderCode}&name=${
                this.form.name
              }&passWord=${this.form.passWord}&contactor=${
                this.form.contactor
              }&address=${this.form.address}&postCode=${
                this.form.postCode
              }&createDate=${this.form.date}&tel=${this.form.tel}&fax=${
                this.form.fax
              }`
            )
            .then(resp => {
              console.log(resp.data);
              if (resp.data.status == 2) {
                this.UpdFormVisible = false;
                //修改成功后更新页面
                axios
                  .post(`/api/main/purchase/vender/show`, `page=1`)
                  .then(resp => {
                    this.pageNum = resp.data.pageNum;
                    this.users = resp.data.list;
                    this.total = resp.data.total;
                  });

                this.$message({
                  message: "修改成功",
                  type: "success"
                });
              }
            });
        } else {
          console.log("保存失败!!");
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
              `/api/main/purchase/vender/delete`,
              `venderCode=${row.venderCode}`
            )
            .then(resp => {
              console.log(row.venderCode);
              console.log(11111, resp.data);
              this.users = resp.data.data;

              if (resp.data.status == 2) {
                //提示
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
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
      this.$router.push({ path: "/AddSupplier" });
    },
    //查找
    onfilt(filt) {
      axios
        .post(
          `/api/main/purchase/vender/show`,
          `page=${this.pageNum}&venderCode=${this.filt.venderCode}&name=${
            this.filt.name
          }`
        )
        .then(resp => {
          this.pageNum = resp.data.pageNum;
          this.users = resp.data.list;
          this.total = resp.data.total;

          console.log(resp.data);
        });
    }
  },
  //创建时获取第一页的数据
  created() {
    axios.post(`/api/main/purchase/vender/show`, `page=1`).then(resp => {
      console.log(resp.data);
      this.pageNum = resp.data.pageNum;
      this.users = resp.data.list;
      this.total = resp.data.total;
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
  margin-top: 10px !important;
  margin-right: 30px;
}
/* .el-icon-circle-plus {
  font-size: 20px;
} */
.tel {
  width: 300px;
}
.fax {
  width: 300px;
}
.call {
  display: flex;
  justify-content: center;
}
.post {
  width: 300px;
}
.date {
  width: 300px;
}
.postcla {
  display: flex;
  justify-content: center;
}
.venderCode {
  width: 300px;
}
.vendername {
  width: 300px;
}
.password {
  width: 300px;
}
.contactor {
  width: 300px;
}
.dender1 {
  display: flex;
  justify-content: center;
}
.dender2 {
  display: flex;
  justify-content: center;
}
.address {
  width: 620px;
}
.code {
  width: 200px;
  margin: 0 20px;
}
.filtname {
  width: 200px;
  margin-right: 20px;
}
.filt {
  display: flex;
  align-items: center;
}
.filtbtn {
  margin-left: 10px;
}
</style>
