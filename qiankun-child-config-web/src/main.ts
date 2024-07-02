/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 16:58:07
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 11:12:33
 * @Description:
 */
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import store from './stores'
import ElementPlus from 'element-plus'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let instance: any = null
const initQianKun = () => {
    renderWithQiankun({
        mount(props) {
            render(props.container)
        },
        bootstrap() {},
        unmount() {
            instance.unmount()
            instance.__instance = null
            instance = null
            history.go(0) //解决样式冲突问题
        },
        update() {},
    })
}
const render = (container?: any) => {
    if (instance) return
    //如果是在主应用的环境下就挂载主应用的节点，否则挂载到本地
    //注意：这边需要避免 id(app)重复导致子应用挂载失败
    instance = createApp(App)
    instance.use(store).use(ElementPlus)
    instance.mount(container ? container.querySelector('#child-app') : '#child-app')
}

//判断当前应用是否在主应用中
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()
