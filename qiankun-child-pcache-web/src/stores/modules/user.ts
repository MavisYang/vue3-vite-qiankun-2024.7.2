/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 11:31:00
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-19 14:39:48
 * @Description:
 */
import { defineStore } from 'pinia'
import { UserState } from '@/stores/interface'
import piniaPersistConfig from '@/stores/helper/persist'

export const useUserStore = defineStore({
    id: 'aggregation-user',
    state: (): UserState => ({
        token: '',
        userInfo: {
            // userId: "1595625687086100482",
            // userName: 'root',
            // password: "$2a$10$Mhcy3zXi0vr5Hp1KxLEYFOIUMHzCQKYZXNAVFYqcM9aYlR0kvcHBO",
            // nickname: "yaozhenpeng",
            // status: "1",
            // avatar: null,
            // phone: "18065220862",
            // email: null,
            // deptId: null,
            // tenantId: null,
            // tenantName: null,
            // gender: "1",
            // type: "0",
            // roleNames: null,
        },
    }),
    getters: {},
    actions: {
        // Set Token
        setToken(token: string) {
            this.token = token
        },
        // Set setUserInfo
        setUserInfo(userInfo: UserState['userInfo']) {
            this.userInfo = userInfo
        },
    },
    persist: piniaPersistConfig('aggregation-user'),
})
