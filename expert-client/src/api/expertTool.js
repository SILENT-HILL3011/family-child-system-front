import request from "../utils/request";

export const ageList = () => {
  return request({
    url: '/expert/content/ageList',
    method: 'post'
  })
}
export const addAge = (params) => {
  return request({
    url: '/expert/content/addAge',
    method: 'post',
    params: params
  })
}

export const subjectList = () => {
  return request({
    url: '/expert/content/subjectList',
    method: 'post'
  })
}
export const addSubject = (params) => {
  return request({
    url: '/expert/content/addSubject',
    method: 'post',
    params: params
  })
}

export const contentList = (params) => {
  return request({
    url: '/expert/content/list',
    method: 'post',
    params: params
  })
}
export const addContent = (params) => {
  return request({
    url: '/expert/content/addContent',
    method: 'post',
    params: params
  })
}

// ====================== 过敏原模块 ======================
export const foodList = () => {
  return request({
    url: '/expert/allergen/foodList',
    method: 'post'
  })
}
export const addFood = (params) => {
  return request({
    url: '/expert/allergen/addFood',
    method: 'post',
    params: params
  })
}

export const allergenList = (params) => {
  return request({
    url: '/expert/allergen/list',
    method: 'post',
    params: params
  })
}
export const addAllergen = (params) => {
  return request({
    url: '/expert/allergen/addAllergen',
    method: 'post',
    params: params
  })
}

// ====================== 营养模块 ======================
export const nutrientFoodList = () => {
  return request({
    url: '/expert/nutrient/foodList',
    method: 'post'
  })
}

export const nutrientList = (params) => {
  return request({
    url: '/expert/nutrient/list',
    method: 'post',
    params: params
  })
}
export const addNutrient = (params) => {
  return request({
    url: '/expert/nutrient/addNutrient',
    method: 'post',
    params: params
  })
}

// ====================== 疾病知识图谱 ======================
export const diseaseList = () => {
  return request({
    url: '/expert/disease/diseaseList',
    method: 'post'
  })
}
export const addDisease = (params) => {
  return request({
    url: '/expert/disease/addDisease',
    method: 'post',
    params: params
  })
}

export const getDisease = (params) => {
  return request({
    url: '/expert/disease/getDisease',
    method: 'post',
    params: params
  })
}

// ====================== 症状 ======================
export const symptomList = () => {
  return request({
    url: '/expert/disease/symptomList',
    method: 'post'
  })
}
export const addSymptom = (params) => {
  return request({
    url: '/expert/disease/addSymptom',
    method: 'post',
    params: params
  })
}

export const getSymptom = (params) => {
  return request({
    url: '/expert/disease/getSymptom',
    method: 'post',
    params: params
  })
}

// ====================== 药品 ======================
export const drugList = () => {
  return request({
    url: '/expert/disease/drugList',
    method: 'post'
  })
}
export const addDrug = (params) => {
  return request({
    url: '/expert/disease/addDrug',
    method: 'post',
    params: params
  })
}

export const getDrug = (params) => {
  return request({
    url: '/expert/disease/getDrug',
    method: 'post',
    params: params
  })
}

// ====================== 关系维护 ======================
export const relateSymptom = (params) => {
  return request({
    url: '/expert/disease/relateSymptom',
    method: 'post',
    params: params
  })
}

export const relateDrug = (params) => {
  return request({
    url: '/expert/disease/relateDrug',
    method: 'post',
    params: params
  })
}