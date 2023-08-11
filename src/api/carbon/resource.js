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

export function getIsNotVerifyList(query){
  return request({
    url: '/carbon/resource/isNotVerifyList',
    method: 'GET',
    params: query
  })
}


export function verifyEnterpriseResource(data){
  return request({
    url: '/emissions/verify',
    method: 'POST',
    data: data
  })
}