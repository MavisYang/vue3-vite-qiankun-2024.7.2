/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 11:31:00
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-19 14:06:37
 * @Description:
 */
import { PersistedStateOptions } from 'pinia-plugin-persistedstate'

/**
 * @description pinia 持久化参数配置
 * @param {String} key 存储到持久化的 name
 * @param {Array} paths 需要持久化的 state name
 * @return persist
 * */
const piniaPersistConfig = (key: string, paths?: string[]) => {
    const persist: PersistedStateOptions = {
        key,
        storage: localStorage, //default localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
        // storage: sessionStorage, //数据在当前浏览器窗口关闭后自动删除。
        paths,
    }
    return persist
}

export default piniaPersistConfig
