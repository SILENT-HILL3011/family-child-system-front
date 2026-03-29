import request from "../utils/request";

export const searchMessage = (pageNum) => {
  return request({
    url: '/expert/util/searchMessage',
    method: 'GET',
    params: { pageNum }
  })
}

export const getHistory = (boardId) => {
  return request({
    url: '/expert/util/history',
    method: 'GET',
    params: { boardId }
  })
}

export const applyMessage = (data) => {
  return request({
    url: '/expert/util/apply',
    method: 'GET',
    params: data
  })
}
