/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-29 17:06:16
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-20 15:47:55
 * @Description:
 */
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/modules/global'
import { getLightColor, getDarkColor } from '@/utils/color'

/**
 * @description 全局主题 hooks
 * */
export const useTheme = () => {
    const globalStore = useGlobalStore()
    const { primary } = storeToRefs(globalStore)
    // init theme
    const initTheme = () => {
        changePrimary(primary.value)
    }

    // 设置主题颜色
    const changePrimary = (val: string) => {
        // 计算主题颜色变化
        document.documentElement.style.setProperty('--el-color-primary', val)
        document.documentElement.style.setProperty('--el-color-primary-dark-2', `${getDarkColor(val, 0.3)}`)
        for (let i = 1; i <= 9; i++) {
            const primaryColor = `${getLightColor(val, i / 10)}`
            document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor)
        }
        globalStore.setGlobalState('primary', val)
    }

    return {
        initTheme,
    }
}
