<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '' }">财务收支</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/NewPurchase">收支查询</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 过滤-->
    <el-form :model="filt" :inline="true" class="filt">
      <el-switch v-model="filt.type" active-text="收入" inactive-text="支出"></el-switch>
      <el-date-picker
        v-model="filt.Date"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder=" 结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>

      <el-input v-model="filt.no" class="code" placeholder="相关单据号"></el-input>

      <el-select v-model="filt.payType" placeholder="单据付款方式">
        <el-option
          v-for="item in Payoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-button type="primary" @click="onfilt('filt')">查找</el-button>
    </el-form>

    <el-table :data="users" border stripe>
      <el-table-column prop="payTime" label="日期"></el-table-column>
      <el-table-column prop="ordercode" label="相关单据号"></el-table-column>
      <el-table-column prop="payPrice" label="金额"></el-table-column>
      <el-table-column prop="account" label="经手人"></el-table-column>
      <el-table-column prop="payType" label="单据付款方式" :formatter="getpay"></el-table-column>
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
      filt: {
        payType: "",
        type: "",
        startDate: "",
        endDate: "",
        no: "",
        Date: ""
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
      currPage: 0
    };
  },
  methods: {
          //过滤处理付款状态
    getpay(row){
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
      console.log(this.filt);
      axios
        .post(
          `/api/main/finance/query`,
          `startDate=${this.filt.Date[0]}&endDate=${this.filt.Date[1]}&type=${
            this.filt.type
          }&payType=${this.filt.payType}&no=${this.filt.no}&page=1`
        )
        .then(resp => {
          console.log(111, resp, resp.data);
          this.users = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;
        });
    },

    //获取分页的数据
    goPage(currPage) {
      this.currPage = currPage;
      console.log(currPage);
      axios
        .post(
          `/api/main/finance/query`,
          `startDate=${this.filt.Date[0]}&endDate=${this.filt.Date[1]}&type=${
            this.filt.type
          }&payType=${this.filt.payType}&no=${this.filt.no}&page=${currPage}`
        )
        .then(resp => {
          this.users = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;
        });
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
