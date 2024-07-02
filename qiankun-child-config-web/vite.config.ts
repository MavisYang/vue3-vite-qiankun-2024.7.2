/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 16:58:07
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 15:07:46
 * @Description:
 */
import { type ConfigEnv, type UserConfigExport, defineConfig, loadEnv } from 'vite'
import * as path from 'path'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
// https://vitejs.dev/config/
export default (configEnv: ConfigEnv): UserConfigExport => {
    const viteEnv = loadEnv(configEnv.mode, process.cwd())
    const { VITE_PUBLIC_PATH, VITE_QK_NAME } = viteEnv
    console.log(viteEnv)
    return {
        base: VITE_PUBLIC_PATH,
        plugins: [
            vue(),
            qiankun(VITE_QK_NAME, {
                //子应用名字，与主应用注册的子应用名字保持一致
                useDevMode: true,
            }),
        ],
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './'), // 设置路径
                '@': path.resolve(__dirname, 'src'), // 设置别名
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        },
        server: {
            host: true, //host:0.0.0.0
            open: true, //是否自动打开浏览器页面
            port: 8080, //端口号
            // origin: 'http://localhost:8080', //解决静态资源加载 404 问题
            cors: true, //跨域设置 允许
            strictPort: false, //端口被占用直接退出
            // 代理配置
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
                '/eunomia-ctr': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/eunomia-ctr/, 'eunomia-ctr'),
                },
            },
        },
    }
}
