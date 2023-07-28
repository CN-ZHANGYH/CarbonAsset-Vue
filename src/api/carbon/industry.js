import request from '@/utils/request'

// 查询行业分类单列表
export function listIndustry(query) {
    return request({
        url: '/carbon/industry/list',
        method: 'get',
        params: query
    })
}

// 查询行业分类单详细
export function getIndustry(id) {
    return request({
        url: '/carbon/industry/' + id,
        method: 'get'
    })
}

// 新增行业分类单
export function addIndustry(data) {
    return request({
        url: '/carbon/industry',
        method: 'post',
        data: data
    })
}

// 修改行业分类单
export function updateIndustry(data) {
    return request({
        url: '/carbon/industry',
        method: 'put',
        data: data
    })
}

// 删除行业分类单
export function delIndustry(id) {
    return request({
        url: '/carbon/industry/' + id,
        method: 'delete'
    })
}
