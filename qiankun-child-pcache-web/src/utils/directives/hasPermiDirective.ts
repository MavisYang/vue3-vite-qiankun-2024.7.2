/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 15:22:27
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-05-27 15:57:12
 * @Description:
 */
// 权限判断自定义指令

import { DirectiveBinding } from 'vue'
const appMode = import.meta.env.VITE_APP_MODE

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const { value: permissionFlag } = binding
        const permission = sessionStorage.getItem('permission')
        const permissions = permission != null ? JSON.parse(permission) || ['*:*:*'] : ['*:*:*']
        const hasPermissions = permissions.some((permission) => {
            if (appMode === 'development') {
                // 在开发环境中始终返回 true，即不移除按钮
                return permissionFlag.includes(permission) //根据权限移除按钮
            } else if (appMode === 'production') {
                return permissionFlag.includes(permission) // 根据权限移除按钮
            }
        })
        if (!hasPermissions) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    },
}
