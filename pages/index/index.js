//index.js
//获取应用实例
const app = getApp()
const {
  connect
} = require('../../libs/wechat-weapp-redux.js')
import {
  getFlightsBanner,
  changeCabin,
  changeTabs,
  changeCalendarTime,
  changePersonnel,
  exchangeDeparture,
  addFlight,
  deleteFlight,
  getFlightPollingSession,
  getFlightSearchData,
  getCityByCode
} from '../../actions/flights.js'
import {
  changeCity,
  getHotCitys
} from '../../actions/flightCitys.js'
import {
  getAddressByLocation,
  getCurrentCity
} from '../../actions/myInfo.js'
import {
  passengerCalculation,
  getLocation,
  convertTimeToStr,
  getTimeStamp
} from '../../utils/util.js'
import {
  getflightsCalendar
} from '../../actions/flightCalendar.js'
const pageConfig = {
  data: {
    showPersonnel: false
  },
  onShow() {

  },
  onLoad() {
    //获取机票banner
    const {
      flightsHome,
      myInfo,
      flightCitys
    } = this.data;
    if (flightsHome.banner.length <= 0) {
      this.dispatch(getFlightsBanner())
    }
    //获取热门城市 (搜索机票需要先掉取热门城市接口)
    console.dir(flightCitys.hot)
    if (flightCitys.hot.length <= 0) {
      this.dispatch(getHotCitys({
        lang: myInfo.lang,
        timestamp: getTimeStamp()
      }))
    }
    //获取用户当前地址
    if (!myInfo.cityInfo.d) {
      getLocation(res => {
        getAddressByLocation({
          lang: 'ZH',
          largeCityOnly: true,
          lat: res.latitude,
          lgt: res.longitude,
          timestamp: getTimeStamp(),
          type: "AIRPORT"
        }).then(res => {
          const {
            ct
          } = flightsHome.strokes[0].departure
          // 如果定位城市没变不需要在请求城市详情
          if (res.resultCode === 200 && res.name !== ct) {
            getCityByCode({
              code: res.code,
              lang: myInfo.lang
            }).then(res => {
              this.dispatch(getCurrentCity(res))
              let data = Object.assign({}, res.result[0], {
                type: 'departure',
                index: 0
              })
              this.dispatch(changeCity(data))
            })
          }

        })
      })
    }

  },
  carouselClick(item) {
    const {
      detail
    } = item
    wx.navigateTo({
      url: `/pages/webView/index?src=${detail.link}`,
    })
  },
  //出发城市
  clickCity(e) {
    const {
      index,
      type
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/flightCitys/index?index=${index}&type=${type}`
    })
  },
  listCalenderClick(e) {
    const {
      index
    } = e.currentTarget.dataset;
    const {
      strokes,
      selectIndex,
      cabin
    } = this.data.flightsHome;
    const {
      myInfo
    } = this.data;
    wx.navigateTo({
      url: `/pages/flightCalendar/index?calendarIndex=${index}`
    })

    this.dispatch(getflightsCalendar({
      currency: myInfo.currency.code,
      current: convertTimeToStr(new Date(), 'yyyyMMdd'),
      depDate: convertTimeToStr(strokes[index].departureTime.begin, 'yyyyMMdd'),
      from: strokes[index].departure.c,
      fromType: strokes[index].departure.t,
      isDirectOnly: false,
      lang: myInfo.lang,
      seatClass: cabin.type,
      showPrice: true,
      to: strokes[index].destination.c,
      toType: strokes[index].destination.t,
      tripType: selectIndex === 1 ? "RT" : "OW"
    }))
  },
  //
  bindChange(e) {
    const {
      value
    } = e.detail;
    console.dir(value)

  },
  //点击tabs事件
  onTabsClick(e) {
    const {
      value
    } = e.detail;
    this.dispatch(changeTabs(value))
  },
  //点击舱位
  pickerCabin(e) {
    const {
      value
    } = e.detail;
    this.dispatch(changeCabin(value))
  },
  //机票搜索
  searh() {
    const {
      flightsHome,
      myInfo
    } = this.data;
    const {
      strokes,
      selectIndex
    } = flightsHome;
    let flage = false;
    let v = '';
    strokes.map((item, index) => {
      if (selectIndex === 1) {
        v = `${item.departure.c}-${item.destination.c}_${convertTimeToStr(item.departureTime.begin, 'yyyy-MM-dd')}_${convertTimeToStr(item.destinationTime.end, 'yyyy-MM-dd')}`
      } else {
        if (index == 0) {
          v += `${item.departure.c}-${item.destination.c}_${convertTimeToStr(item.departureTime.begin, 'yyyy-MM-dd')}`
        } else {
          v += `;${item.departure.c}-${item.destination.c}_${convertTimeToStr(item.departureTime.begin, 'yyyy-MM-dd')}`
        }
      }
      if (!item.departure.c || !item.destination.c) {
        flage = true
      }
    })
    if (flage) {
      wx.showToast({
        icon: 'none',
        title: '请完善出行信息'
      })
      return;
    }
    const tripType = selectIndex === 0 ? 'OW' : selectIndex === 1 ? 'RT' : 'CT';
    wx.navigateTo({
      url: `/pages/timeLine/index?c=${flightsHome.cabin.type}&l=${myInfo.lang}&t=${tripType}&v=${v}&s=1`,
    })
  },
  //显示
  showPersonnelPop() {
    this.setData({
      showPersonnel: true
    })
  },
  enter() {
    this.setData({
      showPersonnel: false
    })
  },
  exchangeCity(e) {
    const {
      index
    } = e.currentTarget.dataset;
    this.dispatch(exchangeDeparture(index))
  },
  //成人
  clickPerson(e) {
    const {
      type,
      action
    } = e.currentTarget.dataset;
    this.dispatch(changePersonnel({
      type,
      action
    }))
  },
  //增加航班
  addFlight() {
    this.dispatch(addFlight())
  },
  deleteFlight() {
    this.dispatch(deleteFlight())
  }
}

function mapStateToProps(state) {
  const {
    flightsHome
  } = state;
  let childMax = passengerCalculation(flightsHome.personnel.adult)
  const newFlights = Object.assign({}, flightsHome, {
    strokes: [flightsHome.strokes[0]]
  })
  return {
    flightsHome: flightsHome.selectIndex === 2 ? flightsHome : newFlights,
    childMax: childMax,
    myInfo: state.myInfo,
    flightCitys: state.flightCitys,
    flightCalendar: state.flightCalendar
  }


}
Page(connect(mapStateToProps)(pageConfig))