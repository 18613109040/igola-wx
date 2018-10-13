import { padStart, dateStrToStamp } from '../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   * @monthLength {Number} 
   * @isShow {Boolean}
   */
  properties: {
    monthLength: {
      type: Number,
      value: 6
    },
    isShow:{
      type: Boolean,
      value: false
    },
    isMulti:{
      type: Boolean,
      value: false
    },
    beginText: {
      type: String,
      value: '去程'
    },
    endText: {
      type: String,
      value: '返程'
    },
    isReverseAllow: {
      type: Boolean,
      value: true
    },
    begin: {
      type: Number,
      value: 0
    },
    end: {
      type: Number,
      value: 0
    },
    priceData:{
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    week: ['日', '一', '二', '三', '四', '五', '六'],
    data: [],
    year: (new Date()).getFullYear(),
    month: (new Date().getMonth() + 1),
    dateTime: dateStrToStamp(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
    name:"slide-right",
    amType:'enter'
  },
  ready() {
    this.tableDate()
    
    
  },
  onShow(){
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // close(){
    //   this.setData({
    //     amType: 'leave',
    //     isShow: false
    //   })
  
    // },
    clickCalendar(e){
      const { item } = e.currentTarget.dataset;
      const { isReverseAllow, begin, data, end, isMulti, dateTime } = this.data;
      if (dateTime > item.time) return;
      if (!isMulti){
        this.setData({
          begin: item.time,
          end: '',
        })
        let eventDetail = { begin: item.time, end: '' } // detail对象，提供给事件监听函数
        this.triggerEvent('calendarslect', eventDetail)
        wx.navigateBack()
      }else if (!begin || (begin && end)) {
        this.setData({
          begin:item.time,
          end:'',
        })
        let eventDetail = { begin: item.time, end: '' } // detail对象，提供给事件监听函数
        this.triggerEvent('calendarslect', eventDetail)
      } else if (begin && !end) {
        //若不支持反向选择，则选中日期
        if (!isReverseAllow &&
          this.getDaysSize((begin.year + '-' + begin.month + '-' + begin.day),
          (item.year + '-' + item.month + '-' + item.day)) <= 0
        ) {
          return;
        }
        //反选日期
        if (this.isOpposite(item.time, begin)) {
          this.setData({
            end: begin,
            begin:item.time
          })
          let eventDetail = { begin: item.time, end: begin } // detail对象，提供给事件监听函数
          this.triggerEvent('calendarslect', eventDetail)
        } else {
          this.setData({
            end: item.time,
          })
          let eventDetail = { begin: begin, end: item.time } // detail对象，提供给事件监听函数
          this.triggerEvent('calendarslect', eventDetail)
        }
        
        wx.navigateBack()
      }
    },
    //判断是否反转日期
    isOpposite(end, begin) {
      return end < begin ? true : false;
    },
    //获取天数差
    getDaysSize(s1, s2) {
      let s1s = new Date(s1);
      let s2s = new Date(s2);
      let days = s2s.getTime() - s1s.getTime();
      let time = parseInt(days / (1000 * 60 * 60 * 24));
      return time;
    },
    //获取周几
    getWeekday(date) {
      let nowDate = new Date();
      let days = this.getDaysSize(nowDate, date);
      let mydate = new Date(date);
      let myday = mydate.getDay() //注:0-6对应为星期日到星期六 
      return myday;
    },
    //将数据格式化表格日期格式
    monthDate(year, month) {
      //或取当前月份最后一天的日期
      let lastDay = new Date(year, month, 0).getDate();
      //计算当前月份第一天是星期几
      let weekday = this.getWeekday(year + '-' + month + '-01');
      //定义存放当前月份的数组
      let data = [];
      //定义日期表格数组
      let result = [];
      //计算出当前月份每一天到数组中
      for (let day = 1; day <= lastDay; day++) {
        day = padStart(day,2, '0')
        const time = dateStrToStamp(year, month, day)
        data.push({
          day,
          month,
          year,
          time
        });
      }

      //补全日期前几天
      for (let i = 0; i < weekday; i++) {
        data.unshift('');
      }
      //切成6行
      for (let i = 0, len = data.length; i < len; i += 7) {
        result.push(data.slice(i, i + 7));
      }
      //补全日期后几天
      let length = result[(result.length - 1)].length;
      if (length < 7) {
        for (let i = 0; i < (7 - length); i++) {
          result[(result.length - 1)].push('');
        }
      }

      return result;
    },
    //初始化表格数据
    tableDate() {
      const {
        monthLength,
        year,
        month
      } = this.data;
      let data = [];
      for (let i = 0; i < monthLength; i++) {
        let y = (month + i) > 12 ? year + 1 : year;
        let m = (month + i) > 12 ? (month + i - 12) : (month + i);
        let re = this.monthDate(y, m < 10 ? '0' + m : m);
        data.push(re);
      }
      this.setData({
        data: data
      })
    }
  }
})