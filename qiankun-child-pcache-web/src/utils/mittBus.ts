/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-10 17:12:21
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-05-29 17:03:45
 * @Description: 兄弟组件传值-EventBus事件总线
 */
// 1. 引入 mitt，是一个函数
import mitt from 'mitt'
// 2. 调用 mitt
const Mit = mitt()

// 3. TypeScript注册
// 由于必须要拓展 ComponentCustomProperties 类型才能获得类型提示
declare module 'vue' {
    export interface ComponentCustomProperties {
        $Bus: typeof Mit
    }
}
export default Mit

// 在mian.ts中全局引入 或者使用时单个引入
// import Mit from '@/utils/mittBus'
// const app = createApp(App)
// app.config.globalProperties.$Bus = Mit

//4. 组件中使用 : on 订阅，emit 发布，off 取消订阅，all.clear 取消所有订阅
/**
 A 组件派发（emit）
<script setup lang="ts">
  import { getCurrentInstance } from 'vue'

  // 获取全局的 vue 实例
  const instance = getCurrentInstance();

  const emit1 = () => {
    // 调用实例身上挂载的 $Bus
    instance?.proxy?.$Bus.emit('on-num', 100)
  }

  const emit2 = () => {
    instance?.proxy?.$Bus.emit('*****', 500)
  }
</script>
B 组件监听（on）
<script setup lang="ts">
  import { getCurrentInstance } from 'vue'
  const instance = getCurrentInstance()
  instance?.proxy?.$Bus.on('on-num', (num) => {
    console.log(num, 'B')
  })
</script>
 */
