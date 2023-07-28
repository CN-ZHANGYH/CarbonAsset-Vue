import request from '@/utils/request'

// 查询企业出售资产列表
export function listAsset(query) {
  return request({
    url: '/carbon/asset/list',
    method: 'get',
    params: query
  })
}

// 查询企业出售资产详细
export function getAsset(assetId) {
  return request({
    url: '/carbon/asset/' + assetId,
    method: 'get'
  })
}

// 新增企业出售资产
export function addAsset(data) {
  return request({
    url: '/carbon/asset',
    method: 'post',
    data: data
  })
}

// 修改企业出售资产
export function updateAsset(data) {
  return request({
    url: '/carbon/asset',
    method: 'put',
    data: data
  })
}

// 删除企业出售资产
export function delAsset(assetId) {
  return request({
    url: '/carbon/asset/' + assetId,
    method: 'delete'
  })
}
