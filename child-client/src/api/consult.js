import request from "../utils/request"

// 获取专家列表
export const getExpertByType = (params) => {
  return request({
    url: '/child/util/getExpertByType',
    method: 'get',
    params
  })
}

export const consultToExpert = (params) => {
  return request({
    url: '/child/util/consultToExpert',
    method: 'get',
    params
  })
}

export const getMessageInfoByBoardId = (params) => {
  return request({
    url: '/child/util/getMessageInfoByBoardId',
    method: 'get',
    params
  })
}

export const searchMyMessage = (params) => {
  return request({
    url: '/child/util/searchMyMessage',
    method: 'get',
    params
  })
}

export const finishMessage = (params) => {
  return request({
    url: '/child/util/finishMessage',
    method: 'get',
    params
  })
}