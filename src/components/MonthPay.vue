<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '' }">月度报表</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/NewPurchase">月度收支报表</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 过滤-->
    <el-form :model="filt" :inline="true" class="filt">
      <el-date-picker v-model="filt.time" type="month" placeholder="选择月" value-format="yyyy-MM-dd"></el-date-picker>

      <el-button type="primary" @click="onfilt('filt')">查找</el-button>
    </el-form>

    <el-table :data="users" border stripe @expand-change="info">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item>
              <el-tabs type="card" @tab-click="pay" class="pay">
                <el-tab-pane label="收款明细"></el-tab-pane>
                <el-tab-pane label="付款明细"></el-tab-pane>

                <el-table :data="details" border stripe class="detailtable">
                  <el-table-column prop="soid" label="销售单号" v-if="so"></el-table-column>
                  <el-table-column prop="createTime" label="销售单日期" v-if="so"></el-table-column>
                  <el-table-column prop="poid" label="采购单号" v-if="po"></el-table-column>
                  <el-table-column prop="createTime" label="采购单日期" v-if="po"></el-table-column>
                  <el-table-column prop="pay_time" label="收款日期"></el-table-column>
                  <el-table-column prop="pay_price" label="收款金额"></el-table-column>
                  <el-table-column prop="account" label="经手人"></el-table-column>
                  <el-table-column prop="status" label="处理状态" :formatter="getstatus"></el-table-column>
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
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column prop="receCount" label="收款次数"></el-table-column>
      <el-table-column prop="recePrice" label="收款总金额"></el-table-column>
      <el-table-column prop="payCount" label="付款次数"></el-table-column>
      <el-table-column prop="payPrice" label="付款总金额"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      details: [],
      filt: {
        time: ""
      },
      Payoptions: [
        {
          value: 1,
          label: "货到付款"
        },
        {
          value: 2,
          label: "款到发货"
        },
        {
          value: 3,
          label: "预付款到发货"
        }
      ],
      users: [],
      total: 0,
      pageNum: 1,
      currPage: 0,
      type: 1,
      so:false,
      po:false
    };
  },
  methods: {
    //tabs事件
    pay(tab, event) {
      console.log(1, tab.label);
      if (tab.label == "付款明细") {
        this.type = 2;
        this.so = false;
        this.po = true;
        let time = this.filt.time.slice(0, 7);
        axios
          .post(`/api/main/report/payment/detail/pay`, `time=${time}`)
          .then(resp => {
            console.log(resp.data);
            this.details = resp.data.list;
            this.total = resp.data.total;
            this.pageNum = resp.data.pageNum;
          });
      } else if (tab.label == "收款明细") {
        this.type = 1;
        this.po = false;
        this.so = true;
        
        let time = this.filt.time.slice(0, 7);
        axios
          .post(`/api/main/report/payment/detail/receipt`, `time=${time}`)
          .then(resp => {
            console.log(resp.data);
            this.details = resp.data.list;
            this.total = resp.data.total;
            this.pageNum = resp.data.pageNum;
          });
      }
    },
    //过滤处理付款状态
    getpay(row) {
      if (row.payType == 1) {
        return "货到付款";
      } else if (row.payType == 2) {
        return "款到发货";
      } else if (row.payType == 3) {
        return "预付款到发货";
      }
    },
    // //查找
    onfilt() {
      console.log(this.filt.time.slice(0, 7));
      let time = this.filt.time.slice(0, 7);
      axios.post(`/api/main/report/payment/main`, `time=${time}`).then(resp => {
        this.so = true;
        //    this.details = resp.data.details.list;
        console.log(111, resp, resp.data);
        this.users = [resp.data];
      });
    },
    info() {
      //第一次展开的是收款明细
      console.log(22);
      let time = this.filt.time.slice(0, 7);
      axios
        .post(`/api/main/report/payment/detail/receipt`, `time=${time}`)
        .then(resp => {
          console.log(resp.data);
          this.details = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;
        });
    },

    //获取分页的数据
    goPage(currPage) {
      this.currPage = currPage;
      let time = this.filt.time.slice(0, 7);
      if (this.type == 2) {
        //如果type为1是付款明细的分页
        axios
          .post(
            `/api/main/report/payment/detail/pay`,
            `time=${time}&page=${currPage}`
          )
          .then(resp => {
         this.details = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;
          });
      } else if (this.type == 1) {
        axios
          .post(
            `/api/main/report/payment/detail/receipt`,
            `time=${time}&page=${currPage}`
          )
          .then(resp => {
        this.details = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;
          });
      }
    },
    //过滤处理状态
    getstatus(row) {
      if (row.status == 1) {
        return "新增";
      } else if (row.status == 2) {
        return "已收货";
      } else if (row.status == 3) {
        return "已付款";
      } else if (row.status == 4) {
        return "已了结";
      }
    },
    //过滤处理付款状态
    getpay(row) {
      console.log(111, row);
      if (row.payType == 1) {
        return "货到付款";
      } else if (row.payType == 2) {
        return "款到发货";
      } else if (row.payType == 3) {
        return "预付款到发货";
      }
    }
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
  margin-bottom: 15px;
}
.herd {
  margin-top: 10px !important;
}
</style>
