import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
import Cookies from 'js-cookie'
Vue.use(Vuex)

const SET_ACCOUNT = 'set_account';
const SET_ALTERORDERS = 'set_alterorders';
const SET_MODELS = "set_models";
const store = new Vuex.Store({
    state: {
        // account: sessionStorage.getItem("username"),
        account:Cookies.get("username"),
        //修改采购单的信息
        alterorders:[],
        models:Cookies.get("models")
    },
    mutations: {
        //mutations函数最好是个常量，规则
        [SET_ACCOUNT](state, username){
            Cookies.set('username', username);
            state.account = username; //把传入数据放入state里面
        },
        [SET_ALTERORDERS](state, row){
          state.alterorders = row;
        },
        [SET_MODELS](state, models){
          
            Cookies.set('models', models);
            state.models = models;
        }

        
    },
    actions: {
        login(context, payload){ 
            //1.用Promise回调函数响应成功或者失败的内容
            //2.注意用post跨域请求要配置config文件下的index.js,的proxyTable属性
            return new Promise((resolve,reject)=>{
                console.log(payload.role);
             let role = payload.role ? "member": "customer" //默认为客户登录
              axios.post('/api/sys/login',`username=${payload.username}&password=${payload.password}&role=${role}`).then(resp => {
                    console.log('响应的内容：',resp.data,resp.data.data.models.map(item=>
                        item.modelName
                    ))
               
                  
                    if(resp.data.status==3){
                        reject('账号或密码错误')
                    }else if(resp.data.status==2){
                        context.commit(SET_ACCOUNT,payload.username)

                        context.commit(SET_MODELS,resp.data.data.models.map(item=>
                            item.modelName
                        ))
                        //用action的方法提交mutations
                        resolve()//回调成功函数
                    }else{
                        // throw new Error('服务器异常')
                        reject('服务器异常')//回调失败函数
                    }
                })
            })
           
        },
        //修改采购单的信息
        alterorders(context, payload){
         console.log(payload.row);
         context.commit(SET_ALTERORDERS,payload.row)
        }
    }
});

export default store;