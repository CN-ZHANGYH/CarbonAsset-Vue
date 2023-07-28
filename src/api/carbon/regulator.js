import request from '@/utils/request'

// 查询监管机构信息列表
export function listRegulator(query) {
  return request({
    url: '/carbon/regulator/list',
    method: 'get',
    params: query
  })
}

// 查询监管机构信息详细
export function getRegulator(regulatorId) {
  return request({
    url: '/carbon/regulator/' + regulatorId,
    method: 'get'
  })
}

// 新增监管机构信息
export function addRegulator(data) {
  return request({
    url: '/carbon/regulator',
    method: 'post',
    data: data
  })
}

// 修改监管机构信息
export function updateRegulator(data) {
  return request({
    url: '/carbon/regulator',
    method: 'put',
    data: data
  })
}

// 删除监管机构信息
export function delRegulator(regulatorId) {
  return request({
    url: '/carbon/regulator/' + regulatorId,
    method: 'delete'
  })
}
