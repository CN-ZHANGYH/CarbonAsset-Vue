import request from '@/utils/request'

// 查询资源类型数据列表
export function listType(query) {
  return request({
    url: '/carbon/type/list',
    method: 'get',
    params: query
  })
}

// 查询资源类型数据详细
export function getType(id) {
  return request({
    url: '/carbon/type/' + id,
    method: 'get'
  })
}

// 新增资源类型数据
export function addType(data) {
  return request({
    url: '/carbon/type',
    method: 'post',
    data: data
  })
}

// 修改资源类型数据
export function updateType(data) {
  return request({
    url: '/carbon/type',
    method: 'put',
    data: data
  })
}

// 删除资源类型数据
export function delType(id) {
  return request({
    url: '/carbon/type/' + id,
    method: 'delete'
  })
}
