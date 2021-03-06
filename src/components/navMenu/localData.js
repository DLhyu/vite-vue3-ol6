/*
 * @Description: 
 * @Author: huyong
 * @Date: 2021-09-30 15:52:10
 * @LastEditTime: 2021-12-31 16:44:00
 * @LastEditors:  
 */
export const createDate = () => {
  const date = new Date()
  return [date.getFullYear(),date.getMonth()+1<10?'0'+date.getMonth()+1:date.getMonth()+1,date.getDate()].join('-')
}
export const createHourArr = () => {
  let hourArr = []
  for(let i=0; i<24; i++){
    hourArr.push(i)
  }
  return hourArr
}
export const getBtList = () => {
  let btList = [];
  for (let i = 0; i < 24; i += 1) {
    btList.push({
      value: i < 10 ? "0" + i : i,
      label: i < 10 ? "0" + i : i
    });
  }
  return btList;
}
export const elementArr = [{
  label: 'TMP',
  name: '温度'
},{
  label: 'ER03',
  name: '降水'
},{
  label: 'EDA10',
  name: '风'
}]
export const stationArr = [{
  label: 'gjz',
  name: '国家站'
},{
  label: 'qyz',
  name: '区域站'
},{
  label: 'station',
  name: '站点'
},{
  label: 'stationName',
  name: '站点名称'
},{
  label: 'warningIcon',
  name: '告警图标'
}]

export const realArr = [{
  label: 'rain',
  name: '降水'
},{
  label: 'tem',
  name: '温度'
},{
  label: 'avgWind',
  name: '平均风'
},{
  label: 'vis',
  name: '能见度'
},{
  label: 'wepNow',
  name: '天气'
},{
  label: 'rhu',
  name: '湿度'
},{
  label: 'gst',
  name: '地面温度'
},{
  label: 'extremeWind',
  name: '极大风'
},{
  label: 'snowDepth',
  name: '积雪深度'
}]

export const hourRainArr = [{
  label: 'pre1',
  name: '1小时'
},{
  label: 'pre3',
  name: '3小时'
},{
  label: 'pre6',
  name: '6小时'
},{
  label: 'pre12',
  name: '12小时'
},{
  label: 'pre24',
  name: '24小时'
}]

export const gridType = {
  TMP: 'TMP',
  TMAX: 'TMAX',
  TMIN: 'TMIN',
  EDA10: 'EDA10',
  ER03: 'ER03',
  ERH: 'ERH',
  VIS03: 'VIS03',
  ECT: 'ECT'
}

export const weatherLegendsConfig = {
  temperatureCor : [ {
  'r' : 0,
  'g' : 0,
  'b' : 255,
  'value' : "-40",
  'text' : "-40 -30.1"
}, {
  'r' : 0,
  'g' : 0,
  'b' : 255,
  'value' : "-30",
  'text' : "-30~-20.1"
}, {
  'r' : 0,
  'g' : 166,
  'b' : 255,
  'value' : "-20",
  'text' : "-20~-10.1"
}, {
  'r' : 0,
  'g' : 255,
  'b' : 181,
  'value' : "-10",
  'text' : "-10~-0.1"
}, {
  'r' : 0,
  'g' : 255,
  'b' : 8,
  'value' : "0",
  'text' : "0~9.9"
    
}, {
  'r' : 148,
  'g' : 255,
  'b' : 0,
  'value' : "10",
  'text' : "10~19.9"
}, {
  'r' : 255,
  'g' : 195,
  'b' : 0,
  'value' : "20",
  'text' : "20~29.9"
}, {
  'r' : 255,
  'g' : 44,
  'b' : 0,
  'value' : "30",
  'text' : "30~39.9"
}, {
  'r' : 255,
  'g' : 10,
  'b' : 0,
  'value' : "40",
  'text' : "40~44.9"
}, {
  'r' : 255,
  'g' : 10,
  'b' : 0,
  'value' : "45",
  'text' : ">=45"
} ],
rainCor : [ {
  'r' : 255,
  'g' : 255,
  'b' : 255,
  'value' : "0",
  'text' : "0~0.1"
}, {
  'r' : 171,
  'g' : 239,
  'b' : 161,
  'value' : "0.1",
  'text' : "0.1~4.9"
}, {
  'r' : 114,
  'g' : 214,
  'b' : 99,
  'value' : "5",
  'text' : "5~9.9"
}, {
  'r' : 60,
  'g' : 186,
  'b' : 60,
  'value' : "10",
  'text' : "10~24.9"
}, {
  'r' : 96,
  'g' : 184,
  'b' : 255,
  'value' : "25",
  'text' : "25~49.9"
    
}, {
  'r' : 0,
  'g' : 0,
  'b' : 255,
  'value' : "50",
  'text' : "50~99.9"
}, {
  'r' : 249,
  'g' : 1,
  'b' : 247,
  'value' : "100",
  'text' : "100~149.9"
}, {
  'r' : 209,
  'g' : 1,
  'b' : 186,
  'value' : "150",
  'text' : "150~199.9"
}, {
  'r' : 169,
  'g' : 0,
  'b' : 125,
  'value' : "200",
  'text' : "200~249.9"
}, {
  'r' : 129,
  'g' : 0,
  'b' : 64,
  'value' : "250",
  'text' : ">=250"
} ],
windCor : [ {
  'r' : 82,
  'g' : 71,
  'b' : 141,
  'value' : 0,
  'text' : "0~0.9"
}, {
  'r' : 85,
  'g' : 78,
  'b' : 177,
  'value' : 1,
  'text' : "1~1.9"
}, {
  'r' : 80,
  'g' : 87,
  'b' : 184,
  'value' : 2,
  'text' : "2~3.9"
}, {
  'r' : 67,
  'g' : 105,
  'b' : 196,
  'value' : 4,
  'text' : "4~5.9"
}, {
  'r' : 64,
  'g' : 160,
  'b' : 180,
  'value' : 6,
  'text' : "6~7.9"
}, {
  'r' : 78,
  'g' : 193,
  'b' : 103,
  'value' : 8,
  'text' : "8~9.9"
}, {
  'r' : 104,
  'g' : 209,
  'b' : 79,
  'value' : 10,
  'text' : "10~11.9"
}, {
  'r' : 157,
  'g' : 221,
  'b' : 68,
  'value' : 12,
  'text' : ">=12"
} ],
humidityCor : [ {
  'r' : 0,
  'g' : 0,
  'b' : 0,
  'value' : "0",
  'text' : "0~9.9"
}, {
  'r' : 240,
  'g' : 23,
  'b' : 175,
  'value' : "10",
  'text' : "10~19.9"
}, {
  'r' : 245,
  'g' : 3,
  'b' : 180,
  'value' : "20",
  'text' : "20~29.9"
}, {
  'r' : 247,
  'g' : 70,
  'b' : 3,
  'value' : "30",
  'text' : "30~39.9"
}, {
  'r' : 255,
  'g' : 0,
  'b' : 0,
  'value' : "40",
  'text' : "40~49.9"
}, {
  'r' : 255,
  'g' : 130,
  'b' : 0,
  'value' : "50",
  'text' : "50~59.9"
}, {
  'r' : 255,
  'g' : 255,
  'b' : 0,
  'value' : "60",
  'text' : "60~69.9"
}, {
  'r' : 164,
  'g' : 255,
  'b' : 0,
  'value' : "70",
  'text' : "70~79.9"
}, {
  'r' : 64,
  'g' : 255,
  'b' : 0,
  'value' : "80",
  'text' : "80~89.9"
    
}, {
  'r' : 0,
  'g' : 255,
  'b' : 0,
  'value' : "90",
  'text' : "90~99.9"
}, {
  'r' : 0,
  'g' : 191,
  'b' : 255,
  'value' : "100",
  'text' : ">=100"
} ],
VIS03Cor : [ {
  'r' : 115,
  'g' : 35,
  'b' : 5,
  'value' : "0",
  'text' : "0~0.19"
}, {
  'r' : 155,
  'g' : 1,
  'b' : 255,
  'value' : "0.2",
  'text' : "0.2~0.4"
}, {
  'r' : 254,
  'g' : 1,
  'b' : 0,
  'value' : "0.5",
  'text' : "0.5~9.9"
}, {
  'r' : 255,
  'g' : 84,
  'b' : 0,
  'value' : "1",
  'text' : "1~1.9"
}, {
  'r' : 254,
  'g' : 176,
  'b' : 74,
  'value' : "2",
  'text' : "2~2.9"
}, {
  'r' : 255,
  'g' : 254,
  'b' : 0,
  'value' : "3",
  'text' : "3~4.9"
}, {
  'r' : 115,
  'g' : 254,
  'b' : 52,
  'value' : "5",
  'text' : "5~9.9"
}, {
  'r' : 145,
  'g' : 224,
  'b' : 248,
  'value' : "10",
  'text' : "10~19.9"
}, {
  'r' : 201,
  'g' : 236,
  'b' : 255,
  'value' : "20",
  'text' : "20~29.9"
}, {
  'r' : 254,
  'g' : 254,
  'b' : 254,
  'value' : "30",
  'text' : ">=30"
} ],
ECTCor : [ {
  'r' : 228,
  'g' : 228,
  'b' : 228,
  'value' : "0",
  'text' : "0~9.9"
}, {
  'r' : 218,
  'g' : 218,
  'b' : 218,
  'value' : "10",
  'text' : "10~19.9"
}, {
  'r' : 208,
  'g' : 208,
  'b' : 208,
  'value' : "20",
  'text' : "20~29.9"
}, {
  'r' : 198,
  'g' : 198,
  'b' : 198,
  'value' : "30",
  'text' : "30~39.9"
}, {
  'r' : 188,
  'g' : 188,
  'b' : 188,
  'value' : "40",
  'text' : "40~49.9"
}, {
  'r' : 178,
  'g' : 178,
  'b' : 178,
  'value' : "50",
  'text' : "50~59.9"
}, {
  'r' : 168,
  'g' : 168,
  'b' : 168,
  'value' : "60",
  'text' : "60~69.9"
}, {
  'r' : 158,
  'g' : 158,
  'b' : 158,
  'value' : "70",
  'text' : "70~79.9"
}, {
  'r' : 148,
  'g' : 148,
  'b' : 148,
  'value' : "80",
  'text' : "80~89.9"
}, {
  'r' : 138,
  'g' : 138,
  'b' : 138,
  'value' : "90",
  'text' : "90~99.9"
} , {
  'r' : 128,
  'g' : 128,
  'b' : 128,
  'value' : "100",
  'text' : ">=100"
}]
}

export const realtime = [{
    label: '宁夏图层（测试）',
    action: 'ningxiaReal',
    icon: 'el-icon-menu',
    width: '500px',
    component: () => import(/* webpackChunkName: "weather" */ '@/components/navMenu/RightMenu.vue')
    }, {
      label: '宁夏气象数据',
      action: 'gridReal',
      icon: 'el-icon-menu',
      width: '500px',
      component: () => import(/* webpackChunkName: "weather" */ '@/components/navMenu/RightMenu.vue')
  // }, {
  //   label: '周边实况',
  //   action: 'otherReal',
  //   icon: 'icon-star',
  //   width: '500px',
  //   // height: '400px',
  //   component: () => import(/* webpackChunkName: "weather" */ '../realWeather/otherReal/index')
  // }, {
  //   label: '雷达观测',
  //   action: 'radarTest',
  //   icon: 'icon-radar',
  //   component: () => import(/* webpackChunkName: "weather" */ '../realWeather/radarTest/index')
  // }, {
  //   label: '卫星观测',
  //   action: 'satelliteTest',
  //   icon: 'icon-star',
  //   component: () => import(/* webpackChunkName: "weather" */ '../realWeather/satelliteTest/index')
  // }, {
  //   label: '闪电观测',
  //   action: 'lightningTest',
  //   icon: 'icon-grid',
  //   component: () => import(/* webpackChunkName: "weather" */ '../realWeather/lightningTest/index')
  }]

  export const spatialAnalysis = [{
    label: '缓冲区分析',
    action: 'bufferAnalysis',
    icon: 'el-icon-menu',
    width: '500px',
    height: '200px',
    component: () => import('@/components/navMenu/RightMenu.vue')
  },{
    label: '淹没分析',
    action: 'floodAnalysis',
    icon: 'el-icon-menu',
    width: '500px',
    height: '200px',
    component: () => import('@/components/navMenu/RightMenu.vue')
  }]