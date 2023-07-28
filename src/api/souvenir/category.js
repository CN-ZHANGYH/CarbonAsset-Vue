import request from '@/utils/request'

// 查询纪念卡分类数据列表
export function listCategory(query) {
  return request({
    url: '/souvenir/category/list',
    method: 'get',
    params: query
  })
}

// 查询纪念卡分类数据详细
export function getCategory(id) {
  return request({
    url: '/souvenir/category/' + id,
    method: 'get'
  })
}

// 新增纪念卡分类数据
export function addCategory(data) {
  return request({
    url: '/souvenir/category',
    method: 'post',
    data: data
  })
}

// 修改纪念卡分类数据
export function updateCategory(data) {
  return request({
    url: '/souvenir/category',
    method: 'put',
    data: data
  })
}

// 删除纪念卡分类数据
export function delCategory(id) {
  return request({
    url: '/souvenir/category/' + id,
    method: 'delete'
  })
}


export function getCategoryList(){
  return request({
    url: '/souvenir/category/nameList',
    method: 'GET'
  })
}