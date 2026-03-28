import request from "../utils/request";

export const getMonthSchedule = (data) => {
  return request({
    url: '/child/schedule/getScheduleByMonth',
    method: 'post',
    params: data
  })
}

export const createSchedule = (data) => {
    return request({
        url: '/child/schedule/createSchedule',
        method: 'post',
        params: data
    })
}