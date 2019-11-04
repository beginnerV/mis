 <template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/supplier' }">供应商管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/AddSupplier">添加新供应商</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片  -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div>
        <el-col :span="12">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="供应商编号" prop="venderCode">
              <el-input v-model="form.venderCode"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="passWord" >
              <el-input v-model="form.passWord" type="passWord"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contactor">
              <el-input v-model="form.contactor"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <div class="postcla">
            <el-form-item label="邮政编码" prop="postCode" class="post">
              <el-input v-model="form.postCode"></el-input>
            </el-form-item>
            <el-form-item label="添加日期" prop="date" class="date" label-width="80px">
              <el-input v-model="form.date" :disabled="true"></el-input>
            </el-form-item>
            </div>
            <div class="call">
            <el-form-item label="电话" prop="tel" class="tel" >
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="传真" prop="fax" class="fax" label-width="80px">
              <el-input v-model="form.fax"></el-input>
            </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">确认保存</el-button>
              <el-button @click="resetForm('Form')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        venderCode: "",
        name: "",
        passWord: "",
        contactor: "",
        address: "",
        postCode: "",
        createDate: "",
        tel: "",
        fax: "",
        date: "" //自定义日期
      },
      rules: {
        venderCode: [
          { required: true, message: "请输入供应商编号", trigger: "blur" },{
            pattern:/^\w{4,20}$/,
            message: "请输入4-20个字符的供应商编号",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "请输入3-12个字符的用户账号",
            trigger: "blur"
          }
        ],
        passWord: [
          { required: true, message: "请输入用户密码", trigger: "blur" }
        ],
        contactor: [
          { required: true, message: "请输入联系人", trigger: "change" }
        ],
        tel: [
          { required: true, message: "请输入电话", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //确认保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let status = this.form.status == "否" ? 0 : 1;
          console.log("保存成功!");
          console.log(this.form.date);

          axios
            .post(
              "/api/main/purchase/vender/add",
              `venderCode=${this.form.venderCode}&name=${this.form.name}&passWord=${
                this.form.passWord
              }&contactor=${
                this.form.contactor
              }&address=${this.form.address}&postCode=${this.form.postCode}&createDate=${this.form.date}&tel=${this.form.tel}&fax=${this.form.fax}`
            )
            .then(resp => {
              console.log(resp.data);
                   if(resp.data.status == 2){
                      this.$router.push({ path: "/supplier" });
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                
                   }
            });
        } else {
          console.log("保存失败!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created: function() {
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
    this.form.date = year + "-" + month + "-" + day;
  }
};
</script>

<style scoped>
.bread {
  margin-bottom: 15px;

}
.tel{
    width: 300px;
}
.fax{
    width: 250px;
}
.call{
 display: flex;
 justify-content: center;
}
.post{
 width: 300px;
}
.date{
  width: 250px;
}
.postcla{
 display: flex;
 justify-content: center;
}
</style>
