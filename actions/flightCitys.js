import { wxRequest } from '../utils/fetch.js'
export const GET_HOT_CITYS = 'GET_HOT_CITYS'
export const CHANGE_CITY = "CHANGE_CITY"
export const FIND_AIR_PORT = "FIND_AIR_PORT"
export const EMPTY_AIR_PORT = "EMPTY_AIR_PORT"
//获取热门城市
export function getHotCitys(data) {
  return dispatch => {
    wxRequest({
      url: "api-data-service/data/find-hot",
      method: 'POST',
      data: data,
    }).then((json) => {
      if (json.resultCode === 200) {
        return dispatch({
          type: GET_HOT_CITYS,
          json
        })
      }
    })
  }
}

//选择城市
export function changeCity(json) {
  return {
    type: CHANGE_CITY,
    json
  }
}

//查询机场
export function findAirPort(data){
  return dispatch => {
    wxRequest({
      url: "api-data-service/data/find-airport",
      method: 'GET',
      data: data,
    }).then((json) => {
      if (json.resultCode === 200) {
        return dispatch({
          type: FIND_AIR_PORT,
          json
        })
      }
    })
  }
}

//清空机场数据
export function emptyAirPort(json){
  return{
    type:EMPTY_AIR_PORT,
    json
  }
}