<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/NewPurchase' }">新添采购单</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/AlterOrders">修改</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片  -->
    <el-card class="box-card">
      <div>
        <el-col>
          <el-form ref="form" :model="form" :rules="rules" label-width="110px" :inline="true">
            <el-form-item>
              <el-button type="primary" class="btnadd" @click="addbtn">
                <i class="el-icon-circle-plus"></i> 增加商品明细
              </el-button>
              <el-button type="primary" @click="submitForm('form')">确认保存</el-button>
            </el-form-item>
            <br>
            <el-form-item label="采购单编号" prop="poId">
              <el-input v-model="form.poId" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="供应商编号" prop="venderCode">
              <el-input v-model="form.venderCode" @focus="venderCode"></el-input>
            </el-form-item>
            <el-form-item label="供应商名称" prop="venderCode">
              <el-input v-model="form.vendername" @focus="vendername"></el-input>
            </el-form-item>
            <el-form-item label="创建用户" prop="account">
              <el-input v-model="form.account" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
              <el-input v-model="form.createTime" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="附加费用" prop="tipFee">
              <el-input v-model="form.tipFee" @input="tipFee"></el-input>
            </el-form-item>
            <el-form-item label="产品总价" prop="productTotal">
              <el-input v-model="form.productTotal" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="采购总价" prop="poTotal">
              <el-input v-model="form.poTotal" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="付款方式" prop="payType">
              <!-- <el-input v-model="form.payType"></el-input> -->
              <el-select
                v-model="form.payType"
                placeholder="选择付款方式"
                class="select"
                @change="select"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="最低预付款金额" prop="prePayFee">
              <el-input v-model="form.prePayFee" :disabled="seleabled"></el-input>
            </el-form-item>
            <el-form-item label="采购单状态" prop="status">
              <el-input v-model="form.status" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="2"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="form.remark"
              ></el-input>
            </el-form-item>
            <br>
          </el-form>
        </el-col>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-table :data="poitems" :model="poitems" stripe style="width: 100%">
        <el-table-column prop="poId" label="采购单编号" width="180"></el-table-column>
        <el-table-column prop="productCode" label="产品编号" width="180"></el-table-column>
        <el-table-column label="产品单价">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.itemprice"
              placeholder="请输入价格"
              @input="itemprice(scope.$index, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品数量">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.itemnum"
              placeholder="请输入数量"
              @input="itemnum(scope.$index, scope.row,scope)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="数量单位"></el-table-column>
        <el-table-column prop="subPrice" label="小计"></el-table-column>
        <el-table-column prop="itemPrice" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="Delete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding: 14px;">
        <span class="total">总价：{{pricetotal}}</span>
      </div>
    </el-card>
    <!-- 添加供应商 -->
    <el-dialog title="添加供应商" :visible.sync="Visible">
      <div>
        <!-- 过滤 -->
        <el-form :model="filt">
          <div class="filt">
            <el-input v-model="filt.venderCode" class="code" placeholder="供应商编号"></el-input>
            <el-input v-model="filt.name" class="filtname" placeholder="供应商名称"></el-input>
            <el-button type="primary" @click="onfilt('filt')">查找</el-button>
          </div>
        </el-form>
        <!--  -->
        <el-table :data="users" border stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="50px" sortable></el-table-column>
          <el-table-column prop="venderCode" label="供应商编号"></el-table-column>
          <el-table-column prop="name" label="供应商名称"></el-table-column>

          <el-table-column label="操作" width="150px">
            <template slot-scope="scope" class="btnmini">
              <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">选择添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next,jumper"
          :total="total"
          :current-page="pageNum"
          @current-change="vgoPage"
          class="pp"
        ></el-pagination>
      </div>
    </el-dialog>
    <!--  -->
    <!-- 添加商品 -->
    <el-dialog title="添加商品" :visible.sync="goodsVisible">
      <div>
        <!-- 确认 -->
        <el-form :model="filt">
          <div class="filt">
            <el-button type="primary" @click="confirm">确定</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
          </div>
          <el-table :data="goods" border stripe @selection-change="changeFun">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="productCode" label="产品编码"></el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="unitName" label="数量单位"></el-table-column>
          </el-table>
        </el-form>
        <!--  -->
        <el-pagination
          background
          layout="prev, pager, next,jumper"
          :total="goodstotal"
          :current-page="goodspageNum"
          @current-change="goodsPage"
          class="pp"
        ></el-pagination>
      </div>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
import axios from "axios";
import store from "../store";
export default {
  data() {
    return {
      form: {
        account: "",
        name: "",
        createDate: "",
        status: "新添采购单",
        modelcodes: [],
        createTime: "", //自定义日期
        prePayFee: 0,
        vendername: "",
        tipFee: 0,
        remark: ""
      },
      filt: {
        venderCode: "",
        name: ""
      },
      users: [],
      total: 0,
      pageNum: 1,
      options: [
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
      rules: {
        name: [{ required: true, message: "请输入用户姓名", trigger: "blur" }],
        passWord: [
          { required: true, message: "请输入用户密码", trigger: "blur" }
        ],
        modelcodes: [
          { required: true, message: "请至少选择一个权限", trigger: "change" }
        ]
      },
      Visible: false, //选择供应商框
      goodsVisible: false, //选择商品框
      goods: [],
      goodstotal: 0,
      goodspageNum: 1,
      poitems: [],
      Selection: [],
      poId: "",
      pricetotal: 0, //产品总价
      detailarr: [], //购物单明细
      seleabled: true, //最低预付款金额禁用状态
      content: store.state.alterorders //要修改的信息
    };
  },
  methods: {
    //确认保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let status = this.form.status == "新增采购单" ? 1 : 1;

          for (let i = 0; i < this.poitems.length; i++) {
            delete this.poitems[i].itemnum;
            delete this.poitems[i].itemprice;
            delete this.poitems[i].subPrice;
            delete this.poitems[i].total;
          }

          let pomain = {
            createTime:this.form.createTime,
            poId: this.form.poId,
            venderCode: this.form.venderCode,
            account: this.form.account,
            tipFee: this.form.tipFee,
            productTotal: this.form.productTotal,
            poTotal: this.form.poTotal,
            payType: this.form.payType,
            prePayFee: this.form.prePayFee,
            status: status,
            remark: this.form.remark,
            poitems: this.poitems
          };
          axios({
            url: "/api/main/purchase/pomain/update",
            method: "post",
            data: JSON.stringify(pomain),
            headers: {
              "Content-Type": "application/json"
            }
          }).then(resp => {
            console.log("提交", resp.data);
            if(resp.data.status == 2){
        this.$router.push({ path: "/NewPurchase" });
         this.$message({
                  message: "修改成功",
                  type: "success"
                });
            }else{
        this.$message({
          message: '修改失败',
          type: 'warning'
        });
            }
            this.$message(resp.data.statusInfo);
          });
        } else {
          return false;
        }
      });
    },
    //增加明细
    addbtn() {
      this.goodsVisible = true;
    },
    //付款方式
    select() {
      console.log(1111, this.form.payType);
      if (this.form.payType == 3) {
        this.seleabled = false;
      } else {
        this.seleabled = true;
      }
    },
    //输入数量
    itemnum(index, row) {

      this.poitems[index].num = row.itemnum;
      if (row.itemprice != undefined && row.itemnum != undefined) {
        row.subPrice = Number(row.itemprice * row.itemnum);
        this.poitems[index].total = row.subPrice; //把小计添加到表格数组中

        this.poitems[index].itemPrice = row.subPrice;

        let n = 0; //遍历数组该对象计算出总价
        for (let i = 0; i < this.poitems.length; i++) {
          n += this.poitems[i].total;
        }
        console.log("n", n);
        if (!isNaN(n)) {
          this.pricetotal = n;
          this.form.productTotal = n; //产品总价
          this.form.poTotal = Number(this.form.productTotal + this.form.tipFee); //采购总价
        }
      }
    },
    //输入单价
    itemprice(index, row, scope) {
      this.poitems[index].unitPrice = row.itemprice;
      if (isNaN(this.pricetotal)) {
        this.pricetotal = 0;
      }
      if (row.itemprice != undefined && row.itemnum != undefined) {
        row.subPrice = Number(row.itemprice * row.itemnum);
        this.poitems[index].total = row.subPrice; //把小计添加到表格数组中
        //小计删除
        let n = 0; //遍历数组该对象计算出总价
        for (let i = 0; i < this.poitems.length; i++) {
          n += this.poitems[i].total;
        }

        console.log("n", n);
        if (n != NaN) {
          this.pricetotal = n;
          this.form.productTotal = n; //产品总价
          this.form.poTotal = Number(this.form.productTotal + this.form.tipFee); //采购总价
        }
      }
    },
    //删除
    Delete(index, row) {
      console.log(index);
      this.poitems.splice(index, 1);
      console.log(1111, this.poitems);
    },
    //附加费用改变的时候,采购总价也在改变
    tipFee() {
      this.form.poTotal = this.form.productTotal + Number(this.form.tipFee); //采购总价
    },
    //查找供应商
    onfilt(filt) {
      axios
        .post(
          `/api/main/purchase/vender/show`,
          `page=${this.pageNum}&venderCode=${this.filt.venderCode}&name=${
            this.filt.name
          }`
        )
        .then(resp => {
          this.pageNum = resp.data.pageNum;
          this.users = resp.data.list;
          this.total = resp.data.total;
          console.log(resp.data);
        });
    }, //获取供应商分页的数据
    vgoPage(currPage) {
      axios
        .post(`/api/main/purchase/vender/show?page=${currPage}`)
        .then(resp => {
          this.users = resp.data.list;
          this.total = resp.data.total;
          this.pageNum = resp.data.pageNum;

          //当页码改变数据也随着改变
        });
    },
    //获取商品分页数据
    goodsPage(currPage) {
      axios.post(`/api/main/sell/product/show?page=${currPage}`).then(resp => {
        this.goods = resp.data.list;

        //当页码改变数据也随着改变
      });
    },
    //选择供应商事件
    handleEdit(index, row) {
      this.form.venderCode = row.venderCode;
      this.form.vendername = row.name;
      this.Visible = false;
    },
    //选择供应商名称事件
    vendername() {
      this.Visible = true;
    },
    //供应商编号焦点事件
    venderCode() {
      this.Visible = true;
    },
    //添加商品的确认按钮
    confirm() {
      this.goodsVisible = false;
      console.log("添加商品的确认按钮", ...this.Selection);

      this.poitems.push(...this.Selection);
      this.poId = this.form.poId;

      console.log();
      //把采购单编号添加上去
      for (let i = 0; i < this.poitems.length; i++) {
        this.poitems[i].poId = this.form.poId;
      }

      for (let i = 0; i < this.poitems.length; i++) {
        delete this.poitems[i].categoryId;
        delete this.poitems[i].categoryName;
        delete this.poitems[i].createDate;
        delete this.poitems[i].name;
        delete this.poitems[i].num;
        delete this.poitems[i].poNum;
        delete this.poitems[i].price;
        delete this.poitems[i].remark;
        delete this.poitems[i].soNum;
        delete this.poitems[i].total;
        delete this.poitems[i].itemnum;
        delete this.poitems[i].subPrice;
      }
    },
    //添加商品的取消按钮
    cancel() {},
    changeFun(val) {
      this.Selection = val;
    }
  },
  created: function() {
    //要修改的信息
    this.form.poId = this.content.poId;
    this.form.account = this.content.account;

    if (this.content.payType == "货到付款") {
      this.content.payType = 1;
    } else if (this.content.payType == "款到发货") {
      this.content.payType = 2;
    } else if (this.content.payType == "预付款到发货") {
      this.content.payType = 3;
    }

    this.form.payType = this.content.payType;
    this.form.createTime = this.content.createTime;
    this.form.poTotal = this.content.poTotal;
    this.form.prePayFee = this.content.prePayFee;
    this.form.productTotal = this.content.productTotal;
    this.form.status = this.content.status == 1 ? "新增采购单" : "新增采购单";
    this.form.tipFee = this.content.tipFee;
    this.form.venderCode = this.content.venderCode;
    this.form.vendername = this.content.venderName;
    this.form.remark = this.content.remark;

//采购单明细
    axios.post(`/api/main/purchase/pomain/queryItem`, `poId=${this.form.poId}`).then(resp => {
      this.poitems = resp.data;
      console.log("明细",resp.data,this.poitems);
     
   
    });
    console.log("store.state.alterorders", this.content.venderName);

    //获取供应商分页数据
    axios.post(`/api/main/purchase/vender/show`, `page=1`).then(resp => {
      this.pageNum = resp.data.pageNum;
      this.users = resp.data.list;
      this.total = resp.data.total;
    });
    //获取产品分页数据
    axios.post(`/api/main/sell/product/show`).then(resp => {
      this.goods = resp.data.list;
      this.goodstotal = resp.data.total;
      this.goodspageNum = resp.data.pageNum;
    });
  }
};
</script>

<style scoped>
.bread {
  margin-bottom: 15px;
}
.select {
  width: 173px;
}
.filt {
  display: flex;
  align-items: center;
}
.code {
  width: 200px;
  margin: 0 20px;
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
</style>
