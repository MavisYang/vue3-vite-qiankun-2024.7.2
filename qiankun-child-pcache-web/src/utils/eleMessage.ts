
import { ElMessageBox, } from 'element-plus';

export function useConfirm(title: string, content: string, succ: Function, fail?: Function, obj?: object) {
  ElMessageBox.confirm(content, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false,
    ...obj,
  })
    .then(() => {
      succ && succ();
    })
    .catch(() => {
      fail && fail();
    });
}

export function useConfirmKnow(title: string, content: string, succ: Function, fail?: Function, obj?: object) {
  ElMessageBox.confirm(content, title, {
    type: 'warning',
    confirmButtonText: '知道了',
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    ...obj,
  })
    .then(() => {
      succ && succ();
    })
    .catch(() => {
      fail && fail();
    });
}

