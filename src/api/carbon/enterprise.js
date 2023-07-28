import request from '@/utils/request'

// 查询企业信息列表
export function listEnterprise(query) {
  return request({
    url: '/carbon/enterprise/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息详细
export function getEnterprise(enterpriseId) {
  return request({
    url: '/carbon/enterprise/' + enterpriseId,
    method: 'get'
  })
}

// 新增企业信息
export function addEnterprise(data) {
  return request({
    url: '/carbon/enterprise',
    method: 'post',
    data: data
  })
}

// 修改企业信息
export function updateEnterprise(data) {
  return request({
    url: '/carbon/enterprise',
    method: 'put',
    data: data
  })
}

// 删除企业信息
export function delEnterprise(enterpriseId) {
  return request({
    url: '/carbon/enterprise/' + enterpriseId,
    method: 'delete'
  })
}

export function getNewUserKeyAndAddress(){
  return request({
    url: '/newKey',
    method: 'get'
  })
}
