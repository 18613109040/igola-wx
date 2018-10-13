import { wxRequest } from '../utils/fetch.js'
export const GET_CURRENT_CITY = 'GET_CURRENT_CITY'
//根据经纬度获取当前地址
export function getAddressByLocation(data) {
  return wxRequest({
      url: "api-data-service/data/find-nearest",
      method: 'POST',
      data: data,
    })
  
}

//获取当前定位城市详情
export function getCurrentCity(json){
 return {
   type:'GET_CURRENT_CITY',
   json
 }
}