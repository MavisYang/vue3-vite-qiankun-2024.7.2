import { isArray } from '@/utils/is'

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @returns {String}
 */
export function getStorage(key: string) {
    const value = window.localStorage.getItem(key)
    try {
        return JSON.parse(window.localStorage.getItem(key) as string)
    } catch (error) {
        return value
    }
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {*} value Storage值
 * @returns {void}
 */
export function setStorage(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @returns {void}
 */
export function removeStorage(key: string) {
    window.localStorage.removeItem(key)
}

/**
 * @description 清除所有localStorage
 * @returns {void}
 */
export function clearStorage() {
    window.localStorage.clear()
}
/**
 * @description 判断数据类型
 * @param {*} val 需要判断类型的数据
 * @returns {String}
 */
export function isType(val: any): string {
    if (val === null) return 'null'
    if (typeof val !== 'object') return typeof val
    else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase()
}

/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID(): string {
    let uuid = ''
    for (let i = 0; i < 32; i++) {
        let random = (Math.random() * 16) | 0
        if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
        uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
    }
    return uuid
}

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number}
 */
export function randomNum(min: number, max: number): number {
    let num = Math.floor(Math.random() * (min - max) + max)
    return num
}
/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang(): string {
    let browserLang = navigator.language ? navigator.language : navigator?.browserLanguage
    let defaultBrowserLang = ''
    if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
        defaultBrowserLang = 'zh'
    } else {
        defaultBrowserLang = 'en'
    }
    return defaultBrowserLang
}

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
    let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
    return newMenuList.flatMap((item) => [item, ...(item.children ? getFlatMenuList(item.children) : [])])
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]): Array<any> {
    let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
    return newMenuList.filter((item) => {
        item.children?.length && (item.children = getShowMenuList(item.children))
        return !item.meta?.isHide
    })
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (
    menuList: Menu.MenuOptions[],
    parent: Array<any> = [],
    result: { [key: string]: any } = {},
): object => {
    for (const item of menuList) {
        result[item.path] = [...parent, item]
        if (item.children) getAllBreadcrumbList(item.children, result[item.path], result)
    }
    return result
}

/**
 * @description 使用递归处理路由菜单 path，生成一维数组 (第一版本地路由鉴权会用到，该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} menuPathArr 菜单地址的一维数组 ['**','**']
 * @returns {Array}
 */
export function getMenuListPath(menuList: Menu.MenuOptions[], menuPathArr: string[] = []): string[] {
    for (const item of menuList) {
        if (typeof item === 'object' && item.path) menuPathArr.push(item.path)
        if (item.children?.length) getMenuListPath(item.children, menuPathArr)
    }
    return menuPathArr
}

/**
 * @description 递归查询当前 path 所对应的菜单对象 (该函数暂未使用)
 * @param {Array} menuList 菜单列表
 * @param {String} path 当前访问地址
 * @returns {Object | null}
 */
export function findMenuByPath(menuList: Menu.MenuOptions[], path: string): Menu.MenuOptions | null {
    for (const item of menuList) {
        if (item.path === path) return item
        if (item.children) {
            const res = findMenuByPath(item.children, path)
            if (res) return res
        }
    }
    return null
}

/**
 * @description 使用递归过滤需要缓存的菜单 name (该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} keepAliveNameArr 缓存的菜单 name ['**','**']
 * @returns {Array}
 * */
export function getKeepAliveRouterName(menuList: Menu.MenuOptions[], keepAliveNameArr: string[] = []): Array<any> {
    menuList.forEach((item) => {
        item.meta.isKeepAlive && item.name && keepAliveNameArr.push(item.name)
        item.children?.length && getKeepAliveRouterName(item.children, keepAliveNameArr)
    })
    return keepAliveNameArr
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: 'tag') {
    const value = fieldNames?.value ?? 'value'
    const label = fieldNames?.label ?? 'label'
    const children = fieldNames?.children ?? 'children'
    let filterData: { [key: string]: any } = {}
    // 判断 enumData 是否为数组
    if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children)
    // 判断是否输出的结果为 tag 类型
    if (type == 'tag') {
        return filterData?.tagType ? filterData.tagType : ''
    } else {
        return filterData ? filterData[label] : '--'
    }
}

/**
 * @description 处理 ProTable 值为数组 || 无数据
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export function formatValue(callValue: any): string {
    // 如果当前值为数组，使用 / 拼接（根据需求自定义）
    if (isArray(callValue)) return callValue.length ? callValue.join(' / ') : '-'
    return callValue ?? '--'
}

/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {String}
 */

const mode = import.meta.env.VITE_ROUTER_MODE

export function getUrlWithParams() {
    const url = {
        hash: location.hash.substring(1),
        history: location.pathname + location.search,
    }
    return url[mode]
}
/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export function handleProp(prop: string) {
    const propArr = prop.split('.')
    if (propArr.length == 1) return prop
    return propArr[propArr.length - 1]
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
    if (!prop.includes('.')) return row[prop] ?? '--'
    prop.split('.').forEach((item) => (row = row[item] ?? '--'))
    return row
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
    return enumData.reduce((accumulator: any, current: any) => {
        if (accumulator) return accumulator
        if (current[value] === callValue) return current
        if (current[children]) return findItemNested(current[children], callValue, value, children)
    }, null)
}

/**
 * 日期格式化
 * @param timeStr
 * @param pattern
 * @returns
 */
export function parseTime(timeStr: string | number | object, pattern?: string) {
    let time = timeStr
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date: any
    if (typeof time === 'object') {
        date = time
    } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time
                .replace(new RegExp(/-/gm), '/')
                .replace('T', ' ')
                .replace(new RegExp(/\.[\d]{3}/gm), '')
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * 判断两个对象是否相同
 * @param {Object} newValue 要比较的对象一
 * @param {Object} oldValue 要比较的对象二
 * @returns {Boolean} 相同返回 true，反之 false
 */
export const isEqual = (newValue: { [key: string]: any }, oldValue: { [key: string]: any }): boolean => {
    // 比较新旧值是否相等
    for (let key in newValue) {
        if (typeof newValue[key] === 'object') {
            if (JSON.stringify(newValue[key]) !== JSON.stringify(oldValue[key])) {
                return true //有修改
            }
        } else {
            //判断当前key是否修改
            if (newValue[key] !== oldValue[key]) {
                console.log('有修改', key, newValue[key], oldValue[key])
                return true //有修改
            }
        }
    }
    return false
}

/**
 * 数据合并
 * @param source
 * @param target
 * @returns
 */
export function mergeRecursive(source, target) {
    for (var p in target) {
        try {
            if (target[p].constructor == Object) {
                source[p] = mergeRecursive(source[p], target[p])
            } else {
                source[p] = target[p]
            }
        } catch (e) {
            source[p] = target[p]
        }
    }
    return source
}

/**
 * 数组平铺
 * @param arr
 * @returns
 */
export function flattenArray(arr: any) {
    while (arr.some((i: any) => Array.isArray(i))) {
        arr = [].concat(...arr)
    }
    return arr
}

/**
 * 返回重复的数组内容
 * @param arr
 * @returns
 */
export function duplicates(arr) {
    return arr.filter((e, i) => arr.indexOf(e) !== arr.lastIndexOf(e) && arr.indexOf(e) === i)
}

/**
 * 回显数据字典 根据code值查找name值
 * @param data
 * @param val
 * @param code
 * @param name
 * @returns
 */
export function getNameByCode(data: any = [], val: number | string = '', code = 'dictCode', name = 'dictName') {
    const item = data.find((v) => Number(v[code]) === Number(val)) || {}
    return item ? item[name] : ''
}

export function getEnumItem(data: any = [], val: '', code = 'dictCode') {
    return data.find((v) => v[code] == val) || {}
}
/**
 * 截取时间
 */
export const sliceTime = (time: string) => {
    return time && time.slice(0, 16).replaceAll('T', ' ')
}
/**
 *
 * @param num 数字
 * @returns 百分数
 */
export const toThousands = (num) => {
    num = num + ''
    if (!num.includes('.')) {
        num += '.'
    }
    return num
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ','
        })
        .replace(/\.$/, '')
}
//导出
export const exportFile = (blob: any, title: string, type = 'xlsx') => {
    const a = document.createElement('a')
    const binaryData: any = []
    binaryData.push(blob)
    // 创建临时url对象
    const url = window.URL.createObjectURL(new Blob(binaryData))
    a.href = url
    // 文件名
    a.download = title + '.' + type
    a.click()
    // 释放之前创建的URL对象
    window.URL.revokeObjectURL(url)
}
