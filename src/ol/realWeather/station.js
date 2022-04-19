/*
 * @Description: 
 * @Author: huyong
 * @Date: 2021-12-31 14:43:05
 * @LastEditTime: 2022-01-06 17:41:06
 * @LastEditors:  
 */
import { getMapAll, pointStyleFunction, krigingStyle, clipStyle, isoStyle } from "@/components/ol/comMap.js"
import { train, grid, plot } from '@sakitam-gis/kriging'
import polygonJson from '../../assets/json/polygonBuffer.json'
import * as turf from '@turf/turf'
import * as kriging from 'kriging-contour'
import { getVectorContext } from 'ol/render'
export class station {
    // 构造函数
    constructor(map){
        // super()
        this.map = map
        this.olMap = getMapAll()
    }
    data = {
        stationVector: null,    // 站点数据图层
        stationSource: null,    // 站点数据source
        krigingVectorLayer: null,   // 等值面图层
    }
    // 加载站点数据
    addStationData(data, defaultOptions){
        const { VectorSource, VectorLayer, Feature, Point } = this.olMap
        this.clearStationData()
        let features = []
        // debugger
        // console.log('defaultOptions', defaultOptions)
        data.map(({obTime, stationId, stationName, stationType, lon, lat, temMax, tem, temMin, 
            winSAvg10, winDAvg10, winSInstMax, winDInstMax, winSAvg2, pre1, pre3, pre6, pre12, pre24, vis, wepNow, rhu, gst, snowDepth}) => {
            features.push(new Feature({
                geometry: new Point([lon, lat]),
                attributes: { 
                distCode: stationId, 
                stationId: stationId, 
                stationName: stationName, 
                stationType: stationType,
                tem: tem,
                winSAvg10: winSAvg10,
                winDAvg10: winDAvg10,
                winSInstMax: winSInstMax,
                winDInstMax: winDInstMax,
                pre1: pre1,
                pre3: pre3,
                pre6: pre6,
                pre12: pre12,
                pre24: pre24,
                vis: vis,
                wepNow: wepNow,
                rhu: rhu,
                gst: gst,
                snowDepth: snowDepth,
                // dataType: datatype
                },
                tem: tem,
            }))
        })
        // 数据源
        this.data.stationSource = new VectorSource({
            features: features
        });
        // 数据图层
        this.data.stationVector = new VectorLayer({
            source: this.data.stationSource,
            style: function(feature){
                return pointStyleFunction(feature, defaultOptions)
            }
        })
        this.map.addLayer(this.data.stationVector)
    }
    // 站点数据显隐控制
    changeStationData(defaultOptions){
        this.data.stationVector && this.data.stationVector.setStyle(function(feature){
            return pointStyleFunction(feature, defaultOptions)
        })
    }
    // 清除站点数据
    clearStationData(){
        this.data.stationSource && this.data.stationSource.clear()
        this.data.stationVector && this.map.removeLayer(this.data.stationVector)
    }
    // 使用kringing-counter绘制等值面
    drawIsoByKc(){
        if(!this.data.stationSource) return
        const { GeoJSON, Polygon, VectorSource, VectorLayer } = this.olMap
        console.time("drawIsoByKc")
        let params={
            krigingModel:'spherical',//'exponential','gaussian','spherical'
            krigingSigma2:0,
            krigingAlpha:100,
            canvasAlpha:0.9,
            colors:["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf","#fee08b", 
            "#fdae61", "#f46d43", "#d73027", "#a50026"]
        };
        // 获得数据
        const format=new GeoJSON()
        let features = this.data.stationSource.getFeatures()
        let dataset = JSON.parse(format.writeFeatures(features))
        // 定义边界
        const polygonArr = polygonJson.polygonArr
        const rings = [polygonArr]
        let clipgeom = new Polygon(rings)
        let ex = clipgeom.getExtent();
        let min = 0, max = 0, len = params.colors.length
        dataset.features.forEach(feature => {
            const val = feature.properties['tem']
            if(val<min){
                min = val
            }
            if(val>max){
                max = val
            }
        })
        let span = (max-min)/len
        const breaks = []
        for(let i=0; i<len; i++){
            // breaks.push(Math.round(min+i*span))
            breaks.push(min+i*span)
        }
        console.log('breaks', breaks)
        // const breaks = [-7.0, -6.0, -5.0, -4.0, -3.0, -2.0, -1.0, 0, 1, 2, 3]
        //克里金矢量等值面
        let krigingVectorSource=new VectorSource();
        this.data.krigingVectorLayer=new VectorLayer({
            opacity: 0.7,
            source:krigingVectorSource,
            zIndex:3,
            style:function(feature,res){
                //获取等值面分级的权重值
                let _value=feature.get('contour_value');
                let color
                //根据权重值，计算所在颜色渲染的区间
                breaks.some((item, i) => {
                    if(item === _value){
                        color = params.colors[i]
                        return true
                    }
                })
                return krigingStyle(color)
            }
        });
        //克里金栅格等值面
            // let krigingCanvasLayer=new Image({
            // 	zIndex:2
        // });
        // debugger
        //生成克里金矢量等值面
        // const breaks = [0,10,20,30,40,50,60,70,80,90,100]
        let kriging_contours=kriging.getVectorContour(dataset,'tem',{
            model:'exponential',
            sigma2:0,
            alpha:100
        },breaks,ex);
        
        features=format.readFeatures(kriging_contours);
        krigingVectorSource.addFeatures(features)
        this.clipIso(this.data.krigingVectorLayer)
        this.map.addLayer(this.data.krigingVectorLayer)
        // let imageSource=new ImageCanvas({
        //   canvasFunction:(extent, resolution, pixelRatio, size, projection) =>{
        //     let canvas = document.createElement('canvas');
        //     canvas.width = size[0];
        //     canvas.height = size[1];
        //     canvas.style.display='block';
        //     //设置canvas透明度
        //     canvas.getContext('2d').globalAlpha=params.canvasAlpha;                          
        //     //使用分层设色渲染
        //     kriging.drawCanvasContour(dataset,'level',{
        //       model:'exponential',
        //       sigma2:0,
        //       alpha:100
        //     },canvas,[extent[0],extent[2]],[extent[1],extent[3]],params.colors);
        //     return canvas;
        //   },
        //   projection: 'EPSG:4326'
        // })
        // krigingCanvasLayer.setSource(imageSource)
        // this.addLayer(krigingCanvasLayer)
        console.timeEnd("drawIsoByKc")
    }
    // 绘制站点等值面
    drawStationIsosurface(){
        if(!this.data.stationSource) return
        const { Polygon, VectorSource, VectorLayer } = this.olMap
        // 定义kriging插值的参数
        let params = {
            krigingModel: 'spherical',//model可选'exponential','gaussian','spherical'
            krigingSigma2: 0,
            krigingAlpha: 226,
            canvasAlpha: 0.75,//canvas图层透明度
            // colors: ['rgb(0, 0, 255)', 'rgb(0, 0, 255)', 'rgb(0, 166, 255)', 'rgb(0, 255, 181)', 'rgb(0, 255, 8)', 'rgb(148, 255, 0)', 'rgb(255, 195, 0)', 'rgb(255, 44, 0)', 'rgb(255, 10, 0)', 'rgb(255, 10, 0)'],
            colors:[
                "#006837", 
                "#1a9850", 
                "#66bd63", 
                "#a6d96a", 
                "#d9ef8b", 
                "#ffffbf",
                "#fee08b", 
                "#fdae61", 
                "#f46d43", 
                "#d73027",
                "#a50026"],
            // colors: ["#00A600", "#01A600", "#03A700", "#04A700", "#05A800", "#07A800", "#08A900", "#09A900", "#0BAA00", "#0CAA00", "#0DAB00", "#0FAB00", "#10AC00", "#12AC00", "#13AD00", "#14AD00", "#16AE00", "#17AE00", "#19AF00", "#1AAF00", "#1CB000", "#1DB000", "#1FB100", "#20B100", "#22B200", "#23B200", "#25B300", "#26B300", "#28B400", "#29B400", "#2BB500", "#2CB500", "#2EB600", "#2FB600", "#31B700", "#33B700", "#34B800", "#36B800", "#37B900", "#39B900", "#3BBA00", "#3CBA00", "#3EBB00", "#3FBB00", "#41BC00", "#43BC00", "#44BD00", "#46BD00", "#48BE00", "#49BE00", "#4BBF00", "#4DBF00", "#4FC000", "#50C000", "#52C100", "#54C100", "#55C200", "#57C200", "#59C300", "#5BC300", "#5DC400", "#5EC400", "#60C500", "#62C500", "#64C600", "#66C600", "#67C700", "#69C700", "#6BC800", "#6DC800", "#6FC900", "#71C900", "#72CA00", "#74CA00", "#76CB00", "#78CB00", "#7ACC00", "#7CCC00", "#7ECD00", "#80CD00", "#82CE00", "#84CE00", "#86CF00", "#88CF00", "#8AD000", "#8BD000", "#8DD100", "#8FD100", "#91D200", "#93D200", "#95D300", "#97D300", "#9AD400", "#9CD400", "#9ED500", "#A0D500", "#A2D600", "#A4D600", "#A6D700", "#A8D700", "#AAD800", "#ACD800", "#AED900", "#B0D900", "#B2DA00", "#B5DA00", "#B7DB00", "#B9DB00", "#BBDC00", "#BDDC00", "#BFDD00", "#C2DD00", "#C4DE00", "#C6DE00", "#C8DF00", "#CADF00", "#CDE000", "#CFE000", "#D1E100", "#D3E100", "#D6E200", "#D8E200", "#DAE300", "#DCE300", "#DFE400", "#E1E400", "#E3E500", "#E6E600", "#E6E402", "#E6E204", "#E6E105", "#E6DF07", "#E6DD09", "#E6DC0B", "#E6DA0D", "#E6D90E", "#E6D710", "#E6D612", "#E7D414", "#E7D316", "#E7D217", "#E7D019", "#E7CF1B", "#E7CE1D", "#E7CD1F", "#E7CB21", "#E7CA22", "#E7C924", "#E8C826", "#E8C728", "#E8C62A", "#E8C52B", "#E8C42D", "#E8C32F", "#E8C231", "#E8C133", "#E8C035", "#E8BF36", "#E9BE38", "#E9BD3A", "#E9BC3C", "#E9BB3E", "#E9BB40", "#E9BA42", "#E9B943", "#E9B945", "#E9B847", "#E9B749", "#EAB74B", "#EAB64D", "#EAB64F", "#EAB550", "#EAB552", "#EAB454", "#EAB456", "#EAB358", "#EAB35A", "#EAB35C", "#EBB25D", "#EBB25F", "#EBB261", "#EBB263", "#EBB165", "#EBB167", "#EBB169", "#EBB16B", "#EBB16C", "#EBB16E", "#ECB170", "#ECB172", "#ECB174", "#ECB176", "#ECB178", "#ECB17A", "#ECB17C", "#ECB17E", "#ECB27F", "#ECB281", "#EDB283", "#EDB285", "#EDB387", "#EDB389", "#EDB38B", "#EDB48D", "#EDB48F", "#EDB591", "#EDB593", "#EDB694", "#EEB696", "#EEB798", "#EEB89A", "#EEB89C", "#EEB99E", "#EEBAA0", "#EEBAA2", "#EEBBA4", "#EEBCA6", "#EEBDA8", "#EFBEAA", "#EFBEAC", "#EFBFAD", "#EFC0AF", "#EFC1B1", "#EFC2B3", "#EFC3B5", "#EFC4B7", "#EFC5B9", "#EFC7BB", "#F0C8BD", "#F0C9BF", "#F0CAC1", "#F0CBC3", "#F0CDC5", "#F0CEC7", "#F0CFC9", "#F0D1CB", "#F0D2CD", "#F0D3CF", "#F1D5D1", "#F1D6D3", "#F1D8D5", "#F1D9D7", "#F1DBD8", "#F1DDDA", "#F1DEDC", "#F1E0DE", "#F1E2E0", "#F1E3E2", "#F2E5E4", "#F2E7E6", "#F2E9E8", "#F2EBEA", "#F2ECEC", "#F2EEEE", "#F2F0F0", "#F2F2F2"]
        };
        // 定义裁剪边界
        const polygonArr = polygonJson.polygonArr
        const rings = [polygonArr]
        let clipgeom = new Polygon(rings)
        // 绘制kriging插值图
        console.time('drawCanvas')
        let canvasLayer = null;
        const _this = this
        let drawKriging =function (extent){
            let values = [], lngs = [], lats = [];
            _this.data.stationSource && _this.data.stationSource.forEachFeature(function (feature) {
                values.push(feature.get('attributes').tem);
                lngs.push(feature.getGeometry().getCoordinates()[0]);
                lats.push(feature.getGeometry().getCoordinates()[1]);
            })
            if (values.length > 3) {
                let letiogram = train(values, lngs, lats,
                    params.krigingModel, params.krigingSigma2, params.krigingAlpha);
                let ex = clipgeom.getExtent();
                // debugger
                let polygons = [];
                polygons.push([
                    [ex[0], ex[1]], [ex[0], ex[3]],
                    [ex[2], ex[3]], [ex[2], ex[1]]
                ])
                let gridRes = grid(polygons, letiogram, (ex[2] - ex[0]) / 200);  
                // console.log('gridRes', gridRes)             
                //移除已有图层
                if (canvasLayer !== null) {
                    _this.removeLayer(canvasLayer);
                }
                //创建新图层
                // canvasLayer = new Image({
                //     source: new ImageCanvas({
                //         canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
                //             // console.log(extent);
                //             let canvas = document.createElement('canvas');
                //             canvas.width = size[0];
                //             canvas.height = size[1];
                //             canvas.style.display = 'block';
                //             //设置canvas透明度
                //             canvas.getContext('2d').globalAlpha = params.canvasAlpha;
                //             //使用分层设色渲染
                //             plot(canvas, gridRes,
                //                 [extent[0], extent[2]], [extent[1], extent[3]], params.colors);                            
                //             return canvas;
                //         },
                //         projection: 'EPSG:4326'
                //     })
                // })     
                canvasLayer = _this.createIsoByTurf(gridRes, extent, params)
                _this.clipIso(canvasLayer)
                //向map添加图层
                _this.map.addLayer(canvasLayer);
            } else {
                alert("有效样点个数不足，无法插值");
            }
        }      
        //首次加载，自动渲染一次差值图
        let extent = clipgeom.getExtent();
        drawKriging(extent);
        console.timeEnd('drawCanvas')
    }
    // 裁剪等值面
    clipIso(canvasLayer){
        const { Polygon, Feature, VectorSource, VectorLayer } = this.olMap
        // 定义裁剪边界
        const polygonArr = polygonJson.polygonArr
        const rings = [polygonArr]
        let clipgeom = new Polygon(rings)
        // 定义裁剪范围图层
        const features = [new Feature({
            geometry: clipgeom
        })]
        const source = new VectorSource({
            features: features
        });
        // 格点数据矢量图层
        const vector = new VectorLayer({
            source: source,
        })
        // 根据图层特征源裁剪等值面
        canvasLayer.setExtent(vector.getSource().getExtent())
        canvasLayer.on('postrender', function (e) {
            const vectorContext = getVectorContext(e);
            e.context.globalCompositeOperation = 'destination-in';
            vector.getSource().forEachFeature(function (feature) {
                vectorContext.drawFeature(feature, clipStyle);
            });
            e.context.globalCompositeOperation = 'source-over';
        })
    }
    // 使用turf.js处理网格数据，生成等值面，提升交互性能，显示效果更好一点
    createIsoByTurf(gridRes, extent, params){
        const { VectorSource, VectorLayer, GeoJSON } = this.olMap
        var vectorSource = new VectorSource();
        var canvasLayer = new VectorLayer({
            source: vectorSource,
            opacity: 0.7,
            style: function (feature) {
                return isoStyle(feature, params);
            }
        })
        //使用turf渲染等值面/线
        let fc = this.gridFeatureCollection(gridRes,[extent[0], extent[2]], [extent[1], extent[3]]);
        var collection = turf.featureCollection(fc);
        var breaks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
        var isobands = turf.isobands(collection, breaks, { zProperty: 'value' });
        function sortArea(a,b)
        {
            return turf.area(b)-turf.area(a);
        }
        //按照面积对图层进行排序，规避turf的一个bug
        isobands.features.sort(sortArea)
        var polyFeatures = new GeoJSON().readFeatures(isobands, {
            featureProjection: 'EPSG:4326'
        })
        vectorSource.addFeatures(polyFeatures)
        return canvasLayer
    }
    //利用网格计算点集
    gridFeatureCollection(grid, xlim, ylim) {
        var range =grid.zlim[1] - grid.zlim[0];
        var i, j, x, y, z;
        var n = grid.data.length;//列数
        var m = grid.data[0].length;//行数
        var pointArray = [];
        for (i = 0; i < n ; i++)
            for (j = 0; j < m ; j++) {
                x = (i) * grid.width + grid.xlim[0];
                y = (j) * grid.width + grid.ylim[0];
                z = (grid.data[i][j] - grid.zlim[0]) / range;
                if (z < 0.0) z = 0.0;
                if (z > 1.0) z = 1.0;
                pointArray.push(turf.point([x, y], { value: z }));
            }
        return pointArray;
    }
    // 控制等值面的显隐
    changeStationIso(val){
        this.data.krigingVectorLayer && this.data.krigingVectorLayer.setVisible(val)
    }
}