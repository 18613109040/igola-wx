import { host } from '../config.js'
export function wxRequest(options) {
  let token = wx.getStorageSync('token');
  let uid = wx.getStorageSync('uid')
  let params = {
    url: `${host}/${options.url}`,
    data: options.data,
    method: options.method || 'GET',
    header: {
      // 'content-type': 'application/x-www-form-urlencoded',
      "Shop-Token": token,
      "Shop-UID": uid,
      ...options.header
    }
  }
  return new Promise((resolve, reject) => {
    wx.request(
      Object.assign({
        ...params,
        success: (res) => {
          wx.hideLoading()
          const data = res.data;
          if (!data.resultCode){
            data.resultCode = 200;
            data.data = res.data;
          }
          // if (data.resultCode === 200){
            resolve(data)
          // }else{
            // wx.showToast({
            //   title: data.errorMessage,
            //   icon: 'none',
            //   duration: 2000
            // })
          // }
        },
        fail: reject
      })
    )
  })
}


