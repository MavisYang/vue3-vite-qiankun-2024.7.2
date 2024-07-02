/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 11:31:00
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-20 14:17:52
 * @Description:
 */
import { defineStore } from 'pinia'
import { GlobalState } from '@/stores/interface'
import piniaPersistConfig from '@/stores/helper/persist'

const DEFAULT_PRIMARY = import.meta.env.VITE_PRIMARY_COLOR as string

export const useGlobalStore = defineStore({
    id: 'aggregation-global',
    // 修改默认值之后，需清除 localStorage 数据
    state: (): GlobalState => ({
        // 当前系统语言
        language: null,
        // 当前页面是否全屏
        maximize: false,
        // 主题颜色
        primary: DEFAULT_PRIMARY,
        // 头部反转
        headerInverted: false,
        // 折叠菜单
        isCollapse: false,
        // 菜单手风琴
        accordion: false,
        // 面包屑导航
        breadcrumb: true,
        // 面包屑导航图标
        breadcrumbIcon: false,
        // 标签页
        tabs: false,
        // 标签页图标
        tabsIcon: true,
        // 页脚
        footer: true,
    }),
    getters: {},
    actions: {
        // Set GlobalState
        setGlobalState(...args: ObjToKeyValArray<GlobalState>) {
            this.$patch({ [args[0]]: args[1] })
        },
    },
    persist: piniaPersistConfig('aggregation-global'),
})
