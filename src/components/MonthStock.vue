<template>
  <div>
 <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '' }">月度报表</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/MonthStock">月度库存报表</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 过滤-->
    <el-form :model="filt" :inline="true" class="filt">

        <el-date-picker v-model="filt.time" type="month" placeholder="选择月"
        value-format="yyyy-MM-dd"
        ></el-date-picker>

      <el-button type="primary" @click="onfilt('filt')">查找</el-button>
    </el-form>

    <el-table :data="users" border stripe   
        @expand-change="info"
        >

  <el-table-column type="expand">
          <template slot-scope="props">
           <el-form label-position="left" inline class="demo-table-expand">

                <el-form-item>
                <el-table :data="details" border stripe class="detailtable">
                    
                  <el-table-column prop="ProductCode" label="产品编号"></el-table-column>
                  <el-table-column prop="name" label="产品名称"></el-table-column>
                  <el-table-column prop="num" label="库存数"></el-table-column>
         
                </el-table>
                    <el-pagination
      background
      layout="prev, pager, next,jumper"
      :total="total"
      :current-page="pageNum"
      @current-change="goPage"
      class="pp"
    ></el-pagination>
    </el-form-item>
            </el-form>
          </template>
        </el-table-column>

      <el-table-column prop="totalNum" label="产品总库数"></el-table-column>


      
    </el-table>

  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
    details:[],
      filt: {
        time:""
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
      console.log(this.filt.time.slice(0,7));
      let time = this.filt.time.slice(0,7)
      axios
        .post(
          `/api/main/report/stock/main`,
          `time=${time}`
        )
        .then(resp => {
            //    this.details = resp.data.details.list;
          console.log(111, resp, resp.data);
         this.users = [resp.data];
        });
    },
    info(){
        console.log(22);
          let time = this.filt.time.slice(0,7)
      axios
        .post(
          `/api/main/report/stock/main`,
          `time=${time}`
        )
        .then(resp => {
this.details = resp.data.details.list;
        this.total = resp.data.details.total;
          this.pageNum = resp.data.details.pageNum;
        });
    },

    //获取分页的数据
    goPage(currPage) {
      this.currPage = currPage;
    let time = this.filt.time.slice(0,7)
      axios
        .post(
          `/api/main/report/stock/main`,
          `time=${time}&page=${currPage}`
        )
        .then(resp => {
         this.details = resp.data.details.list;
          this.total = resp.data.details.total;
          this.pageNum = resp.data.details.pageNum;
        });
    },
        //过滤处理状态
    getstatus(row) {
      if (row.status == 1) {
        return "新增";
      } else if (row.status == 2) {
        return "已收货";
      } else if (row.status == 3) {
        return "已付款";
      }else if(row.status == 4){
         return "已了结"
      }
    },
       //过滤处理付款状态
    getpay(row){
        console.log(111,row);
  if (row.payType == 1) {
        return "货到付款";
      } else if (row.payType == 2) {
        return "款到发货";
      } else if (row.payType == 3) {
        return "预付款到发货";
      }
    },
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
