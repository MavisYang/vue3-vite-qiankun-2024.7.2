/*
 * @Author:
 * @Date: 2024-07-02 16:31:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-02 16:46:53
 * @Description:
 */

import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
const { VITE_PUBLIC_PATH, VITE_LOGIN_URL } = import.meta.env

export const loginUrl: any = qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH + VITE_LOGIN_URL : VITE_LOGIN_URL
