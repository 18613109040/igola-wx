import { GET_HOT_CITYS, CHANGE_CITY, FIND_AIR_PORT, EMPTY_AIR_PORT} from '../actions/flightCitys.js'
const inint = {
  tabs: [{
    title: '国內'
  }, {
      title: '国际·港澳台'
  }],
  selectIndex:0,
  historyDomesticCitys: wx.getStorageSync('historyDomesticCitys')||[],
  historyInternationalCitys: wx.getStorageSync('historyInternationalCitys') || [],
  africa:[],
  america:[],
  asia:[],
  europe:[],
  hot:[],
  oceania:[]
}
export function flightCitys(state = inint, action) {
  let json = action.json
  switch (action.type) {
    case GET_HOT_CITYS:
      return Object.assign({},state,json.result)
    case CHANGE_CITY:
      let historyCitys=[]
      if (json.selectIndex==0){
        historyCitys = wx.getStorageSync('historyDomesticCitys') || [];
      }else{
        historyCitys = wx.getStorageSync('historyInternationalCitys') || [];
      }
       
      historyCitys = historyCitys.filter(item=>item.d !== json.d)
      if (historyCitys.length >= 5) {
        historyCitys.unshift(json)
        historyCitys = historyCitys.slice(0, 5)
      } else {
        historyCitys.push(json)
      }
      if (json.selectIndex == 0) {
        wx.setStorageSync("historyDomesticCitys", historyCitys)
        return Object.assign({}, state, { historyDomesticCitys: historyCitys })
      }else{
        wx.setStorageSync("historyInternationalCitys", historyCitys)
        return Object.assign({}, state, { historyInternationalCitys: historyCitys })
      }
    default: 
      return state
  }
}

export function airPort(state={code:-1,data:[]},action){
  let json = action.json
  switch (action.type) {
    case FIND_AIR_PORT:
      json.result.map(item=>{
        if(item.s){
          let temp=[];
          let temc=[];
          item.s.map(i=>{
            temp.push(i.d)
            temc.push(i.c)
          })
          item.ds = temp.toString().replace(/,/g,"/")
          item.cs = temc.toString().replace(/,/g, "/")
        }
      })
      return {
        code:0,
        data:json.result
      }
    case EMPTY_AIR_PORT:
      return {
        code:-1,
        data:[]
      }
    default:
      return state
  }
}