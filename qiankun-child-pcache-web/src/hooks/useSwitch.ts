/*
 * @Author: yangmiaomiao
 * @Date: 2024-02-07 17:10:51
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-05-27 14:20:17
 * @Description:
 */
import { ElMessageBox } from 'element-plus'
import { reactive } from 'vue'

/**
 * @description 修改状态--switch
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Function} getListApi 获取表格数据 api 方法 (非必传)
 * @param {Function} switchCallBack 修改成功之后数据处理 (非必传)
 * @param {Function} requestError 修改失败之后数据处理 (非必传)
 *
 * */

interface useSwitchRow {
    [key: string]: any
}
export const useSwitch = () => {
    const switchRow = reactive({
        row: {} as any,
        prop: '',
        loading: false,
        isAgain: false,
    })

    // 需要二次确认
    const handleClickSwitch = (
        isAgain: boolean = false,
        row: useSwitchRow,
        prop: string,
        againContent: string,
        callback: Function,
    ) => {
        switchRow.row = row
        switchRow.prop = prop || ''
        switchRow.isAgain = isAgain
        return isAgain ? againConfirm(row, againContent, prop, callback) : handleSwitchChange(row, prop, callback)
    }

    const againConfirm = (row: useSwitchRow, againContent: string, prop: string, callback: Function) => {
        ElMessageBox.confirm(againContent, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                return handleSwitchChange(row, prop, callback)
            })
            .catch(() => {
                initSwitchRow()
                return false
            })
        return false
    }

    //不需要二次确认直接修改状态
    const handleSwitchChange = (row: useSwitchRow, prop: string, callback: Function) => {
        if (switchRow.loading) return
        switchRow.row = { ...row }
        switchRow.prop = prop
        switchRow.loading = true

        return new Promise((resolve, reject) => {
            try {
                console.log(typeof callback, 'callback()')
                // const res = callback && callback()
                if (typeof callback == 'function') {
                    callback()
                }

                // console.log(res, res.code, '------------')
                // if (res.code === 200) {
                //   ElMessage.success('状态修改成功');
                //   initSwitchRow()
                //   resolve(true);
                // } else {
                //   console.log('error')
                //   ElMessage.error(res.message);
                //   initSwitchRow()
                //   reject(false);
                // }

                resolve(true)
            } catch (err) {
                reject(false)
            }
        })
    }

    const initSwitchRow = () => {
        switchRow.loading = false
        switchRow.isAgain = false
        switchRow.row = {}
        switchRow.prop = ''
    }
    return {
        switchRow,
        initSwitchRow,
        handleClickSwitch,
        handleSwitchChange,
    }
}
