// components/icon/index.js
Component({
  /**
   * 组件的属性列表
   * @type {String} 图标类型
   * @size {Number} 图标大小
   * @color {Color} 颜色
   */
  properties: {
    type: {
      type: String,
      value: '',
    },
    size: {
      type: Number,
      value: 40,
    },
    color: {
      type: String,
      value: '',
    },
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
      this.triggerEvent('iconclick', {})
    }
  }
})
