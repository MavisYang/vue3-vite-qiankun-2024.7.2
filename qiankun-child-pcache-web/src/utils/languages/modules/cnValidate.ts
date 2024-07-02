
const cnValidate={
    validate:{
        textNumLetter:"请输入字母或数字,长度不超过20",
        textInt:"请输入正整数或0",
        textStr20:"长度不超过20个字符",
        textStr30:"长度不超过30个字符",
        textStr50:"长度不超过50个字符",
        textNonempty:"不能为空!",
        textEmail : "请输入正确的电子邮箱地址!",
        textPhone : "请输入正确的手机号码!",
        textTel :"请输入正确的座机号码!",
        textPersonName : "请输入正确的姓名!",
        textEn : "请输入英文字母,可包含大小写!",
        textURL : '以http/https/ftp/ftps开头，可包含路径、携带参数!如http://xx.xx.xx/path?a=1',
        textPath : '必须"/"开头,只允许字母、数字、下划线，如：/root',
        textPath_ : '必须"盘符或/"开头,"/"结尾,只允许字母、数字、下划线、点。如：D:/dir/dd.a/或/root/home/',
        textIp : '请输入正确的ip，如192.168.1.1!',
        textIprange : '请输入正确的ip段，如192.168.1.0-192.168.1.255!',
        textPort : '端口范围为:0-65535,请输入正确的端口范围!',
        textPswd1 : '最少6位，必须包含1个大写字母,1个小写字母,1个数字,1个特殊字符!',
        textPswd2 : '至少6位，只能包含字母,数字,下划线!',
        textCode : '以字母开头,由字母、数字、下划线组成，长度2-32位',
        textName : '由汉字、数字、字母、下划线组成,长度长度2-32位',
        noChinese:'不允许输入汉字'
    }
}
export default cnValidate;