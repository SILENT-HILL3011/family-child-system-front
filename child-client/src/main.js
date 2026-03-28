import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import ElementPlus from 'element-plus' 
import 'element-plus/dist/index.css' 
import './style.css'
import App from './App.vue'
import 'element-plus/dist/index.css'
import { zhCn } from 'element-plus/es/locale/index.mjs'



const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn  
})
app.mount('#app')