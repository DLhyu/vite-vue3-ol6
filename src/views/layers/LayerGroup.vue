<!--
 * @Description: 图层组
 * @Author: huyong
 * @Date: 2021-11-03 11:16:17
 * @LastEditTime: 2022-04-19 14:36:34
 * @LastEditors:  
-->
<template>
    <div class="layerGroup">
        <el-container>
        <el-card class="box-card" shadow="never" :body-style="{ padding: '10px' }">
            <template #header>
            <div class="card-header">
                <span>{{name}}</span>
                <el-button class="button" type="text" @click="addData">加载数据</el-button>
                <el-button class="button" type="text" @click="clearData">清除数据</el-button>
            </div>
            </template>
            <el-scrollbar height="350px">
            <div>
                <el-collapse>
                    <el-collapse-item title="ningxia_country" name="1">
                        <div>
                        <el-checkbox v-model="checked1" :label=label size="small"></el-checkbox>
                        <div>
                        <span>{{opacity}}</span>
                        <el-slider class="slider_opacity" v-model="value1" :min="0" :max="1" :step="0.01" input-size="mini" @input="inputVal(value1,1)"></el-slider>
                        </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="coupl4326" name="2">
                        <div>
                        <el-checkbox v-model="checked2" :label=label size="small"></el-checkbox>
                        <div>
                        <span>{{opacity}}</span>
                        <el-slider class="slider_opacity" v-model="value2" :min="0" :max="1" :step="0.01" input-size="mini" @input="inputVal(value2,2)"></el-slider>
                        </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="coupl4490" name="4">
                        <div>
                        <el-checkbox v-model="checked4" :label=label size="small"></el-checkbox>
                        <div>
                        <span>{{opacity}}</span>
                        <el-slider class="slider_opacity" v-model="value4" :min="0" :max="1" :step="0.01" input-size="mini" @input="inputVal(value4,4)"></el-slider>
                        </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="test_sql" name="3">
                        <div>
                        <el-checkbox v-model="checked3" :label=label size="small"></el-checkbox>
                        <div>
                        <span>{{opacity}}</span>
                        <el-slider class="slider_opacity" v-model="value3" :min="0" :max="1" :step="0.01" input-size="mini" @input="inputVal(value3,3)"></el-slider>
                        </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="xyzLayer" name="5">
                        <div>
                        <el-checkbox v-model="checked5" :label=label size="small"></el-checkbox>
                        <div>
                        <span>{{opacity}}</span>
                        <el-slider class="slider_opacity" v-model="value5" :min="0" :max="1" :step="0.01" input-size="mini" @input="inputVal(value5,5)"></el-slider>
                        </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="query_intersects" name="6">
                        <div>
                        <el-checkbox v-model="checked6" :label=label size="small"></el-checkbox>
                        <div>
                        <span>{{opacity}}</span>
                        <el-slider class="slider_opacity" v-model="value6" :min="0" :max="1" :step="0.01" input-size="mini" @input="inputVal(value6,6)"></el-slider>
                        </div>
                        </div>
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="x:">
                                <el-input v-model="x" placeholder="请输入经度"></el-input>
                            </el-form-item>
                            <el-form-item label="y:">
                                <el-input v-model="y" placeholder="请输入纬度"></el-input>
                            </el-form-item>
                            <el-form-item label="radiu:">
                                <el-input v-model="radiu" placeholder="请输入半径"></el-input>
                            </el-form-item>
                            <el-form-item>
                            <el-button type="primary" @click="onSubmit">Query</el-button>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="test_short_path" name="7">
                        <div>
                        <el-checkbox v-model="checked7" :label=label size="small"></el-checkbox>
                        <div>
                        <span>{{opacity}}</span>
                        <el-slider class="slider_opacity" v-model="value7" :min="0" :max="1" :step="0.01" input-size="mini" @input="inputVal(value7,7)"></el-slider>
                        </div>
                        </div>
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="起点:">
                                <el-select v-model="start" placeholder="请选择">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                            <el-form-item label="终点:">
                                <el-select v-model="end" placeholder="请选择">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-button type="primary" @click="addShortPathByGS">Query</el-button>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
            </div>
            </el-scrollbar>
        </el-card>
        </el-container>
    </div>
</template>

<script>
import { defineComponent, ref, isRef, reactive, toRefs, nextTick, getCurrentInstance, watch, onMounted } from "vue";
import { Group as LayerGroup, Tile as TileLayer, Image, Vector as VectorLayer } from 'ol/layer'
import { ImageWMS, WMTS, XYZ } from 'ol/source'
import * as proj from 'ol/proj'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import TileGrid from 'ol/tilegrid/TileGrid'
import * as extent from 'ol/extent'
import VectorSource from 'ol/source/Vector'
import { GeoJSON, WFS } from 'ol/format'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'
import { Stroke, Style } from 'ol/style'
import mixins from '@/mixins'
import { getMap, getView } from "@/components/ol/comMap.js";
import ol from '@/ol/'
import { LineString } from "ol/geom";

export default defineComponent({
    name: 'layerGroup',
    mixins: [mixins.olMixin],
    props: { name: { type: String, default: '图层组' } },
    mounted() {
        nextTick(() =>{
            // const self = this
            // console.log('self', self)
        })
    },
    setup(props){
        const { proxy, ctx } = getCurrentInstance()
        const _this = proxy // 没有用 ctx 因为 vue3 项目打包后 ctx 会失效
        let map = ref(null)
        let pArrowAnimate = ref(null)
        // console.log('map', getMap())
        // console.log('_this', _this)
        let layerGroup = ref(null) // 存放图层组实例
        let features = ref(null)
        let shortPathFeatures = ref(null)    // 存放最短路径的geo
        const projectionXYZ = proj.get("EPSG:4326")
        const projectionExtent = projectionXYZ.getExtent();      // 投影坐标系的范围
        const resolutionsArr4326 = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125, 0.000021457672119140625, 0.000010728836059570312, 0.000005364418029785156, 0.000002682209014892578, 0.000001341104507446289, 6.705522537231445e-7, 3.3527612686157227e-7,0.0000001676380634,0.0000000838190317,0.0000000419095159];
        const resolutionsArr4490 = ['0.143984375', '0.0719921875', '0.03599609375', '0.017998046875', '0.0089990234375', '0.00449951171875', '0.002249755859375', '0.0011248779296875', '0.0005624389648437', '0.0002812194824219', '0.0001406097412109', '0.0000703048706055', '0.0000351524353027']
        const matrixIds24326 = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9']
        const matrixIds24490 = ['EPSG:4490:0', 'EPSG:4490:1', 'EPSG:4490:2', 'EPSG:4490:3', 'EPSG:4490:4', 'EPSG:4490:5', 'EPSG:4490:6', 'EPSG:4490:7', 'EPSG:4490:8', 'EPSG:4490:9']

        // 界面属性声明
        const checked1 = ref(true)
        const checked2 = ref(true)
        const checked3 = ref(true)
        const checked4 = ref(false)
        const checked5 = ref(false)
        const checked6 = ref(true)
        const checked7 = ref(true)
        const value1 = ref(1)
        const value2 = ref(0.7)
        const value3 = ref(1)
        const value4 = ref(0.7)
        const value5 = ref(1)
        const value6 = ref(1)
        const value7 = ref(1)

        let layer1 = ref(null)
        let layer2 = ref(null)
        let layer3 = ref(null)
        let layer4 = ref(null)
        let layer5 = ref(null)
        let layer6 = ref(null)
        let layer7 = ref(null)

        // 用reactive声明对象
        const point = reactive({ x: 106.26667, y: 37.06667 })
        const start = ref('changsha')
        const end = ref('beijing')
        const options = reactive([{
            value: 'changsha',
            label: '长沙市'
        },{
            value: 'beijing',
            label: '北京市'
        },{
            value: 'changde',
            label: '常德市'
        },{
            value: 'shaodong',
            label: '邵东市'
        }])

        const onSubmit = () => {
            getFeature()
        }

        const radiu = ref(2500)

        const formatTooltip = (val) => {
            return val / 100
        }

        const inputVal = (val, ids) => {
            // console.log('val', val,ids)
            switch(ids){
                case 1:
                    layer1.setOpacity(val)
                    break;
                case 2:
                    layer2.setOpacity(val)
                    break;
                case 3:
                    layer3.setOpacity(val)
                    break;
                case 4:
                    layer4.setOpacity(val)
                    break;
                case 5:
                    layer5.setOpacity(val)
                    break;
                case 6:
                    layer6.setOpacity(val)
                    break;
                case 7:
                    layer7.setOpacity(val)
                    break;
            }
        }

        // 测试最短路径——Image方式加载数据
        let shortPathLayer = new Image()
        const queryShortPath = () => {
            const geom = {
                changsha: [113.084424, 28.253983],
                beijing: [116.411236, 39.912503],
                changde: [112.941737, 29.039925],
                shaodong: [111.747018, 27.266693]
            }
            // var startCoord = [117.34211730957, 49.6271781921387]
            // var destCoord = [127.216133117676, 45.7485237121582]
            const startCoord = geom[start.value], destCoord = geom[end.value]
            var params = {
                LAYERS: 'test:short_path',
                FORMAT: 'image/png',
            };
            var viewparams = [
                'x1:' + startCoord[0], 'y1:' + startCoord[1],
                'x2:' + destCoord[0], 'y2:' + destCoord[1]
                // 'x1:' + 113.084424, 'y1:' + 28.253983,      // 长沙市
                // 'x2:' + 116.411236, 'y2:' + 39.912503,       // 北京市
                // 'x2:' + 111.747018, 'y2:' + 27.266693,      // 邵东市
                // 'x2:' + 112.941737, 'y2:' + 29.039925,      // 常德市
            ];
            // console.log(viewparams);   
            params.viewparams = viewparams.join(';');
            shortPathLayer.setSource(new ImageWMS(
                {
                    url: 'http://localhost:8086/geoserver/test/wms',
                    params: params
                })
            )
            console.info('shortPathLayer',shortPathLayer.getSource());
        }
        // 测试最短路径——geojson方式加载数据
        const shortPathVS = new VectorSource(); // 声明特征数据源
        const shortPathV = new VectorLayer({    // 声明矢量图层
            source: shortPathVS,
            style: new Style({  // 设置样式
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 4,
                }),
            }),
        });

        const addShortPathByGS = () => {
            // 获取查询参数
            const geom = {
                changsha: [113.084424, 28.253983], // 长沙市
                beijing: [116.411236, 39.912503],  // 北京市
                changde: [112.941737, 29.039925],  // 常德市
                shaodong: [111.747018, 27.266693]  // 邵东市
            }
            const startCoord = geom[start.value], destCoord = geom[end.value]
            let viewparams = [
                'x1:' + startCoord[0], 'y1:' + startCoord[1],
                'x2:' + destCoord[0], 'y2:' + destCoord[1]
            ];
            // 生成GetFeature请求
            const featureRequest = new WFS().writeGetFeature({
                srsName: 'EPSG:4326',
                featureNS: 'http://test',
                featurePrefix: 'test',
                featureTypes: ['short_path'],
                outputFormat: 'application/json',
                viewParams: viewparams.join(';')
            })
            // 然后发布请求并将收到的特征添加到图层
            fetch('http://localhost:8086/geoserver/test/ows?service=WFS', {
                method: 'POST',
                body: new XMLSerializer().serializeToString(featureRequest),
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                // 4326转3857
                // let line = new LineString(json.features[0].geometry.coordinates).transform('EPSG:4326','EPSG:3857');
                // json.features[0].geometry.coordinates = line.getCoordinates()
                shortPathFeatures = new GeoJSON().readFeatures(json);
                // console.log('features', shortPathFeatures)
                const street = shortPathFeatures[0]
                const closestPoint = street.getGeometry().getClosestPoint(startCoord)
                const firstPoint = street.getGeometry().getFirstCoordinate()
                if(Math.abs(closestPoint[0]-firstPoint[0])>0.1&&Math.abs(closestPoint[1]-firstPoint[1])>0.1){
                    // console.log('coordinates', street.getGeometry().getCoordinates())
                    const geoArr = street.getGeometry().getCoordinates()
                    street.getGeometry().setCoordinates(geoArr.reverse())
                }
                shortPathVS.clear()
                shortPathVS.addFeature(street);
                map.getView().fit(shortPathVS.getExtent());
                const TileLayer2 = map.getLayers().array_[0].getLayers().array_[1]
                // console.log('alllayers', map.getLayers().array_[0].getLayers().array_[1])
                pArrowAnimate.addGeometroy(TileLayer2, street)
            });
        }

        const addData = () => {
            // console.log('_this', _this)
            if(!isRef(map)){
                // const initStation = _this.olObj.station
                // const olMap = _this.olObj.station.olMap
                // initStation({olMap:olMap})
                // map = _this.olObj.map
                // map = getMap()
                map.addLayer(layerGroup)
                getGroupLayer()
                // map.addLayer(result);
            }
        }

        const clearData = () => {
            // console.log('isRef', isRef(map))
            if(layerGroup&&!isRef(map)){
                map.removeLayer(layerGroup)
                map = ref(null)
            }
        }

        // wms图层
        let wmsLayer = new Image({
            source: new ImageWMS({
            ratio: 1,
            url: 'http://localhost:8086/geoserver/test/wms',
            // crossOrigin: 'anonymous',           //跨域声明
            params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',  
                    'tiled': true,
                    "LAYERS": 'test:ningxia_country',
                    "exceptions": 'application/vnd.ogc.se_inimage',
                }
            })
        });

        // wmts图层 srs4326
        let wmtsLayer4326 = new TileLayer({
            opacity: 0.7,
            source: new WMTS({
                url: 'http://localhost:8086/geoserver/gwc/service/wmts',
                layer: 'test:coupl',
                format: 'image/png',
                matrixSet: 'EPSG:4326',
                projection: projectionXYZ,
                tileGrid : new WMTSTileGrid({
                    origin: extent.getTopLeft(projectionExtent),  // WMTS Origin在左上角，origin位置不能变
                    resolutions: resolutionsArr4326,
                    matrixIds: matrixIds24326,
                    extent: [104.15,35.10,107.80,39.50],
                }),
                style: '',
                wrapX: true
            })
        });

        // wmts图层 srs4490
        let wmtsLayer4490 = new TileLayer({
            opacity: 0.7,
            visible: false,
            source: new WMTS({
                url: 'http://localhost:8086/geoserver/gwc/service/wmts',
                layer: 'test:coupl',
                format: 'image/png',
                matrixSet: 'EPSG:4490',
                projection: proj.get("EPSG:4490"),
                tileGrid : new WMTSTileGrid({
                    origin: [104.15, 39.50],  // WMTS Origin在左上角，origin位置不能变
                    resolutions: resolutionsArr4490,
                    matrixIds: matrixIds24490,
                    extent: [104.15,35.10,107.80,39.50],
                }),
                style: '',
                wrapX: true
            })
        });

        // 加载wfs 使用viewparams参数的sql查询和cql查询
        const test_sql = 'http://localhost:8086/geoserver/test/ows?service=WFS&' +
                'version=1.0.0&request=GetFeature&typeName=test:test_sql&' +
                'outputFormat=application/json&' +
                'viewparams=gid:6&cql_filter=gid<=6'
        const query_intersects = 'http://localhost:8086/geoserver/test/ows?service=WFS&' +
                'version=1.0.0&request=GetFeature&typeName=test:query_intersects&' +
                'outputFormat=application/json&' +
                'viewparams=x:106.26667;y:37.06667'
        const short_path = 'http://localhost:8086/geoserver/test/ows?service=WFS&' +
                'version=1.0.0&request=GetFeature&typeName=test:short_path&' +
                'outputFormat=application/json&' +
                'viewparams=x1:113.084424;y1:28.253983;x2:116.411236;y2:39.912503'
        const vectorSource = new VectorSource({
            format: new GeoJSON(),
            url: function (extent) {
                return (test_sql);
            },
            strategy: bboxStrategy,
        });
        const vector = new VectorLayer({
            source: vectorSource,
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2,
                }),
            }),
        });

        const vectorSource2 = new VectorSource();
        const vector2 = new VectorLayer({
            source: vectorSource2,
            style: new Style({
                stroke: new Stroke({
                color: 'rgba(0, 0, 255, 1.0)',
                width: 2,
                }),
            }),
        });

        const getFeature = () => {
            // 生成GetFeature请求
            const featureRequest = new WFS().writeGetFeature({
                srsName: 'EPSG:4326',
                featureNS: 'http://test',
                featurePrefix: 'test',
                featureTypes: ['query_intersects'],
                outputFormat: 'application/json',
                viewParams: 'x:'+point.x+';y:'+point.y+';radiu:'+radiu.value
            })
            // 然后发布请求并将收到的特征添加到图层
            fetch('http://localhost:8086/geoserver/test/ows?service=WFS', {
                method: 'POST',
                body: new XMLSerializer().serializeToString(featureRequest),
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                features = new GeoJSON().readFeatures(json);
                // console.log('features', features)
                vectorSource2.clear()
                vectorSource2.addFeatures(features);
                // map.getView().fit(vectorSource2.getExtent());
            });
        }
        getFeature()

        // xyz方式加载切片地图
        const xyzUrl = 'http://localhost:8086/geoserver/gwc/service/wmts?layer=test%3Acoupl&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&'
        var xyzLayer = new TileLayer({
            visible: false,
            source: new XYZ({
                projection: projectionXYZ,
                maxZoom: 24,
                minZoom: 0,
                tileGrid: new TileGrid({
                    origin: extent.getTopLeft(projectionExtent),  // WMTS Origin在左上角，origin位置不能变；,
                    resolutions: resolutionsArr4326,
                    // extent: [-180.0,-90.0,180.0,90.0],
                    extent: [104.15,35.10,107.80,39.50],
                    tileSize: [256, 256],
                }),
                tileUrlFunction: function (tileCoord, pixelRatio, proj) {
                    if (!tileCoord) {
                        return "";
                    }
                    var z = tileCoord[0];
                    var x = tileCoord[1];
                    var y = tileCoord[2]; // y轴取反，-1目的是为了从0开始计数
                    return xyzUrl + 'TileMatrix=EPSG%3A4326%3A'+ z +'&TileCol=' + x + '&TileRow=' + y
                }
            })
        });

        layerGroup = new LayerGroup({
            layers: [wmsLayer, wmtsLayer4326, vector, wmtsLayer4490, xyzLayer, vector2, shortPathV]
        })

        const getGroupLayer = () => {
            const group = map.getLayerGroup()
            group.getLayers().forEach(function (layers, i) {
                if (layers instanceof LayerGroup) {
                    layers.getLayers().forEach(function (layer, i) {
                        if(i===0){
                            layer1 = layer
                        }else if(i===1){
                            layer2 = layer
                        }else if(i===2){
                            layer3 = layer
                        }else if(i===3){
                            layer4 = layer
                        }else if(i===4){
                            layer5 = layer
                        }else if(i===5){
                            layer6 = layer
                        }else if(i===6){
                            layer7 = layer
                        }
                    })
                }
            })
        }
        watch([checked1, checked2, checked3, checked4, checked5, checked6, checked7], (newVal, oldVal) => {
            // console.log("新值:", newVal, "老值:", oldVal);
            // console.log('layerGroup', map.getLayerGroup())
            layer1.setVisible(checked1.value)
            layer2.setVisible(checked2.value)
            layer3.setVisible(checked3.value)
            layer4.setVisible(checked4.value)
            layer5.setVisible(checked5.value)
            layer6.setVisible(checked6.value)
            layer7.setVisible(checked7.value)
        })
        onMounted(()=>{
            map = getMap()
            pArrowAnimate = new ol.arrowAnimate(map)
        })
        return{
            name: props.name,
            checked1,
            checked2,
            checked3,
            checked4,
            checked5,
            checked6,
            checked7,
            label: '显隐',
            opacity: '透明度',
            value1,
            value2,
            value3,
            value4,
            value5,
            value6,
            value7,
            formatTooltip,
            inputVal,
            addData,
            clearData,
            ...toRefs(point),
            start,
            end,
            options,
            radiu,
            onSubmit,
            queryShortPath,
            addShortPathByGS
        }
    }
})
</script>
<style scoped>
.layerGroup{
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 99;
}
.box-card {
  width: 500px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.slider_opacity{
    position: relative;
    right: -15px;
    width: 300px;
}
</style>