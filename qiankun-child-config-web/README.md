# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended Setup

-   [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur

-   Use [vue-tsc](https://github.com/vuejs/language-tools/tree/master/packages/tsc) for performing the same type checking from the command line, or for generating d.ts files for SFCs.

# 子应用添加 qiankun 配置

## 安装插件

```
yarn add vite-plugin-qiankun -D
```

## .env.development 添加子应用名字

```
VITE_PUBLIC_PATH = /child-web/
VITE_QK_NAME = child-web
```

## 配置 vite.config.ts

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

export default (configEnv: ConfigEnv): UserConfigExport => {
    const viteEnv = loadEnv(configEnv.mode, process.cwd())
    const { VITE_PUBLIC_PATH, VITE_QK_NAME, VITE_PORT } = viteEnv
    return {
        base: VITE_PUBLIC_PATH,
        plugins: [
            vue(),
            qiankun(VITE_QK_NAME, {
                //子应用名字，与主应用注册的子应用名字保持一致
                useDevMode: true,
            }),
        ],
    }
}
```

## 配置 main.ts

```
mport { createApp } from 'vue'
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

```
