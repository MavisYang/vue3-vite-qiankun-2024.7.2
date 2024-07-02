/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-28 10:01:34
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-28 10:02:32
 * @Description:
 */
declare interface ImportMetaEnv {
    readonly VITE_APP_API_URL: string
    readonly VITE_PUBLIC_PATH: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
