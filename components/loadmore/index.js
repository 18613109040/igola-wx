
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: ''
    },
    isEnd: {
      type: Boolean,
      value: false
    },
    icon: {
      type: String
    },
    image:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },
  attached() {
    const { image, icon} = this.data;
    // this.setData({
    //   iconStatus
    // })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
