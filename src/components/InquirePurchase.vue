<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '' }">采购管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/NewPurchase">新添采购单</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 过滤-->
    <el-form :model="filt" :inline="true" class="filt">
      <el-input v-model="filt.poId" class="code" placeholder="采购单编号"></el-input>
      <el-select v-model="filt.payType" placeholder="付款方式">
        <el-option
          v-for="item in payoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="filt.vender" placeholder="供应商">
        <el-option
          v-for="item in Codeoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <br>
      <div class="herd">
        <el-select v-model="filt.status" placeholder="处理状态">
          <el-option
            v-for="item in statusoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="filt.Date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder=" 结束日期"
        ></el-date-picker>
        <el-button type="primary" @click="onfilt('filt')">查找</el-button>
      </div>
    </el-form>

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
              <span>{{ props.row.payType }}</span>
            </el-form-item>
            <el-form-item label="最低预付款">
              <span>{{ props.row.prePayFee }}</span>
            </el-form-item>
            <el-form-item label="采购单状态">
              <span>{{ props.row.status == 1 ? "新添采购单": "新添采购单"}}</span>
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
      <el-table-column prop="payType" label="付款方式"></el-table-column>
      <el-table-column prop="prePayFee" label="最低预付款金额"></el-table-column>
      <el-table-column prop="status" label="处理状态" ></el-table-column>
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
        poId: "",
        payType: "",
        Date: "",
        vender: ""
      },
      Codeoptions: [],
      statusoptions: [
        {
          value: 1,
          label: "新增采购单"
        },
        {
          value: 2,
          label: "已收货"
        },
        {
          value: 3,
          label: "已付款"
        },
        {
          value: 4,
          label: "已了结"
        }
      ],
      payoptions: [
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
      productCodetable: [],
      //设置row-key只展示一行
      expands: [], //只展开一行放入当前行id
      getRowKeys(row) {
        return row.poId;
      }
    };
  },
  methods: {
    // //查找
    onfilt() {
      console.log("vlue", this.filt.vender);
      if (this.filt.vender) {
        let obj = {};
        let val = this.filt.vender;
        obj = this.Codeoptions.find(item => {
          //这里的Codeoptions就是上面遍历的数据源
          return item.value === val; //筛选出匹配数据
        });
        console.log("label", obj.label);
      }

      console.log(this.filt.Date);

      //格式化时间
      var p = function(value) {
        return value < 10 ? "0" + value : value;
      };

      if (this.filt.Date[0] && this.filt.Date[1]) {
        console.log(111);
        //开始日期
        let startDate = new Date(this.filt.Date[0]);
        var resStartDate =
          startDate.getFullYear() +
          "-" +
          p(startDate.getMonth() + 1) +
          "-" +
          p(startDate.getDate());

        //结束日期
        let endDate = new Date(this.filt.Date[1]);
        var resEndDate =
          endDate.getFullYear() +
          "-" +
          p(endDate.getMonth() + 1) +
          "-" +
          p(endDate.getDate());
      } else {
        var resStartDate = "";
        var resEndDate = "";
      }

      axios
        .post(
          `/api/main/purchase/pomain/query`,
          `poId=${this.filt.poId}&venderCode=${
            this.filt.vender
          }&startDate=${resStartDate}&endDate=${resEndDate}&payType=${
            this.filt.payType
          }&status=${this.filt.status}&page=1`
        )
        .then(resp => {
          console.log(111, resp, resp.data);
          this.users = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;

                    for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].payType == 1) {
              this.users[i].payType = "货到付款";
            } else if (this.users[i].payType == 2) {
              this.users[i].payType = "款到发货";
            } else if (this.users[i].payType == 3) {
              this.users[i].payType = "预付款到发货";
            }
          }

            for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].status == 1) {
          this.users[i].status = "新增供应商";
        } else if (this.users[i].status == 2) {
          this.users[i].status = "已收货";
        } else if (this.users[i].status == 3) {
          this.users[i].status = "已付款";
        } else if(this.users[i].status == 4){
          this.users[i].status = "已了结";
        }
      }
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
    //获取分页的数据
    goPage(currPage) {
      this.currPage = currPage;
      axios
        .post(`/api/main/purchase/pomain/show`, `type=1&page=${currPage}`)
        .then(resp => {
          this.users = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;

          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].payType == 1) {
              this.users[i].payType = "货到付款";
            } else if (this.users[i].payType == 2) {
              this.users[i].payType = "款到发货";
            } else if (this.users[i].payType == 3) {
              this.users[i].payType = "预付款到发货";
            }
          }

            for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].status == 1) {
          this.users[i].status = "新增供应商";
        } else if (this.users[i].status == 2) {
          this.users[i].status = "已收货";
        } else if (this.users[i].status == 3) {
          this.users[i].status = "已付款";
        } else if(this.users[i].status == 4){
          this.users[i].status = "已了结";
        }
      }
        });
    },
  },
  //创建时获取第一页的数据
  created() {
    axios.post(`/api/main/purchase/pomain/show`, `type=1&page=1`).then(resp => {
      console.log(222, resp.data);
      this.pageNum = resp.data.pageNum;
      this.users = resp.data.list;
      this.total = resp.data.total;

      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].payType == 1) {
          this.users[i].payType = "货到付款";
        } else if (this.users[i].payType == 2) {
          this.users[i].payType = "款到发货";
        } else if (this.users[i].payType == 3) {
          this.users[i].payType = "预付款到发货";
        }
      }



     for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].status == 1) {
          this.users[i].status = "新增供应商";
        } else if (this.users[i].status == 2) {
          this.users[i].status = "已收货";
        } else if (this.users[i].status == 3) {
          this.users[i].status = "已付款";
        } else if(this.users[i].status == 4){
          this.users[i].status = "已了结";
        }
      }
    });
    //获取供应商下拉框数据
    axios.post(`/api/main/purchase/vender/show`).then(resp => {
      console.log(resp.data);
      // for (let i = 0; i < resp.data.list.length; i++) {
      //   this.Codeoptions.push({
      //     value: `${resp.data.list[i].venderCode}`,
      //     label: `${resp.data.list[i].name}`
      //   });
      // }

      // let total = Number(resp.data.total.toString().charAt(0));
      // if (resp.data.total > 10) {
      //   for (let i = 0; i < total; i++) {
      //     //如果分页大于10条数据,分别获取分页里头的数据
      //     axios
      //       .post(`/api/main/purchase/vender/show`, `page=${i}`)
      //       .then(resp => {
      //         //每次循环把该分页下的数据添加到下拉框数组中
      //         for (let i = 0; i < resp.data.list.length; i++) {
      //           this.Codeoptions.push({
      //             value: `${resp.data.list[i].venderCode}`,
      //             label: `${resp.data.list[i].name}`
      //           });
      //         }
      //       });
      //   }
      // }
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
  margin-bottom: 15px;
}
.herd {
  margin-top: 10px !important;
}
</style>
