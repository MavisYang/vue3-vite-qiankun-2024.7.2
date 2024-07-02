/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:23:52
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-28 08:54:05
 * @Description:
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import stores from '@/stores'
import ElementPlus from 'element-plus'
import * as ElementPlusIcons from '@element-plus/icons-vue'
// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/src/index.scss' //element-plus自定义命名
import '@/styles/index.scss'
import start from './qiankun/index'

start({
    sandbox: true,
    prefetch: true, //是否开启预加载
})
const app = createApp(App)

Object.keys(ElementPlusIcons).forEach((key) => {
    app.component(key, ElementPlusIcons[key])
})
app.use(router).use(ElementPlus).use(stores).mount('#qiankun-app')
