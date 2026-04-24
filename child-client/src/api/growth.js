import request from "../utils/request"

export const addChild = (data) => {
  return request({
    url: '/child/grow/addChild',
    method: "post",
    params: data
  })
}

export const delChild = (data) => {
  return request({
    url: '/child/grow/deleteChild',
    method: 'post',
    params: data
  })
}

export const searchChildInfo = (data) => {
  return request({
    url: '/child/grow/searchChildInfo',
    method: "post",
    params: data
  })
}

export const searchChildInfoById = (data) => {
  return request({
    url: '/child/grow/searchChildById',
    method: "post",
    params: data
  })
}

export const updateChildInfo = (data) => {
  return request({
    url: '/child/grow/updateChildInfo',
    method: 'post',
    data: data
  })
}

// ================== 生长发育 ==================
export const recordGrowth = (data) => {
  return request({
    url: '/child/grow/recordGrowth',
    method: 'post',
    data: data
  })
}

export const searchGrowth = (data) => {
  return request({
    url: '/child/grow/searchGrowth',
    method: 'post',
    params: data
  })
}

export const updateGrowthRecord = (data) => {
  return request({
    url: '/child/grow/updateGrowthRecord',
    method: 'post',
    params: data
  })
}

// ================== 疫苗 ==================
export const searchVaccineByChildId = (data) => {
  return request({
    url: '/child/grow/searchVaccine',
    method: 'post',
    params: data
  })
}

export const updateVaccine = (data) => {
  return request({
    url: '/child/grow/updateVaccine',
    method: 'post',
    params: data
  })
}

export const searchVaccineThisYear = (data) => {
  return request({
    url: '/child/grow/searchVaccineThisYear',
    method: "post",
    params: data
  })
}

// ================== 体检 ==================
export const appointExamination = (data) => {
  return request({
    url: '/child/grow/appointExamination',
    method: "post",
    params: data
  })
}

export const recordLive = (data) => {
  return request({
    url: '/child/grow/recordLive',
    method: "post",
    params: data
  })
}

export const searchLive = (data) => {
  return request({
    url: '/child/grow/searchLive',
    method: "get",
    params: data
  })
}

export const updateLiveRecord = (data) => {
  return request({
    url: '/child/grow/updateLiveRecord',
    method: "post",
    params: data
  })
}

export const deleteLiveRecord = (data) => {
  return request({
    url: '/child/grow/deleteLiveRecord',
    method: "post",
    params: data
  })
}

export const exportLive = (params) => {
  return request({
    url: '/child/grow/exportLive',
    method: "get",
    params: params,
    responseType: 'blob'
  })
}
export const searchExamination = () => {
  return request({
    url: '/child/grow/searchExamination',
    method: 'GET'
  })
}