<!--
 * @Description: 
 * @Author: huyong
 * @Date: 2021-09-17 21:25:08
 * @LastEditTime: 2022-01-06 17:43:45
 * @LastEditors:  
-->
<template>
  <div class="rightMenu">
    <el-card class="box-card" shadow="never">
      <div class="text item">
       <el-collapse v-model="activeNames">
        <el-collapse-item title="站点数据" name="1">
          <el-form :inline="true">
            <el-form-item label="日期：">
              <el-date-picker v-model="curStationDate" type="date" size="mini" placeholder="请选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" 
              :disabled-date="disabledDate" :clearable='false'>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="时：">
              <el-select v-model="curHour" placeholder="请选择时次" size="mini">
                <el-option v-for="(item, i) in hourArr" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-button-group class="el-bt-group">
              <el-button type="primary" size="mini"><el-icon :size="10"><i-arrow-left /></el-icon>前一时次</el-button>
              <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
              <el-button type="primary" @click="clearStationData" size="mini">清除</el-button>
              <el-button type="primary" size="mini">后一时次<el-icon :size="10"><i-arrow-right /></el-icon></el-button>
            </el-button-group>
            <el-form-item label="站点显示：">
              <el-checkbox-group v-model="stationDic" @change="changeStation">
                <el-checkbox v-for="(item, i) in stationArr" :key="i" :label="item.label">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="实况显示：">
              <el-checkbox-group v-model="realDic" @change="changeReal">
                <el-checkbox v-for="(item, i) in realArr" :key="i" :label="item.label">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="小时降水：">
              <el-radio-group v-model="hourRain" @change="changeHourRain">
                <el-radio v-for="(item, i) in hourRainArr" :key="i" :label="item.label">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="等值面：">
              <el-checkbox v-model="checkedStationIso" label="显隐" size="mini" @change="changeStationIso(checkedStationIso)"></el-checkbox>
              <el-button type="primary" @click="addIso" size="mini"> 生成</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="格点数据" name="2">
          <el-form :inline="true">
            <el-form-item label="日期：">
              <el-date-picker v-model="curGridDate" type="date" size="mini" placeholder="请选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" 
              :disabled-date="disabledDate" :clearable='false'>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="要素：">
              <el-select v-model="curElement" placeholder="请选择要素" size="mini">
                <el-option v-for="(item, i) in elementArr" :key="i" :label="item.name" :value="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时效：">
            <div slot="formBtn">
              <el-button-group v-for="(item,index) in btList" :key="index">
                <el-button
                  @click="setIndex(item, index)"
                  class="buttonDiv"
                  :class="{'elBackground':singleIndex == item.value}"
                >{{item.label}}</el-button>
              </el-button-group>
            </div>
            </el-form-item>
            <el-button-group class="el-bt-group">
              <el-button type="primary" size="mini"><el-icon :size="10"><i-arrow-left /></el-icon>前一时次</el-button>
              <el-button type="primary" @click="onSubmitGrid" size="mini">查询</el-button>
              <el-button type="primary" @click="clearGridData" size="mini">清除</el-button>
              <el-button type="primary" size="mini">后一时次<el-icon :size="10"><i-arrow-right /></el-icon></el-button>
            </el-button-group>
            <div slot="legend" v-if="legendToggle" class="legend pos-fixed">
              <li v-for="item in legends" :key="item.label">
                <div :style="{ backgroundColor: item.color}">{{item.label}}</div>
                <!-- <div class="label">{{item.label}}</div> -->
              </li>
            </div>
            <el-form-item label="等值面：">
              <el-checkbox v-model="checkedGridIso" label="显隐" size="mini" @change="changeGridIso(checkedGridIso)"></el-checkbox>
              <el-button type="primary" @click="addGridIso" size="mini"> 生成</el-button>
            </el-form-item>
            <!-- <el-form-item label="站点显示：">
              <el-checkbox-group v-model="stationDic" @change="changeStation">
                <el-checkbox v-for="(item, i) in stationArr" :key="i" :label="item.label">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="实况显示：">
              <el-checkbox-group v-model="realDic" @change="changeReal">
                <el-checkbox v-for="(item, i) in realArr" :key="i" :label="item.label">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="小时降水：">
              <el-radio-group v-model="hourRain" @change="changeHourRain">
                <el-radio v-for="(item, i) in hourRainArr" :key="i" :label="item.label">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </el-form>
        </el-collapse-item>
      </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, toRaw, shallowRef, markRaw, onMounted, watch } from "vue";
import { createDate, createHourArr, stationArr, realArr, hourRainArr, elementArr, gridType, weatherLegendsConfig, getBtList } from "./localData.js";
import http from '@/api/http'
import { get } from 'axios'
import { getMap, getMapAll } from "@/components/ol/comMap.js";
import { ElMessage } from 'element-plus'
import ol from '@/ol/'
export default defineComponent({
  name: "rightMenu",
  setup() {
    let map = ref(null)
    let station = ref(null)
    let grid = ref(null)
    let mapAll = ref(null)
    const elForm = reactive({
      activeNames: ['1'],
      hourArr: createHourArr(),
      curHour: new Date().getHours(),
      curStationDate: createDate(),
      curGridDate: createDate(),
      stationDic: ['gjz', 'station', 'stationName', 'warningIcon'],
      realDic: ['rain', 'tem', 'avgWind', 'wepNow'],
      hourRain: 'pre1',
      curElement: 'TMP',
      legends: '',
      legendToggle: false,
      btList: getBtList(),
      singleIndex: -1,
      checkedStationIso: true,
      checkedGridIso: true,
    })
    const defaultOptions = {
      stationType: 'gjz',
      station: true,
      stationName: 'stationName',
      warningIcon: 'warningIcon',
      rain: 'pre1',
      tem: 'tem',
      avgWind: 'avgWind',
      vis: '',
      wepNow: 'wepNow',
      rhu: '',
      gst: '',
      extremeWind: '',
      snowDepth: ''
    }
    // watch([elForm.checkedStationIso, elForm.checkedGridIso], (newVal, oldVal) => {

    // })
    const handlerMethods = reactive({
      changeStationIso(val){
        station.changeStationIso(val)
      },
      changeGridIso(val){
        grid.changeGridIso(val)
      },
      addGridIso(){
        grid.addGridIso()
        // const url = 'nc/getNcData'
        // http.get(url).then(res=>{
        //   // console.log('res', res)
        //   if(res!=null){
        //     grid.addGridIso(res)
        //   }else{
        //     ElMessage({
        //       message: '请求出错啦！',
        //       type: 'error',
        //     })
        //   }
        // })
      },
      addIso(){
        station.drawIsoByKc()
        // station.drawStationIsosurface()
      },
      disabledDate(time) {
        return time.getTime() > Date.now()
      },
      getLegendArr: (type, weatherLegends) => {
        let legend;
        if (
          type.TMP === elForm.curElement ||
          type.TMAX === elForm.curElement ||
          type.TMIN === elForm.curElement
        ) {
          legend = weatherLegends.temperatureCor;
        } else if (type.ER03 === elForm.curElement) {
          legend = weatherLegends.rainCor;
        } else if (type.EDA10 === elForm.curElement) {
          legend = weatherLegends.windCor;
        } else if (type.ERH === elForm.curElement) {
          legend = weatherLegends.humidityCor;
        } else if (type.VIS03 === elForm.curElement) {
          legend = weatherLegends.VIS03Cor;
        } else if (type.ECT === elForm.curElement) {
          legend = weatherLegends.ECTCor;
        }
        return legend;
      },
      getLegendColor: (legend) => {
        let legends = [];
        for (let i = 0; i < legend.length; i++) {
          legends.push({
            label: legend[i].text,
            color:
              "rgba(" +
              legend[i].r +
              ", " +
              legend[i].g +
              ", " +
              legend[i].b +
              ", 0.5)"
          });
        }
        return legends;
      },
      setIndex: (item, index) => {
        elForm.singleIndex = item.value
      },
      clearData: () => {
        station.clearStationData()
        grid.clearGridData()
      },
      clearStationData: () => {
        station.clearStationData()
      },
      clearGridData: () => {
        grid.clearGridData()
        elForm.legendToggle = false
        elForm.singleIndex = -1
        grid.clearGridWindData()
      },
      onSubmit: () => {
        get('/public/api/json/2021120812.json').then(res=>{
          const data = res.data.filter(item => item.stationType==='gjz')
          // const data = res.data.filter(item => item.stationType==='qyz')
          station.addStationData(data, defaultOptions)
        })
      },
      onSubmitGrid: () => {
        const url = 'grid5x5/getGrid5x5'
        const date = elForm.curGridDate.toString().split('-').join('')
        if(elForm.singleIndex===-1){
          ElMessage({message: '请点击选择时效！', type: 'warning'})
          return
        }
        const params = {
          dateTime: date,
          fileName: date,
          statistic: 0,
          suffix: elForm.singleIndex,
          type: elForm.curElement
        }
        http.get(url,params).then(res=>{
          if(res.code === 200 && res.data.errorInfo === null){
            const data = res.data
            // console.log('data', data)
            const legends = handlerMethods.getLegendArr(gridType, weatherLegendsConfig)
            elForm.legends = handlerMethods.getLegendColor(legends)
            elForm.legendToggle = true
            grid.addGridData(data, legends, params.type)
          }else{
            ElMessage({
              message: '获取数据失败！缺失文件：'+res.data.errorInfo,
              type: 'error',
            })
          }
        })
      },
      changeStation: (val) => {
        const opt = {
          stationType: val.find(x => x==='gjz') ? val.find(x => x==='qyz') ? 'all' : 'gjz': val.find(x => x==='qyz') ?  val.find(x => x==='gjz') ? 'all' : 'qyz':'',
          station: val.find(x => x==='station') !== undefined,
          stationName: val.find(x => x==='stationName'),
          warningIcon: val.find(x => x==='warningIcon'),
        }
        Object.assign(defaultOptions, opt)
        station.changeStationData(defaultOptions)
      },
      changeReal: (val) => {
        const opt = {
          rain: val.find(x => x==='rain') ? 'pre1' : '',
          tem: val.find(x => x==='tem'),
          avgWind: val.find(x => x==='avgWind'),
          vis: val.find(x => x==='vis'),
          wepNow: val.find(x => x==='wepNow'),
          rhu: val.find(x => x==='rhu'),
          gst: val.find(x => x==='gst'),
          extremeWind: val.find(x => x==='extremeWind'),
          snowDepth: val.find(x => x==='snowDepth'),
        }
        Object.assign(defaultOptions, opt)
        station.changeStationData(defaultOptions)
      },
      changeHourRain: (val) => {
        const opt = {
          hourRain: val
        }
        Object.assign(defaultOptions, opt)
        station.changeStationData(defaultOptions)
      }
    })
    onMounted(()=>{
      map = getMap()
      mapAll = getMapAll()
      station = new ol.station(map)
      grid = new ol.grid(map)
      // console.log('mapAll', mapAll)
    })
    return {
      ...toRefs(elForm),
      stationArr,
      realArr,
      hourRainArr,
      elementArr,
      ...toRefs(handlerMethods)
    };
  },
})
</script>

<style scoped>
.rightMenu{
    position: relative;
    top: 15px;
    right: -10px;
    display: block;
    width: auto;
    height: auto;
}
:deep() .el-card__header{
  border-bottom: 0px solid #EBEEF5;
}
.text {
    font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.box-card {
  width: 500px;
}
/* :deep().el-form-item--small .el-form-item__content{
  width: 150px;
} */
:deep().el-input--mini .el-input__inner{
  width: 124px;
}
.el-bt-group{
  margin-left: 50px;
}
.el-checkbox{
  margin-right: 10px;
}
.el-radio{
  margin-right: 10px;
}
.el-form-item__content .el-radio-group {
  padding-top: 0
}
/*鼠标点击后移开，恢复本身样式*/
.buttonDiv,
.buttonDiv:focus:not(.buttonDiv:hover) {
  margin-right: 15px;
  border: 1px solid #2794f8;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 #f4f4f4;
  /* color: #2794f8;
  background: white; */
}
/*鼠标按下，没有抬起*/
.buttonDiv:active {
  background: #2794f8;
  color: white;
}
.elBackground {
  background-color: #409eff;
  color: white;
}
</style>