// components/transition/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: 'fade'
    },
    customStyle: String,
    show: {
      value: true,
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
      value: 500
    }
  },
  externalClasses: ['custom-class'],
  attached() {
    if (this.data.show) {
      this.show();
    }
  },
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

    onAnimationEnd() {
      if (!this.data.show) {
        this.setData({
          display: false
        });
      }
    }
  }
})
