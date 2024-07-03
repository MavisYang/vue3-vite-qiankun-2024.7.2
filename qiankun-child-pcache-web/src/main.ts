/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 11:18:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-03 11:25:48
 * @Description:
 */
import { createApp } from 'vue'
import App from './App.vue'

import '@/styles/reset.scss' // reset style sheet
import '@/styles/common.scss' // CSS common style sheet
import '@/assets/iconfont/iconfont.scss' // iconfont css
import '@/assets/fonts/font.scss' // font css
import 'element-plus/dist/index.css' // element css
import '@/styles/element.scss' // custom element css
import 'virtual:svg-icons-register' // svg icons
import '@/assets/icons/iconfont.ts'
import ElementPlus from 'element-plus' // element plus
import * as Icons from '@element-plus/icons-vue' // element icons
import directives from '@/utils/directives/index' // custom directives 指令
import hasPermiDirective from '@/utils/directives/hasPermiDirective'
import router from '@/routers' // vue Router
import I18n from '@/utils/languages/index' // vue i18n
import pinia from '@/stores' // pinia store
import errorHandler from '@/utils/errorHandler' // errorHandler
import Mit from '@/utils/mittBus' // mitt
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

    //vue3 挂载全局 API
    instance.config.globalProperties.$Bus = Mit
    instance.config.errorHandler = errorHandler

    instance.directive('hasPermi', hasPermiDirective)

    // register the element Icons component
    Object.keys(Icons).forEach((key) => {
        instance.component(key, Icons[key as keyof typeof Icons])
    })
    instance.use(ElementPlus).use(directives).use(router).use(I18n).use(pinia)
    instance.mount(container ? container.querySelector('#pcache-app') : '#pcache-app')
}

//判断当前应用是否在主应用中
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()
