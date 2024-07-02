const cnCommon = {
   axios: {
      error_Code: '错误代码:',
      error_400: '请求参数可能不正确,请联系管理员!',
      error_404: '接口地址可能不存在,请联系管理员!',
      error_405: '请求方法不被允许,请联系管理员!',
      error_500: '内部服务器可能发生错误,请联系管理员!',
      error_other: '请联系管理员!',
      error_authFailed: '身份验证失败,即将返回登录!',
   },
   messages: {
      success_opera: '恭喜,操作成功!',
      success_cancel: '操作已取消!',
      error_latestOne: '请先选择操作对象!',
      error_mostOne: '此操作最多只能选择一行!',
      error_opera: '抱歉,操作失败!',
   },
}
export default cnCommon;