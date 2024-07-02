/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:35:05
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-15 14:35:13
 * @FilePath: /qiankun-main-config-web/src/stores/modules/login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { defineStore } from 'pinia'

const useLogin = defineStore('login', {
  state: () => ({
    login: false,// 应用的状态
  }),// 返回一个对象，这个对象包含着应用需要的所有状态
  getters: {},// 返回一个对象，这个对象包含着应用需要的所有getters
  actions: {},// 返回一个对象，这个对象包含着应用需要的所有actions
})

export default useLogin