/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 11:31:00
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-05-27 17:07:20
 * @Description:
 */
import { defineStore } from 'pinia'
import { KeepAliveState } from '@/stores/interface'

export const useKeepAliveStore = defineStore({
    id: 'aggregation-keepAlive',
    state: (): KeepAliveState => ({
        keepAliveName: [],
    }),
    actions: {
        // Add KeepAliveName
        async addKeepAliveName(name: string) {
            !this.keepAliveName.includes(name) && this.keepAliveName.push(name)
        },
        // Remove KeepAliveName
        async removeKeepAliveName(name: string) {
            this.keepAliveName = this.keepAliveName.filter((item) => item !== name)
        },
        // Set KeepAliveName
        async setKeepAliveName(keepAliveName: string[] = []) {
            this.keepAliveName = keepAliveName
        },
    },
})
