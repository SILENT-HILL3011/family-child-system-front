import request from "../utils/request";

// 知识查询
export const queryKnowledge = (params) => {
  return request({
    url: '/child/knowledge/query',
    method: 'post',
    params: params
  })
}

// 过敏查询
export const queryAllergen = (params) => {
  return request({
    url: '/child/allergen/query',
    method: 'post',
    params: params
  })
}

// 营养查询
export const queryNutrient = (params) => {
  return request({
    url: '/child/nutrient/query',
    method: 'post',
    params: params
  })
}

// ======================
// 获取下拉列表（全部 POST）
// ======================
export const getAges = ()=>{
  return request({
    url:'/child/knowledge/ages',
    method:'post'
  })
}

export const getSubjects = ()=>{
  return request({
    url:'/child/knowledge/subjects',
    method:'post'
  })
}

export const getNutrientFoodList = ()=>{
  return request({
    url:'/child/nutrient/foods',
    method:'post'
  })
}

export const getAllergenFoodList = ()=>{
  return request({
    url:'/child/allergen/foods',
    method:'post'
  })
}

export const getToolList = () => {
  return request({
    url: '/child/util/recommend',
    method: 'post'  
  })
}

export const getSymptomList = () => {
  return request({
    url: '/child/health/symptom/list',
    method: 'post'
  })
}

export const queryDisease = (params) => {
  return request({
    url: '/child/health/disease',
    method: 'post',
    params: params
  })
}

export const queryDrug = (params) => {
  return request({
    url: '/child/health/drug',
    method: 'post',
    params: params
  })
}