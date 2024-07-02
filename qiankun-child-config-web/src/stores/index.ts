/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:34:19
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-15 14:35:47
 * @FilePath: /qiankun-main-config-web/src/stores/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// pinia persist
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
