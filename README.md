# Vue3+Vite+Qiankun

# 背景

最近在研究微前端，在接入 qiankun 过程中会遇到各种问题，记录下来相关内容。

# 存在问题

qiankun 官方暂未有文档表明已经支持 Vite，所以直接用普通方式接入 vite 构建的子应用时会出现问题。

# 原因分析

## 1.开发模式

在开发环境下，如果我们使用 vite 来构建 vue3 子应用，基于 vite 的构建机制，会在子应用的 html 的入口文件的 script 标签上携带 type ＝ module。我们知道 qiankun 父应用引入子应用，本质上是将 html 做为入口文件，并通过 import-html-entry 这个库去加载子应用所需要的资源列表 Js、css，然后通过 eval 直接执行，基于 vite 构建的 js 中 import、export 并没有被转码(vite 是基于浏览器支持的 ESM import 特性实现的 bundless，通过利用浏览器进行模块间依赖加载，而不需要在编译时进行。)，导致直接报错(不允许在非 type ＝ module 的 script 里面使用 import)

## 2.生产模式

产模式下，因为没有诸如 webpack 中支持运行时 publicPath，也就是＿webpack＿public＿path\_\_，换句话说就是 vite 不支持运行时 publicPath，其主要作用是用来解决微应用动态载入的脚本、样式、图片等地址不正确的问题。

# 解决方案

一款开源插件：`vite-plugin-qiankun`，通过这个插件可以在 qiankun 下解决上述两种模式的问题，同时保留了 vite 构建模块的优势。

# 接入步骤

## 技术栈

在接入中不论是主应用还是子应用，采用技术都是 vue3 + vite + vue-router4

分三个项目

1. qiankun-child-config-web 主应用
2. qiankun-child-pcache-web 子应用（含路由）
3. qiankun-main-config-web 子应用（不含路由）

### 主应用

```
 "dependencies": {
    "qiankun": "^2.10.16",
    "vue": "^3.0.4",
    "vue-router": "^4.2.4"
  },
  "devDependencies": {
    "vite": "^5.2.0",
  }
```

### 子应用

```
"dependencies": {

    "vue": "^3.0.4",
    "vue-router": "^4.2.4"
},
"devDependencies": {
    "@types/node": "^20.14.9",
    "typescript": "^5.2.2",
    "vite": "^5.2.0",
    "vite-plugin-qiankun": "^1.0.15",
}

```

## 创建主应用

(1) 安装 qiankun

```
yarn vite-plugin-qiankun
```

(2) 新建 src/qiankun/app.js 文件，进行单独注册子应用 registerMicroApps 配置

```
const apps = [
    {
        //必须与子应用注册名字相同
        name: 'vue-app',
        //入口路径，开发时为子应用所启本地服务，上线时为子应用线上路径
        entry:'http://localhost:8080',
        //子应用挂载的节点
        container: '#vue-app-container',
        //当访问路由为/micro-vue 时加载子应用
        artiveRule: '/micro-vue'

    },{
        name: 'react-app',
        entry:'http://localhost:8090',
        container: '#react-app-container',
        activeRule: '/micro-react',
        props: {
            msg：＂我是来自主应用的值-react＂
        }
    }
]
export default apps

```

(3) 新建 src/qiankun/index.js 文件，qiankun 主应用的入口文件，主要作用是注册子应用，以及全局的微应用生命周期钩子

```
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
```

(4) 在 App.vue 挂载子应用或者 views 中单独写明子应用

```
<template>
  <div id="app">
    <div id="vue-app-container"></div>
    <div id="react-app-container"></div>
  </div>
</template>
```

(5) 在 main.js 文件中引入 qiankun 插件

```
import start from './qiankun/index'

//添加定时器，异步请求，确保微应用加载完成后再执行start方法
setTimeout(() => {
    start({
        sandbox: true,
        prefetch: true, //是否开启预加载
    })
}, 0)

```

## 创建子应用 micro-vue-app(vue3+vite)

(1) 安装 vite-plugin-qiankun

```
yarn add vite-plugin-qiankun -D
```

(2) 修改 vite.config.js

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
cport default defineConfig({
    plugins: [
        vue(),
        qiankun('vue-app', { //子应用名字，与主应用注册的子应用名字保持一致
            useDevMode: true
        })
    ],
    server: {
        port: 8080
        origin:'http://localhost:8080',//解决静态资源(图片)加载 404 问题
        host: 'localhost',
    }
})

```

修改 vite.config.ts

```
import vue from '@vitejs/plugin-vue'
import vuejsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path'
import qiankun from 'vite-plugin-qiankun'


export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
     const viteEnv = loadEnv(configEnv.mode, process.cwd())
    const { VITE_PUBLIC_PATH } = viteEnv
    console.log(viteEnv)

    return {
        base: VITE_PUBLIC_PATH,
        server: {
            port: 8080
            origin:'http://localhost:8080',//解决静态资源(图片)加载 404 问题
            host: 'localhost',
        },
        plugins: [
            vue(),
            vuejsx(),
            qiankun(VITE_PUBLIC_PATH, {
                //子应用名字，与主应用注册的子应用名字保持一致
                useDevMode: true,
            }),
        ],
    }
})

```

(3) 修改 main.js

```
import { createApp } from 'vue'
import App from './App.vue'
import { stores } from './stores'
import ElementPlus from 'element-plus' // element plus
import * as Icons from '@element-plus/icons-vue' // element icons
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
    instance.config.errorHandler = errorHandler

    instance.directive('hasPermi', hasPermiDirective)

    // register the element Icons component
    Object.keys(Icons).forEach((key) => {
        instance.component(key, Icons[key as keyof typeof Icons])
    })
    instance.use(ElementPlus).use(directives).use(router).use(I18n).use(pinia)
    instance.mount(container ? container.querySelector('#vue-app') : '#vue-app')
}

//判断当前应用是否在主应用中
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()


```

(4) 修改 route 文件，采用 hash 模式

qiankun 官方是以`window.＿POWERED＿BY＿QIANKUN__` 来判断当前是否为 qiankun 环境下，而该插件引用之后是通过`qiankunWindow.＿POWERED＿BY＿QIANKUN__` 来判断。

```
import { createWebHashHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
const router = createRouter({
    //值和主应用中的 activeRule 保持一致
    history: createWebHashHistory(qiankunWindow.__POWERED_BY_QIANKUN__?'/vue-app':'/'),
    routes: [...staticRouter]
})

router.beforeEach(async (to, from, next) => {
    ...
    next()
})
```

(5) 修改路由配置，添加`VITE_PUBLIC_PATH`

静态路由

```
/**
 * staticRouter (静态路由) 接入qiankun是，需要添加上VITE_PUBLIC_PATH
 */
export const staticRouter: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: HOME_URL,
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/components/ErrorMessage/403.vue'),
        meta: {
            title: '403页面',
        },
    },
    {
        path: '/layout',
        name: 'layout',
        component: () => import('@/layouts/index.vue'),
        redirect: HOME_URL,
        children: [],
    },
].map((item) => ({ ...item, path: qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH + item.path : item.path }))

```

页面动态路由

```
router.beforeEach(async (to, from, next) => {
    // 请求菜单列表并添加动态路由 动态路由判断中也要添加VITE_PUBLIC_PATH
    // path: qiankunWindow.__POWERED_BY_QIANKUN__ ? import.meta.env.VITE_PUBLIC_PATH + item.uri : item.uri, //'/vue-app' + 动态路由

    if (!authStore.authMenuListGet.length) {
        await initDynamicRouter()
        return next({ ...to, replace: true })
    }

     // 正常访问页面
    next()
})
```

.evn 的一些动态路由

```
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
const { VITE_PUBLIC_PATH, VITE_LOGIN_URL, VITE_HOME_URL } = import.meta.env

export const history = qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH : '/'

export const LOGIN_URL: any = qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH + VITE_LOGIN_URL : VITE_LOGIN_URL

export const HOME_URL = qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH + VITE_HOME_URL : VITE_HOME_URL

```

一句话，关于路由渲染，都需要添加上`qiankunWindow.__POWERED_BY_QIANKUN__ `判断

# 可能存在的其他问题

[微前端 qiankun(vue3+vite5+vue-router4)开发配置中遇到的问题](https://juejin.cn/spost/7386565810829328395)

# 还有其他使用手册

- [微前端（qiankun）使用手册](https://juejin.cn/post/7379641602618474535)
- [微前端（qiankun）Hash 路由实践](https://juejin.cn/post/7379641602618507303)
- [微前端 qiankun 接入 Vite 构建的子应用](https://juejin.cn/post/7379641602618556455)
