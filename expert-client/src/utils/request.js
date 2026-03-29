import axios from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
})



request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        console.log("【请求拦截器】取出的 token =", token)

        if (token) {
            config.headers['token'] = token
        }
        console.log("【请求头】最终 headers =", config.headers)
        return config
    },
    (error) => Promise.reject(error)
)

request.interceptors.response.use(
    (response) => {
        if (response.request.responseType === 'blob') {
            return response.data
        }
        const res = response.data
        if (res.code === 200 || res.success) {
            return res
        } else {
            ElMessage.error(res.msg || '请求失败')
            return Promise.reject(res)
        }
    }
)


export default request