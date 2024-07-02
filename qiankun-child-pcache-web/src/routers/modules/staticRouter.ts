/*
 * @Author: yangmiaomiao
 * @Date: 2024-02-04 14:44:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-02 16:40:37
 * @Description:
 */
import { RouteRecordRaw } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { loginUrl } from '@/routers/helper'

const { VITE_PUBLIC_PATH, VITE_HOME_URL } = import.meta.env

/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: VITE_HOME_URL,
    },
    {
        path: loginUrl,
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
            role: 'guest',
            type: '',
            targetType: '',
        },
    },
    {
        // path: '/layout',
        path: qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH : '/layout',
        name: 'layout',
        component: () => import('@/layouts/index.vue'),
        redirect: VITE_HOME_URL,
        children: [],
    },
]

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
    {
        path: '/403',
        name: '403',
        component: () => import('@/components/ErrorMessage/403.vue'),
        meta: {
            title: '403页面',
        },
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/components/ErrorMessage/404.vue'),
        meta: {
            title: '404页面',
        },
    },
    {
        path: '/500',
        name: '500',
        component: () => import('@/components/ErrorMessage/500.vue'),
        meta: {
            title: '500页面',
        },
    },
    // Resolve refresh page, route warnings
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/components/ErrorMessage/404.vue'),
    },
]
