import { Table } from './interface'
import { reactive, computed, toRefs } from 'vue'

/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Object} initParam 获取数据初始化参数 (非必传，默认为{})
 * @param {Boolean} isPageable 是否有分页 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 * */
export const useTable = (
    api?: (params: any) => Promise<any>,
    initParam: object = {},
    isPageable: boolean = true,
    dataCallBack?: (data: any) => any,
    requestError?: (error: any) => void,
) => {
    const state = reactive<Table.StateProps>({
        // 表格数据
        tableData: [],
        // 分页数据
        pageable: {
            // 当前页数
            pageNum: 1,
            // 每页显示条数
            pageSize: 10,
            // 总条数
            total: 0,
        },
        // 查询参数
        searchParam: {},
        // 初始化默认的查询参数
        searchInitParam: {},
    })

    /**
     * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
     * */
    const pageParam = computed({
        get: () => {
            return {
                pageNum: state.pageable.pageNum,
                pageSize: state.pageable.pageSize,
            }
        },
        set: (newVal: any) => {
            console.log('我是分页更新之后的值', newVal)
        },
    })

    /**
     * @description 获取表格数据
     * @return void
     * */
    const getTableList = async () => {
        if (!api) return
        try {
            state.searchInitParam = { ...initParam }
            state.searchParam = { ...state.searchInitParam, ...state.searchParam }
            const page = isPageable ? pageParam.value : {}

            const parmas = { ...state.searchParam, ...page }

            console.log('useTable-parmas查询', parmas)

            let { data } = await api(parmas)
            dataCallBack && (data = dataCallBack(data))
            state.tableData = isPageable ? data.list : data
            // 解构后台返回的分页数据 (如果有分页更新分页信息)
            if (isPageable) {
                // const { pageNum, pageSize, total } = data;
                const { total } = data
                const { pageNum, pageSize } = state.pageable
                updatePageable({ pageNum, pageSize, total })
            }
        } catch (error) {
            requestError && requestError(error)
        }
    }

    /**
     *
     * @param key 字段名
     * @param val 值
     */
    const change = (key: string, val: any) => {
        state.searchParam[key] = val
    }

    /**
     * @description 更新分页信息
     * @param {Object} pageable 后台返回的分页数据
     * @return void
     * */
    const updatePageable = (pageable: Table.Pageable) => {
        Object.assign(state.pageable, pageable)
    }

    /**
     * @description 表格数据查询
     * @return void
     * */
    const search = () => {
        state.pageable.pageNum = 1
        getTableList()
    }

    /**
     * @description 表格数据重置
     * @return void
     * */
    const reset = () => {
        state.pageable.pageNum = 1
        state.pageable.pageSize = 10
        // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
        state.searchParam = { ...state.searchInitParam }
        getTableList()
    }

    /**
     * @description 每页条数改变
     * @param {Number} val 当前条数
     * @return void
     * */
    const handleSizeChange = (val: number) => {
        state.pageable.pageNum = 1
        state.pageable.pageSize = val
        getTableList()
    }

    /**
     * @description 当前页改变
     * @param {Number} val 当前页
     * @return void
     * */
    const handleCurrentChange = (val: number) => {
        state.pageable.pageNum = val
        getTableList()
    }

    return {
        ...toRefs(state),
        getTableList,
        change,
        search,
        reset,
        handleSizeChange,
        handleCurrentChange,
    }
}
