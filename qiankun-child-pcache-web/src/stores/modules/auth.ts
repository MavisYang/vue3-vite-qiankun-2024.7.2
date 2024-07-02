/*
 * @Author: yangmiaomiao
 * @Date: 2024-02-04 14:50:50
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-20 10:36:05
 * @Description:
 */
import { defineStore } from 'pinia'
import { AuthState } from '@/stores/interface'
import { getAuthButtonListApi, getAuthMenuListApi } from '@/api/service/login'
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from '@/utils'

export const useAuthStore = defineStore({
    id: 'aggregation-auth',
    state: (): AuthState => ({
        // 按钮权限列表
        authButtonList: {},
        // 菜单权限列表
        authMenuList: [],
        // 当前页面的 router name，用来做按钮权限筛选
        routeName: '',
    }),
    getters: {
        // 按钮权限列表
        authButtonListGet: (state) => state.authButtonList,
        // 菜单权限列表 ==> 这里的菜单没有经过任何处理
        authMenuListGet: (state) => state.authMenuList,
        // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
        showMenuListGet: (state) => getShowMenuList(state.authMenuList),
        // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
        flatMenuListGet: (state) => getFlatMenuList(state.authMenuList),
        // 递归处理后的所有面包屑导航列表
        breadcrumbListGet: (state) => getAllBreadcrumbList(state.authMenuList),
    },
    actions: {
        // Get AuthButtonList
        async getAuthButtonList() {
            const { data } = await getAuthButtonListApi()
            this.authButtonList = data || {}
            const whitelist = '*:*:*'
            sessionStorage.setItem('permission', JSON.stringify([whitelist, ...data.namespaceList]))
        },
        // Get AuthMenuList
        async getAuthMenuList() {
            const { data } = await getAuthMenuListApi()
            console.log('get menu list12', data.list)
            this.authMenuList = this.formatAuthMenuList(data.list)
        },
        // Set RouteName
        setRouteName(name: string) {
            this.routeName = name
        },
        //格式化重新封装菜单列表
        formatAuthMenuList(array: any) {
            return array.map((item: any) => ({
                ...item,
                component: item.path,
                name: item.uri.slice(1),
                path: item.uri,
                meta: {
                    icon: item.icon,
                    title: item.name,
                    isLink: item.isLink ?? '',
                    isHide: item.isHide ?? false,
                    isFull: item.isFull ?? false,
                    isAffix: item.isAffix ?? false,
                    isKeepAlive: item.isKeepAlive ?? true,
                    isTab: item.isTab ?? true,
                },
                children: item.children ? this.formatAuthMenuList(item.children) : null,
            }))
        },
    },
})
