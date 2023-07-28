import request from '@/utils/request'

// 查询企业排放资源列表
export function listResource(query) {
  return request({
    url: '/carbon/resource/list',
    method: 'get',
    params: query
  })
}

// 查询企业排放资源详细
export function getResource(emissionId) {
  return request({
    url: '/carbon/resource/' + emissionId,
    method: 'get'
  })
}

// 新增企业排放资源
export function addResource(data) {
  return request({
    url: '/carbon/resource',
    method: 'post',
    data: data
  })
}

// 修改企业排放资源
export function updateResource(data) {
  return request({
    url: '/carbon/resource',
    method: 'put',
    data: data
  })
}

// 删除企业排放资源
export function delResource(emissionId) {
  return request({
    url: '/carbon/resource/' + emissionId,
    method: 'delete'
  })
}
