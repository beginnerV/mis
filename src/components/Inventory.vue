<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '' }">采购管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/Stock">库存查询</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 过滤 -->
    <el-form :model="filt" :inline="true" ref="filt" class="filt">
      <el-input v-model="filt.productCode" placeholder="产品编号" style="width:150px"></el-input>
      <el-input v-model="filt.name" placeholder="产品名称" style="width:150px"></el-input>
      <el-form-item label="数量" class="num">
        <el-input v-model="filt.min" style="width:80px" label="采购单编号"></el-input>-
        <el-input v-model="filt.max" style="width:80px"></el-input>
      </el-form-item>

      <el-button type="primary" @click="onfilt('filt')" icon="el-icon-search">查找</el-button>
    </el-form>
    <!--  -->

    <el-table
      :data="users"
      border
      stripe
      @expand-change="info"
      :expand-row-keys="expands"
      :row-key="getRowKeys"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item>
            <el-tabs v-model="activeName" type="card" @tab-click="pay" class="pay">
              <el-tab-pane label="入库记录信息"></el-tab-pane>
              <el-tab-pane label="出库记录信息"></el-tab-pane>
            </el-tabs>
            <el-table :data="stockType" border stripe class="detailtable">
              <el-table-column prop="stockTime" label="变更库存时间"></el-table-column>
              <el-table-column prop="orderCode" label="相关采购单号"></el-table-column>
              <el-table-column prop="createUser" label="变更库存经手人"></el-table-column>
              <el-table-column prop="stockNum" label="变更库存数量"></el-table-column>
              <el-table-column prop="stockType" label="变更库存类型"></el-table-column>
            </el-table>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="产品编号"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
      <el-table-column prop="num" label="库存数量"></el-table-column>
      <el-table-column prop="poNum" label="采购在途数"></el-table-column>
      <el-table-column prop="soNum" label="预销售数"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" class="btnmini">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">更改</el-button>
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
    <!-- 更改 -->
    <el-dialog title="更改" :visible.sync="rem">
      <div slot="header" class="clearfix">
        <span>更改</span>
      </div>
      <div>
        <el-form
          ref="remform"
          :model="remform"
          :rules="remrules"
          label-width="120px"
          :inline="true"
        >
          <el-form-item label="产品编号" prop="productCode" >
            <el-input v-model="remform.productCode" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="产品原始数量" prop="originNum" >
            <el-input v-model="remform.originNum" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="变化数量" prop="num">
            <el-input v-model="remform.num"></el-input>
          </el-form-item>

          <el-form-item label="变化类型" prop="type">
            <el-select v-model="remform.type" placeholder="变化类型">
              <el-option
                v-for="item in remoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <br>

          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              :rows="5"
              :autosize="{ minRows: 3, maxRows: 4}"
              placeholder="请输入内容"
              v-model="remform.description"
              style="width:400px"
            ></el-input>
          </el-form-item>
          <br>
          <el-form-item class="formbtn">
            <el-button type="primary" @click="remsubmit('remform')">确认保存</el-button>
            <el-button @click="remreset('remform')" type="primary" :plain="true">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      remform: {
        productCode: "",
        originNum: "",
        num: "",
        type: "",
        description: ""
      },
      remoptions: [
        {
          value: "损耗",
          label: "损耗"
        },
        {
          value: "盘余",
          label: "盘余"
        }
      ],
      filt: {
        num: "",
        productCode: "",
        name: "",
        min: "",
        max: ""
      },
      rem: false,
      type: 1,
      stockType: [],
      activeName: "",
      productCode: "",
      users: [],
      total: 0,
      pageNum: 1,
      currPage: 1,
      //设置row-key只展示一行
      expands: [], //只展开一行放入当前行id
      getRowKeys(row) {
        return row.productCode;
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
        originNum: [
          { required: true, message: "请输入产品原始数量", trigger: "blur" }
        ],
        num: [{ required: true, message: "请输入变化数量", trigger: "blur" }],
        description: [
          { required: true, message: '请选择类型', trigger: 'change'  }
        ],
        type: [{ required: true, message: "请说明变化原因", trigger: "blur" }]
      }
    };
  },
  methods: {
    //确认
    remsubmit(form) {
              this.$refs[form].validate((valid) => {
          if (valid) {

                   axios
      .post(
        `/api/main/stock/checkstock`,
        `productCode=${this.remform.productCode}&originNum=${this.remform.originNum}&num=${this.remform.num}&type=${this.remform.type}&description=${this.remform.description}`
      ).then(resp=>{
        if(resp.data.status == 2){
            this.rem = false;
               this.$message({
            type: "success",
            message: resp.data.statusInfo
          });
        }else{
           this.$message({
            type: "warning",
            message: resp.data.statusInfo
        });
        }
        console.log(resp,resp.data);
      })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    //取消
    remreset(form) {
       this.$refs[form].resetFields();
    },
    //.库存盘点
    handleEdit(index, row) {
       this.rem = true;
       this.remform.productCode = row.productCode;
       this.remform.originNum = row.num;
    },
    onfilt() {
      axios
        .post(
          `/api/main/stock/query`,
          `productCode=${this.filt.productCode}&name=${this.filt.name}&min=${
            this.filt.min
          }&max=${this.filt.max}`
        )
        .then(resp => {
          console.log(resp);
          this.users = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;
        });
    },
    pay(tab, event) {
      if (tab.label == "入库记录信息") {
        console.log(this.currPage, this.productCode);
        axios
          .post(
            `/api/main/stock/alterRecord`,
            `productCode=${this.productCode}&page=${this.currPage}&stockType=1`
          )
          .then(resp => {
            this.stockType = resp.data.data.list;
          });
      } else if (tab.label == "出库记录信息") {
        console.log(this.currPage);
        axios
          .post(
            `/api/main/stock/alterRecord`,
            `productCode=${this.productCode}&page=${this.currPage}&stockType=2`
          )
          .then(resp => {
            console.log(resp.data);
            this.stockType = resp.data.data.list;
          });
      }
    },
    //点击事件,表格当前行被展开或收起
    info(row, expandedRows) {
      axios
        .post(
          `/api/main/stock/alterRecord`,
          `productCode=${row.productCode}&stockType=${this.type}`
        )
        .then(resp => {
          this.stockType = resp.data.data.list;
        });
      this.productCode = row.productCode;
      let that = this;
      //只展开一行
      if (expandedRows.length) {
        //说明展开了
        that.expands = [];
        if (row) {
          that.expands.push(row.productCode); //只展开当前行id
        }
      } else {
        //说明收起了
        that.expands = [];
      }
    },
    //获取分页的数据
    goPage(currPage) {
      this.currPage = currPage;
      axios
        .post(`/api/main/stock/query`, `type=1&page=${currPage}`)
        .then(resp => {
          this.users = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;
        });
    }
  },
  //创建时获取第一页的数据
  created() {
    axios.post(`/api/main/stock/query`).then(resp => {
      this.pageNum = resp.data.pageNum;
      this.users = resp.data.list;
      this.total = resp.data.total;
    });
  }
};
</script>
<style>
.btnadd {
  margin: 10px 0;
  margin-top: 10px !important;
  margin-right: 30px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.detailtable {
  width: 800px;
}
.code {
  width: 150px;
}
.filt {
  margin-top: 20px !important;
}
.herd {
  margin-top: 10px !important;
}
.num {
  margin-left: 10px !important;
}
.formbtn {
  margin: 10px 220px !important;
}
</style>
