# 微前端 qiankun 接入 Vite 构建的子应用

# 存在问题

qiankun 官方暂未有文档表明已经支持 Vite，所以直接用普通方式接入 vite 构建的子应用时会出现问题。

# 原因分析

## 1.开发模式

在开发环境下，如果我们使用 vite 来构建 vue3 子应用，基于 vite 的构建机制，会在子应用的 html 的入口文件的 script 标签上携带 type ＝ module。我们知道 qiankun 父应用引入子应用，本质上是将 html 做为入口文件，并通过 import-html-entry 这个库去加载子应用所需要的资源列表 Js、css，然后通过 eval 直接执行，基于 vite 构建的 js 中 import、export 并没有被转码(vite 是基于浏览器支持的 ESM import 特性实现的 bundless，通过利用浏览器进行模块间依赖加载，而不需要在编译时进行。)，导致直接报错(不允许在非 type ＝ module 的 script 里面使用 import)

# 2.生产模式

产模式下，因为没有诸如 webpack 中支持运行时 publicPath，也就是＿webpack＿public＿path\_\_，换句话说就是 vite 不支持运行时 publicPath，其主要作用是用来解决微应用动态载入的脚本、样式、图片等地址不正确的问题。

# 解决方案

一款开源插件：`vite-plugin-qiankun`，通过这个插件可以在 qiankun 下解决上述两种模式的问题，同时保留了 vite 构建模块的优势。

## 1.创建主应用

(1) 安装 qiankun

```
npm install qiankun
```

(2) 新建 src/qiankun/index.js 文件，进行单独的抽离

```
import { registerMicroApps, start } from 'qiankun'
registerMicroApps([
    {
        //必须与子应用注册名字相同
        name: 'vue-app',
        //入口路径，开发时为子应用所启本地服务，上线时为子应用线上路径
        entry:'http://127.0.0.1:5174',
        //子应用挂载的节点
        container: '#vue-app-container',
        //当访问路由为/micro-vue 时加载子应用
        artiveRule: '/micro-vue'

    },{
        name: 'react-app',
        entry:'http://127.0.0.1:5175',
        container: '#react-app-container',
        activeRule: '/micro-react',
        props: {
            msg：＂我是来自主应用的值-react＂
        }
    }
])
start()
```

(3) 在 main.js 中导入

```
import "./qiankun"
```

(4) 在 App.vue 挂载子应用

```
<template>
  <div id="app">
    <div id="vue-app-container"></div>
    <div id="react-app-container"></div>
  </div>
</template>
```

## 2.创建子应用 micro-vue-app(vue3+vite)

(1) 安装 vite-plugin-qiankun

```
npm install vite-plugin-qiankun
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
        origin:'http://localhost:5174',//解决静态资源加载 404 问题
        host: 'localhost',
        port: 5174
    }
})
```

(3) 修改 main.js

```
import { createApp } from 'vue'
import App from './App.vue'
import { stores } from './stores'

import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let instance = null;
const initQianKun=()=>{
    renderWithQiankun({
        mount(props) {
            instance = createApp(App)
            instance.use(stores)
            instance.mount('# app')
            //可以通过 props 读取主应用的参数：msg
            //监听主应用传值
            props.onGlobalStateChange((state, prev) => {
                console.log('主应用传值', state)
            })
        },
        bootstrap() {},
        unmount() {
            instance.unmount()
            instance = null
        },
        update() {}
    })
}
const render=(container)=>{
        if (instance) return;
    //如果是在主应用的环境下就挂载主应用的节点，否则挂载到本地
    //注意：这边需要避免 id(app)重复导致子应用挂载失败
    const appDom = container? container.querySelector("#app") : "#app"
    instance = createApp(App)
    instance.mount(appDom)
}

//判断当前应用是否在主应用中
qiankunWindow.__POWERED_BY_QIANKUN__? initQianKun() : render()

```

(4) 修改 route 文件，采用 hash 模式
qiankun 官方是以`window.＿POWERED＿BY＿QIANKUN__` 来判断当前是否为 qiankun 环境下，I 而该插件引用之后是通过`qiankunWindow.＿POWERED＿BY＿QIANKUN__` 来判断。

```
import { createWebHashHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
const router = createRouter({
    //值和主应用中的 activeRule 保持一致
    history: createWebHashHistory(qiankunWindow.__POWERED_BY_QIANKUN__?'/vueApp':'/'),
    routes: routes
})
```

## 3.创建子应用 micor-react-app(react18+vite)

和 vue 配置一样，但是会报错

解决方法：在 vite．config．js 中删除 react

```
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
    plugins:[
        //在开发模式下需要把react0关掉
        //https://github.com/umijs/qiankun/issues/1257
        //react(),
        qiankun('react-app',{ //子应用名字，与主应用注册的子应用名字保持一致
            useDevMode: true
        })
    ],
    server:{
        port '5175',
    }
})
```

# 可能存在的其他问题

1. 插件 vite-plugin-qiankun 在生产模式下依旧不支持 publicPath，需要将 vite.config.js 中 base 配置写死。导致多环境部署不便捷。无法像在 webpack 结合 window.INJECTED＿PUBLIC＿PATHBYQIANKUN+publicpath 来解决。

2. 关于 vue3+vite +typescript 项目中出现"Error.The package ＂＠esbuild／win32-x64＂ could not be found， and is needed by esbuild."的错误。

在运行 dev 之前先运行·node nodemodules／esbuild／install.js 命令来解决 esbuild 安装问题。然后再启动项目，发现已经能正常运行。

3. CSS 样式污染问题

接下来就是 vite 引入时问题的重灾区了，由于没有沙箱，样式也不能进行隔离，由于前文提到的 css 加载的方式都是全局在主应用上生效的，所以全局上 css 互相影响的概率就很大，并且子应用使用的和主应用使用的组件库都是 Element 或 Ant Design 系列的，一些类名都是一致，这种情况下如果还按照之前的开发习惯直接控制组件对应的类名样式，大概率会出现互相层叠污染的情况，这时就需要一些开发规范和工程化的手段来设置样式。

以下以 Ant Design 为例，说明如何引入 prefix 来解决样式冲突问题，当然 ElementPlus 中也支持设置 prefix:

（1） ant design 修改 prefix

从工程化的角度可以解决多个 ant design 组件库同时使用的样式污染问题，qiankun 官方也有提供该解决方案，就是通过 ant-desigtn 注入 prefix，拿 ant-desigin-vue 来说：

```
<template>
    <a-config-provider prefix-cls="custom">
        <my-app/>
    </a-config-provider>
</template>
```

这样实际使用的 ant 的类名都是以.custom-xxx 的类名了

上述所见这样实现的自定义类名可以做到多份 ant 的 css 引入类名重复的问题。

当然如果自定义类名的话可以在 less 构建时注入相同的 prefix，让全局的 less 存在相同的一个前缀变量，实际修改.ant-xxx 类似的类名时需要替换.ant 为相应的注入的 prefix 变量：

```
// vite.config.js
export defaul()=>{
    return{
        css:{
        preprocessorOptions:{
            less:{
                modifyVars:{
                    //这里可以注入全局的 less 变量，通过注入的变量名称去实际业务样式修改的地方拼接 prefix 变量
                    'ant-prefix':'custom',//这里注入的 prefix 如上文提到<a-config-provider prefix-cls="custom">需要一致，以便一致
                },
                javascriptEnabled: true,
            },
        },
    },
}
```

通过上面的 vite 配置注入的 ant-prefix 这样可以在实际的样式中拼接使用：

```
.@{ant-prefix} {
    .@{ant-prefix}-col {
        width: 100%;
    }
}
```

这样构建出来的样式修改也是.custom-xxxx 的类名，可以达到修改自己的 ant 组件样式还不影响其他 ant 的项目 UI。

(2)手动隔离子应用的样式

上文的方式解决了 UI 框架级别的 css 污染，同时我们自己的全局样式配置也会有一些 css 样式：

```
input:-webkit-autofill-{
    -webkit-box-shadow:0 0 0 1000px white inset !important;
}

:-webkit-autofill {
    transition: background-color 5000s ease-in-out 0s !important;
}

a:focus,
a:active,
button,
div,
svg,
span, -label{
    outline: none limportant;
}

a{
    color: #51ffff !important;
}
```

这种情况需要我们手动进行隔离，我们可以在挂载的根节点元素上设置 vite 注入的 less 变量 ant-prefix 相同的类名，然后如下配置：

```
.@{ant-prefix} {
    input:-webkit-autofill {
        -webkit-box-shadow:0 0 0 1000px white inset !important;
    }
    :-webkit-autofill{
        transition:background-color 5000s ease-in-out Os !important;
    }
    a:focus,
    a:active,
    button,
    div,
    svg,
    span,
    label {
        outline: none !important;
    }
    a {
        color: #51ffff !important;
    }
}

```

通过如上的包裹实现手动样式隔离，子应用设置的全局样式只作用于自己，不会影响到其他的项目。
