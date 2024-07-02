/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:32:41
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-15 14:34:35
 * @FilePath: /qiankun-main-config-web/src/stores/helper/persist.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PersistedStateOptions } from "pinia-plugin-persistedstate";

/**
 * @description pinia 持久化参数配置
 * @param {String} key 存储到持久化的 name
 * @param {Array} paths 需要持久化的 state name
 * @return persist
 * */
const piniaPersistConfig = () => {
  const persist = {
    key,
    // storage: sessionStorage, //default localStorage
    storage: localStorage,//存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
    // storage: sessionStorage,数据在当前浏览器窗口关闭后自动删除。
    paths
  };
  return persist;
};

export default piniaPersistConfig;
