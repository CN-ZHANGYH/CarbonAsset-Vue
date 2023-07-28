import request from '@/utils/request'

// 查询排放方式的列表
export function listMethod(query) {
  return request({
    url: '/carbon/method/list',
    method: 'get',
    params: query
  })
}

// 查询排放方式的详细
export function getMethod(id) {
  return request({
    url: '/carbon/method/' + id,
    method: 'get'
  })
}

// 新增排放方式的
export function addMethod(data) {
  return request({
    url: '/carbon/method',
    method: 'post',
    data: data
  })
}

// 修改排放方式的
export function updateMethod(data) {
  return request({
    url: '/carbon/method',
    method: 'put',
    data: data
  })
}

// 删除排放方式的
export function delMethod(id) {
  return request({
    url: '/carbon/method/' + id,
    method: 'delete'
  })
}
