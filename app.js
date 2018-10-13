const { Provider } = require('./libs/wechat-weapp-redux.js');
const configureStore = require('./store/configureStore.js');
import locales from './utils/locales.js'
import T from './libs/wxapp-i18n.js'

T.registerLocale(locales)
T.setLocale('zh')
wx.T = T
App(Provider(configureStore())({
  onLaunch() {
  },
  globalData: {
    userInfo: null,
    color: '#FF7920',
    point: {
      latitude: 0,
      longitude: 0
    }
  }
}))
