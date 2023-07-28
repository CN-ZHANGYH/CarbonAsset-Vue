import request from '@/utils/request'

// 查询交易碳额度记录列表
export function listTransaction(query) {
  return request({
    url: '/carbon/transaction/list',
    method: 'get',
    params: query
  })
}

// 查询交易碳额度记录详细
export function getTransaction(transactionId) {
  return request({
    url: '/carbon/transaction/' + transactionId,
    method: 'get'
  })
}

// 新增交易碳额度记录
export function addTransaction(data) {
  return request({
    url: '/carbon/transaction',
    method: 'post',
    data: data
  })
}

// 修改交易碳额度记录
export function updateTransaction(data) {
  return request({
    url: '/carbon/transaction',
    method: 'put',
    data: data
  })
}

// 删除交易碳额度记录
export function delTransaction(transactionId) {
  return request({
    url: '/carbon/transaction/' + transactionId,
    method: 'delete'
  })
}
