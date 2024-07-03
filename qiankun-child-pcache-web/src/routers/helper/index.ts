/*
 * @Author:
 * @Date: 2024-07-02 16:31:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-03 14:36:52
 * @Description:
 */

import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
const { VITE_PUBLIC_PATH, VITE_LOGIN_URL, VITE_HOME_URL } = import.meta.env

export const history = qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH : '/'

export const LOGIN_URL: any = qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH + VITE_LOGIN_URL : VITE_LOGIN_URL

export const HOME_URL = qiankunWindow.__POWERED_BY_QIANKUN__ ? VITE_PUBLIC_PATH + VITE_HOME_URL : VITE_HOME_URL
