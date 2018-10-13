const app = getApp()
const {
  connect
} = require('../../libs/wechat-weapp-redux.js')
import {
  getHotCitys,
  changeCity
} from '../../actions/flightCitys.js'
import {
  getTimeStamp
} from '../../utils/util.js'
const pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    type:'',
    selectIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { flightCitys, myInfo} = this.data;
    if (flightCitys.hot.length<=0){
      this.dispatch(getHotCitys({
        lang: myInfo.lang,
        timestamp: getTimeStamp()
      }))
    }
    
    const { index, type } = options
    this.setData({
      index: index,
      type: type
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },
  focus(){
    const { index, type }  = this.data
    wx.navigateTo({
      url: `/pages/searchCitys/index?index=${index}&type=${type}`
    })
  },
  //点击城市
  changeCity(e){
    const {
      item
    } = e.currentTarget.dataset;
    const { index, type, selectIndex} = this.data;
    this.dispatch(changeCity(Object.assign({}, item, { index, type, selectIndex})))
    wx.navigateBack()
  },
  //点击tabs事件
  onTabsClick(e) {
    const {
      value
    } = e.detail;
    this.setData({
      selectIndex: value
    })
  }
}


function mapStateToProps(state) {
  let { hot } = state.flightCitys
  return {
    flightCitys: state.flightCitys,
    myInfo: state.myInfo,
    domestic: hot.filter(item => item.i===false),
    international: hot.filter(item => item.i === true)
  }
}
Page(connect(mapStateToProps)(pageConfig))