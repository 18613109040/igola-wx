import { GET_FLIGHT_SEARCH_DATA, EMPTY_FLIGHT_SEARCH_DATA } from '../actions/flights.js'
import { CHANGE_FILTER_MENU} from '../actions/timeLine.js'
const inint = {
  loadMore:true,
  steps:[
    {
      flightList:[],
      airlines:[],
      airport:[],
      allianceInfo:[],
      arrTimeInfo:[],
      depTimeInfo:[],
      stopInfo:[],
      planeSizes:[],
      blockBudgetAirLowest:''
    }
  ],
  filterSelectIndex:0,
  filterMenu: ['起降时间', '航空公司', '起降机场', '中转时长', '机型','个性化']
}
export function timeline(state = inint, action){
  let json = action.json
  switch (action.type) {
    case GET_FLIGHT_SEARCH_DATA:
      if(json.steps&&json.steps.length>0){
        let { flightList } = json.steps[0]
        if (flightList.length==0){
          json.loadMore = false
        }else{
          json.loadMore = true
        }
        flightList.map(item=>{
          item.departDate = item.departTime.split(" ")[1]
          item.arriveDate = item.arriveTime.split(" ")[1]
          item.durationTime = item.duration.split(":")
          let airImage = []
          item.airlineCodes.map(itemx=>{
            airImage.push(`http://ovycf8zkv.bkt.clouddn.com/static/APP/images/airline_logo/2x/24x24/${itemx.toLowerCase()}.png`)
          })
          item.airImage = airImage;
          //直飞（没有中转）
          if (item.stops ==0){
            item.ariname = [item.segments[0].orgAirportName.replace("机场", ''), item.segments[0].dstAirportName.replace("机场", '')]
          }else {
            item.ariname = [item.segments[0].orgAirportName.replace("机场", ''), item.segments[item.segments.length-1].dstAirportName.replace("机场", '')]
          }
        }) 
      }
      json.steps[0].flightList = [].concat(state.steps[0].flightList, json.steps[0].flightList)
      return Object.assign({}, state, json)
    case EMPTY_FLIGHT_SEARCH_DATA:
      return inint
    case CHANGE_FILTER_MENU:
      state.filterSelectIndex = json;
      return Object.assign({},state)
    default: return state
  }
}