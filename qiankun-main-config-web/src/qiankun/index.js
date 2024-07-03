/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:31:43
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-03 11:24:12
 * @FilePath: /qiankun-main-config-web/src/qiankun/index.js
 *
 */

import { registerMicroApps, start, addGlobalUncaughtErrorHandler, initGlobalState } from 'qiankun'
import apps from './app'
import router from '@/router/index'

//微应用生命周期
const microAppLifCycles = {
    beforeLoad: [
        //全局的微应用生命周期钩子，子应用加载前

        (app) => {
            // console.log(app, 'beforeLoad')
            return Promise.resolve()
        },
    ],
    beforeMount: [
        //全局的微应用生命周期钩子，子应用挂载前
        (app) => {
            // console.log(app, 'beforeMount')
            return Promise.resolve()
        },
    ],
    afterMount: [
        //全局的微应用生命周期钩子，子应用挂载后
        (app) => {
            // console.log(app, 'afterMount')
            return Promise.resolve()
        },
    ],
    beforeUnmount: [
        (app) => {
            // console.log(app, 'beforeUnmount')
            return Promise.resolve()
        },
    ],
}

registerMicroApps(apps, microAppLifCycles)

//添加全局的未捕获异常处理器
addGlobalUncaughtErrorHandler((event) => {
    const { message: msg } = event
    if (msg && msg.includes('died in status LOADING_SOURCECODE')) {
        console.error('微应用加载失败，请检查应用是否可运行')
    }
})
//定义全局状态，并返回通信方法。微应用通过props获取通信方法
const { onGlobalStateChange, setGlobalState } = initGlobalState({
    name: '',
    value: '',
})
//在当前应用监听全局状态，有变更触发callback
onGlobalStateChange((value, prev) => {
    if (value.name === 'setMainAppRouter') {
        router.replace(value.value)
    }
})
setGlobalState()

export default start
