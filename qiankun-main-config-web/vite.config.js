/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:23:52
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 14:12:22
 * @Description:
 */
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
// https://vitejs.dev/config/
export default (config) => {
    const viteEnv = loadEnv(config.mode, process.cwd())
    console.log(viteEnv)
    const { VITE_BASE_URL } = viteEnv
    return {
        plugins: [vue()],
        base: VITE_BASE_URL,
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './'), // 设置路径
                '@': path.resolve(__dirname, './src'), // 设置别名
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "./src/styles/element.scss" as *;`,
                },
            },
        },
        server: {
            port: 5173,
            host: true,
            hmr: true,
            watch: {
                usePolling: true, // 修复HMR热更新失效
            },
            open: true, //是否自动在浏览器打开
            proxy: {
                '/child-web': {
                    target: 'http://localhost:8080',
                    pathRewrite: {
                        '^/child-web': '/child-web',
                    },
                    changeOrigin: true,
                },
                '/pcache-web': {
                    target: 'http://localhost:5173',
                    pathRewrite: {
                        '^/pcache-web': '/pcache-web',
                    },
                    changeOrigin: true,
                },
                '/pcache-ctrl': {
                    target: 'http://localhost:5173/',
                    pathRewrite: {
                        '^/pcache-ctrl': '/pcache-ctrl',
                    },
                    changeOrigin: true,
                },
                '/file-web': {
                    target: 'http://localhost:5174/',
                    pathRewrite: {
                        '^/file-web': '/file-web',
                    },
                    changeOrigin: true,
                },
                '/dev-api': {
                    target: 'http://localhost:8080',
                    pathRewrite: {
                        '^/dev-api': '/dev-api',
                    },
                    changeOrigin: true,
                },
            },
        },
    }
}
