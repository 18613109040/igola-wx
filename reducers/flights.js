import {
  getWeek,
  convertTimeToStr,
  dateStrToStamp,
  passengerCalculation
} from '../utils/util.js'
import {
  CHANGE_CITY
} from '../actions/flightCitys.js'
import {
  GET_FLIGHTS_BANNER,
  CHANGE_CABIN,
  CHANGE_TABS,
  CHANGE_CALENDAR_TIME,
  CHANGE_PERSONNEL,
  EXCHANGE_DEPARTURE,
  ADD_FLIGHT,
  DELETE_FLIGHT,
  EXCHANGE_FLIGHT,
  CHANGE_FILTER
} from '../actions/flights.js'
const inint = {
  banner: [], //轮播图
  tabs: [{
    title: '单程'
  }, {
    title: '往返'
  }, {
    title: '多程'
  }],
  selectIndex: 0, // 单程 多程 往返 选中索引
  arrow: false,
  strokes: [{
    departure: wx.getStorageSync('strokes') && wx.getStorageSync('strokes')[0].departure || {
      d: ''
    },
    destination: wx.getStorageSync('strokes') && wx.getStorageSync('strokes')[0].destination || {
      d: ''
    },
    departureTime: {
      week: getWeek(new Date()),
      date: convertTimeToStr(new Date(), 'MM月dd日'),
      begin: dateStrToStamp(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
    },
    destinationTime: {
      week: getWeek(new Date().setDate(new Date().getDate() + 3)),
      date: convertTimeToStr(new Date().setDate(new Date().getDate() + 3), 'MM月dd日'),
      end: dateStrToStamp(new Date(new Date().setDate(new Date().getDate() + 3)).getFullYear(), new Date(new Date().setDate(new Date().getDate() + 3)).getMonth() + 1, new Date(new Date().setDate(new Date().getDate() + 3)).getDate())
    },
  }, {
    departure: wx.getStorageSync('strokes') && wx.getStorageSync('strokes')[1].departure || {
      d: ''
    },
    destination: wx.getStorageSync('strokes') && wx.getStorageSync('strokes')[1].destination || {
      d: ''
    },
    departureTime: {
      week: getWeek(new Date()),
      date: convertTimeToStr(new Date(), 'MM月dd日'),
      begin: dateStrToStamp(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
    },
    destinationTime: {
      week: getWeek(new Date().setDate(new Date().getDate() + 3)),
      date: convertTimeToStr(new Date().setDate(new Date().getDate() + 3), 'MM月dd日'),
      end: dateStrToStamp(new Date(new Date().setDate(new Date().getDate() + 3)).getFullYear(), new Date(new Date().setDate(new Date().getDate() + 3)).getMonth() + 1, new Date(new Date().setDate(new Date().getDate() + 3)).getDate())
    },
  }],
  cabinOptions: [{
    name: '经济舱',
    type: "Economy"
  }, {
    name: '高端经济舱',
    type: "PremiumEconomy"
  }, {
    name: '商务舱',
    type: "Business"
  }, {
    name: '头等舱',
    type: "First"
  }],
  sorterIndex: 0,
  sortresOptions: [{
    name: '性价比最高',
    type: ""
  }, {
    name: '最便宜',
    type: "Economy"
  }, {
    name: '最快',
    type: ""
  }, {
    name: '最早出发',
    type: ""
  }, {
    name: '最晚出发',
    type: ""
  }],
  voyageIndex: 0,
  voyageOptions: [{
    name: '任意中转',
    type: ''
  }, {
    name: '只看直飞',
    type: ''
  }, {
    name: '最多一次中转',
    type: ''
  }],
  cabin: {
    name: '经济舱',
    type: "Economy"
  },
  personnel: {
    adult: 1,
    child: 0
  }
}
export function flightsHome(state = inint, action) {
  let json = action.json
  switch (action.type) {
    //获取banner
    case GET_FLIGHTS_BANNER:
      return Object.assign({}, state, {
        banner: json.data
      })
      //舱位选择
    case CHANGE_CABIN:
      state.cabin = state.cabinOptions[json]
      return Object.assign({}, state)
      //tabs 切换
    case CHANGE_TABS:
      state.selectIndex = json
      return Object.assign({}, state)
      //时间选择
    case CHANGE_CALENDAR_TIME:
      const {
        begin,
        calendarIndex,
        end
      } = json;
      if (state.selectIndex === 1) {
        state.strokes[calendarIndex].destinationTime = {
          week: getWeek(new Date(end)),
          date: convertTimeToStr(new Date(end), 'MM月dd日'),
          end: end
        }
      }
      state.strokes[calendarIndex].departureTime = {
        week: getWeek(new Date(begin)),
        date: convertTimeToStr(new Date(begin), 'MM月dd日'),
        begin: begin
      }
      return Object.assign({}, state)
      //成人 儿童选择
    case CHANGE_PERSONNEL:
      const {
        adult,
        child
      } = state.personnel
      if (json.action === 'dec') {
        let decnumber = state.personnel[json.type] - 1
        state.personnel[json.type] = decnumber
        if (json.type === 'adult') {
          let childNum = passengerCalculation(decnumber)
          if (childNum < child) {
            state.personnel.child = childNum
          }
        }
      } else {
        let addnumber = state.personnel[json.type] + 1
        state.personnel[json.type] = addnumber
        if (json.type === 'adult') {
          let childNum = passengerCalculation(addnumber)
          if (childNum < child) {
            state.personnel.child = childNum
          }
        }
      }
      return Object.assign({}, state)
      //城市交换
    case EXCHANGE_DEPARTURE:
      const {
        departure,
        destination
      } = state.strokes[json]
      state.strokes[json].departure = destination
      state.strokes[json].destination = departure
      wx.setStorageSync('strokes', state.strokes)
      return Object.assign({}, state)
      //多程增加航班
    case ADD_FLIGHT:
      state.strokes.push({
        departure: {
          d: ''
        },
        destination: {
          d: ''
        },
        departureTime: {
          week: getWeek(new Date()),
          date: convertTimeToStr(new Date(), 'MM月dd日'),
          begin: dateStrToStamp(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
        },
        destinationTime: {
          week: getWeek(new Date().setDate(new Date().getDate() + 3)),
          date: convertTimeToStr(new Date().setDate(new Date().getDate() + 3), 'MM月dd日'),
          end: dateStrToStamp(new Date(new Date().setDate(new Date().getDate() + 3)).getFullYear(), new Date(new Date().setDate(new Date().getDate() + 3)).getMonth() + 1, new Date(new Date().setDate(new Date().getDate() + 3)).getDate())
        },
      })
      return Object.assign({}, state)
      //多程减少航班
    case DELETE_FLIGHT:
      state.strokes.pop();
      return Object.assign({}, state)
      //选中城市
    case CHANGE_CITY:
      state.strokes[json.index][json.type] = json;
      wx.setStorageSync('strokes', state.strokes)
      return Object.assign({}, state)
    case EXCHANGE_FLIGHT:
      console.dir(json)
      state.strokes = Object.assign({}, state.strokes, json.strokes)
      state.selectIndex = json.selectIndex;
      state.cabin = state.cabinOptions.find(item => item.type === json.cabinType)
      return Object.assign({}, state)
    //机票筛选
    case CHANGE_FILTER:
      state[json.type]= json.value
      return Object.assign({},state)
    default:
      return state

  }
}