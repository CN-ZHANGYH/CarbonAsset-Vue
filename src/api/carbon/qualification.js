import request from '@/utils/request'

// 查询企业资质信息列表
export function listQualification(query) {
  return request({
    url: '/carbon/qualification/list',
    method: 'get',
    params: query
  })
}

// 查询企业资质信息详细
export function getQualification(qualificationId) {
  return request({
    url: '/carbon/qualification/' + qualificationId,
    method: 'get'
  })
}

// 新增企业资质信息
export function addQualification(data) {
  return request({
    url: '/carbon/qualification',
    method: 'post',
    data: data
  })
}

// 修改企业资质信息
export function updateQualification(data) {
  return request({
    url: '/carbon/qualification',
    method: 'put',
    data: data
  })
}

// 删除企业资质信息
export function delQualification(qualificationId) {
  return request({
    url: '/carbon/qualification/' + qualificationId,
    method: 'delete'
  })
}


export function uploadQualification(data) {
  return request({
    url: '/carbon/qualification/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export function verifyQualification(data) {
  return request({
    url: '/carbon/qualification/verifyQualification',
    method: 'post',
    data: data
  })
<<<<<<< HEAD
=======
}

export function getIndustryTag(){
  return request({
    url: '/industrys',
    method: 'GET'
  })
>>>>>>> 0c7f93b (更新项目)
}