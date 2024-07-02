/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 11:31:27
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-19 17:22:19
 * @Description:
 */
import { Login } from '@/api/interface/index'
import authMenuList from '@/assets/json/authMenuList.json'
import authButtonList from '@/assets/json/authButtonList.json'
import authUser from '@/assets/json/authUser.json'
import http from '@/api'
import { JSEncrypt } from 'jsencrypt'

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
    // return http.post<Login.ResLogin>(`/user/authenticate`, params, { loading: false }) // 正常 post json 请求  ==>  application/json
    // return http.post<Login.ResLogin>(`/login`, params, { loading: false }); // 控制当前请求不显示 loading
    // return http.post<Login.ResLogin>(`/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
    // return http.post<Login.ResLogin>(`/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
    // return http.get<Login.ResLogin>(`/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数

    return Promise.resolve({
        data: {
            token: '123456789',
        },
    })
}
// 用户退出登录
export const logoutApi = () => {
    // return http.post(`/user/logout..`)
    return Promise.resolve({
        data: {},
    })
}

// 获取菜单列表
export const getAuthMenuListApi = () => {
    // return http.get<Menu.MenuOptions[]>(`/menu/list`, {}, { loading: false });
    // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 authMenuList.json 数据
    return Promise.resolve(authMenuList)
}

// 获取用户信息
export const getUserInfoApi = () => {
    // return  http.get(`/admin/user/userInfo`)
    return Promise.resolve(authUser)
}

// 获取菜单按钮权限
export const getAuthButtonListApi = () => {
    // return http.get<Login.ResAuthButtons>(`/admin/menu/permission`, {}, { loading: false });
    // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtonList.json 数据
    return Promise.resolve(authButtonList)
}
// JSEncrypt 加密解密
export const getEncrypt = (data: string) => {
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgUusUGOU5rqzMhlxc/yHehbb2XoqkTmaqpTjKR4Dupejv/8teA2yTf0JvQHjRxonHvDFF7WJLbtQ/XnKgkQrrzYPGWKCVuWNrTt8M1Bewcj9e5/z9QpdjbTWKvQSxT0G+RmAxq4BYF9Jcb0BFVNs8AY91oqsBdyjklbxCgeJjcQIDAQAB',
    )
    return encrypt.encrypt(data)
}

// 获取路由--按钮权限列表
export const getMenuPermissionList = () => http.post(`/admin/menu/router`)
