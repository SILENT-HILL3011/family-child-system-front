import request from "../utils/request";

export const expertRegister = (params) => {
  return request({
    url: '/expert/info/expertRegister',
    method: 'POST',
    params
  })
}

export const expertLogin = (params) => {
  return request({
    url: '/expert/info/expertLogin',
    method: 'POST',
    params
  })
}

export const searchExpertInfo = () => {
  return request({
    url: '/expert/info/searchExpertInfo',
    method: 'GET'
  })
}

// 更新专家信息
export const updateExpertInfo = (data) => {
  return request({
    url: '/expert/info/updateExpertInfo',
    method: 'POST',
    data
  })
}

export const createPersonalExamination = (startTime, endTime) => {
  
  return request({
    url: '/expert/info/createPersonalExamination', 
    method: 'POST',                             
    params: { 
      startTime: startTime, 
      endTime: endTime 
    }
  })
}

export const getMyExamination = () => {
  return request({
    url: '/expert/info/getMyExamination',
    method: 'GET'
  })
}

export const putExamResult = (data) => {
  return request({
    url: '/expert/info/putExamResult',
    method: 'POST',
    data
  })
}