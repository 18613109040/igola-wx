import { wxRequest } from '../utils/fetch.js'
import { getTimeStamp } from '../utils/util.js'
export const GET_FLIGHTS_BANNER = 'GET_FLIGHTS_BANNER'
export const CHANGE_CABIN = 'CHANGE_CABIN'
export const CHANGE_TABS = 'CHANGE_TABS'
export const CHANGE_CALENDAR_TIME = 'CHANGE_CALENDAR_TIME'
export const CHANGE_PERSONNEL = "CHANGE_PERSONNEL"
export const EXCHANGE_DEPARTURE = "EXCHANGE_DEPARTURE"
export const ADD_FLIGHT = "ADD_FLIGHT"
export const DELETE_FLIGHT = "DELETE_FLIGHT"
export const GET_FLIGHT_SEARCH_DATA = "GET_FLIGHT_SEARCH_DATA"
export const EMPTY_FLIGHT_SEARCH_DATA = "EMPTY_FLIGHT_SEARCH_DATA"
export const EXCHANGE_FLIGHT = "EXCHANGE_FLIGHT"
export const CHANGE_FILTER = "CHANGE_FILTER"

// 获取机票页Banner
export function getFlightsBanner() {
  return dispatch => {
    wxRequest({
      url: `api-cms/v3/app-banner/ZH`,
      data: {},
    }).then((json) => {
      console.dir(json)
      if (json.resultCode === 200) {
        return dispatch({
          type: GET_FLIGHTS_BANNER,
          json
        })
      }
    })
  }
}
//机票舱位改变
export function changeCabin(value){
  return {
    type: CHANGE_CABIN,
    json:value
  }
}

//tabs 改变
export function changeTabs(value) {
  return {
    type: CHANGE_TABS,
    json: value
  }
}

//时间选择
export function changeCalendarTime(json){
  return{
    type:CHANGE_CALENDAR_TIME,
    json
  }
}

//人数改变
export function changePersonnel(json){
  return {
    type:CHANGE_PERSONNEL,
    json
  }
}

export function exchangeDeparture(json){
  return {
    type: EXCHANGE_DEPARTURE,
    json
  }
}
//增加航班
export function addFlight(json){
  return {
    type: ADD_FLIGHT,
    json
  }
}
//删除航班
export function deleteFlight(json) {
  return {
    type: DELETE_FLIGHT,
    json
  }
}
//timeline 改变数据
export function exchangeFlight(json){
  return{
    type:EXCHANGE_FLIGHT,
    json
  }
}

//机票搜索 获取session 值
export function getFlightPollingSession(data){
  return wxRequest({
    header:{
      timestamp: getTimeStamp()
    },
    url: "api-flight-polling-data-hub/create-session",
    method: 'POST',
    data: data,
  })
}

//机票条件筛选
export function changeFilter(json){
  return{
    type:CHANGE_FILTER,
    json
  }
}

//获取搜索机票
export function getFlightSearchData(data,callback=()=>{}){
  return dispatch => {
    wxRequest({
      url: "api-flight-polling-data-hub/singlePolling",
      method: 'POST',
      data: data,
    }).then((json) => {
      callback(json)
      if (json.resultCode === 200 && json.steps.length>0) {
        return dispatch({
          type: GET_FLIGHT_SEARCH_DATA,
          json
        })
      }
    })
  }
}

//页面销会情况查询的机票
export function emptyFlightSearchData(json){
  return {
    type:EMPTY_FLIGHT_SEARCH_DATA,
    json
  }
}

//根据城市三字码获取城市详情
export function getCityByCode(data) {
  return wxRequest({
    url: `web-gateway/api-data-service/find-lang-airport/${data.code}/${data.lang}`,
    method: 'GET',
    data: data,
  })
}