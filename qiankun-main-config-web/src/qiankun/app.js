/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:31:38
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-03 15:45:01
 * @FilePath: /qiankun-main-config-web/src/qiankun/app.js
 * @Description:
 */
const baseUrl = `//${location.hostname}` //会自动添加上http:
const publicPath = import.meta.env.VITE_BASE_URL

// console.log(`${baseUrl}${import.meta.env.VITE_APP_PCACHE}`)
// console.log(`${baseUrl}${import.meta.env.VITE_APP_CHILD}`)
const apps = [
    {
        //路由子应用
        //必须与子应用注册名字相同
        name: 'pcache-web',
        //入口路径，开发时为子应用所启本地服务，上线时为子应用线上路径
        entry: `${baseUrl}${import.meta.env.VITE_APP_PCACHE}`,
        // entry: 'http://localhost:8090/pcache-web',
        //子应用挂载的节点
        container: '#pcache-web',
        //当访问路由为/micro-vue 时加载子应用
        activeRule: `${publicPath}#/pcache-web`,
    },
    {
        //demo
        name: 'child-web',
        entry: `${baseUrl}${import.meta.env.VITE_APP_CHILD}`, //   //localhost:8080/child-web
        container: '#child-web',
        activeRule: `${publicPath}#/child-web`, //   /config-web/#/child-web
    },
]

export default apps
