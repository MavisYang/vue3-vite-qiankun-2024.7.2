/*
 * @Author: yangmiaomiao
 * @Date: 2024-07-02 14:04:09
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 14:26:27
 * @Description:
 */

import { defineStore } from 'pinia'
import piniaPersistConfig from '@/stores/helper/persist'

const useGlobalStore = defineStore('global', {
    state: () => ({
        // 折叠菜单
        isCollapse: false,
    }),
    getters: {},
    actions: {
        // Set GlobalState
        setGlobalState(...args) {
            this.$patch({ [args[0]]: args[1] })
        },
    },
    persist: piniaPersistConfig('global'),
})

export default useGlobalStore
