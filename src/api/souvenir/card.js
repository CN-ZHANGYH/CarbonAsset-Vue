import request from '@/utils/request'

// 查询纪念卡数据列表
export function listCard(query) {
  return request({
    url: '/souvenir/card/list',
    method: 'get',
    params: query
  })
}

// 查询纪念卡数据详细
export function getCard(id) {
  return request({
    url: '/souvenir/card/' + id,
    method: 'get'
  })
}

// 新增纪念卡数据
export function addCard(data) {
  return request({
    url: '/souvenir/card',
    method: 'post',
    data: data
  })
}

// 修改纪念卡数据
export function updateCard(data) {
  return request({
    url: '/souvenir/card',
    method: 'put',
    data: data
  })
}

// 删除纪念卡数据
export function delCard(id) {
  return request({
    url: '/souvenir/card/' + id,
    method: 'delete'
  })
}

export function uploadCardImg(data){
  return request({
    url: '/souvenir/card/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
