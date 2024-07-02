import { ElMessageBox, ElMessage } from 'element-plus'
import { HandleData } from './interface'

/**
 * @description 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法 (不必传)
 * @param {Object} params 携带的操作数据参数 {id,params} (不必传)
 * @param {String} message 提示信息 (必传)
 * @param {String} confirmType icon类型 (不必传,默认为 warning)
 * @param {String} confirmBtnText 确定按钮文字 (不必传,默认为 确定)
 * @param {String} cancelBtnText 取消按钮文字 (不必传,默认为 取消)
 * @param {String} callback 取消按钮文字 (不必传,默认为 取消)
 * @returns {Promise}
 */
export const useHandleData = (
    message: string,
    confirmType: HandleData.MessageType = 'warning',
    confirmBtnText: string = '确定',
    cancelBtnText: string = '取消',
    api?: (params?: any) => Promise<any>,
    params: any = {},
    callback?: () => void,
) => {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(`是否${message}?`, '温馨提示', {
            confirmButtonText: confirmBtnText,
            cancelButtonText: cancelBtnText,
            type: confirmType,
            draggable: true,
        })
            .then(async () => {
                console.log('点击确定了')
                if (api) {
                    const res = await api(params)
                    if (!res) return reject(false)
                    ElMessage({
                        type: 'success',
                        message: `${message}成功!`,
                    })
                }
                if (typeof callback == 'function') {
                    callback()
                }
                resolve(true)
            })
            .catch(() => {
                console.log('点击取消了')
                reject(false)
            })
    })
}
