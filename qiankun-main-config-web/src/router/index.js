/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:31:52
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 17:51:44
 * @FilePath: /qiankun-main-config-web/src/router/index.js
 * @Description:
 */
import { createRouter, createWebHashHistory } from 'vue-router'

export const routes = [
    {
        name: 'home',
        path: '/',
        icon: 'House',
        title: '首页',
        component: () => import('@/views/Home.vue'),
        meta: {
            title: '首页',
        },
    },
    {
        name: 'parameterCacheApp',
        hidden: false,
        path: '/pcache-web',
        icon: 'Tickets',
        title: '数据聚合',
        subTitle: '缓存查询支撑平台',
        component: () => import('@/views/parameterCacheApp/index.vue'),
        meta: {
            title: '数据聚合',
        },
    },
    {
        name: 'parameterCacheApp',
        hidden: true,
        path: '/pcache-web/:microAppRoute', //vue3
        icon: 'Tickets',
        title: '数据聚合',
        subTitle: '缓存查询支撑平台',
        component: () => import('@/views/parameterCacheApp/index.vue'),
        meta: {},
    },
    // {
    //     name: 'fileWebApp',
    //     path: '/file-web',
    //     icon: 'Files',
    //     title: '文件微服务',
    //     subTitle: '文件微服务支撑平台',
    //     component: () => import('@/views/fileWebApp/index.vue'),
    //     meta: {
    //         title: '文件微服务',
    //     },
    // },
    // {
    //     name: 'fileWebApp',
    //     hidden: true,
    //     path: '/file-web/*', //vue2
    //     icon: 'icon-migrate-yun',
    //     title: '文件微服务',
    //     subTitle: '文件微服务支撑平台',
    //     component: () => import('@/views/fileWebApp/index.vue'),
    // },
    {
        name: 'childWebApp',
        path: '/child-web',
        icon: 'SetUp',
        title: 'child子应用',
        subTitle: '子组件demo',
        component: () => import('@/views/childWebApp/index.vue'),
        meta: {
            title: 'child子应用',
        },
    },
    // {
    //     name: 'childWebApp',
    //     hidden: true, //保证子应用中路由正常跳转
    //     path: '/child-web/:microAppRoute',
    //     icon: 'SetUp',
    //     title: '子应用',
    //     subTitle: '子应用demo',
    //     component: () => import('@/views/childWebApp/index.vue'),
    // },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    strict: false,
    scrollBehavior: () => ({ left: 0, top: 0 }),
})
router.beforeEach(async (to, from, next) => {
    const title = to.meta.title
    if (title) {
        document.title = title
    }
    next()
})

export default router
