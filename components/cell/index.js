// components/flightsCity/index.js
Component({
  /**
   * 组件的属性列表
   * @title {String} 列表项左侧的标题
   * @detail {String} 标题下方的的详细描述
   * @desc {String} 列表项右侧的描述
   * @descSize {String} 列表项右侧的描述字体大小
   * @descColor {Color} 列表项右侧的描述字体颜色
   * @icon {String}  标题前面的图标
   * @iconColor {Color} 标题前面的icon图标颜色
   * @src {String} 标题前面的图标，自定义图片链接
   * @dot {Boolean} 右侧描述部分前面的提醒红点
   * @dotColor {Color} 右侧描述部分前面的提醒红点颜色
   * @arrow {Boolean} 是否显示箭头
   * @mode {String } 列表项边框模式 normal，有下边框；none，无边框
   * @descModel {String} normal 两行  horizontal 一行
   * @iconRight {String} 右侧图标
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    detail: {
      type: String,
      value: '' 
    },
    desc: {
      type: String,
      value: '' 
    },
    tag:{
      type: String,
      value: '' 
    },
    descModel:{
      type:String,
      value:'normal'
    },
    iconColor: {
      type: String,
      value: '#ff5077' 
    },
    descColor:{
      type: String,
      value: '#9B9B9B'
    },
    src: {
      type: String,
      value: '' 
    },
    descSize:{
      type: String,
      value: '24'
    },
    dot: {
      type: Boolean,
      value: false 
    },
    dotColor: {
      type: String,
      value: '#f5123e'
    },
    arrow: {
      type: Boolean,
      value: false  
    },
    arrowSize:{
      type: Number,
      value: 30  
    },
    icon:{
      type: String,
      value: ''
    },
    arrowIcon:{
      type: String,
      value: 'arrow'
    },
    mode: {
      type: String,
      value: 'normal' 
    }
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
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
   
    handleTap(e){
      const { type } = e.currentTarget.dataset;
      // console.dir(e.currentTarget.dataset)
      let eventDetail = { value: type} // detail对象，提供给事件监听函数
      this.triggerEvent('listhandleclick', eventDetail)
    }
  }
})
