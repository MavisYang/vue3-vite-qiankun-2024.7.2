/*
 * @Author: yangmiaomiao
 * @Date: 2024-01-25 17:07:26
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-02-05 15:00:28
 * @Description: 
 */
export namespace Table {
  export interface Pageable {
    pageNum: number;
    pageSize: number;
    total: number;
  }
  export interface StateProps {
    tableData: any[];
    pageable: Pageable;
    searchParam: {
      [key: string]: any;
    };
    searchInitParam: {
      [key: string]: any;
    };
    icon?: {
      [key: string]: any;
    };
  }
}

export namespace HandleData {
  export type MessageType = "" | "success" | "warning" | "info" | "error";
}
