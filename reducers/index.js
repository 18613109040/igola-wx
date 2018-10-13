const Redux = require('../libs/redux.js')
const combineReducers = Redux.combineReducers;
import { flightsHome } from './flights.js'
import { flightCitys, airPort } from './flightCitys.js'
import { myInfo} from './myInfo.js'
import { flightCalendar} from './flightCalendar.js'
import { timeline } from './timeline.js'
const todoApp = combineReducers({
  flightsHome,
  flightCitys,
  airPort,
  flightCalendar,
  myInfo,
  timeline
})
module.exports = todoApp