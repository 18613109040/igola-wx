//index.js
//获取应用实例
const app = getApp()
const {
  connect
} = require('../../libs/wechat-weapp-redux.js')
import {
  changeCalendarTime
} from '../../actions/flights.js'
import {
  padStart,
  dateStrToStamp
} from '../../utils/util.js'
import {
  getflightsCalendar
} from '../../actions/flightCalendar.js'
const pageConfig = {
  data: {
    calendarIndex: 0,
    end: '',
    begin: '',
    symbol:'¥',
    week: ['日', '一', '二', '三', '四', '五', '六'],
    year: (new Date()).getFullYear(),
    month: (new Date().getMonth() + 1),
    dateTime: dateStrToStamp(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
    beginText: '去程',
    endText: '返程',
    isReverseAllow: true
  },
  onShow() {
    const { flightsHome, calendarIndex } = this.data;
    this.setData({
      begin: flightsHome.strokes[calendarIndex].departureTime.begin,
      end: flightsHome.strokes[calendarIndex].destinationTime.end
    })
  },
  onLoad(options) {
    const {
      calendarIndex,
    } = options
    this.setData({
      calendarIndex: calendarIndex,
    })

  },
  clickCalendar(e) {
    const {
      item
    } = e.currentTarget.dataset;
    const {
      isReverseAllow,
      begin,
      data,
      end,
      isMulti,
      dateTime,
      calendarIndex
    } = this.data;
    console.dir(calendarIndex)
    if (dateTime > item.time) return;
    if (!isMulti) {
      this.setData({
        begin: item.time,
        end: '',
      })
      this.dispatch(changeCalendarTime({
        end:'',
        begin: item.time,
        calendarIndex
      }))
      wx.navigateBack()
    } else if (!begin || (begin && end)) {
      this.setData({
        begin: item.time,
        end: '',
      })
      this.dispatch(changeCalendarTime({
        end:'',
        begin: item.time,
        calendarIndex
      }))
    } else if (begin && !end) {
      //若不支持反向选择，则选中日期
      if (!isReverseAllow &&
        this.getDaysSize((begin.year + '-' + begin.month + '-' + begin.day),
          (item.year + '-' + item.month + '-' + item.day)) <= 0
      ) {
        return;
      }
      //反选日期
      if (this.isOpposite(item.time, begin)) {
        this.setData({
          end: begin,
          begin: item.time
        })
        let eventDetail = {
          begin: item.time,
          end: begin
        } // detail对象，提供给事件监听函数
        this.dispatch(changeCalendarTime({
          end: begin,
          begin: item.time,
          calendarIndex
        }))

      } else {
        this.setData({
          end: item.time,
        })
        this.dispatch(changeCalendarTime({
          end: item.time,
          begin,
          calendarIndex
        }))
      }

      wx.navigateBack()
    }
  },
  //判断是否反转日期
  isOpposite(end, begin) {
    return end < begin ? true : false;
  }
}

function mapStateToProps(state) {
  const {
    flightsHome,
    flightCalendar
  } = state;
  return {
    flightsHome: flightsHome,
    flightCalendar: flightCalendar,
    isMulti: flightsHome.selectIndex == 1 ? true : false
  }

}
Page(connect(mapStateToProps)(pageConfig))