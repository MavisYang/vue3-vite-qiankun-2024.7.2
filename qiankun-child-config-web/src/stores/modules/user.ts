// /*
//  * @Author: yangmiaomiao
//  * @Date: 2024-06-28 10:51:28
//  * @LastEditors: yangmiaomiao
//  * @LastEditTime: 2024-07-02 14:26:47
//  * @Description:
//  */
// import { ref, watch } from 'vue'
// import { defineStore } from 'pinia'
// import store from '@/stores'

// export const useUserStore = defineStore('user', () => {
//     const token = ref<string>(localStorage.getItem('token') || '')
//     const userInfo = ref({})

//     watch(
//         () => token.value,
//         (val) => {
//             console.log(val)
//         },
//     )

//     // 登录
//     const login = async () => {
//         const { data } = (await loginApi()) as any
//         setToken(data.token)
//         token.value = data.token
//         //存储localStorage 或者cookie中
//         localStorage.setItem('token', data.token)
//     }

//     //退出登录
//     const logout = async () => {
//         token.value = ''
//         localStorage.setItem('token', '')
//     }

//     //获取用户详情
//     const getInfo = async () => {
//         // 登录逻辑
//         const { data } = await getUserInfoApi()
//         setUserInfo(data.token)
//         token.value = data.token
//         //...
//     }

//     // 设置token
//     const setToken = (value: string) => {
//         //
//     }

//     // 设置用户信息
//     const setUserInfo = (value: any) => {}

//     return {
//         token,
//         userInfo,
//         login,
//         logout,
//         getInfo,
//     }
// })

// // 在setup外使用
// export function useUserStoreHook() {
//     return useUserStore(store)
// }
