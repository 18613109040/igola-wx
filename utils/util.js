
// 提示框
export function alert(content, callback) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
    success: callback
  })
}
export function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//返回周几
export function getWeek(timeStamp) {
  if (!timeStamp) { return false; }
  if (typeof timeStamp == 'string') {
    timeStamp = parseInt(timeStamp)
  }
  if (timeStamp.toString().length == 10) {
    timeStamp = timeStamp * 1000
  }
  let day = new Date(timeStamp).getDay();
  let weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  return weeks[day]
  
}
/**
 * String  padStart 实现
 */
export function padStart(target,targetLength, padString) {
  target = String(target);
  targetLength = targetLength >> 0; 
  padString = String(typeof padString !== 'undefined' ? padString : ' ');
  if (target.length >= targetLength) {
    return String(target);
  } else {
    targetLength = targetLength - target.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); 
    }
    return padString.slice(0, targetLength) + String(target);
  }
};
export function dateStrToStamp(year, month, day, isSecond = false){
  const m = padStart(month,2,'0');
  const d = padStart(day, 2, '0');
  const date = new Date(`${year}-${m}-${d}`)
  return isSecond ? Math.round(date.getTime() / 1000) : date.getTime();
}
/**
 * @description 时间转换,将时间字符串转为时间戳
 * @param dateStr 日期字符串
 * @param isSecond 为true则输出10位时间戳(秒),默认为13位(毫秒)
 * @returns {number}
 */
export function convertStrToStamp(dateStr, isSecond = false) {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);
  if (date.toString() === 'Invalid Date') {
    console.error('[convertStrToStamp]: 日期格式错误.');
  } else {
    return isSecond ? Math.round(date.getTime() / 1000) : date.getTime();
  }
}

/**
 * @description 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
export function debounce(func, wait, immediate) {
  let timeout;
  let args;
  let context;
  let timestamp;
  let result;
  const later = function () {
    // 据上一次触发时间间隔
    const last = Date.now() - timestamp;
    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function () {
    context = this;
    args = arguments;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
}

export function convertTimeToStr(timeStamp, fmt = 'yyyy-MM-dd hh:mm:ss') {
  let date, k, o, tmp;
  if (!timeStamp) { return false; }
  if (typeof timeStamp == 'string') {
    timeStamp = parseInt(timeStamp)
  }
  //如果是10位数,则乘以1000转换为毫秒
  if (timeStamp.toString().length == 10) {
    timeStamp = timeStamp * 1000
  }
  date = new Date(timeStamp);
  o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        tmp = RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length);
        fmt = fmt.replace(RegExp.$1, tmp);
      }
    }
  } else if (/(M+)/.test(fmt)){
    for (k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        tmp = RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length);
        fmt = fmt.replace(RegExp.$1, tmp);
      }
    }
  }
  return fmt
}
export function add(a, b, num) {

  let d = parseFloat(a) + parseFloat(b);
  return parseFloat(d.toFixed(num || 2));
}
export function mul(a, b, num) {
  let d = parseFloat(a) - parseFloat(b);
  return parseFloat(d.toFixed(num || 2));
}

//获取经纬度
export function getLocation(callback) {
  wx.getLocation({
    type: 'gps',
    success(res) {
      callback(res)
    },
    fail(res) {
      if (res.errMsg == 'getLocation:fail auth deny' && wx.openSetting) {
        confirm({
          content: '若不授权地理位置权限, 则无法正常使用, 请重新授权地理位置权限',
          cancelText: '不授权',
          confirmText: '授权',
          ok() {
            wx.openSetting({
              success(res) {
                if (res.authSetting['scope.userLocation']) {
                  getLocation(callback)
                } else {
                  alert('获取用户地址失败')
                }
              }
            })
          }
        })
      } else {
        alert('获取用户地址失败')
      }

    }
  })
}
// 确认框
export function confirm(options) {
  var {
    content, confirmText, cancelText,
    ok,
  } = options
  confirmText = confirmText || '确定'
  cancelText = cancelText || '取消'
  wx.showModal({
    content,
    confirmText,
    cancelText,
    confirmColor: '#ff7920',
    success(res) {
      if (res.confirm) {
        ok && ok()
      }
    }
  })
}
function resolveAdInfo(adInfo) {
  const { city, district, adcode } = adInfo
  return {
    city, district,
    district_id: adcode,
    city_id: adcode.replace(/\d{2}$/, '00')
  }
}


/***
 * 根据经纬度计算距离
 */

const EARTH_RADIUS = 6378137.0;    //单位M
const PI = Math.PI;

function getRad(d) {
  return d * PI / 180.0;
}
export function getFlatternDistance(lat1, lng1, lat2, lng2) {
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

/**
 * 数组去重
 */
export function arrayToRepeat(data = []) {
  var obj = {};
  var newArray = [];
  for (var i = 0; i < data.length; i++) {
    if (!obj[data[i]]) {
      obj[data[i]] = data[i]
      newArray.push(data[i])
    }
  }
  return newArray;
}
//根据成人数量返回儿童最大数量
export function passengerCalculation(adult){
  if(adult<=3){
    return adult*2
  }else{
    return 9-adult
  }
}

//计算timestamp 值
export function getTimeStamp(){
  const temp = parseInt(new Date().getTime() / 1000)
  const ava = 97
  return parseInt((temp * ava) % 1000) + parseInt(temp * 1000)

}

