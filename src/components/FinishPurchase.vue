<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '' }">采购管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/NewPurchase">采购单了结</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-tabs type="border-card" @tab-click="pay">
      <el-tab-pane label="货到付款"></el-tab-pane>
      <el-tab-pane label="款到发货"></el-tab-pane>
      <el-tab-pane label="预付款到发货"></el-tab-pane>

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
              <el-form-item label="采购单编号">
                <span>{{ props.row.poId }}</span>
              </el-form-item>
              <el-form-item label="供应商编号">
                <span>{{ props.row.venderCode }}</span>
              </el-form-item>
              <el-form-item label="创建用户">
                <span>{{ props.row.account }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime}}</span>
              </el-form-item>
              <el-form-item label="附加费用">
                <span>{{ props.row.tipFee }}</span>
              </el-form-item>
              <el-form-item label="产品总价">
                <span>{{ props.row.productTotal }}</span>
              </el-form-item>
              <el-form-item label="采购总价">
                <span>{{ props.row.poTotal }}</span>
              </el-form-item>
              <el-form-item label="付款方式">
                <span>{{ props.row.payType == 1 ? "货到付款" : props.row.payType == 2 ? "款到发货" : "预付款到发货"}}</span>
              </el-form-item>
              <el-form-item label="最低预付款">
                <span>{{ props.row.prePayFee }}</span>
              </el-form-item>
              <el-form-item label="采购单状态">
                <span>{{ props.row.status == 1 ? "新增" : props.row.status == 2 ? "已付款" : "已预付" }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
              <el-form-item label="采购单编号">
                <span>{{ props.row.poId }}</span>
              </el-form-item>
              <el-form-item>
                <el-table :data="productCodetable" border stripe class="detailtable">
                  <el-table-column prop="productCode" label="产品编号"></el-table-column>
                  <el-table-column prop="unitPrice" label="产品单价"></el-table-column>
                  <el-table-column prop="num" label="产品数量"></el-table-column>
                  <el-table-column prop="unitName" label="数量单位"></el-table-column>
                  <el-table-column prop="itemPrice" label="明细总价"></el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="poId" label="采购单编号"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="100px"></el-table-column>
        <el-table-column prop="venderName" label="供应商名称"></el-table-column>
        <el-table-column prop="account" label="创建用户" width="80px"></el-table-column>
        <el-table-column prop="prePayFee" label="附加费用" width="80px"></el-table-column>
        <el-table-column prop="productTotal" label="采购产品总价"></el-table-column>
        <el-table-column prop="poTotal" label="采购单总价格"></el-table-column>
        <el-table-column prop="payType" label="付款方式" :formatter="getpay"></el-table-column>
        <el-table-column prop="prePayFee" label="最低预付款金额"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope" class="btnmini">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">了结</el-button>
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
    </el-tabs>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      users: [],
      total: 0,
      pageNum: 1,
      currPage: 0,
      paytype: 1,
      //设置row-key只展示一行
      expands: [], //只展开一行放入当前行id
      getRowKeys(row) {
        return row.poId;
      },
      productCodetable: []
    };
  },
  methods: {
    //采购单了结
    handleEdit(index, row) {
      console.log(row);
      this.$confirm("此操作将了结该采购单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post(
              `/api/main/purchase/pomain/end`,
              `poId=${row.poId}&type=${row.status}`
            )
            .then(resp => {
              axios
                .post(
                  `/api/main/purchase/pomain/show`,
                  `type=2&payType=${row.payType}`
                )
                .then(resp => {
                  this.paytype = row.payType;
                  this.pageNum = resp.data.pageNum;
                  this.users = resp.data.list;
                  this.total = resp.data.total;
                 
                });
           
            this.$message({
            type: "success",
            message: resp.data.statusInfo
          });
            });
      
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //点击事件,表格当前行被展开或收起
    info(row, expandedRows) {
      axios
        .post(`/api/main/purchase/pomain/queryItem`, `poId=${row.poId}`)
        .then(resp => {
          console.log(555, resp.data);
          this.productCodetable = resp.data;
        });
      let that = this;
      //只展开一行
      if (expandedRows.length) {
        //说明展开了
        that.expands = [];
        if (row) {
          that.expands.push(row.poId); //只展开当前行id
        }
      } else {
        //说明收起了
        that.expands = [];
      }
    },
    //过滤处理付款状态
    getpay(row) {
      if (row.status == 1) {
        return "货到付款";
      } else if (row.status == 2) {
        return "款到发货";
      } else if (row.status == 3) {
        return "预付款到发货";
      }
    },
    //导航
    pay(tab, event) {
      console.log(1, tab.label);
      if (tab.label == "货到付款") {
        axios
          .post(`/api/main/purchase/pomain/show`, `type=2&payType=1`)
          .then(resp => {
            this.paytype = 1;
            this.pageNum = resp.data.pageNum;
            this.users = resp.data.list;
            this.total = resp.data.total;
          });
      } else if (tab.label == "款到发货") {
        axios
          .post(`/api/main/purchase/pomain/show`, `type=2&payType=2`)
          .then(resp => {
            this.paytype = 2;
            this.pageNum = resp.data.pageNum;
            this.users = resp.data.list;
            this.total = resp.data.total;
          });
      } else if (tab.label == "预付款到发货") {
        axios
          .post(`/api/main/purchase/pomain/show`, `type=2&payType=3`)
          .then(resp => {
            this.paytype = 3;
            this.pageNum = resp.data.pageNum;
            this.users = resp.data.list;
            this.total = resp.data.total;
          });
      }
    },

    //获取分页的数据
    goPage(currPage) {
      this.currPage = currPage;
      if (this.paytype == 1) {
        axios
          .post(
            `/api/main/purchase/pomain/show`,
            `type=2&typeType=1&page=${this.currPage}`
          )
          .then(resp => {
            this.pageNum = resp.data.pageNum;
            this.users = resp.data.list;
            this.total = resp.data.total;
          });
      } else if (this.paytype == 2) {
        axios
          .post(
            `/api/main/purchase/pomain/show`,
            `type=2&typeType=2&page=${this.currPage}`
          )
          .then(resp => {
            this.pageNum = resp.data.pageNum;
            this.users = resp.data.list;
            this.total = resp.data.total;
          });
      } else if (this.paytype == 3) {
        axios
          .post(
            `/api/main/purchase/pomain/show`,
            `type=2&typeType=3&page=${this.currPage}`
          )
          .then(resp => {
            this.pageNum = resp.data.pageNum;
            this.users = resp.data.list;
            this.total = resp.data.total;
          });
      }
    }
  },
  //创建时获取第一页的数据
  created() {
    console.log(1);
    axios
      .post(`/api/main/purchase/pomain/show`, `type=2&payType=1`)
      .then(resp => {
        console.log(1111, resp.data);
        this.pageNum = resp.data.pageNum;
        this.users = resp.data.list;
        this.total = resp.data.total;
      });
  }
};
</script>
<style>
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
</style>
