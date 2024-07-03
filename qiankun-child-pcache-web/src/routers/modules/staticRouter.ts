/*
 * @Author: yangmiaomiao
 * @Date: 2024-02-04 14:44:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-03 14:38:42
 * @Description:
 */
import { RouteRecordRaw } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { HOME_URL } from '@/routers/helper'

const { VITE_PUBLIC_PATH } = import.meta.env

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
            role: 'guest',
            type: '',
            targetType: '',
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

/**
 * errorRouter (错误页面路由) 接入qiankun是，需要添加上VITE_PUBLIC_PATH
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
].map((item) => ({ ...item, path: qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH + item.path : item.path }))
