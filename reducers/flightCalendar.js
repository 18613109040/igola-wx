import { GET_FLIGHTS_CALENDAR} from '../actions/flightCalendar.js'
import {
  dateStrToStamp
} from '../utils/util.js'
export function flightCalendar(state = inintDate(), action){
  let json = action.json
  switch (action.type) {
    case GET_FLIGHTS_CALENDAR:
      state.map((item,index)=>{
        item.map((ix,i)=>{
          ix.map((it,j)=>{
            if(it){
              it = Object.assign(it, json.months[index].days[i * 7 + j])
            }
          })
        })
      })
      console.dir(state)
      return [...state] 
    default:
       return state
  }
}

//获取天数差
function getDaysSize(s1, s2) {
  let s1s = new Date(s1);
  let s2s = new Date(s2);
  let days = s2s.getTime() - s1s.getTime();
  let time = parseInt(days / (1000 * 60 * 60 * 24));
  return time;
}
//获取周几
function getWeekday(date) {
  let nowDate = new Date();
  let days = getDaysSize(nowDate, date);
  let mydate = new Date(date);
  let myday = mydate.getDay() //注:0-6对应为星期日到星期六 
  return myday;
}
//将数据格式化表格日期格式
function monthDate(year, month) {
  //或取当前月份最后一天的日期
  let lastDay = new Date(year, month, 0).getDate();
  //计算当前月份第一天是星期几
  let weekday = getWeekday(year + '-' + month + '-01');
  //定义存放当前月份的数组
  let data = [];
  //定义日期表格数组
  let result = [];
  //计算出当前月份每一天到数组中
  for (let day = 1; day <= lastDay; day++) {
    const time = dateStrToStamp(year, month, day)
    data.push({
      day,
      month,
      year,
      time
    });
  }

  //补全日期前几天
  for (let i = 0; i < weekday; i++) {
    data.unshift('');
  }
  //切成6行
  for (let i = 0, len = data.length; i < len; i += 7) {
    result.push(data.slice(i, i + 7));
  }
  //补全日期后几天
  let length = result[(result.length - 1)].length;
  if (length < 7) {
    for (let i = 0; i < (7 - length); i++) {
      result[(result.length - 1)].push('');
    }
  }

  return result;
}
//初始化表格数据
function inintDate() {
  const monthLength = 6;
  const year =  (new Date()).getFullYear();
  const  month = (new Date().getMonth() + 1);
  let data = [];
  for (let i = 0; i < monthLength; i++) {
    let y = (month + i) > 12 ? year + 1 : year;
    let m = (month + i) > 12 ? (month + i - 12) : (month + i);
    let re = monthDate(y,  m);
    data.push(re);
  }
  console.dir(data)
  return data
}