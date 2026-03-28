import request from "../utils/request";

export const userRegister = (data) => {
  return request({
    url: '/child/user/register', 
    method: 'post', 
    params:data, 
  })
}

export const userLogin = (data) => {
  return request({
    url: '/child/user/login',
    method: 'post',
    params:data
  })
}

export const getUserInfo = () => {
  return request({
    url: '/child/user/getUserInfo',
    method: 'post',
  })
}

export const updateUserInfo = (data) => {
  return request({
    url: '/child/user/updateUserInfo',
    method: 'post',
    data: data
  })
}

export const createFamily = (data)=>{
  return request({
    url:'child/user/createFamily',
    method:'post',
    params:data
  })
}

export const searchMemberList = (pageNum) =>{
  return request({
    url: "/child/user/searchMemberList",
    method: "post",
    params: { pageNum }
  })
}

export const inviteMember = (data)=>{
  return request({
    url:"/child/user/inviteMember",
    method:"post",
    params:data
  })
}