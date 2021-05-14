import request from '@/utils/request'

export function getTagList() {
    return request({
        url: '/tag/getTagList',
        method: 'get',
    })
}

export function getArticleById(id) {
    return request({
        url: '/article/getArticleById',
        method: 'get',
        params: {
            id
        }
    })
}

export function getCategoryList() {
    return request({
        url: '/category/getCategoryList',
        method: 'get',
    })
}

export function saveArticle(data) {
    return request({
        url: '/article/saveOrUpdate',
        method: 'post',
        data
    })
}

export function getArticleList(data) {
    return request({
        url: '/article/getArticleList',
        method: 'post',
        data
    })
}

export function saveTags(data) {
    return request({
        url: '/tag/saveTags',
        method: 'post',
        data
    })
}

export function putStatus(data) {
    return request({
        url: '/article/putStatus',
        method: 'put',
        data
    })
}