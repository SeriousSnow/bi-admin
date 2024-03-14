import http from '@/utils/http'

// 获取模型列表
export function getModelList(data) {
  return http({
    url: '/api/club/gpt/list/page',
    method: 'post',
    data,
  })
}

// 删除模型
export function delModel(id) {
  return http({
    url: '/api/club/gpt/delete',
    method: 'delete',
    params: { id },
  })
}

// 添加模型
export function addModel(data) {
  return http({
    url: '/api/club/gpt/add',
    method: 'post',
    data,
  })
}

// 修改模型
export function editModel(data) {
  return http({
    url: '/api/club/gpt/edit',
    method: 'put',
    data,
  })
}

// 分页查看个人模型
export function modelListPagePerson(data) {
  return http({
    url: '/club/gpt/list/pageOne',
    method: 'post',
    data,
  })
}

// 模型图片上传接口
export function fileUpload(formData) {
  return http({
    url: '/api/oss/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
