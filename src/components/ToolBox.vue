<template>
  <el-card class="tools-box">
    <el-row>
      <el-col :span="12"
              style="width:auto;">
        <ul class="tools-box">
          <li v-for="item in boxTools"
              :key="item.action"
              :class="{active: activedMod==item.action}">
            <el-button :round="true"
                       class="tool-btn"
                       @click="showBox(item)"><i :class="item.icon"></i><br /><span>{{item.label}}</span></el-button>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <ul class="tools-list">
          <li v-for="item in tools"
              :key="item.action"
              :class="{active:activedTool==item.action}">
            <el-button :round="true"
                       class="tool-btn"
                       :icon="item.icon"
                       @click="showTool(item)">{{item.label}}</el-button>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
const boxTools = [{
  label: '天气实况',
  action: 'realtime',
  icon: 'icon-tqsk'
}, {
  label: '预警提示',
  action: 'riskWarning',
  icon: 'icon-fxyj'
}, {
  label: '短时临近',
  action: 'shortTerm',
  icon: 'icon-ljyb'
}, 
// {
//   label: '山洪显示',
//   action: 'torrentialFlood',
//   icon: 'icon-yjxh'
// }, 
{
  label: '工具箱',
  action: 'toolBox',
  icon: 'icon-fxyj'
}]

// const realtime = [{
//     label: '分钟实况',
//     action: 'minuteReal',
//     icon: 'icon-rain',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/MinuteReal')
//   }, {
//     label: 'CIMISS实况',
//     action: 'cimissReal',
//     icon: 'icon-rain',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/MinuteReal')
//   }, {
//     label: '周边市县实况',
//     action: 'rimCitiesReal',
//     icon: 'icon-rain',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/MinuteReal')
//   }, {
//     label: '降水',
//     title: '降水实况',
//     action: 'realRain',
//     icon: 'icon-rain',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/RealRain')
//   }, {
//     label: '气温',
//     action: 'realTemp',
//     icon: 'icon-tmp',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/RealTemp')
//   }, {
//     label: '风',
//     action: 'realWind',
//     icon: 'icon-wind',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/RealWind')
//   }, {
//     label: '相对湿度',
//     action: 'realRhu',
//     icon: 'icon-humidity',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/RealRhu')
//   }, {
//     label: '能见度',
//     action: 'realVis',
//     icon: 'icon-vis',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/RealVis')
//   }, {
//     label: '气压',
//     action: 'realPrs',
//     icon: 'icon-vis',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/RealPrs')
//   }, {
//     label: '卫星',
//     action: 'starReal',
//     icon: 'icon-star',
//     component: null
//   }, {
//     label: '雷达',
//     action: 'radarReal',
//     icon: 'icon-radar',
//     component: null
//   }, {
//     label: '格点实况',
//     action: 'gridReal',
//     icon: 'icon-grid',
//     component: null
//   }]
const realtime = [{
  label: '宁夏实况',
  action: 'ningxiaReal',
  icon: 'icon-grid',
  width: '500px',
  component: () => import(/* webpackChunkName: "weather" */ '@/components/navMenu/RightMenu.vue')
//   }, {
//     label: '格点实况',
//     action: 'gridReal',
//     icon: 'icon-grid',
//     component: () => import(/* webpackChunkName: "weather" */ '../realWeather/gridReal/index')
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
const shortTerm = [{
  // label: '临近天气预报',
  // action: 'weatherBulletin',
  // icon: 'icon-grid',
  // width: '500px',
  // height: '700px',
  // component: () => import(/* webpackChunkName: "shortTerm" */ '../shortTerm/weatherBulletin/index')
  // },{
  // label: '6h短时预报制作',
  // action: 'forecastProduction',
  // icon: 'icon-grid',
  // width: '500px',
  // height: '700px',
  // component: () => import(/* webpackChunkName: "shortTerm" */ '../shortTerm/forecastProduction/index')
  // },{
  // label: '12h短时预报制作',
  // action: '12hForecastProduction',
  // icon: 'icon-grid',
  // width: '500px',
  // height: '700px',
  // component: () => import(/* webpackChunkName: "shortTerm" */ '../shortTerm/12hForecastProduction/index')
  // },{
  // label: '雷电潜势预报制作',
  // action: 'lightningPotential',
  // icon: 'icon-grid',
  // width: '500px',
  // height: '700px',
  // component: () => import(/* webpackChunkName: "shortTerm" */ '../shortTerm/lightningPotential/index')
  }]


  const riskWarning = [{
  // label: '预警提示查询',
  // action: 'warnMonitor',
  // icon: 'icon-grid',
  // width: '1200px',
  // height: '400px',
  // component: () => import(/* webpackChunkName: "shortTerm" */ '../warnProduct/monitor/index')
  }]



const toolsMap = {
  realtime,
  // shortTerm,
  // riskWarning,
  // torrentialFlood: [{
  //   label: '山洪基础数据',
  //   action: 'torrentialBaseData',
  //   icon: 'icon-rain',
  //   width: '700px',
  //   height: '300px',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/TorrentialBaseData')
  // }, {
  //   label: '中小河流',
  //   action: 'smallRivers',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/SmallRivers')
  // }, {
  //   label: '山洪沟',
  //   action: 'minuteReal3',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // }, {
  //   label: '泥石流沟',
  //   action: 'minuteReal4',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // }, {
  //   label: '滑坡点',
  //   action: 'minuteReal5',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // }, {
  //   label: '风险区划',
  //   action: 'minuteReal6',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // }, {
  //   label: '山洪沟风险区划',
  //   action: 'minuteReal7',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // }, {
  //   label: '中小河流风险区划',
  //   action: 'minuteReal8',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // }, {
  //   label: '阈值数据展示',
  //   action: 'minuteReal9',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // }, {
  //   label: '数据图表查看',
  //   action: 'minuteReal10',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // }, {
  //   label: '乡镇人口经济',
  //   action: 'minuteReal11',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // }], /* 山洪显示 */
  // toolBox: [{
  // //   label: '图片制作',
  // //   action: 'toolkit1',
  // //   icon: 'icon-rain',
  // //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // // }, {
  //   label: '留痕管理',
  //   action: 'toolkit2',
  //   icon: 'icon-rain',
  //   width: '1200px',
  //   height: '400px',
  //   component: () => import(/* webpackChunkName: "torrential" */ '../trace/index')
  // }, 
  // // {
  // //   label: '站点管理',
  // //   action: 'toolkit13',
  // //   icon: 'icon-rain',
  // //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // // }, {
  // //   label: '村镇管理',
  // //   action: 'toolkit14',
  // //   icon: 'icon-rain',
  // //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // // }, {
  // //   label: '温度补正',
  // //   action: 'toolkit15',
  // //   icon: 'icon-rain',
  // //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // // }, 
  // {
  //   label: '落区绘制',
  //   action: 'toolkit16',
  //   icon: 'icon-rain',
  //   component: () => import(/* webpackChunkName: "toolBox" */ '../toolBox/DrawFallingArea')
  // }, 
  // // {
  // //   label: '要素绘制',
  // //   action: 'toolkit17',
  // //   icon: 'icon-rain',
  // //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // // }, {
  // //   label: '绘制和测量',
  // //   action: 'toolkit18',
  // //   icon: 'icon-rain',
  // //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // // }, {
  // //   label: '测量工具',
  // //   action: 'toolkit19',
  // //   icon: 'icon-rain',
  // //   component: () => import(/* webpackChunkName: "torrential" */ '../torrentialFlood/MinuteReal')
  // // }, 
  // {
  //   label: '临时阈值',
  //   action: 'thresholdSetting',
  //   icon: 'icon-rain',
  //   // width: '500px',
  //   height: '400px',
  //   component: () => import(/* webpackChunkName: "toolBox" */ '../toolBox/ThresholdSetting')
  // }, {
  //   label: '默认阈值',
  //   action: 'thresholdModify',
  //   icon: 'icon-rain',
  //   height: '400px',
  //   component: () => import(/* webpackChunkName: "toolBox" */ '../toolBox/ThresholdModify')
  // },{
  //   label: '预警阈值',
  //   action: 'alarmThreshold',
  //   icon: 'icon-rain',
  //   width: '1500px',
  //   height: '850px',
  //   component: () => import(/* webpackChunkName: "toolBox" */ '../toolBox/AlarmThreshold')
  // }
  // ]
}

export default {
  data () {
    return {
      boxTools,
      toolsMap,
      tools: [],
      activedMod: null,
      activedTool: null
    }
  },
  mounted () {
    this.showDefaultTool()
  },
  methods: {
    showBox (mod) {
      console.log('showBox')
      const toolsMap = this.toolsMap
      const type = mod.action
      this.activedTool = null
      this.activedMod = type
      const tools = toolsMap[type]
      this.tools = tools
    },
    showTool (tool) {
      console.log('showTool')
      this.activedTool = tool.action
      this.$emit('showDialog', tool)
    },
    showDefaultTool () {
      console.log('showDefaultTool')
      this.boxTools.length && this.showBox(this.boxTools[0])
      this.tools.length && this.showTool(this.tools[0])
    }
  }
}
</script>
