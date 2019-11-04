<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/Product">产品分类列表</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" class="btnadd" @click="btnadd">
      <i class="el-icon-circle-plus"></i> 添加
    </el-button>
    <!-- 添加分类 -->
      <el-dialog title="添加产品分类" :visible.sync="productcate">
            <div slot="header" class="clearfix">
              <span>添加产品分类</span>
            </div>
            <div>
              <el-form ref="form" :model="addform" :rules="addrules" label-width="120px">

                   <el-form-item label="分类序列号" prop="categoryId">
                  <el-input v-model="addform.categoryId"></el-input>
                </el-form-item>

                <el-form-item label="产品名称" prop="name">
                  <el-input v-model="addform.name"></el-input>
                </el-form-item>        
           
             <el-form-item label="描述" prop="remark">
              <el-input
                type="textarea"
                :rows="2"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="form.remark"
              ></el-input>
            </el-form-item>

                <el-form-item>
                  <el-button type="primary" :plain="true" @click="addsubmit('form')">确认保存</el-button>
                  <el-button @click="addreset('form')">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
          <!--  -->
    <el-table :data="users" border stripe>
      <el-table-column prop="categoryId" label="分类序列号"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="remark" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" class="btnmini">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <!-- 修改用户-->
          <el-dialog title="修改用户" :visible.sync="UpdFormVisible">
            <div slot="header" class="clearfix">
              <span>修改用户</span>
            </div>
            <div>
              <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-form-item label="分类序列号" prop="categoryId">
                  <el-input v-model="form.categoryId"></el-input>
                </el-form-item>
                <el-form-item label="产品名称" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>        
            <el-form-item label="描述" prop="remark">
              <el-input
                type="textarea"
                :rows="2"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="form.remark"
              ></el-input>
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
export default {
  data() {
    return {
      users: [],
      total: 0,
      pageNum: 0,
      form: {
        categoryId: "",
        name: "",
        remark:""
      },
      addform:{
        categoryId: "",
        name: "",
        remark:""
      },
      productcate:false,
      rules: {
        categoryId: [
          { required: true, message: "请输入分类序列号", trigger: "blur" },
         ,{
            pattern:/^\w{0,20}$/,
            message: "请输入0-20个字符的分类序列号",
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }]
      },
      addrules:{
              categoryId: [
          { required: true, message: "请输入分类序列号", trigger: "blur" },
         ,{
            pattern:/^\w{0,20}$/,
            message: "请输入0-20个字符的分类序列号",
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }]
      },
      UpdFormVisible: false //是否显示修改页面的弹窗
    };
  },
  methods: {
    //获取分页的数据
    goPage(currPage) {
     axios.post(`/api/main/sell/category/show`, `page=${currPage}`).then(resp => {
     this.users = resp.data.list;
      this.total = resp.data.total;
      this.pageNum = resp.data.pageNum;
    });
    },
    //修改
    handleEdit(index, row) {
      // console.log(this.form.status);
      this.UpdFormVisible = true;
      this.form.categoryId = row.categoryId; //把原来信息传入修改表单
      this.form.name = row.name;
      this.form.remark = row.remark;
    },
    //提交修改表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post(
              "/api/main/sell/category/update",
              `categoryId=${this.form.categoryId}&name=${this.form.name}&remark=${this.form.remark}`
            )
            .then(resp => {
                  console.log(1111,resp);
                  console.log(2222,resp.data);
              if (resp.data.status == 2) {
                // console.log(resp.data.data.list); //这里的数据只有两行
                //重新回到第一页
                axios
                  .post(`/api/main/sell/category/show`, `page=1`)
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
              }else{
                   this.$message({
                  message: "修改失败",
                  type: "warning"
                });
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
              `/api/main/sell/category/delete`,
              `categoryId=${row.categoryId}`
            )
            .then(resp => {
            //   console.log(resp.data.data.list);
              this.users = resp.data.data;
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
        this.productcate = true;
    },
    //提交添加表单
    addsubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post(
              "/api/main/sell/category/add",
              `categoryId=${this.addform.categoryId}&name=${this.addform.name}&remark=${this.addform.remark}`
            )
            .then(resp => {
                console.log();
                  console.log(1111,resp);
                  console.log(2222,resp.data);
              if (resp.data.status == 2) {
                // console.log(resp.data.data.list); //这里的数据只有两行
                //重新回到第一页
                axios
                  .post(`/api/main/sell/category/show`, `page=1`)
                  .then(resp => {
                    this.users = resp.data.list;
                    this.total = resp.data.total;
                    this.pageNum = resp.data.pageNum;
                  });
                  this.productcate = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.UpdFormVisible = false;
              }else{
                   this.$message({
                  message: "添加失败",
                  type: "warning"
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addreset(form) {
      this.productcate = false;
      this.$refs[form].resetFields();
    },
  },
  //创建时获取第一页的数据
  created() {
     axios.post(`/api/main/sell/category/show`, `page=1`).then(resp => {
     this.users = resp.data.list;
      this.total = resp.data.total;
      this.pageNum = resp.data.pageNum;
    });
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
