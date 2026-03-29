import request from "../utils/request";

export const publishFamilyTask = (params) => {
  return request({
    url: '/child/family/publishTask',
    method: 'get',
    params
  })
}

export const searchFamilyTask = (params) => {
  return request({
    url: '/child/family/searchTask',
    method: 'get',
    params
  })
}

export const acceptFamilyTask = (params) => {
  return request({
    url: '/child/family/acceptTask',
    method: 'get',
    params
  })
}

export const searchMyTask = () => {
  return request({
    url: '/child/family/searchMyTask',
    method: 'get'
  })
}

export const finishFamilyTask = (params) => {
  return request({
    url: '/child/family/finishTask',
    method: 'get',
    params
  })
}

export const publishFamilyMessage = (params) => {
  return request({
    url: '/child/family/publishMessage',
    method: 'get',
    params
  })
}

export const getMessageList = () => {
  return request({
    url: '/child/family/searchMessage',
    method: 'get',
    params: {
      familyId: localStorage.getItem('familyId') // 从本地读取
    }
  })
}

export const likeMessage = (params) => {
  return request({
    url: '/child/family/likeMessage',
    method: 'get',
    params
  })
}

export const applyToMessage = (params) => {
  return request({
    url: '/child/family/applyToMessage',
    method: 'get',
    params
  })
}

export const searchComment = (params) => {
  return request({
    url: '/child/family/searchComment',
    method: 'get',
    params
  })
}

export const applyToComment = (params) => {
  return request({
    url: '/child/family/applyToComment',
    method: 'get',
    params
  })
}

export const changeRole = (params) => {
  return request({
    url: '/child/family/changeRole',
    method: 'get',
    params
  })
}