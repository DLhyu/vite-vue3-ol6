/*
 * @Description: 地图类
 * @Author: huyong
 * @Date: 2021-11-29 16:44:26
 * @LastEditTime: 2022-01-03 16:27:11
 * @LastEditors:  
 */
import "ol/ol.css";
import { Map, View, Feature, Overlay } from "ol";
import { MousePosition, FullScreen, ScaleLine, defaults } from "ol/control";
import { mapUrl } from "@/config/mapconfig.js";
import { Group as LayerGroup, Tile, Vector as VectorLayer, Image } from "ol/layer";
import { OSM, TileArcGISRest, XYZ, Vector as VectorSource } from "ol/source";
import { createStringXY } from "ol/coordinate";
import { Draw, Modify } from "ol/interaction";
import { createBox } from 'ol/interaction/Draw';
import { Polygon, LineString, Point } from "ol/geom";
import { getArea, getLength } from "ol/sphere";
import { GeoJSON } from 'ol/format'
import { initMapAll, style, labelStyle, tipStyle, modifyStyle, segmentStyle, styleDrawTool } from './comMap.js'

export default class OlMap extends Map {
  // 设置父类默认值
  constructor(target) {
    const osmLayer = new Tile({
      visible: false,
      source: new OSM(),
      properties: {
        name: "openstreetmap",
      },
    });
    // ArcGIS地图
    const arcgisLayer = new Tile({
      visible: true,
      source: new TileArcGISRest({
        url: mapUrl.arcgisUrl,
      }),
      properties: {
        name: "arcgismap",
      },
    });
    // 高德地图
    const gaodeLayer = new Tile({
      visible: false,
      source: new XYZ({
        url: mapUrl.gaodeMapUrl,
      }),
      properties: {
        name: "gaodemap",
      },
    });
    const layerGroup = new LayerGroup({
      layers: [osmLayer, arcgisLayer, gaodeLayer],
    });
    // 构建地图
    super({
      target,
      logo: false,
      // 控件 默认控件不显示
      controls: defaults({
        attribution: false,
        rotate: false,
        zoom: false,
      }),
      // 图层
      layers: [layerGroup], // 加载图层组
      view: new View({
        // 地图视图
        projection: "EPSG:4326", // 坐标系，有EPSG:4326和EPSG:3857
        center: [106.26667, 37.06667], // 地图中心坐标
        minZoom: 1, // 地图缩放最小级别
        zoom: 7, // 地图缩放级别（打开页面时默认级别）
      }),
    });
    // 设置地图需要的初始化对象
    this.olMap = {
      VectorSource: VectorSource,
      VectorLayer: VectorLayer,
      Feature: Feature,
      Point: Point,
      GeoJSON: GeoJSON,
      Polygon: Polygon,
      Draw: Draw,
      Overlay: Overlay,
    }
    initMapAll(this.olMap)
  }
  data = {
    vector: null, // 量测工具的矢量图层
    vectorDraw: null, // 绘制工具的矢量图层
    source: null, // 量测工具的矢量数据源
    sourceDraw: null, // 绘制工具的矢量数据源
    draw: null, // 量测工具的交互画笔
    drawTool: null, // 绘制工具的交互画笔
    modify: null, // 量测工具的修改画笔
    stationVector: null,    // 站点数据图层
    stationSource: null,    // 站点数据source
    gridVector: null,    // 格点数据图层
    gridSource: null,    // 格点数据source
    windLayer: null,    // 风场图层
    allgrid: {},  // 临时存放风场格点数据
    gridOverlay: null,  // 格点弹窗覆盖物
    windClick: null,    // 格点风场点击事件
    gridPointerMove: null,   // 鼠标移入格点事件
    featureOverlay: null,    // 高亮图层
    hightdDraw: null,   // 鼠标移入格点高亮显示数据的交互
    drawType: [
      // 绘图的类型
      "Point",
      "LineString",
      "LinearRing",
      "Polygon",
      "MultiPoint",
      "MultiLineString",
      "MultiPolygon",
      "GeometryCollection",
      "Circle",
      "Squre",
      "Hand",
    ],
    // fullScreenControl: null, // 全屏控件
    // scaleLineControl: null, // 比例尺
    // mousePositionControl: null, // 鼠标位置
  }
  clearMap() {
    this.getTargetElement().style.cursor = "";
    this.clearDrawTool();
    this.clearMeasureTool();
  }
  clearMeasureTool() {
    this.data.modify && this.removeInteraction(this.data.modify);
    this.data.draw && this.removeInteraction(this.data.draw);
    this.data.source && this.data.source.clear();
    this.data.vector && this.removeLayer(this.data.vector);
  }
  clearDrawTool() {
    this.data.drawTool && this.removeInteraction(this.data.drawTool);
    this.data.sourceDraw && this.data.sourceDraw.clear();
    this.data.vectorDraw && this.removeLayer(this.data.vectorDraw);
  }
  // 初始化地图控件
  initControl(mousePositionDom) {
    // 实例化鼠标位置控件
    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4), //坐标格式
      projection: "EPSG:4326", //地图投影坐标系
      className: "custom-mouse-position", //坐标信息显示样式
      // 显示鼠标位置信息的目标容器
      target: mousePositionDom.value,
      undefinedHTML: "&nbsp", //未定义坐标的标记
    });
    // 全屏控件
    this.fullScreenControl = new FullScreen();
    // 比例尺
    this.scaleLineControl = new ScaleLine({ units: "metric", bar: false });
    this.addControl(this.fullScreenControl);
    this.addControl(this.scaleLineControl);
    this.addControl(this.mousePositionControl);
  }
  // 地图控件控制
  changeControl(val, item) {
    switch (val) {
      case "fullscreen":
        if (item) {
          this.addControl(this.fullScreenControl);
        } else if (!item) {
          this.removeControl(this.fullScreenControl);
        }
        break;
      case "scaleline":
        if (item) {
          this.addControl(this.scaleLineControl);
        } else if (!item) {
          this.removeControl(this.scaleLineControl);
        }
        break;
      case "mousePosition":
        if (item) {
          this.addControl(this.mousePositionControl);
        } else if (!item) {
          this.removeControl(this.mousePositionControl);
        }
        break;
    }
  }
  // 底图切换控制
  changeBaseMap(val) {
    const group = this.getLayerGroup();
    // console.log('group', group)
    group.getLayers().forEach(function (layers, i) {
      if (layers instanceof LayerGroup && i === 0) {
        layers.getLayers().forEach(function (layer, i) {
          layer.setVisible(layer.getProperties().name === val ? true : false);
          // console.log('prop', layer.getProperties())
        });
      }
    });
  }
  // 距离
  formatLength(line) {
    const length = getLength(line, { projection: "EPSG:4326" });
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " km";
    } else {
      output = Math.round(length * 100) / 100 + " m";
    }
    return output;
  }
  // 面积
  formatArea(polygon) {
    const area = getArea(polygon, { projection: "EPSG:4326" });
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + " km\xB2";
    } else {
      output = Math.round(area * 100) / 100 + " m\xB2";
    }
    return output;
  }
  // 量测工具
  measureTool(meaType) {
    const segmentStyles = [segmentStyle];

    this.data.source && this.data.source.clear();
    this.data.source = new VectorSource();
    this.data.modify && this.removeInteraction(this.data.modify);
    this.data.modify = new Modify({
      source: this.data.source,
      style: modifyStyle,
    });

    let tipPoint;
    const _this = this;

    function styleFunction(feature, segments, drawType, tip) {
      const styles = [style];
      const geometry = feature.getGeometry();
      const type = geometry.getType();
      let point, label, line;
      if (!drawType || drawType === type) {
        if (type === "Polygon") {
          point = geometry.getInteriorPoint();
          label = _this.formatArea(geometry);
          line = new LineString(geometry.getCoordinates()[0]);
        } else if (type === "LineString") {
          point = new Point(geometry.getLastCoordinate());
          label = _this.formatLength(geometry);
          line = geometry;
        }
      }
      if (segments && line) {
        let count = 0;
        line.forEachSegment(function (a, b) {
          const segment = new LineString([a, b]);
          const label = _this.formatLength(segment);
          if (segmentStyles.length - 1 < count) {
            segmentStyles.push(segmentStyle.clone());
          }
          const segmentPoint = new Point(segment.getCoordinateAt(0.5));
          segmentStyles[count].setGeometry(segmentPoint);
          segmentStyles[count].getText().setText(label);
          styles.push(segmentStyles[count]);
          count++;
        });
      }
      if (label) {
        labelStyle.setGeometry(point);
        labelStyle.getText().setText(label);
        styles.push(labelStyle);
      }
      if (
        tip &&
        type === "Point" &&
        !_this.data.modify.getOverlay().getSource().getFeatures().length
      ) {
        tipPoint = geometry;
        tipStyle.getText().setText(tip);
        styles.push(tipStyle);
      }
      return styles;
    }
    this.data.vector && this.removeLayer(this.data.vector);
    this.data.vector = new VectorLayer({
      source: this.data.source,
      style: function (feature) {
        return styleFunction(feature, true);
      },
    });
    this.addLayer(this.data.vector);
    this.addInteraction(this.data.modify);

    // let draw; // global so we can remove it later
    function addInteraction() {
      const drawType = meaType;
      const activeTip =
        "单击继续绘制" + (drawType === "Polygon" ? "多边形" : "线");
      const idleTip = "单击开始测量";
      let tip = idleTip;
      _this.data.draw = new Draw({
        source: _this.data.source,
        type: drawType,
        style: function (feature) {
          return styleFunction(feature, true, drawType, tip);
        },
      });
      _this.data.draw.on("drawstart", function () {
        _this.getTargetElement().style.cursor = "pointer";
        if (true) {
          _this.data.source.clear();
        }
        _this.data.modify.setActive(false);
        tip = activeTip;
      });
      _this.data.draw.on("drawend", function () {
        _this.getTargetElement().style.cursor = "";
        modifyStyle.setGeometry(tipPoint);
        _this.data.modify.setActive(true);
        _this.once("pointermove", function () {
          modifyStyle.setGeometry();
        });
        tip = idleTip;
      });
      _this.data.modify.setActive(true);
      _this.addInteraction(_this.data.draw);
      //   _this.data.draw = draw
    }
    // debugger
    this.data.draw && this.removeInteraction(this.data.draw);
    // console.log('this.getInteractions()',this.getInteractions())
    this.data.drawTool && this.removeInteraction(this.data.drawTool); // 移除绘制工具的画笔
    addInteraction();
  }
  drawTool(type) {
    this.data.draw && this.removeInteraction(this.data.draw); // 移除量测工具的画笔
    if (!this.data.drawType.includes(type)) {
      console.error("传入了不符合规范的绘图类型");
      return;
    }
    this.data.sourceDraw && this.data.sourceDraw.clear();
    this.data.sourceDraw = new VectorSource(); // 创建矢量图层数据源
    this.data.vectorDraw && this.removeLayer(this.data.vectorDraw);
    this.data.vectorDraw = new VectorLayer({
      // 创建矢量图层
      source: this.data.sourceDraw, // 添加矢量数据源到图层
    });
    this.addLayer(this.data.vectorDraw);
    this.data.drawTool && this.removeInteraction(this.data.drawTool);
    this.data.drawTool = new Draw({
      // 创建交互画笔
      source: this.data.sourceDraw, // 勾绘的要素会添加到 source 所属的矢量图层
      type: type === "Hand" ? "LineString" : type === "Squre" ? "Circle" : type,
      style: styleDrawTool,
      freehand: type === "Hand", // 手绘
      snapTolerance: 50, // 以矢量点为圆心吸附的半径，默认12px
      geometryFunction: type === "Squre" ? createBox() : undefined,
    });
    // 将绘制的图片添加到map中
    this.addInteraction(this.data.drawTool);
  }
  // 删除上一次处于绘画中的上一个点
  clearLastDraw() {
    if (!this.data.drawTool) return;
    const removeLastFeature = () => {
      const featuresArray = this.data.sourceDraw.getFeatures();
      if (featuresArray.length !== 0) {
        this.data.sourceDraw.removeFeature(
          featuresArray[featuresArray.length - 1]
        );
      }
    };
    // 如果处于线段或多边形绘画中 撤销上一个点
    if (this.data.drawTool.finishCoordinate_) {
      this.data.drawTool.removeLastPoint();
      if (!this.data.drawTool.finishCoordinate_) {
        removeLastFeature();
      }
    } else {
      // 否则取消上一次绘图
      removeLastFeature();
    }
  }
  // 框选打印地图
  async printMap() {
    this.clearMap();
    const _this = this;
    this.getTargetElement().style.cursor = "crosshair";
    this.drawTool("Squre");
    const getDataUrl = () => {
        return new Promise((resolve, reject) => {
            this.data.drawTool.on("drawend", function (evt) {
                _this.clearMap();
                _this.getTargetElement().style.cursor = "";
                var feature = evt.feature;
                var extent = feature.getGeometry().getExtent();
                //地理坐标转换屏幕坐标
                var coord = [extent[0], extent[3]];
                var leftTopPosition = _this.getPixelFromCoordinate(coord);
                //地理坐标转换屏幕坐标
                var coord1 = [extent[2], extent[1]];
                var bottomRightPosition = _this.getPixelFromCoordinate(coord1);
                //计算框选矩形的宽度以及高度像素
                var width = Math.abs(bottomRightPosition[0] - leftTopPosition[0]);
                var height = Math.abs(bottomRightPosition[1] - leftTopPosition[1]);
                //计算框选矩形的左上角屏幕坐标
                var minx =
                leftTopPosition[0] <= bottomRightPosition[0]
                    ? leftTopPosition[0]
                    : bottomRightPosition[0];
                var miny =
                leftTopPosition[1] <= bottomRightPosition[1]
                    ? leftTopPosition[1]
                    : bottomRightPosition[1];
                _this.once("rendercomplete", function () {
                const mapCanvas = document.createElement("canvas");
                const olLayerCanvas = document.querySelectorAll(".ol-layer canvas");
                mapCanvas.width = olLayerCanvas[0].clientWidth;
                mapCanvas.height = olLayerCanvas[0].clientHeight;
                document.body.appendChild(mapCanvas);
                var img = new Image();
                // document.body.removeChild(element)
                const mapContext = mapCanvas.getContext("2d");
                Array.prototype.forEach.call(
                    document.querySelectorAll(".ol-layer canvas"),
                    function (canvas) {
                    if (canvas.width > 0) {
                        const opacity = canvas.parentNode.style.opacity;
                        mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
                        const transform = canvas.style.transform;
                        // Get the transform parameters from the style's transform matrix
                        const matrix = transform
                        .match(/^matrix\(([^\(]*)\)$/)[1]
                        .split(",")
                        .map(Number);
                        // Apply the transform to the export map context
                        CanvasRenderingContext2D.prototype.setTransform.apply(
                        mapContext,
                        matrix
                        );
                        mapContext.drawImage(canvas, 0, 0);
                    }
                    }
                )
                img.src = mapCanvas.toDataURL("image/png");
                let dataUrl;
                img.onload = function () {
                  //要先确保图片完整获取到，这是个异步事件
                  var canvas = document.createElement("canvas"); //创建canvas元素
                  document.body.appendChild(canvas);
                  canvas.width = width;
                  canvas.height = height;
                  canvas
                    .getContext("2d")
                    .drawImage(img, minx, miny, width, height, 0, 0, width, height); //将图片绘制到canvas中
                  dataUrl = canvas.toDataURL(); //转换图片为dataURL
                //   var link = document.createElement("a");
                //   link.download = "框选导出.png";
                //   link.href = dataUrl;
                //   document.body.appendChild(link);
                //   link.click();
                //   console.log("截图数据获取成功");
                  document.body.removeChild(mapCanvas);
                  document.body.removeChild(canvas);
                //   document.body.removeChild(link);
                  return resolve(dataUrl)
                };
                });
            });
        })
    }
    const dataUrl = await getDataUrl()
    return {dataUrl}
  }
}

// 一些测试代码
// var url2='http://localhost:8086/geoserver/gwc/service/wmts?layer=test%3Acoupl&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A6&';
// var url3='http://localhost:8086/geoserver/gwc/service/wmts?layer=test%3Atowpl&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A7&'

// var extents = []
// var projectionXYZ = proj.get("EPSG:4326")
// var projectionExtent = projectionXYZ.getExtent();      // 投影坐标系的范围
// var resolutionsArr = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125, 0.000021457672119140625, 0.000010728836059570312, 0.000005364418029785156, 0.000002682209014892578, 0.000001341104507446289, 6.705522537231445e-7, 3.3527612686157227e-7,0.0000001676380634,0.0000000838190317,0.0000000419095159];
// // var resolutionsArr = ['0.143984375', '0.0719921875', '0.03599609375', '0.017998046875', '0.0089990234375', '0.00449951171875', '0.002249755859375', '0.0011248779296875', '0.0005624389648437', '0.0002812194824219', '0.0001406097412109', '0.0000703048706055', '0.0000351524353027']
// const size = extent.getWidth(projectionExtent) / 256;
// const resolutions = new Array(19);
// const matrixIds = new Array(19);
// for (let z = 0; z < 19; ++z) {
// // generate resolutions and matrixIds arrays for this WMTS
//     resolutions[z] = size / Math.pow(2, z);
//     matrixIds[z] = z;
// }
// const matrixIds2 = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9']
// // const matrixIds2 = ['EPSG:4490:-1', 'EPSG:4490:0', 'EPSG:4490:1', 'EPSG:4490:2', 'EPSG:4490:3', 'EPSG:4490:4', 'EPSG:4490:5', 'EPSG:4490:6', 'EPSG:4490:7', 'EPSG:4490:8', 'EPSG:4490:9']

// let wmsLayer = new Image({
//     source: new ImageWMS({
//     ratio: 1,
//     url: 'http://localhost:8086/geoserver/test/wms',
//     // crossOrigin: 'anonymous',           //跨域声明
//     params: {
//             'FORMAT': 'image/png',
//             'VERSION': '1.1.1',
//             'tiled': true,
//             "LAYERS": 'test:ningxia_country',
//             "exceptions": 'application/vnd.ogc.se_inimage',
//         }
//     })
// });
// let wmtsLayer = new Tile({
//     opacity: 0.7,
//     source: new WMTS({
//         url: 'http://localhost:8086/geoserver/gwc/service/wmts',
//         layer: 'test:coupl',
//         format: 'image/png',
//         matrixSet: 'EPSG:4326',
//         projection: projectionXYZ,
//         tileGrid : new WMTSTileGrid({
//             origin: extent.getTopLeft(projectionExtent),  // WMTS Origin在左上角，origin位置不能变；,
//             resolutions: resolutionsArr,
//             matrixIds: matrixIds2,
//             extent: [104.15,35.10,107.80,39.50],
//         }),
//         style: '',
//         wrapX: true
//     })
// });
// // 加载wfs 使用viewparams参数的sql查询和cql查询
// const vectorSource = new VectorSource({
//     format: new GeoJSON(),
//     url: function (extent) {
//         return (
//         'http://localhost:8086/geoserver/test/ows?service=WFS&' +
//         'version=1.0.0&request=GetFeature&typeName=test:test_sql&' +
//         'outputFormat=application/json&' +
//         'viewparams=gid:6&cql_filter=gid=6'
//         );
//     },
//     strategy: bboxStrategy,
// });
// const vector = new VectorLayer({
//     source: vectorSource,
//     style: new Style({
//         stroke: new Stroke({
//             color: 'rgba(0, 0, 255, 1.0)',
//             width: 2,
//         }),
//     }),
// });

// var testLayer = new Tile({
//     source: new XYZ({
//         projection: projectionXYZ,
//         maxZoom: 24,
//         minZoom: 0,
//         tileGrid: new TileGrid({
//             origin: extent.getTopLeft(projectionExtent),  // WMTS Origin在左上角，origin位置不能变；,
//             resolutions: resolutions,
//             // extent: [-180.0,-90.0,180.0,90.0],
//             extent: [104.15,35.10,107.80,39.50],
//             tileSize: [256, 256],
//         }),
//         tileUrlFunction: function (tileCoord, pixelRatio, proj) {
//             if (!tileCoord) {
//                 return "";
//             }
//             var z = tileCoord[0];
//             var x = tileCoord[1];
//             var y = tileCoord[2]; // y轴取反，-1目的是为了从0开始计数
//             return url2 + 'TileCol=' + x + '&TileRow=' + y
//         }
//     })
// });

// var testLayer3 = new Tile({
//     source: new XYZ({
//         projection: projectionXYZ,
//         maxZoom: 24,
//         minZoom: 0,
//         tileGrid: new TileGrid({
//             origin: extent.getTopLeft(projectionExtent),  // WMTS Origin在左上角，origin位置不能变；,
//             resolutions: resolutions,
//             // extent: [-180.0,-90.0,180.0,90.0],
//             extent: [104.15,35.10,107.80,39.50],
//             tileSize: [256, 256],
//         }),
//         tileUrlFunction: function (tileCoord, pixelRatio, proj) {
//             if (!tileCoord) {
//                 return "";
//             }
//             var z = tileCoord[0];
//             var x = tileCoord[1];
//             var y = tileCoord[2]; // y轴取反，-1目的是为了从0开始计数
//             return url3 + 'TileCol=' + x + '&TileRow=' + y
//         }
//     })
// });
