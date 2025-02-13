/*
 * @Author: yangmiaomiao
 * @Date: 2024-02-04 14:41:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-02-05 14:30:50
 * @Description:
 */
import { Upload } from '@/api/interface/index'
import http from '@/api'

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
    return http.post<Upload.ResFileUrl>(`/file/upload/img`, params, { cancel: false })
}

// 视频上传
export const uploadVideo = (params: FormData) => {
    return http.post<Upload.ResFileUrl>(`/file/upload/video`, params, { cancel: false })
}
