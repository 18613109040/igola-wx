// components/mask/index.js
Component({
  /**
   * 组件的属性列表
   * @show {Boolean} 是否显示
   * @mask {Boolean} 
   * @customStyle {String}
   * @zIndex {Number}
   */
  properties: {
    show: Boolean,
    mask: Boolean,
    customStyle: String,
    zIndex: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick() {
      let eventDetail = { value: "" } // detail对象，提供给事件监听函数
      this.triggerEvent('maskclick', eventDetail)
    }
  }
})
