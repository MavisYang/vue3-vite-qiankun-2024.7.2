/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 16:28:23
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-05-28 19:55:54
 * @Description:
 */
// dev环境
export function isDevFn(mode: string): boolean {
    return mode === 'development'
}
// prod环境
export function isProdFn(mode: string): boolean {
    return mode === 'production'
}
// 获取process.env数据
export function wrapperEnv(envConf: Recordable): ViteEnv {
    const ret: any = {}

    for (const envName of Object.keys(envConf)) {
        let realName = envConf[envName].replace(/\\n/g, '\n')
        realName = realName === 'true' ? true : realName === 'false' ? false : realName
        if (envName === 'VITE_PORT') realName = Number(realName)
        if (envName === 'VITE_PROXY') {
            try {
                realName = JSON.parse(realName)
            } catch (error) {}
        }
        ret[envName] = realName
    }
    return ret
}
