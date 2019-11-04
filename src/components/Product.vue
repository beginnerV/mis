<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/Product">产品列表</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 过滤 -->
    <el-form :model="filt">
      <div class="filt">
        <el-button type="primary" class="btnadd" @click="btnadd">
          <i class="el-icon-circle-plus"></i> 添加
        </el-button>

        <el-input v-model="filt.productCode" class="code" placeholder="产品编号"></el-input>
        <el-input v-model="filt.name" class="filtname" placeholder="产品名称"></el-input>
        <el-input v-model="filt.categoryId" class="categoryId" placeholder="所属分类"></el-input>
        <el-button type="primary" @click="onfilt('filt')">查找</el-button>
      </div>
    </el-form>
    <!--  -->
    <!-- 添加产品 -->
    <el-dialog title="添加产品" :visible.sync="productcate">
      <div slot="header" class="clearfix">
        <span>添加产品</span>
      </div>
      <div>
        <el-form ref="form" :model="addform" :rules="addrules" label-width="120px" :inline="true">
          <el-form-item label="产品编号" prop="productCode">
            <el-input v-model="addform.productCode"></el-input>
          </el-form-item>

          <el-form-item label="产品名称" prop="name">
            <el-input v-model="addform.name"></el-input>
          </el-form-item>

          <el-form-item label="数量单位" prop="unitName">
            <el-input v-model="addform.unitName"></el-input>
          </el-form-item>

          <el-form-item label="选择分类" prop="categoryId">
            <el-select v-model="addform.categoryId" placeholder="选择分类" @change="cate">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="销售价" prop="price">
            <el-input v-model="addform.price"></el-input>
          </el-form-item>

          <el-form-item label="添加日期" prop="createDate">
            <el-input v-model="addform.createDate" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="remark">
            <el-input
              type="textarea"
              :rows="2"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="addform.remark"
            ></el-input>
          </el-form-item>
          <br>
          <el-form-item class="footbtn">
            <el-button type="primary" :plain="true" @click="addsubmit('form')">确认保存</el-button>
            <el-button @click="addreset('form')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--  -->
    <el-table :data="users" border stripe>
      <el-table-column prop="productCode" label="产品编号" width="80"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
      <el-table-column prop="unitName" label="数量单位" width="80"></el-table-column>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="createDate" label="添加日期"></el-table-column>
      <el-table-column prop="price" label="销售价"></el-table-column>
      <el-table-column prop="remark" label="产品描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" class="btnmini">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <!-- 修改产品-->
          <el-dialog title="修改产品" :visible.sync="rem">
            <div slot="header" class="clearfix">
              <span>修改产品</span>
            </div>
            <div>
              <el-form
                ref="form"
                :model="remform"
                :rules="remrules"
                label-width="120px"
                :inline="true"
              >
                <el-form-item label="产品编号" prop="productCode">
                  <el-input v-model="remform.productCode"></el-input>
                </el-form-item>

                <el-form-item label="产品名称" prop="name">
                  <el-input v-model="remform.name"></el-input>
                </el-form-item>

                <el-form-item label="数量单位" prop="unitName">
                  <el-input v-model="remform.unitName"></el-input>
                </el-form-item>

                <el-form-item label="选择分类" prop="categoryId">
                  <el-select v-model="remform.categoryId" placeholder="选择分类" @change="remcate">
                    <el-option
                      v-for="item in remoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="销售价" prop="price">
                  <el-input v-model="remform.price"></el-input>
                </el-form-item>

                <el-form-item label="添加日期" prop="createDate">
                  <el-input v-model="remform.createDate" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="2"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="remform.remark"
                  ></el-input>
                </el-form-item>
                <br>
                <el-form-item class="footbtn">
                  <el-button type="primary" :plain="true" @click="remsubmit('form')">确认保存</el-button>
                  <el-button @click="remreset('form')">取消</el-button>
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
        remark: ""
      },
      addform: {
        productCode: "",
        name: "",
        unitName: "",
        categoryId: "",
        price: "",
        createDate: "",
        remark: ""
      },
      options: [],
      remoptions:[],
      remform: {
        productCode: "",
        name: "",
        unitName: "",
        categoryId: "",
        price: "",
        createDate: "",
        remark: ""
      },
      filt: {
        productCode: "",
        name: "",
        categoryId: ""
      },
      productcate: false,
      rem: false,
      rules: {
        categoryId: [
          { required: true, message: "请输入分类序列号", trigger: "blur" },
          ,
          {
            pattern: /^\w{0,20}$/,
            message: "请输入0-20个字符的分类序列号",
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }]
      },
      addrules: {
        productCode: [
          { required: true, message: "请输入产品编号", trigger: "blur" },
          ,
          {
            pattern: /^\d{4,20}$/,
            message: "请输入4-20为数字字母的产品编号",
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        unitName: [
          { required: true, message: "请输入数量单位", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请输入分类编号", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入销售价", trigger: "blur" }]
      },
      rules: {
        categoryId: [
          { required: true, message: "请输入分类序列号", trigger: "blur" },
          ,
          {
            pattern: /^\w{0,20}$/,
            message: "请输入0-20个字符的分类序列号",
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }]
      },
      remrules: {
        productCode: [
          { required: true, message: "请输入产品编号", trigger: "blur" },
          ,
          {
            pattern: /^\d{4,20}$/,
            message: "请输入4-20为数字字母的产品编号",
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        unitName: [
          { required: true, message: "请输入数量单位", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请输入分类编号", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入销售价", trigger: "blur" }]
      },
      UpdFormVisible: false //是否显示修改页面的弹窗
    };
  },
  methods: {
    //获取分页的数据
    goPage(currPage) {
      axios
        .post(`/api/main/sell/product/show`, `page=${currPage}`)
        .then(resp => {
          this.users = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;
        });
    },
    //修改
    handleEdit(index, row) {
        axios.post(`/api/main/sell/category/show`).then(resp => {
        console.log(555, resp.data);
        for (let i = 0; i < resp.data.total; i++) {
          this.remoptions.push({
            value: `${resp.data.list[i].categoryId}`,
            label: `${resp.data.list[i].name}`
          });
        }
      });
      //获取原来的信息
      this.remform.productCode = row.productCode;
      this.remform.name = row.name;
      this.remform.unitName = row.unitName;
      this.remform.price = row.price;
      this.remform.createDate = this.addform.createDate;
      this.rem = true;
      this.remform.num = row.num;
      console.log(666, row);
      
    },
    remcate(){

    },
    //提交修改表单
    remsubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post(
              "/api/main/sell/product/update",
              `productCode=${this.remform.productCode}&name=${
                this.remform.name
              }&unitName=${this.remform.unitName}&categoryId=${
                this.remform.categoryId
              }&price=${this.remform.price}&createDate=${
                this.remform.createDate
              }&remark=${this.remform.remark}`
            )
            .then(resp => {
              console.log(1111, resp);
              console.log(2222, resp.data);
              if (resp.data.status == 2) {
                // console.log(resp.data.data.list); //这里的数据只有两行
                //重新回到第一页
                axios
                  .post(`/api/main/sell/product/show`, `page=1`)
                  .then(resp => {
                    this.users = resp.data.list;
                    this.total = resp.data.total;
                    this.pageNum = resp.data.pageNum;
                  });
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.rem = false;
              } else {
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
    remreset(form) {
      this.rem = false;
      // this.$refs[form].resetFields();
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
              `/api/main/sell/product/delete`,
              `productCode=${row.productCode}`
            )
            .then(resp => {
              console.log(66, row.productCode);
              //   console.log(resp.data.data.list);
              this.users = resp.data.data;
              console.log(resp.data);
              if (resp.data.status == 4) {
                this.$message({
                  type: "success",
                  message:
                    "如果有产品相关的销售单或采购单存在，该产品不能被删除!"
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
      this.productcate = true;

      axios.post(`/api/main/sell/category/show`).then(resp => {
        console.log(555, resp.data);
        for (let i = 0; i < resp.data.total; i++) {
          this.options.push({
            value: `${resp.data.list[i].categoryId}`,
            label: `${resp.data.list[i].name}`
          });
        }
      });
    },
    cate() {
      console.log(2222, this.addform.categoryId);
    },
    //提交添加表单
    addsubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post(
              "/api/main/sell/product/add",
              `productCode=${this.addform.productCode}&name=${
                this.addform.name
              }&unitName=${this.addform.unitName}&categoryId=${
                this.addform.categoryId
              }&price=${this.addform.price}&createDate=${
                this.addform.createDate
              }&remark=${this.addform.remark}`
            )
            .then(resp => {
              console.log();
              console.log(1111, resp);
              console.log(2222, resp.data);
              if (resp.data.status == 2) {
                // console.log(resp.data.data.list); //这里的数据没有
                //重新回到第一页
                axios
                  .post(`/api/main/sell/product/show`, `page=1`)
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
              } else {
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
    //查找
    onfilt(filt) {
      axios
        .post(
          `/api/main/sell/product/show`,
          `page=${this.pageNum}&productCode=${this.filt.productCode}&name=${
            this.filt.name
          }&categoryId=${this.filt.categoryId}`
        )
        .then(resp => {
          console.log(this.pageNum);
          this.pageNum = resp.data.pageNum;
          this.users = resp.data.list;
          this.total = resp.data.total;

          console.log(
            666,
            resp.data,
            this.filt.productCode,
            this.filt.name,
            this.filt.categoryId
          );
          console.log(resp);
        });
    }
  },
  //创建时获取第一页的数据
  created() {
    axios.post(`/api/main/sell/product/show`, `page=1`).then(resp => {
      console.log(resp.data.list);
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
    this.addform.createDate = year + "-" + month + "-" + day;
  }
};
</script>
<style scoped>
.btnadd {
  margin: 10px 0;
  margin-top: 10px !important;
}
.el-icon-circle-plus {
  font-size: 15px;
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
.code {
  width: 200px;
  margin: 0 20px;
}
.categoryId {
  width: 200px;
  margin-right: 20px;
}
.footbtn {
  margin-left: 220px;
  margin-top: 20px;
}
</style>
