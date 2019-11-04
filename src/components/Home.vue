<template>
  <div id="homeapp">

    <el-header class="header">

      <!-- Header content -->
      <div class="logo">
        <img src="../assets/logo.png" height="60">
        <h4>信息系统管理界面</h4>
      </div>

      <div class="head">
        <div>
          <i class="el-icon-user-solid"></i>
          <span>{{account}}</span>
          <i class="el-icon-date"></i>
          {{date}}
          <!-- <el-button type="danger" round @click="quit" size="mini">退出登录</el-button> -->
        </div>
      </div>
    </el-header>

    <el-container style="height:100%;">
      <el-aside class="aside" :span="3">
        <!-- 导航 -->
        <el-menu
          default-active="this.$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
        >
          <el-menu-item index="/hello">
            <i class="el-icon-menu"></i>
            <span>主页</span>
          </el-menu-item>

          <el-menu-item index="/usertable">
            <i class="el-icon-s-custom"></i>
            <span>用户管理</span>
          </el-menu-item>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>产品管理</span>
            </template>
            <el-menu-item index="/Product">产品列表</el-menu-item>
            <el-menu-item index="/ProductCate">产品分类列表</el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-shopping-cart-2"></i>
              <span>采购管理</span>
            </template>
            <el-menu-item index="/supplier">供应商管理</el-menu-item>
            <el-menu-item index="/NewPurchase">新添采购单</el-menu-item>
            <el-menu-item index="/FinishPurchase">采购单了结</el-menu-item>
            <el-menu-item index="/InquirePurchase">采购查询</el-menu-item>
          </el-submenu>

          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-house"></i>
              <span>仓库管理</span>
            </template>
            <el-menu-item index="/Warehous">入库登记</el-menu-item>
            <el-menu-item index="/Outstock">出库登记</el-menu-item>
            <el-menu-item index="/Stock">库存查询</el-menu-item>
            <el-menu-item index="/Inventory">库存盘点</el-menu-item>
          </el-submenu>

          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-shopping-bag-1"></i>
              <span>销售管理</span>
            </template>
            <el-menu-item index>客户管理</el-menu-item>
            <el-menu-item index>新添销售单</el-menu-item>
            <el-menu-item index>销售单了结</el-menu-item>
            <el-menu-item index>销售单查询</el-menu-item>
          </el-submenu>

          <el-submenu index="8">
            <template slot="title">
              <i class="el-icon-s-marketing"></i>
              <span>财务收支</span>
            </template>
            <el-menu-item index="/Receipt">收款登记</el-menu-item>
            <el-menu-item index="/Pay">付款登记</el-menu-item>
            <el-menu-item index="/PayQuery">收支查询</el-menu-item>
          </el-submenu>

          <el-submenu index="9">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>月度报表</span>
            </template>
            <el-menu-item index="/MonthPurchase">月度采购报表</el-menu-item>
            <el-menu-item index="/MonthMarket">月度销售报表</el-menu-item>
            <el-menu-item index="/MonthOutstock">月度出库报表</el-menu-item>
            <el-menu-item index="/MonthInstock">月度入库报表</el-menu-item>
            <el-menu-item index="/MonthStock">月度库存报表</el-menu-item>
            <el-menu-item index="/MonthPay">月度收支报表</el-menu-item>
          </el-submenu>

          <el-menu-item @click="quit">
            <i class="el-icon-switch-button"></i>
            <span>退出登录</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="contain" :span="21">
        <router-view/>
        
      </el-main>
    </el-container>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'js-cookie'
import { mapState } from "vuex";
import axios from "axios"

export default {
  name: "test",
  data() {
    return {
      isCollapse: true,
      date: new Date()
    };
  },
  computed: {
    ...mapState(["account"])
  },
  mounted() {
    let _this = this;
    this.timer = setInterval(function() {
      _this.date = new Date().toLocaleString();

    });
  },
  beforeDestroy: function() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    quit() {
this.$confirm('是否退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
    //退出登录
      // sessionStorage.removeItem("username"); //清除username数据
      this.$router.push({ path: "/" });
       Cookies.set('username', "");
      axios.post('/api/sys/logout',`username=${this.account}`).then(resp=>{
        if(resp.data == "成功退出"){
           console.log(resp.data);
        }else{
          this.$router.push({ path: "/" });
        }
      }) 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });

  
      console.log();
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
};
</script>

<style scoped>
.aside {
  height: 900px;
}
.contain {
  height: 900px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #545c64;
  color: white;
  padding: 0px 50px;
  margin-bottom: 1px;
}
.head {
  /* width: 200px; */
  font-size: 13px;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid #545c64;
  border-radius: 14px;
  background-color: #3a3e42;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}
span {
  font-size: 16px;
  margin-right: 8px;
}
.logo {
  display: flex;
  align-items: center;
}
</style>