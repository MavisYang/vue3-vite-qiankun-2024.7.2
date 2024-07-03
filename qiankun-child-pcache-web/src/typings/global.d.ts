/*
 * @Author:
 * @Date: 2024-07-02 14:43:12
 * @LastEditors:
 * @LastEditTime: 2024-07-03 14:35:33
 * @Description:
 */
/* Menu */
declare namespace Menu {
    interface MenuOptions {
        path: string
        name: string
        [key: string]: any
        component?: string | (() => Promise<unknown>)
        redirect?: string
        meta: MetaProps
        children?: MenuOptions[]
    }
    interface MetaProps {
        icon: string
        title: string
        activeMenu?: string
        isLink?: string
        isHide: boolean
        isFull: boolean
        isAffix: boolean
        isKeepAlive: boolean
        isTab: boolean
    }
}

/* FileType */
declare namespace File {
    type ImageMimeType =
        | 'image/apng'
        | 'image/bmp'
        | 'image/gif'
        | 'image/jpeg'
        | 'image/pjpeg'
        | 'image/png'
        | 'image/svg+xml'
        | 'image/tiff'
        | 'image/webp'
        | 'image/x-icon'

    type ExcelMimeType =
        | 'application/vnd.ms-excel'
        | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

/* Vite */
declare type Recordable<T = any> = Record<string, T>

declare interface ViteEnv {
    VITE_APP_MODE: 'development' | 'production' | 'test'
    VITE_PUBLIC_PATH: string
    VITE_ROUTER_MODE: 'hash' | 'history'
    VITE_DROP_CONSOLE: boolean
    VITE_API_URL: string
    VITE_GLOB_APP_TITLE: string
    VITE_PORT: number
    VITE_OPEN: boolean
    VITE_HOME_URL: string
    VITE_PRIMARY_COLOR: string
}

interface ImportMetaEnv extends ViteEnv {
    __: unknown
}

/* __APP_INFO__ */
declare const __APP_INFO__: {
    pkg: {
        name: string
        version: string
        dependencies: Recordable<string>
        devDependencies: Recordable<string>
    }
    lastBuildTime: string
}
