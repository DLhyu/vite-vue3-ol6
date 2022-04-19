/*
 * @Description: 最短路径箭头动画
 * @Author: huyong
 * @Date: 2022-04-18 17:03:36
 * @LastEditTime: 2022-04-19 09:11:17
 * @LastEditors:  
 */
import { getMapAll, getMapStyle } from "@/components/ol/comMap.js";
import { Icon, Fill, Stroke, Text, Style, Circle } from 'ol/style'
import { getVectorContext } from 'ol/render'
import { LineString, Point } from "ol/geom";
import Feature from 'ol/Feature';
import { unByKey } from 'ol/Observable';
import { fromLonLat } from "ol/proj";
export class arrowAnimate {
  // 构造函数
  constructor(map) {
    this.map = map;
    this.olMap = getMapAll();
    // 声明监听事件的变量
    this.postrenderListen = null
    // 声明需要用到的样式
    this.textStyle = new Style({
      text: new Text({
        font: "bold 26px Mirosoft Yahei",
        placement: "line",
        text: "最 短 路 径",
        fill: new Fill({
          color: "#000",
        }),
        offsetY: 3,
        stroke: new Stroke({
          color: "#FFF",
          width: 2,
        }),
      }),
    });
    this.buttomPathStyle = new Style({
      stroke: new Stroke({
        color: [4, 110, 74],
        width: 28,
      }),
    });
    this.upperPathStyle = new Style({
      stroke: new Stroke({
        color: [0, 186, 107],
        width: 20,
      }),
    });
    this.outStyle = new Style({
      image: new Circle({
        radius: 18,
        fill: new Fill({
          color: [4, 110, 74],
        }),
      }),
    });
    this.midStyle = new Style({
      image: new Circle({
        radius: 15,
        fill: new Fill({
          color: [0, 186, 107],
        }),
      }),
    });
    this.innerDot = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: [255, 255, 255],
        }),
      }),
    });
    this.foutrStyle = new Style({
      image: new Circle({
        radius: 18,
        fill: new Fill({
          color: "#000",
        }),
      }),
    });
    this.fmidStyle = new Style({
      image: new Circle({
        radius: 15,
        fill: new Fill({
          color: "#FFF",
        }),
      }),
    });
    this.finnerStyle = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: "#000",
        }),
      }),
    });
  }
  // 加载特征几何的箭头动画
  addGeometroy(tileLayer, street){
    if(this.postrenderListen!=null){
        unByKey(this.postrenderListen)
        this.postrenderListen = null
    }
    street.setStyle(this.textStyle);
    var offset = 0.01;
    this.postrenderListen = tileLayer.on("postrender", (evt) => {
      var vct = getVectorContext(evt);
      vct.drawFeature(street, this.buttomPathStyle);
      vct.drawFeature(street, this.upperPathStyle);
      let numArr = Math.ceil(
        street.getGeometry().getLength() / this.map.getView().getResolution() / 100
      );
      var points = [];
      for (var i = 0; i <= numArr; i++) {
        let fracPos = i / numArr + offset;
        if (fracPos > 1) fracPos -= 1;
        let pf = new Feature(
          new Point(street.getGeometry().getCoordinateAt(fracPos))
        );
        points.push(pf);
      }

      //确定方向并绘制
      street.getGeometry().forEachSegment((start, end) => {
        points.forEach((item) => {
          // 4326转3857
          let start1 = fromLonLat(start, 'EPSG:3857')
          let end1 = fromLonLat(end, 'EPSG:3857')
          let line = new LineString([start1, end1]);
          let coord1 = item.getGeometry().getFirstCoordinate();
          let coord = fromLonLat(coord1, 'EPSG:3857')
          let cPoint = line.getClosestPoint(coord);
          if (
            Math.abs(cPoint[0] - coord[0]) < 1 &&
            Math.abs(cPoint[1] - coord[1]) < 1
          ) {
            var myImage = new Image(128, 128);
            myImage.src = "../../../data/arrow.png";
            let dx = end[0] - start[0];
            let dy = end[1] - start[1];
            var rotation = Math.atan(dx / dy);
            rotation = dy > 0 ? rotation : Math.PI + rotation;
            vct.setStyle(
              new Style({
                image: new Icon({
                  img: myImage,
                  imgSize: [128, 128],
                  scale: 0.15,
                  rotation: rotation,
                }),
              })
            );
            vct.drawGeometry(item.getGeometry());
          }
        });
        vct.setStyle(this.outStyle);
        vct.drawGeometry(new Point(street.getGeometry().getFirstCoordinate()));
        vct.setStyle(this.midStyle);
        vct.drawGeometry(new Point(street.getGeometry().getFirstCoordinate()));
        vct.setStyle(this.innerDot);
        vct.drawGeometry(new Point(street.getGeometry().getFirstCoordinate()));
        vct.setStyle(this.foutrStyle);
        vct.drawGeometry(new Point(street.getGeometry().getLastCoordinate()));
        vct.setStyle(this.fmidStyle);
        vct.drawGeometry(new Point(street.getGeometry().getLastCoordinate()));
        vct.setStyle(this.finnerStyle);
        vct.drawGeometry(new Point(street.getGeometry().getLastCoordinate()));
      });

      offset = offset + 0.003;
      //复位
      if (offset >= 1) offset = 0.001;
      this.map.render();
    });
  }
}
