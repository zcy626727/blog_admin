import request from '@/utils/request'

//获取标签列表
export function getTagList() {
    return request({
        url: '/tag/getTagList',
        method: 'get',
    })
}

//根据id获取文章信息
export function getArticleById(id) {
    return request({
        url: '/article/getArticleById',
        method: 'get',
        params: {
            id
        }
    })
}

//获取分类列表
export function getCategoryList(params) {
    return request({
        url: '/category/getCategoryList',
        method: 'get',
        params
    })
}

//获取分类列表（分页）
export function getCategoryListPlus(current, size) {
    return request({
        url: '/category/getCategoryListPlus',
        method: 'get',
        params: {
            current,
            size
        }
    })
}

//保存文章
export function saveArticle(data) {
    return request({
        url: '/article/saveOrUpdate',
        method: 'post',
        data
    })
}

//获取文章列表
export function getArticleList(data) {
    return request({
        url: '/article/getArticleList',
        method: 'post',
        data
    })
}

//保存标签
export function saveTags(data) {
    return request({
        url: '/tag/saveTags',
        method: 'post',
        data
    })
}

//保存分类
export function saveCategory(data) {
    return request({
        url: '/category/saveCategory',
        method: 'post',
        data
    })
}

//设置文章状态
export function putStatus(data) {
    return request({
        url: '/article/putStatus',
        method: 'put',
        data
    })
}

//更新类别
export function updateCategory(data) {
    return request({
        url: '/category/updateCategory',
        method: 'put',
        data
    })
}

//删除文章封面
export function removeAvatar(id, name) {
    return request({
        url: '/article/removeAvatar',
        method: 'delete',
        params: {
            id,
            name
        }
    })
}

//删除文章插图
export function removeIllustration(id, name) {
    return request({
        url: '/article/removeIllustration',
        method: 'delete',
        params: {
            id,
            name
        }
    })
}

//上传文章封面
export function uploadIllustration(formdata) {
    return request({
        url: '/article/uploadIllustration',
        method: 'post',
        data: {
            formdata
        },
        headers: { 'Content-Type': 'multipart/form-data;charse=UTF-8' },
        transformRequest: [function() {
            return formdata;
        }],
    })
}