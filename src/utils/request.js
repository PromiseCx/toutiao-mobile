import axios from "axios"
import store from "@/store"


const request = axios.create({
    baseURL: "http://toutiao.itheima.net"
})

//请求拦截器
request.interceptors.request.use(function (config) {
    // 请求发起会经过这个函数
    // config: 本次请求得配置对象
    const {user}  = store.state;
    if(user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    // 拦截器中必须要返回拦截器中的对象，否则请求会发不出去
    return config
},function(error) {
    // 请求还未发送就报错则会经过这个函数
    return Promise.reject(error);
})

// 响应拦截器

export default request