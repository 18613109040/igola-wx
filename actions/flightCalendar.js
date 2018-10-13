import { wxRequest } from '../utils/fetch.js'
export const GET_FLIGHTS_CALENDAR = 'GET_FLIGHTS_CALENDAR'
// 获取机票页日历
export function getflightsCalendar(data) {
  return dispatch => {
    wxRequest({
      url: "web-gateway/api-flight-inspire-data-hub/calendar",
      method:'POST',
      data: data,
    }).then((json) => {
      if (json.resultCode === 200) {
        return dispatch({
          type: GET_FLIGHTS_CALENDAR,
          json
        })
      }
    })
  }
}