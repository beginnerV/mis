import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from "../components/Home.vue"
import Usertable from "../components/usertable.vue"
import Hello from "../components/hello.vue"
import Adduser from "../components/adduser.vue"
import Supplier from "../components/supplier.vue"
import NewPurchase from "../components/NewPurchase.vue"
import FinishPurchase from "../components/FinishPurchase.vue"
import InquirePurchase from "../components/InquirePurchase.vue"
import AddSupplier from "../components/AddSupplier.vue"
import Addorders from "../components/addorders.vue"
import Product from "../components/Product.vue"
import ProductCate from "../components/ProductCate.vue"
import Alterorders from "../components/Alterorders.vue"
import Warehous from "../components/Warehous.vue"
import Outstock from "../components/Outstock.vue"
import Inventory from "../components/Inventory.vue"
import Stock from "../components/Stock.vue"
import Pay from "../components/Pay.vue"
import Receipt from "../components/Receipt.vue"
import PayQuery from "../components/PayQuery.vue"
import MonthStock from "../components/MonthStock.vue"
import MonthInstock from "../components/MonthInstock.vue"
import MonthOutstock from "../components/MonthOutstock.vue"
import MonthPurchase from "../components/MonthPurchase.vue"
import MonthMarket from "../components/MonthMarket.vue"
import MonthPay from "../components/MonthPay.vue"
import info from "../components/info.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
   
    },
    {
      path: '/home',
      component: Home,
      children:[
      {
        path:"/usertable",
        component:Usertable,
        meta:{auth:"系统管理",requireAuth:true}
      },
      {
        path:"/hello",
        component:Hello,
        meta:{requireAuth:true}
      },
      {
        path:"/adduser",
        component:Adduser,
        meta:{auth:"系统管理",requireAuth:true}
      },
      {
        path:"/supplier",
        component:Supplier,
        meta:{auth:"采购管理",requireAuth:true}
      },
      {
        path:"/NewPurchase",
        component:NewPurchase,
        meta:{auth:"采购管理",requireAuth:true}
      },
      {
        path:"/FinishPurchase",
        component:FinishPurchase,
        meta:{auth:"采购管理",requireAuth:true}
      },
      {
        path:"/InquirePurchase",
        component:InquirePurchase,
        meta:{auth:"采购管理",requireAuth:true}
      },
      {
        path:"/AddSupplier",
        component:AddSupplier,
        meta:{auth:"采购管理",requireAuth:true}
      },{
        path:"/Addorders",
        component:Addorders,
        meta:{auth:"采购管理",requireAuth:true}
      },{
        path:"/Product",
        component:Product,
        meta:{auth:"销售管理",requireAuth:true}
      },{
        path:"/ProductCate",
        component:ProductCate,
        meta:{auth:"销售管理",requireAuth:true}
      },{
        path:"/Alterorders",
        component:Alterorders,
        meta:{auth:"采购管理",requireAuth:true}
      },{
        path:"/Warehous",
        component:Warehous,
        meta:{auth:"仓库管理",requireAuth:true}
      },{
        path:"/Outstock",
        component:Outstock,
        meta:{auth:"仓库管理",requireAuth:true}
      },{
        path:"/Inventory",
        component:Inventory,
        meta:{auth:"仓库管理",requireAuth:true}
      },{
        path:"/Stock",
        component:Stock,
        meta:{auth:"仓库管理",requireAuth:true}
      },{
        path:"/Pay",
        component:Pay,
        meta:{auth:"财务管理",requireAuth:true}
      },{
        path:"/Receipt",
        component:Receipt,
        meta:{auth:"财务管理",requireAuth:true}
      },{
        path:"/PayQuery",
        component:PayQuery,
        meta:{auth:"财务管理",requireAuth:true}
      },{
        path:"/MonthStock",
        component:MonthStock,
        meta:{auth:"业务报表",requireAuth:true}
      },{
        path:"/MonthInstock",
        component:MonthInstock,
        meta:{auth:"业务报表",requireAuth:true}
      },{
        path:"/MonthOutstock",
        component:MonthOutstock,
        meta:{auth:"业务报表",requireAuth:true}
      },{
        path:"/MonthPurchase",
        component:MonthPurchase,
        meta:{auth:"业务报表",requireAuth:true}
      },{
        path:"/MonthMarket",
        component:MonthMarket,
        meta:{auth:"业务报表",requireAuth:true}
      },{
        path:"/MonthPay",
        component:MonthPay,
        meta:{auth:"业务报表",requireAuth:true}
      },{
        path:"/info",
        component:info 
      }
      ],
      meta:{requireAuth:true}
    }

  ]
})
