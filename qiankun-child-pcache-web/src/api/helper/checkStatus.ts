/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 11:31:27
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-05-27 11:45:46
 * @Description:
 */
import { ElMessage } from 'element-plus'
import I18n from '@/utils/languages/index'
const { t } = I18n.global

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number, message: string) => {
    switch (status) {
        case 400:
            // "请求失败！请您稍后重试";
            ElMessage.error(`${t('axios.error_Code')}【${status}】${message ? message : t(`axios.error_${status}`)}`)
            break
        case 401:
            // ElMessage.error("登录失效！请您重新登录");
            ElMessage.error(message ? message : '用户名或密码错误，请重试')
            break
        case 403:
            ElMessage.error('当前账号无权限访问！')
            break
        case 404:
            // 你所访问的资源不存在！
            ElMessage.error(`${t('axios.error_Code')}【${status}】${message ? message : t(`axios.error_${status}`)}`)
            break
        case 405:
            // 请求方式错误！请您稍后重试
            ElMessage.error(`${t('axios.error_Code')}【${status}】${message ? message : t(`axios.error_${status}`)}`)
            break
        case 408:
            // 请求超时！请您稍后重试
            ElMessage.error(`${t('axios.error_Code')}【${status}】${message ? message : t(`axios.error_${status}`)}`)
            break
        case 500:
            // 服务异常！
            ElMessage.error(`${t('axios.error_Code')}【${status}】${message ? message : t(`axios.error_${status}`)}`)
            break
        case 502:
            ElMessage.error('网关错误！')
            break
        case 503:
            ElMessage.error('服务不可用！')
            break
        case 504:
            ElMessage.error('网关超时！')
            break
        default:
            // ElMessage.error("请求失败！");
            ElMessage.error(`${t('axios.error_Code')}【${status}】${message ? message : t(`axios.error_${status}`)}`)
    }
}
