const app = getApp()
const {
  connect
} = require('../../libs/wechat-weapp-redux.js')
import {
  findAirPort,
  changeCity
} from '../../actions/flightCitys.js'
import { Base64 } from '../../libs/base64.js';
const pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    type:''
  },
  onLoad: function (options) {
    const { index, type } = options
    this.setData({
      index: index,
      type: type
    })

  },
  //查询
  searchAirPort(e){
    const { value } = e.detail;
    wx.showLoading();
    this.dispatch(findAirPort({
      lang: Base64.encode('ZH'),
      text: Base64.encode(value),
      timestamp: new Date().getTime()
    }))
  },
  //选择地点
  selectAirPort(e){
    const {
      item
    } = e.currentTarget.dataset;
    const { index, type } = this.data;
    this.dispatch(changeCity(Object.assign({}, item, { index, type, selectIndex: item.i?1:0 })))
    wx.navigateBack({
      delta: 2
    })
  }
}

function mapStateToProps(state) {
  return {
    airPort: state.airPort
  }
}
Page(connect(mapStateToProps)(pageConfig))