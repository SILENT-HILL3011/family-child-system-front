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