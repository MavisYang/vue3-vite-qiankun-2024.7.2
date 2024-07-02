# 数据聚合 dpscn-aggregation-web

## 介绍

## 安装使用步骤

-   **Install：**

```text
yarn
```

-   **Run：**

```text
yarn dev
```

-   **Build：**

```text
# 开发环境
yarn build:dev

# 生产环境
yarn build
```

## 开发前准备

1. 安装 vscode 插件：koroFileHeader
2. 在.vscode 文件夹下 settings.json 修改 Author 和 LastEditors
3. 在.gitignore 中添加.vscode，禁止提交

```text

"fileheader.customMade": {
    "Author": "开发人名XXX",
    "Date": "Do not edit",
    "LastEditors": "开发人名XXX",
    "LastEditTime": "Do not edit",
    "Description": ""
},
```

## 项目功能

-   使用 Vue3.4 + TypeScript 开发，单文件组件**＜ script setup ＞**
-   采用 Vite5 作为项目开发、打包工具（配置 gzip/brotli 打包、tsx 语法、跨域代理…）
-   使用 Pinia 替代 Vuex，轻量、简单、易用，集成 Pinia 持久化插件
-   使用 TypeScript 对 Axios 整个二次封装（请求拦截、取消、常用请求封装…）
-   使用 Element-UI 组件库，并基于 Element 二次封装组件
-   使用 VueRouter 配置动态路由权限拦截、路由懒加载，支持页面按钮权限控制
-   使用 KeepAlive 对页面进行缓存，支持多级嵌套路由缓存
-   常用自定义指令开发（权限、复制、水印、拖拽、节流、防抖、长按…）
-   使用 Prettier 统一格式化代码，集成 ESLint、Stylelint 代码校验规范

## 文件资源目录

```text
├─ .vscode                 # VSCode 推荐配置
├─ public                  # 静态资源文件（该文件夹不会被打包）
├─ src
│  ├─ api                  # API 接口管理
│  ├─   ├─ enums           # 项目常用枚举
│  ├─   ├─ service         # 放置各个页面模块API请求
│  ├─   ├─ interface       # 项目常用声明TS
│  ├─ assets               # 静态资源文件
│  ├─ components           # 全局组件
│  ├─ hooks                # 常用 Hooks 封装
│  ├─ layouts              # 框架布局模块
│  ├─ routers              # 路由管理
│  ├─ stores               # pinia store
│  ├─ styles               # 全局样式文件
│  ├─ typings              # 全局 ts 声明
│  ├─ utils                # 常用工具库
|  |    ├─  directives     # 全局指令文件
│  │    ├─  languages      # 语言国际化 i18n
│  │    ├─  websocket      # 封装 websocket
│  │    ├─  validate       # 封装常用正则校验
│  │    ├─  index          # 常用工具库
│  │    ├─  is             # 常用工具库
│  ├─ views                # 项目所有页面
│  ├─ App.vue              # 项目主组件
│  ├─ main.ts              # 项目入口文件
│  └─ vite-env.d.ts        # 指定 ts 识别 vue
├─ .editorconfig           # 统一不同编辑器的编码风格
├─ .env                    # vite 常用配置+环境基本配置
├─ .env.development        # 开发环境配置
├─ .env.production         # 生产环境配置
├─ .gitignore              # 忽略 git 提交
├─ .prettierignore         # 忽略 Prettier 格式化
├─ .prettierrc             # Prettier 格式化配置
├─ index.html              # 入口 html
├─ package-lock.json       # 依赖包包版本锁
├─ package.json            # 依赖包管理
├─ README.md               # README 介绍
├─ tsconfig.json           # typescript 全局配置
└─ vite.config.ts          # vite 全局配置文件
```
