const app = getApp()
const {
  connect
} = require('../../libs/wechat-weapp-redux.js')
import {
  getCityByCode,
  getFlightPollingSession,
  getFlightSearchData,
  exchangeFlight,
  changeCalendarTime,
  changeFilter,
  emptyFlightSearchData
} from '../../actions/flights.js'
import { changeFilterMenu } from '../../actions/timeLine.js'
import {
  convertTimeToStr,
  dateStrToStamp,
  getWeek
} from '../../utils/util.js'
const pageConfig = {

  /**
   * 页面的初始数据
   */
  data: {
    sessionId: '',
    currentTime: new Date().getTime(),
    showFilter: false,
    showLoadMore:false,
    pageNumber:1,
    pageSize:30
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      c,
      l,
      t,
      v,
      s
    } = options
    v = decodeURIComponent(v)
    let citysCode = ""
    let items = [];
    let strokes = [];
    let temps = v.split(";")
    temps.map((item, index) => {
      let stroke = item.split('_')
      items.push({
        date: stroke[1].replace(/-/g, ''),
        from: {
          c: stroke[0].split('-')[0]
        },
        to: {
          c: stroke[0].split('-')[1]
        }
      })
      if (t.toUpperCase() === "RT") {
        items.push({
          date: stroke[2].replace(/-/g, ''),
          from: {
            c: stroke[0].split('-')[1]
          },
          to: {
            c: stroke[0].split('-')[0]
          }
        })
      }
      index == 0 ? citysCode += `${stroke[0]}` : citysCode += `-${stroke[0]}`
    })
    const {
      myInfo
    } = this.data;
    getCityByCode({
      code: citysCode,
      lang: myInfo.lang
    }).then(res => {
      let codes = citysCode.split('-')
      let arrayCodes = [];
      items.map(item => {
        item.from.t = res.result.find(it => it.c === item.from.c).t
        item.to.t = res.result.find(it => it.c === item.to.c).t
      })
      //不是机票首页搜索进入的
      if (s !== 1) {
        if (t.toUpperCase() === "RT") {
          strokes.push({
            departure: res.result.find(it => it.c === items[0].from.c),
            destination: res.result.find(it => it.c === items[0].to.c),
            departureTime: {
              week: getWeek(items[0].date),
              date: convertTimeToStr(items[0].date, 'MM月dd日'),
              begin: dateStrToStamp(items[0].date)
            },
            destinationTime: {
              week: getWeek(items[1].date),
              date: convertTimeToStr(items[1].date, 'MM月dd日'),
              begin: dateStrToStamp(items[1].date)
            }
          })
        } else {
          items.map(item => {
            strokes.push({
              departure: res.result.find(it => it.c === item.from.c),
              destination: res.result.find(it => it.c === item.to.c),
              departureTime: {
                week: getWeek(item.date),
                date: convertTimeToStr(item.date, 'MM月dd日'),
                begin: dateStrToStamp(item.date)
              }
            })
          })
        }
        const selectIndex = t === 'OW' ? 0 : t === 'RT' ? 1 : 2;
        // this.dispatch(exchangeFlight({ strokes: strokes, selectIndex: selectIndex, cabinType: c}))
      }
      //动态设置当前页面的标题
      wx.setNavigationBarTitle({
        title: `${strokes[0].departure.district}-${strokes[0].destination.district}`
      })

      const options = {
        enableMagic: true,
        lang: myInfo.lang,
        magicEnabled: true,
        queryObj: {
          cabinAlert: true,
          cabinType: c,
          isDomesticCabinType: 0,
          passengerInfo: [],
          tripType: t,
          item: items
        }
      }
      getFlightPollingSession(options).then(res => {
        this.setData({
          sessionId: res.sessionId
        })
        this.getData(res.sessionId)
      })
    })
  },
  //获取航班数据
  getData(id) {
    const {
      myInfo,
      sessionId,
      pageNumber,
      pageSize
    } = this.data;
    this.dispatch(getFlightSearchData({
      currency: myInfo.currency.code,
      filters: [],
      lang: myInfo.lang,
      pageNumber: pageNumber,
      pageSize: pageSize,
      sessionId: id || sessionId,
      sorters: [],
      voyage: 0
    }, (res) => {
      if (res.resultCode !== 200 || res.steps.length === 0) {
        this.getData(this.data.sessionId)
      }else{
        this.setData({
          pageNumber: pageNumber+1,
          pageSize:15,
          showLoadMore: false
        })
      }
    }))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.dispatch(emptyFlightSearchData())
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  //滚动到底部加载数据
  bindScrollToLower(){
    const { showLoadMore,timeline} = this.data;
    if (timeline.loadMore && !showLoadMore){
      this.setData({
        showLoadMore: true
      })
      this.getData();
    }
   
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  changeTime() {
    wx.navigateTo({
      url: `/pages/flightCalendar/index?calendarIndex=0`
    })
  },
  //前一天
  before() {
    const {
      flightsHome
    } = this.data;
    this.dispatch(changeCalendarTime({
      begin: flightsHome.strokes[0].departureTime.begin - 24 * 60 * 60 * 1000,
      calendarIndex: 0,
      end: flightsHome.strokes[0].destinationTime.end
    }))
  },
  //后一天
  next() {
    const {
      flightsHome
    } = this.data;
    this.dispatch(changeCalendarTime({
      begin: flightsHome.strokes[0].departureTime.begin + 24 * 60 * 60 * 1000,
      calendarIndex: 0,
      end: flightsHome.strokes[0].destinationTime.end
    }))
  },
  //筛选确定
  pickerSorter(e) {
    const {
      value
    } = e.detail;

    this.dispatch(changeFilter({
      type: 'sorterIndex',
      value: value
    }))
  },
  //中转筛选
  pickerVoyage(e) {
    const {
      value
    } = e.detail;
    this.dispatch(changeFilter({
      type: 'voyageIndex',
      value: value
    }))
  },
  //显示筛选
  filterShow() {
    this.setData({
      showFilter: true
    })
  },
  colosePopup() {
    this.setData({
      showFilter: false
    })
  },
  //进入预定界面
  toCabinList() {
    wx.navigateTo({
      url: '/pages/cabinList/index',
    })
  },
  //
  filterMenuClick(e){
    const {
      index
    } = e.currentTarget.dataset;
    this.dispatch(changeFilterMenu(index))
  }
}

function mapStateToProps(state) {
  const {
    flightsHome
  } = state;
  const newFlights = Object.assign({}, flightsHome, {
    strokes: [flightsHome.strokes[0]]
  })
  const days = parseInt(Math.abs(flightsHome.strokes[0].departureTime.begin - flightsHome.strokes[0].destinationTime.end) / 1000 / 60 / 60 / 24)
  const { flightList, airlines, depTimeInfo, arrTimeInfo, blockBudgetAirLowest, allianceInfo } = state.timeline.steps[0]
  console.dir(state.timeline)
  return {
    airlines: airlines,
    depTimeInfo: depTimeInfo,
    arrTimeInfo: arrTimeInfo,
    allianceInfo: allianceInfo,
    blockBudgetAirLowest: blockBudgetAirLowest,
    flightsHome: flightsHome.selectIndex === 1 ? flightsHome : newFlights,
    myInfo: state.myInfo,
    timeline: state.timeline,
    flightList: flightList,
    days: flightsHome.selectIndex === 1 ? days : '',
    flightCalendar: state.flightCalendar
  }
}
Page(connect(mapStateToProps)(pageConfig))