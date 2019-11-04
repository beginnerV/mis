// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from "axios"
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import Cookies from 'js-cookie'

//请求头信息加用户名
axios.defaults.headers.common['Authorization'] = store.state.account;


Vue.use(ElementUI);
Vue.prototype.$axios = axios  //在vue示例中创建个prototype原型axios,使之在全局可以使用
Vue.config.productionTip = false

// //路由拦截器
router.beforeEach((to, from, next) => {

  //判断是该用户否有访问权限
   console.log("判断是该用户否有访问权限",store.state.models,to.meta.auth)

      // // next();
      // //判断是该用户否有访问权限该组件
      // if(store.state.models.indexOf(to.meta.auth)>=0){
      //   next();
      // } else if(to.path === '/'){  //判断是否登录界面，是则路由跳转
      //     next();
      //   }else if(to.path === '/home'){
      //     next();
      //   }else if(to.path === '/hello'){  
      //     next();
      //   }else if(to.path === '/info'){
      //     next();
      //   }else{
      //     next({
      //       path:'/info'
      //     })
      //   }
   
  
  


  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
   
    if(Cookies.get('username')){ //判断本地是否存在
      next();
      //判断是该用户否有访问权限该组件
      // console.log(22);
      // if(store.state.models.indexOf(to.meta.auth)>=0){
      //   next();
      // } else if(to.path === '/'){  //判断是否登录界面，是则路由跳转
      //     next();
      //   }else if(to.path === '/home'){
      //     next();
      //   }else if(to.path === '/hello'){  
      //     next();
      //   }else if(to.path === '/info'){
      //     next();
      //   }else{
      //     next({
      //       path:'/info'
      //     })
      //   }

    }else {
     if(to.path === '/'){  //判断是否登录界面，是则路由跳转
     
        next();
      }else { //否则路由跳转登录界面
        next({
          path:'/'
        })
      }
    }
  }
  else {
    next();
  }


});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
