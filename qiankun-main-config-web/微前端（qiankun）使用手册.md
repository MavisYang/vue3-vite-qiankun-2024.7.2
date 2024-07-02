# 微前端（qiankun）使用手册

本文中主应用采用 vue2 构建,微应用采用 vue2、vue3、react 构建。其中主应用和微应用都采用 webpack 打包,
并且主应用路由模式选择了 History（该模式需要服务端支持）,微应用路由模式采用 History、Hash。
如果在项目采用 vite 构建的前提下需要使用 qiankun,请查看文档《微前端 qiankun 接入 Vite 构建的子应用》。
如果主应用路由模式需要使用 hash,请查看文档《微前端（qiankun）Hash 路由实践》。

# 创建主应用

## 1.安装 qiankun

```
yarn add qiankun 或者 npm i qiankun -S
```

## 2.注册微应用

在入口文件 main.js 中注册所有微应用并启动 qiankun

```
import { registerMicroApps, start, addGlobalUncaughtErrorHandler, initGlobalState } from 'qiankun'
//1.定义所有微应用
const apps = [
    {
        //必须与子应用注册名字相同
        name:'micro-app-vue2',
        //入口路径,开发时为子应用所启本地服务,上线时为子应用线上路径
        entry:'//localhost:3003',
        //子应用挂载的节点
        container: '#micro-app-vue2',
        //当访问路由为/micro-app-vue2 时加载子应用
        activeRule:'/micro-app-vue2',
        //主应用向子应用传递参数
        props:{
            msg:“我是来自主应用的值”
        }
    },
    {
        name: 'micro-app-vue3',
        entry: '//localhost:3001',
        container: '#micro-app-vue3',
        activeRule:'/micro-app-vue3'
    },
    {
        name: 'micro-app-react',
        entry: '//localhost:4001',
        container.'#micro-app-react',
        activeRule: '/micro-app-react'
    }

]

//2.微应用生命周期
//qiankun暴露了五个生命周期钩子:beforeLoad、beforeMount、afterMount、beforeUnmount和afterUnmount,这五个钩子可以在主应用中注册子应用时使用。
const microAppLifCycles= {
    //全局的微应用生命周期钩子,子应用加载前
    beforeLoad:[
        app => {
            console.log（＇子应用加载-beforeLoad＇, app）
            return Promise.resolve()
        }
    ],
    //全局的微应用生命周期钩子,子应用挂载前
    beforeMount:[
        app=>{
            console.log('2-beforeMount', app)
            return Promise.resolve()
        }
    ],
    //全局的微应用生命周期钩子,子应用挂载后
    afterMount:[
        app =>{
            console.log('3-afterMount', app)
            return Promise.resolve()
        }
    ],
    beforeUnmount:[
        app=>{
            console.log('4-beforeUnmount', app)
        }
    ],
}


//3.注册微应用的基础配置信息（第二个参数可选）
registerMicroApps(apps, microAppLifCycles)

//4.添加全局的未捕获异常处理器
addGlobalUncaughtErrorHandler((event)=>{
    const {message: msg}= event
    if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
        console.error（＇微应用加载失败,请检查应用是否可运行,event）
    }
)}

//5.启动微应用
start({
    prefetch:true,//是否开启预加载；
    sandbox: {
        experimentalStylelsolation:true//实验性的样式隔离
    }
})

```

关于预加载微应用 prefetch 的属性说明:

（1）配置为 true 则会在第一个微应用 mount 完成后开始预加载其他微应用的静态资源

（2）配置为 all 则主应用 start 后即开始预加载所有微应用静态资源

（3）配置为 string］则会在第一个微应用 mounted 后开始加载数组内的微应用资源

（4）配置为 function 则可完全自定义应用的资源加载时机（首屏应用及次屏应用）

当微应用信息注册完之后,一旦浏览器的 url 发生变化,便会自动触发 qiankun 的匹配逻辑,所有 activeRule 规则匹配上的微应用就会被挂载到指定的 container 中,同时依次调用微应用暴露出的生命周期钩子。

## 3.创建微应用 SFC

每个微应用使用一个对应的单文件组件进行挂载,并在 mounted 中进行判断如果未开启 qiankun 则进行开启。

该处以 microAppVue2 组件为例,其它组件只需要修改 id 和组件 name

```
<template>
<   !-- 这个id需要和注册微应用中的container的值对应 -->
    <div id="micro-app-vue2"/>
</template>
<script>
    import { start } from 'qiankun'
    export default {
        name: 'microAppVue2',
        components: {},
        mounted(){
            if (!window.qiankunStarted) {
            window.qiankunStarted =true

            start({
                prefetch:true,//是否开启预加载
                sandbox:{
                experimentalStylelsolation:true//实验性的样式隔离
                }
            })
        }
    }
</script>
```

## 4.路由配置

```
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes =[
    {
        //这个path需要和注册微应用中的activeRule的值对应
        path: '/micro-app-vue2',
        component: 0=>import('@/views/microAppVue2/index.vue')
    },
    {
        path:'/micro-app-vue3",
        component:0=>import('@/views/microAppVue3/index.vue')
    },
        path:'/micro-app-react',
        component: 0=>import('@/views/microAppReact/index.vue')
    },
]

const router = new VueRouter({
    //选择history模式时,需要设置base,这样在访问路由时会自动带上项目的基路径
    mode: 'history',
    base: process.env.BASEURL,
    routes
})
export default router
```

## 5.主应用代理微应用的接口地址

在使用 qiankun 微前端框架时,主应用可以通过配置代理来转发子应用的接口请求。这样可以解决跨域问题和统一管理接口访问。

首先,在主应用的配置文件中（例如 webpack.config.js）添加以下代码:

```
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = {
    //...其他配置

    devServer:{
    //...其他devServer 配置项
    //添加代理配置
    proxy:{
        '/api': {
        target:＇http://子应用的接口地址＇,
        changeOrigin: true,
        pathRewrite: {
            ＇^/api＇:'', //如果子应用接口有基础路径,需要进行重写
        },
    },
},
```

上述代码中,将/api 路径下的请求转发到了子应用的接口地址,并进行了域名跨域处理。你可以根据实际情况修改目标地址和路径重写规则。

然后,在微应用中调用接口时,使用相对于主应用的/api 路径作为前缀,例如:

```
fetch('/api/users')
    .then(response => response.json()))
    .then(data => console.log(data))
    .catch(error => console.error(error));

```

这样就能将请求发送给子应用的接口地址,并成功获取响应数据。

注意:以上示例是基于 webpack-dev-server 进行配置的,在生产环境部署时需要根据实际情况配置代理服务器。

# 创建微应用

vue2、vue3 和 react 的配置由于框架不同而在代码上有些微区别（比如 vue2 创建实例是 new vue,vue3 是 createApp）,但整体 qiankun 的配置步骤和配置内容相同。此处不做区分,以下仅以 vue2 为例:

## 1.修改配置文件

```
//vue.config.js

//1.package.json中name的值必须和主应用中注册微应用的name的值对应
const packageName = require('./package.json').name;
module.exports = {
    configureWebpack: {
            //2.打包方式改造
            output: {
            library: packageName,
            //这里设置为umd意思是在AMD或CommonJS的require之后可访问。
            libraryTarget: "umd",
            //webpack用来异步加载chunk的JSONP函数。
            jsonpFunction:'webpackJsonp_$(packageName}',
        },
    },
    devServer:{
        port:"3003°,
        disableHostCheck:true,//关闭主机检查,使微应用可以被fetch
        headers: {
        //3.因为qiankun内部请求都是fetch来请求资源,所以子应用必须允许跨域＂Access-Contro[-Allow-Origin＇:＂＊＊,
        },
    },
};

```

为什么 qiankun 要求子应用打包为 umd 库格式呢？

主要是为了主应用能够拿到子应用在入口文件导出的生命钩子函数,这也是主应用和子应用之间通信的关键。

umd 全称是 UniversalModuleDefinition,是一种通用模块定义格式,通常用在前端模块化开发中。

由于不同的模块化规范定义不同,为了让各种规范的模块可以通用,在不同的环境下都可以正常运行,就出现了 umd 这个通用格式。

umd 格式是一种既可以在浏览器环境下使用,也可以在 node 环境下使用的格式。它将 CommonJS、AMD 以及普通的全局定义模块三种模块模式进行了整合。

## 2.修改 publicPath

src 目录下新建 public-path.js,用于处理打包后静态资源的路径问题。内容如下:

```
if(window.__POWERED_BY_QIANKUN_){
// eslint-disable-next-line no-undef
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;

```

## 3.路由配置

```
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'


Vue.use(Router)
export default new Router({
    //1.设置history模式
    mode: 'history',
    //2.设置base,值和主应用中的activeRule保持一致
    base:window._POWEREDBYQIANKUN_?"/micro-app-vue2":"/",
    routes
})
```

当使用 vue-router v4.x 时,是通过 createRouter 的方式实例化 router 设置 histrov 和 base 通过如下方式:

```
//1.Hash路由设置方法,hash不需要设置base
history:createWebHashHistory(),

//2.设置History 路由时必须添加base
// history: createWebHistory(qiankunWindow._POWERED_BY_QIANKUN   ? '/micro-app-vue3-vite' : '/'),
```

当微应用为 History 时,主应用的 router/index.js 中必须多添加一项路由配置:

```
//...
{

    hidden: true,
    name: 'microAppVue2',
    //匹配微应用的路由
    path: '/micro-app-vue2/*',
    component: () => import('@/views/microAppVue2/index.vue')

}
//...

```

## 4.入口文件修改

修改入口文件 main.js,修改内容如下:

```
//1.顶部引入public-path
import './public-path',
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

//2.定义一个Vue实例
let instance=null

//3.渲染方法
function render(props = {}){
    const { container } = props
    instance=new Vue({
    router,
    render: (h)=>h(App)}).$mount(container ? container.querySelector('#app') : '#app')
}

//4.判断是否在qiankun环境下,非qiankun环境下独立运行
if (!window._POWERED_BY_QIANKUN__){
    render()
}

//5.暴露qiankun生命周期钩子
export async function bootstrap() {}

export async function mount(props) {
    render(props);
}
export async function unmount() {
    instance.$destroy();
    instance.$el.innerHTML = ";
    instance = null;
}
```

项目在迁移成子应用时,需要在入口文件配合 qiankun 来做一些改动,而这些改动有可能影响子应用的独立运行。为了解决子应用也能独立运行的问题,qiankun 注入了一个变量:window.POWEREDBYQIANKUN,这样就可以判断当前应用是否在独立运行。

但是变量需要在运行时动态的注入,那么该变量设置的位置就需要考虑清楚,qiankun 选择在 single-spa 提供的生命周期前进行变量的注入,在 beforeLoad 和 beforeMount 中把变量置为 true,在 beforeUnmount 中把变量置为 false。

和 single-spa 一样,qiankun 子应用的接入必须暴露三个生命周期:

（1）Bootstrap:只会在微应用初始化的时候调用一次,下次微应用重新进入时会直接调用 mount 钩子,不会再重复触发 bootstrap。I 通常我们可以在这里做一些全局变量的初始化,比如不会在 unmount 阶段被销毁的应用级别的缓存等。

（2）Mount:应用每次进入都会调用 mount 方法,通常我们在这里触发应用的渲染方法。

（3）Unmount:应用每次切出/卸载会调用的方法,通常在这里我们会卸载微应用的应用实例。

# 主应用和微应用通信

## 1.主应用中注册全局状态

在入口文件 main.js 中定义并监听全局状态

```
import { initGlobalState } from 'qiankun'

//定义全局状态,并返回通信方法,建议在主应用使用,微应用通过props获取通信方法
const { onGlobalStateChange, setGlobalState } = initGlobalState({
    user: 'qiankun'
})

//在当前应用监听全局状态,有变更触发 callback
onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - main]:',value + prev))

//按一级属性设置全局状态,微应用中只能修改已存在的一级属性
setGlobalState({
    ignore: 'master'
    user: {
        name:'master'
    }
})
```

## 2.微应用中监听并修改

在入口文件 main.js 中添加如下配置:

```
//微应用通过props 获取通信方法
function storesTest(props){
    props.onGlobalStateChange &&
        props.onGlobalStateChange(
        (value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
        true,
    );
    props.setGlobalState &&
        props.setGlobalState({
        ignore: props.name,
        user: {
            name: props.name,
        }
    });

export async function mount(props) {
    storesTest(props);
    //挂载到子应用,方便使用
    instance.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange;
    instance.config.globalProperties.$setGlobalState = props.setGlobalState;
}

```

以上通信过程如下:

（1）主应用里面先 initGlobalState

（2）主应用监听 onGlobalStateChange

（3）主应用去修改 setGlobalState

（3.1）主应用监听到并执行回调

（3.2）子应用监听到并执行回调

（4）子应用监听 onGlobalStateChange

（5）子应用去修改 setGlobalState

（5.1）主应用监听到并执行回调

（5.2）子应用监听到并执行回调

# 常见问题

## 1.qiankun 官方统计的常见问题

<https://qiankun.umijs.org/zh/faq>

## 2.子应用静态资源加载失败问题

说明:子应用的静态资源引用时都是相对路径,当子应用放入到基座中后,通过主应用 url 访问时,静态资源的请求域名默认会使用主应用的,所以导致静态资源全部加载失败。

常规情况可以通过以下前两点解决这个问题:

（1）使用 webpack 运行时 publicPath 配置 qiankun 将会在微应用 bootstrap 之前注入一个运行时的 publicPath 变量,你需要做的是在微应用的 entry js 的顶部添加如下代:

```
__webpack_public_path__ = __window.INJECTED_PUBLIC_PATH_BY_QIANKUN__;
```

关于运行时 publicPath 的技术细节，可以参考 webpack 文档。

runtime publicPath 主要解决的是微应用动态载入的脚本、样式、图片等地址不正确的问题。MIOM
（2）使用 webpack 静态 publicPath 配置 你需要将你的 webpack publicPath 配置设置成一个绝对地址的 url，比如在开发环境可能是：

```
{
    output:{
        publicPath://localhost:${port}',
    }
}
```

（3）对于 vite 构建的子应用，上述两种方法可能失效，可尝试如下设置 origin 方法：

```
export default defineConfig({
//...
server.{
    host: 'localhost',
    port: 5174,
        origin: 'http://localhost5174'
    }
})
```

## 3.解决切换路由时报错

[Vue Router warn]: Error with push/replace State DOMException: Failed to execute 'replaceState' on 'History':
-A history state object with URL 'http://localhost:8080undefined/' cannot be created in a document with origin 'http://localhost8080' and URL 'http://localhost8080/mypage1/'

```
router.beforeEach((to, from, next) => {
if (!window.history.state.current) window.history.state.current = to.fullPath;
if (!window.history.state.back) window.history.state.back = from.fullPath;
//手动修改history的state
return next();
```

## 4.微应用不是直接跟路由关联或是有需要手动触发子应用加载的场景该怎么做？

这时候 qiankun 提供了一个 loadMicroApp 的方法进行子应用的手动加载，本质上是利用 single-spa 的 mountRootParcel api 来实现的。

```
import { loadMicroApp} from 'qiankun';
loadMicroApp(
    name: 'app',
    entry:'//localhost:7100',
    container:'#Container',
});
```

使用 loadMircoApp 还需要在子应用中暴露 update 钩子。

```
//增加update 钩子以便主应用手动更新微应用
export async function update(props) {
    renderPatch(props);
}
```
