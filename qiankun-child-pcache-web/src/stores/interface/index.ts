/*
 * @Author: yangmiaomiao
 * @Date: 2024-02-19 09:27:21
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-20 09:34:21
 * @Description:
 */
export type AssemblySizeType = 'large' | 'default' | 'small'

export type LanguageType = 'zh' | 'en' | null

/* GlobalState */
export interface GlobalState {
    language: LanguageType
    maximize: boolean
    primary: string
    headerInverted: boolean
    isCollapse: boolean
    accordion: boolean
    breadcrumb: boolean
    breadcrumbIcon: boolean
    tabs: boolean
    tabsIcon: boolean
    footer: boolean
}

/* UserState */
export interface UserState {
    token: string
    userInfo: {
        [key: string]: any
    }
}

/* tabsMenuProps */
export interface TabsMenuProps {
    icon: string
    title: string
    path: string
    name: string
    close: boolean
    isKeepAlive: boolean
    isTab: boolean
}

/* TabsState */
export interface TabsState {
    tabsMenuList: TabsMenuProps[]
}

/* AuthState */
export interface AuthState {
    routeName: string
    authButtonList: {
        [key: string]: any
    }
    authMenuList: Menu.MenuOptions[]
}

/* KeepAliveState */
export interface KeepAliveState {
    keepAliveName: string[]
}

export interface PermissionState {
    [key: string]: any
}
