import request from "../utils/request";

export const searchMailList = (data) => {
  return request({
    url: '/child/mail/searchMailList',
    method: 'post',
    params: data
  })
}

// 打开邮件（标为已读）
export const openMail = (data) => {
  return request({
    url: '/child/mail/openMail',
    method: 'post',
    params: data
  })
}

// 全部已读
export const readAllMail = () => {
  return request({
    url: '/child/mail/readAll',
    method: 'post'
  })
}

// 检查是否有未读邮件
export const checkUnReadMails = () => {
  return request({
    url: '/child/mail/checkUnReadMails',
    method: 'get'
  })
}