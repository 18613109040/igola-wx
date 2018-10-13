// components/share/share.js
var app = getApp();
let animationShowHeight = 300;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  showModalStatus: {
    type: Boolean,
    value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: "",
    showModalStatus: false,
  },

  /**
   * 组件的方法列表
   */
 
    showModal: function () {
      // 显示遮罩层  
      var animation = wx.createAnimation({
        duration: 200,
        delay: 0
      })
      this.animation = animation
      animation.translateY(animationShowHeight).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    hideModal: function () {
      // 隐藏遮罩层  
      var animation = wx.createAnimation({
        duration: 200,
        delay: 0
      })
      this.animation = animation;
      animation.translateY(animationShowHeight).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    },
    onShow: function () {
      let that = this;
      wx.getSystemInfo({
        success: function (res) {
          animationShowHeight = res.windowHeight;
        }
      })
    },
  
})
//index.js  

