/*
 * @Description: 
 * @Author: huyong
 * @Date: 2021-12-31 14:43:18
 * @LastEditTime: 2022-01-06 17:41:39
 * @LastEditors:  
 */
import { getMapAll, hightStyle, polygonStyleFunction, hightTipStyle, getWindyDetail, gridIsoStyle } from "@/components/ol/comMap.js"
import { WindLayer } from "ol-wind"
import Geocoder from "../../plugin/geocoder.hw";
import http from '@/api/http'
import { ElMessage } from 'element-plus'
export class grid {
    // 构造函数
    constructor(map){
        // super()
        this.map = map
        this.olMap = getMapAll()
    }
    data = {
        gridVector: null,    // 格点数据图层
        gridSource: null,    // 格点数据source
        windLayer: null,    // 风场图层
        allgrid: {},  // 临时存放风场格点数据
        gridOverlay: null,  // 格点弹窗覆盖物
        windClick: null,    // 格点风场点击事件
        gridPointerMove: null,   // 鼠标移入格点事件
        featureOverlay: null,    // 高亮图层
        hightdDraw: null,   // 鼠标移入格点高亮显示数据的交互
        gridIsoTemp: {},  // 生成格点等值面的临时数据 
        vectorIsoLayer: null,   // 等值面图层
    }
    // 加载格点数据
    addGridData(data, legends, type){
        const { VectorSource, VectorLayer, Feature, Polygon, Draw, popup } = this.olMap
        // 初始化格点风场弹窗覆盖物
        this.initPopup(popup)
        this.clearGridData()
        // debugger
        // console.log('data', data)
        let features = []
        const datasets = data.datasets  // 数据集
        let longitudeStart = data.longitudeStart  // 开始经度
        const longitudeEnd = data.longitudeEnd  // 结束经度
        let latitudeStart = data.latitudeStart  // 开始纬度
        const latitudeEnd = data.latitudeEnd  // 结束纬度
        const latitudeSpan = data.latitudeSpan  // 纬向分辨率
        const longitudeSpan = data.longitudeSpan  // 经向分辨率
        const span = data.latitudeSpan/2   //  分辨率
        const lonNum = data.longitudeNum    // 经向列数
        const latNum = data.latitudeNum     // 纬向行数
        const dStartLon = data.longitudeStart
        this.data.gridIsoTemp.value = datasets
        this.data.gridIsoTemp.lng = []
        this.data.gridIsoTemp.lat = []

        for(let i=0; i<latNum; i++){
            for(let j=0; j<lonNum; j++){
                if(i===0&&j>0){
                    longitudeStart=longitudeStart+longitudeSpan
                }else if(i>0&&j===0){
                    longitudeStart = dStartLon
                    latitudeStart=latitudeStart+latitudeSpan
                }else if(i>0&&j>0){
                    longitudeStart=longitudeStart+longitudeSpan
                }
                !this.data.gridIsoTemp.lng.includes(longitudeStart) && this.data.gridIsoTemp.lng.push(longitudeStart)
                !this.data.gridIsoTemp.lat.includes(latitudeStart) && this.data.gridIsoTemp.lat.push(latitudeStart)
                features.push(new Feature({
                    geometry: new Polygon([[[longitudeStart-span, latitudeStart+span],[longitudeStart+span, latitudeStart+span],[longitudeStart+span, latitudeStart-span]
                        ,[longitudeStart-span, latitudeStart-span],[longitudeStart-span, latitudeStart+span]]]),
                    attributes: {
                        value: datasets[i][j],
                    }
                }))
            }
        }
        // 设置鼠标移入高亮图层
        this.data.featureOverlay = new VectorLayer({
            source: new VectorSource(),
            style: hightStyle
        })
        this.map.addLayer(this.data.featureOverlay)
        // 设置高亮要素变量
        let highlight, highlightVal

        // 格点数据特征源
        this.data.gridSource = new VectorSource({
            features: features
        });
        // 格点数据矢量图层
        this.data.gridVector = new VectorLayer({
            source: this.data.gridSource,
            style: function(feature){
                return polygonStyleFunction(feature, legends)
            }
        })
        this.map.addLayer(this.data.gridVector)
        function hightStyleFunction(value){
            highlightVal=value.toString()
            return hightTipStyle(highlightVal)
        }
        // 鼠标移入格点事件
        this.data.gridPointerMove = type !== 'EDA10' ? this.map.on('pointermove', (e) => {
        const feature = this.map.getFeaturesAtPixel(e.pixel)[0]
        if(this.map.hasFeatureAtPixel(e.pixel) && feature.getGeometry() instanceof Polygon){
            // debugger
            // console.log('feature', feature)
            highlightVal = feature.get('attributes').value
            if(feature!==highlight){
                if(highlight){
                    this.data.featureOverlay.getSource().removeFeature(highlight)
                }
                this.data.featureOverlay.getSource().addFeature(feature)
                this.data.hightdDraw && this.map.removeInteraction(this.data.hightdDraw)
                this.data.hightdDraw = new Draw({
                    source: this.data.featureOverlay.getSource(),
                    type: "Point",
                    style: function (feature) {
                        return hightStyleFunction(highlightVal);
                    },
                })
                this.map.addInteraction(this.data.hightdDraw)
                // const featureStyle = hightStyle(feature.get('attributes').value)
                highlight = feature
            }
        }else{
            highlight && this.data.featureOverlay.getSource().removeFeature(highlight)
            highlight = null
            highlightVal = ''
        }
        }):null
        type === 'EDA10' && this.addWind(data, legends, popup)
    }
    // 清除格点数据
    clearGridData(){
        this.data.hightdDraw && this.map.removeInteraction(this.data.hightdDraw)
        this.data.gridPointerMove && this.map.un(this.data.gridPointerMove.type, this.data.gridPointerMove.listener)
        this.data.gridSource && this.data.gridSource.clear()
        this.data.gridVector && this.map.removeLayer(this.data.gridVector)
        this.data.featureOverlay && this.map.removeLayer(this.data.featureOverlay)
        this.clearGridWindData()
    }
    // 加载风场数据数据
    addWind(data, legendArr, popup){
        this.changeWindData(data)
        // debugger
        // console.log('data', data)
        const datasets = []
        const uWind = {
            header: {
                dx: data.latitudeSpan,
                dy: data.longitudeSpan,
                la1: data.latitudeStart,
                la2: data.latitudeEnd,
                lo1: data.longitudeStart,
                lo2: data.longitudeEnd,
                numberPoints: data.longitudeNum*data.latitudeNum,
                ny: data.latitudeNum,
                nx: data.longitudeNum,
                parameterCategory: 2,
                parameterNumber: 2,
                parameterUnit: "m.s-1",
                parameterNumberName: 'eastward_wind',
            },
            data:data.windSpeed.flat(),
        }
        const vWind = {
            header: {
                dx: data.latitudeSpan,
                dy: data.longitudeSpan,
                la1: data.latitudeStart,
                la2: data.latitudeEnd,
                lo1: data.longitudeStart,
                lo2: data.longitudeEnd,
                numberPoints: data.longitudeNum*data.latitudeNum,
                ny: data.latitudeNum,
                nx: data.longitudeNum,
                parameterCategory: 2,
                parameterNumber: 3,
                parameterUnit: "m.s-1",
                parameterNumberName: 'eastward_wind',
            },
            data:data.windDir.flat(),
        }
        datasets.push(uWind)
        datasets.push(vWind)
        this.analysisWindyData(datasets)
        // get('/public/api/json/wind.f008.json').then(res=>{
        //   const data = res.data
        this.data.windLayer = new WindLayer(datasets, {
            forceRender: false,
            windOptions: {
                // globalAlpha: 0.6,
                // colorScale: scale,
                velocityScale: 1 / 70,
                paths: 5000,
                // paths: (m) => {
                //   if(m>0&&m<=0.9){
                //     return 1500
                //   }else if(m>1&&m<=1.9){
                //     return 2000
                //   }else if(m>2&&m<=3.9){
                //     return 2500
                //   }else if(m>4&&m<=5.9){
                //     return 3000
                //   }else if(m>6&&m<=7.9){
                //     return 3500
                //   }else if(m>8&&m<=9.9){
                //     return 4000
                //   }else if(m>10&&m<=11.9){
                //     return 4500
                //   }else if(m>=12){
                //     return 5000
                //   }
                // },
                maxAge: 80,
                // eslint-disable-next-line no-unused-vars
                // colorScale: [
                //   'rgb(82,71,141)',
                //   'rgb(85,78,177)',
                //   'rgb(80,87,184)',
                //   'rgb(67,105,196)',
                //   'rgb(64,160,180)',
                //   'rgb(78,193,103)',
                //   'rgb(104,209,79)',
                //   'rgb(157,221,68)',
                // ],
                colorScale: (value) => {
                    let val
                    for(let i=0; i<legendArr.length-1; i++){
                        const min = legendArr[i].value
                        const max = legendArr[i+1].value
                        if(value >= min && value < max){
                            val =  legendArr[i].r+','+legendArr[i].g+','+legendArr[i].b+',0.5'
                            break
                        }else if(value>=legendArr[legendArr.length-1].value){
                            val =  legendArr[legendArr.length-1].r+','+legendArr[legendArr.length-1].g+','+legendArr[legendArr.length-1].b+',0.5'
                            break
                        }
                    }
                    return 'rgba('+val+')'
                    // console.log(m);
                },
                lineWidth: (m) => {
                    if(m>0&&m<=0.9){
                        return 1
                    }else if(m>1&&m<=1.9){
                        return 1.5
                    }else if(m>2&&m<=3.9){
                        return 2
                    }else if(m>4&&m<=5.9){
                        return 2.5
                    }else if(m>6&&m<=7.9){
                        return 3
                    }else if(m>8&&m<=9.9){
                        return 3.5
                    }else if(m>10&&m<=11.9){
                        return 4
                    }else if(m>=12){
                        return 4.5
                    }
                },
                // colorScale: scale,
                generateParticleOption: false,
            },
            // map: map,
            // projection: 'EPSG:4326'
        });
        // console.log(map, this.data.windLayer);
        // })
        this.map.addLayer(this.data.windLayer);
        this.data.windClick = this.map.on('singleclick', (e) => {
            var details = getWindyDetail(e.coordinate, this.data.allgrid);
            // console.log(details);
            if(details){
                const content = popup.childNodes[1]
                content.innerHTML = '<span>风向:' + details.direction + '\n 风级:' + details.level + '\n 风速:' + details.speed + '</span>'
                this.data.gridOverlay.setPosition(e.coordinate) // 设置弹窗位置
            }else{
                this.closeOverly()
            }
            // alert(' 风向:' + details.direction + '\n 风级:' + details.level + '\n 风速:' + details.speed);
        });
    }
    // 初始化格点风场弹窗覆盖物
    initPopup(popup){
        const { Overlay, popupCloser } = this.olMap
        // 创建格点弹窗覆盖物
        this.data.gridOverlay = new Overlay({
            element: popup,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },  
        })
        // 添加覆盖物到地图
        this.map.addOverlay(this.data.gridOverlay)
        popupCloser.value.onclick = () => {
            this.closeOverly()
            popupCloser.value.blur()
            return false
        }
    }
    // 隐藏格点风场弹窗覆盖物
    closeOverly(){
        this.data.gridOverlay && this.data.gridOverlay.setPosition(undefined)
    }
    // 清除格点风场数据
    clearGridWindData(){
        this.closeOverly()
        this.data.windClick && this.map.un(this.data.windClick.type, this.data.windClick.listener)
        this.data.windLayer && this.map.removeLayer(this.data.windLayer)
    }
    // 重新编制风场数据，反转纬度
    changeWindData(data){
        // debugger
        const defaultUData = []
        const defaultVData = []
        const udatasets = data.windSpeed  // u wind
        const vdatasets = data.windDir    // v wind

        for(let i=0; i<udatasets.length; i++){
            defaultUData.unshift(udatasets[i])
            defaultVData.unshift(vdatasets[i])
        }
        data.windSpeed = defaultUData
        data.windDir = defaultVData
        // console.log('defaultUData', defaultUData)
        // console.log('defaultVData', defaultVData)
    }
    // 临时存放风场格点数据
    analysisWindyData(windydata){
        var p = 0;
        var data = []
        var east, north;
        if (windydata[0].header.parameterNumberName == "eastward_wind") {
            east = windydata[0];
            north = windydata[1];
        } else {
            east = windydata[1];
            north = windydata[0];
        }
        for (var j = 0; j < north.header.ny; j++) {
            var row = [];
            for (var i = 0; i < north.header.nx; i++, p++) {
                row[i] = [east.data[p], north.data[p]];
            }
            data[j] = row;
        }
        this.data.allgrid.data = data
        this.data.allgrid.header = windydata[0].header
        // console.log('this.data.allgrid', this.data.allgrid)
    }
    // 加载格点等值面测试
    addGridIso(){
        if(!this.data.gridIsoTemp.lng.length>0){
            ElMessage({
                message: '请先加载相应格点数据，再渲染等值面！',
                type: 'warning',
            })
        }
        const url = 'grid5x5/getGrid5x5Iso'
        const params = {
            lng: this.data.gridIsoTemp.lng,
            lat: this.data.gridIsoTemp.lat,
            value: this.data.gridIsoTemp.value,
        }
        http.post(url, params).then(res=>{
            if(res.code === 200 && res.data != null){
                console.log('res', res)
                this.renderGridIso(JSON.parse(res.data))
            }else{
                ElMessage({
                    message: '获取数据失败！',
                    type: 'error',
                })
            }
        })
    }
    // 获取到后台生成的等值面geojson，然后进行渲染
    renderGridIso(data){
        const { VectorSource, VectorLayer, GeoJSON } = this.olMap
        //解码方法
        const json = Geocoder.decode(data)
        // console.log('json', json)
        const format=new GeoJSON()
        const vectorSource = new VectorSource({
            features: format.readFeatures(json)
        })
        this.data.vectorIsoLayer = new VectorLayer({
            source: vectorSource,
            style: function(feature){
                return gridIsoStyle(feature)
            },
        })
        this.map.addLayer(this.data.vectorIsoLayer)
    }
    // 控制等值面显隐
    changeGridIso(val){
        this.data.vectorIsoLayer && this.data.vectorIsoLayer.setVisible(val)
    }
}