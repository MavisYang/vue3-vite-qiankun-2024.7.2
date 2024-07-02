# 微前端-主应用

## 安装依赖

```
yarn
```

## 项目启动

```
yarn  dev
```

## 项目打包

```
yarn  build
```

# 项目结构

```
├── index.html
├── src
│   ├── App.vue
│   ├── main.js
│   ├── assets
│   │   ├── img
│   │   └── iconfont

│   ├── components
│   │   ├── 404.vue
│   ├── qiankun
│   │   ├── app.js
│   │   └── index.js
│   ├── router
│   │   └── index.js
│   ├── stores
│   │   └── index.js
│   ├── styles
│   ├   ├── element.scss
│   │   └── index.scss
│   ├── utils
│   │   └── index.js
│   ├── sidebar
│   │   └── index.vue
│   └── views
│       ├── fileWebApp
│       ├── parameterCacheApp
│       └── Home.vue
├── .env.development
├── .env.production
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
└── yarn.lock
```

# 项目说明

## Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

-   [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur

## [QianKun 解决 element ui 和 element-plus 样式冲突](https://www.cnblogs.com/Gherardo/p/18270650)

微前端所有的项目样式从 .el- 自定义样式为 .ep-

```

```
