// components/prewImage/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageList:{
      type:Array,
      value:[]
    }
  },
  ready(){
    
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
    lookImage(e){
      let { imageList} = this.data;
      let { index } = e.currentTarget.dataset;
      wx.previewImage({
        current: imageList[index || 0], // 当前显示图片的http链接
        urls: imageList// 需要预览的图片http链接列表
      })
    }
  }
})
