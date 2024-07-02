/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:31:38
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 17:51:39
 * @FilePath: /qiankun-main-config-web/src/qiankun/app.js
 * @Description:
 */
const baseUrl = `//${location.hostname}`
const publicPath = import.meta.env.VITE_BASE_URL

console.log(
    `${publicPath}#/pcache-web`,
    '---',
    `${baseUrl}${import.meta.env.VITE_APP_CHILD}`,
    `${baseUrl}${import.meta.env.VITE_APP_PCACHE}`,
)
const apps = [
    {
        //数据聚合
        //必须与子应用注册名字相同
        name: 'pcache-web',
        //入口路径，开发时为子应用所启本地服务，上线时为子应用线上路径
        entry: `${baseUrl}${import.meta.env.VITE_APP_PCACHE}`,
        //子应用挂载的节点
        container: '#pcache-web',
        //当访问路由为/micro-vue 时加载子应用
        activeRule: `${publicPath}#/pcache-web`,
    },
    // {
    //     //文件微服务
    //     name: 'file-web',
    //     entry: `${baseUrl}${import.meta.env.VITE_APP_FILE}`,
    //     container: '#file-web',
    //     activeRule: `${publicPath}#/file-web`,
    // },
    {
        //demo
        name: 'child-web',
        entry: `${baseUrl}${import.meta.env.VITE_APP_CHILD}`, //   //localhost:8080/child-web
        container: '#child-web',
        // activeRule: `${publicPath}#/child-web`, //   /config-web/#/child-web
        activeRule: (location) => {
            return location.pathname.includes('/child-web') // 路由中包含/vite-vue3-app时，激活该微应用
        },
    },
]

export default apps
