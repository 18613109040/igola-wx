// components/tabs/index.js
Component({
  /**
   * 组件的属性列表
   * @tabs {Array} tabs 数据
   * @active {Number} 当前被激活索引
   * @indicatorActiveColor {Color} 选中底部border颜色
   * 
   */
  properties: {
    tabs:{
     type: Array,
     value: []
    },
    active:{
     type: Number,
     value: 0
    },
    indicatorActiveColor:{
      type: String,
      value: ''
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
    onTap(e){
      const { active } = this.data;
      const { index } = e.currentTarget.dataset;
      this.setData({
        active: index
      })
      let eventDetail = { value: index } // detail对象，提供给事件监听函数
      this.triggerEvent('tabsclick', eventDetail)
    }
  }
})
