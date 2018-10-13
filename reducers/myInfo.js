import { GET_CURRENT_CITY } from '../actions/myInfo.js'
const inint = wx.getStorageSync("myInfo")||{
  currency:{
    code:'CNY',
    nameEN:'Chinese Yuan',
    nameZh:'人民币',
    number:156,
    symbol:"¥"
  },
  lang:'ZH',
  cityInfo:{
    d:''
  }
}
export function myInfo(state=inint,action){
  let json = action.json
  switch (action.type) {
    case GET_CURRENT_CITY:
      const data = Object.assign({}, state, {
        cityInfo: json.result[0]
      })
      wx.setStorageSync('myInfo', data )
      return data
      
    default: return state
  }
}