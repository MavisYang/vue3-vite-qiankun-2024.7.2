/*
 * @Author: yangmiaomiao
 * @Date: 2023-12-28 20:30:16
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-03 16:22:22
 * @Description:
 */
import vue from '@vitejs/plugin-vue'
import vuejsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path'
import viteCompression from 'vite-plugin-compression'
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { wrapperEnv } from './src/utils/getEnv'
import qiankun from 'vite-plugin-qiankun'
import pkg from './package.json'
import dayjs from 'dayjs'

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
    pkg: { dependencies, devDependencies, name, version },
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
    const env = loadEnv(mode, process.cwd())
    const viteEnv = wrapperEnv(env)
    console.log('viteEnv', viteEnv)

    const { VITE_PUBLIC_PATH, VITE_PORT, VITE_OPEN } = viteEnv

    return {
        base: VITE_PUBLIC_PATH,
        server: {
            port: VITE_PORT, //端口号
            origin: 'http://localhost:' + VITE_PORT, //http://localhost:8090
            open: VITE_OPEN, //是否自动在浏览器打开
            host: true,
            hmr: true,
            watch: {
                usePolling: true, // 修复HMR热更新失效
            },
            proxy: {
                '/mock': {
                    target: 'http://127.0.0.1:4523/m1/3915073-0-default/mock',
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path) => path.replace(/^\/mock/, ''),
                },
                '/api': {
                    target: 'http://192.168.1.10:8080',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
        plugins: [
            vue(),
            vuejsx(),
            qiankun(VITE_PUBLIC_PATH, {
                //子应用名字，与主应用注册的子应用名字保持一致
                useDevMode: true,
            }),
            viteCompression({
                verbose: true,
                disable: false,
                threshold: 1048576,
                algorithm: 'gzip',
                ext: '.gz',
            }),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹(路径为存放所有svg图标的文件夹不单个svg图标)
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]',
            }),
        ],
        css: {
            preprocessorOptions: {
                // 导入scss预编译程序
                scss: {
                    additionalData: `$primaryColor: ${viteEnv.VITE_PRIMARY_COLOR};@import "@/styles/var.scss";`,
                },
            },
        },
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './'), // 设置路径
                '@': path.resolve(__dirname, './src'), // 设置别名
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
                '@components': path.resolve(__dirname, './src/components'),
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        },

        esbuild: {
            //打包时移除dconsole.log 和 debugger
            pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
        },
        build: {
            outDir: 'dist',
            minify: 'esbuild',
            // minify: "terser", esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
            sourcemap: false,
            // 禁用 gzip 压缩大小报告，可略微减少打包时间
            reportCompressedSize: false,
            // 规定触发警告的 chunk 大小
            chunkSizeWarningLimit: 2000,
            // 分包策略
            // rollupOptions: {
            //     output: {
            //         manualChunks(id) {
            //             // 静态资源最小话分拆打包
            //             if (id.includes('node_modules')) {
            //                 return id.toString().split('node_modules/')[1].split('/')[0].toString()
            //             }
            //         },
            //     },
            // },
            rollupOptions: {
                output: {
                    // Static resource classification and packaging
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                },
            },
        },
        define: {
            __APP_INFO__: JSON.stringify(__APP_INFO__),
        },
    }
})
