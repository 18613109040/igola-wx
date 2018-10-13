// components/popup/index.js
Component({
  /**
   * 组件的属性列表
   * @show {Boolean} 当前组件是否显示
   * @duration {Number}动画时长，单位为毫秒
   * @overlay {Boolean} 是否显示背景蒙层
   * @position {String} 可选值为 center top bottom right left
   */
  properties: {
    transition: String,
    overlayStyle: String,
    customStyle: String,
    show: {
      value: false,
      type: Boolean,
      observer(value) {
        if (value) {
          this.show();
        } else {
          this.setData({
            type: 'leave'
          });
        }
      }
    },
    
    duration: {
      type: Number,
      value: 300
    },
    zIndex: {
      type: Number,
      value: 100
    },
    overlay: {
      type: Boolean,
      value: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true
    },
    position: {
      type: String,
      value: 'center'
    }
  },
  externalClasses: ['custom-class'],
  /**
   * 组件的初始数据
   */
  data: {
    type: '',
    inited: false,
    display: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this.setData({
        inited: true,
        display: true,
        type: 'enter'
      });
    },
    onClickOverlay() {
     
      // this.$emit('click-overlay');

      if (this.data.closeOnClickOverlay) {
        this.setData({
          show:false
        })
      }
    },
    onAnimationEnd() {
      if (!this.data.show) {
        this.setData({
          display: false
        });
      }
    }
  }
})
