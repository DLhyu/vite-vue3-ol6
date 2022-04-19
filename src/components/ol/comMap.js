/*
 * @Description: 
 * @Author: huyong
 * @Date: 2021-11-29 15:23:47
 * @LastEditTime: 2022-04-18 17:30:35
 * @LastEditors:  
 */
import {
    Circle as CircleStyle,
    Fill,
    RegularShape,
    Stroke,
    Style,
    Text,
    Icon
} from "ol/style";
import { tempIsosurfaceColor } from "@/utils/utils.js";

const mapObj = {
    map: null,
    view: null,
    mapAll: {},
    style: {
      Fill: new Fill(),
      Stroke: new Stroke(),
      Circle: new CircleStyle(),
      Style: new Style(),
      Text: new Text(),
      // Icon: new Icon({}),
    }
}

export const initObjMap = (map) => {
    mapObj.map = map
}

export const initObjView = (view) => {
    mapObj.view = view
}

export const initMapAll = (mapAll) => {
    mapObj.mapAll = mapAll
}

export const getMap = () => {
    return mapObj.map
}

export const getView = () => {
    return mapObj.view
}

export const getMapAll = () => {
    return mapObj.mapAll
}

export const getMapStyle = () => {
  return mapObj.style
}

export const createTextStyle = (feature, name) => {
    return styleCache(feature, name)
}

export const createWindSymbol = (speed, direction) => {
    let picUrl
    if (speed <= 3.3&&speed > 1.5) {
      picUrl = "./assets/wind/2-3LevelWind.png"
    }
    else if (speed <= 5.4) {
      picUrl = "./assets/wind/3-4LevelWind.png"
    }
    else if (speed <= 7.9) {
      picUrl = "./assets/wind/4-5LevelWind.png"
    }
    else if (speed <= 10.7) {
      picUrl = "./assets/wind/5-6LevelWind.png"
    }
    else if (speed <= 13.8) {
      picUrl = "./assets/wind/6-7LevelWind.png"
    }
    else if (speed <= 17.1) {
      picUrl = "./assets/wind/7-8LevelWind.png"
    }
    else if (speed <= 20.7) {
      picUrl = "./assets/wind/8-9LevelWind.png"
    }
    else if (speed <= 24.4) {
      picUrl = "./assets/wind/9-10LevelWind.png"
    }
    else if (speed <= 28.4) {
      picUrl = "./assets/wind/10-11LevelWind.png"
    }
    else if (speed <= 32.6) {
      picUrl = "./assets/wind/11-12LevelWind.png"
    }
    else if (speed <= 100) {
      picUrl = "./assets/wind/11-12LevelWind.png"
    }
    let symbol = new Icon({
        anchor: [0.5, 0.5],
        src: picUrl,
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        rotation: direction * Math.PI / 180,    // 以弧度为单位旋转，需要角度转弧度：角度 * Math.PI / 180;角度: 弧度 * 180 / Math.PI
        size: [27, 54],
        rotateWithView: false
    })
    return symbol
}

const styleCache = (feature, name)=> {
    const attributes = feature
    const styleObj = {
        'stationName': new Text({
            font: "Bold 10px/1 'Open Sans'",
            textAlign: 'center',
            textBaseline: 'top',
            text: attributes.stationName,
            offsetY: 5
        }),
        'tem': new Text({
            font: "Bold 10px/1 'Open Sans'",
            textAlign: 'center',
            textBaseline: 'top',
            text: attributes.tem!=null&&attributes.tem<999999?attributes.tem.toString():'',
            offsetY: -5,
            offsetX: -20,
            fill: new Fill({color: 'blue'})
        }),
        'vis': new Text({
            font: "Bold 10px/1 'Open Sans'",
            textAlign: 'center',
            textBaseline: 'top',
            text: attributes.vis!=null&&attributes.vis>0&&attributes.vis<999999?attributes.vis.toString():'',
            offsetY: 10,
            offsetX: 25,
            fill: new Fill({color: '#9966FF'})
        }),
        'rhu': new Text({
            font: "Bold 10px/1 'Open Sans'",
            textAlign: 'center',
            textBaseline: 'top',
            text: attributes.rhu!=null&&attributes.rhu>=0?attributes.rhu.toString():'',
            offsetY: -5,
            offsetX: 20,
            fill: new Fill({color: 'gray'})
        }),
        'gst': new Text({
            font: "Bold 10px/1 'Open Sans'",
            textAlign: 'center',
            textBaseline: 'top',
            text: attributes.gst!=null&&attributes.gst<100?attributes.gst.toString():'',
            offsetY: -20,
            offsetX: -20,
            fill: new Fill({color: 'orange'})
        }),
        'snowDepth': new Text({
            font: "Bold 10px/1 'Open Sans'",
            textAlign: 'center',
            textBaseline: 'top',
            text: attributes.snowDepth!=null&&attributes.snowDepth<100&&attributes.snowDepth>0?attributes.snowDepth.toString():'',
            offsetY: 15,
            offsetX: 0,
            fill: new Fill({color: 'orange'})
        }),
    }
    return styleObj[name]
}

const getHourRainStyle = (attributes, rLabel) => {
    return new Text({
        font: "Bold 10px/1 'Open Sans'",
        textAlign: 'center',
        textBaseline: 'top',
        text: attributes[rLabel]!=null&&attributes[rLabel]>0&&attributes[rLabel]<100?attributes[rLabel].toString():'',
        offsetY: 10,
        offsetX: -20,
        fill: new Fill({color: 'green'})
    })
}

export const pointStyleFunction = (features, opts) => {
    const feature = features.get('attributes')
    // debugger
    if(opts.stationType===''){
        return
    }else if(feature.stationType != opts.stationType&&opts.stationType!='all'){
        return
    }
    const stationName = new Style({
        image: new CircleStyle({
            radius: opts.station?4:0,
            fill: new Fill({color: 'rgba(255, 0, 0, 0.9)'}),
            stroke: new Stroke({color: 'red', width: 1}),
        }),
        text: createTextStyle(feature, opts.stationName),
    })
    const tem = new Style({
        text: createTextStyle(feature, opts.tem),
    })
    const pre = new Style({
        text: getHourRainStyle(feature, opts.rain ? opts.hourRain ? opts.hourRain : opts.rain : opts.rain),
    })
    const avgWind = new Style({
        image: createWindSymbol(feature.winSAvg10, feature.winDAvg10)
    })
    const vis = new Style({
        text: createTextStyle(feature, opts.vis),
    })
    const rhu = new Style({
        text: createTextStyle(feature, opts.rhu),
    })
    const gst = new Style({
        text: createTextStyle(feature, opts.gst),
    })
    const extremeWind = new Style({
        image: createWindSymbol(feature.winSInstMax, feature.winDInstMax),
    })
    const snowDepth = new Style({
        text: createTextStyle(feature, opts.snowDepth),
    })
    const styles = [stationName, tem, pre, vis, rhu, gst, snowDepth]
    opts.avgWind && styles.push(avgWind)
    opts.extremeWind && styles.push(extremeWind)
    return styles;
}

export const polygonStyleFunction = (features, legends) => {
  return new Style({
    fill: new Fill({
      color: 'rgba('+getColor(features.get('attributes').value,legends)+')',
    }),
    stroke: new Stroke({
      color: 'rgba('+getColor(features.get('attributes').value,legends)+')',
      width: 0.1,
    }),
  })
}
// 高亮样式
export const hightStyle = new Style({
  fill: new Fill({
    color: "rgba(255, 255, 255, 0.1)",
  }),
  stroke: new Stroke({
    color: '#FF0000',
    width: 2
  }),
})
export const hightTipStyle = (text) => {
  return new Style({
    text: new Text({
      text: text,
      font: "12px Calibri,sans-serif",
      fill: new Fill({
        color: "rgba(255, 255, 255, 1)",
      }),
      backgroundFill: new Fill({
        color: "rgba(0, 0, 0, 0.4)",
      }),
      padding: [2, 2, 2, 2],
      textAlign: "left",
      offsetX: 15,
    }),
  });
}

const getColor = (value, legendArr) => {
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
  return val
}

// 获取鼠标点击点的风场信息
export const getWindyDetail = (coord, allgrid) => {
  var lng = coord[0];
  var lat = coord[1];
  if(lng < allgrid.header.lo1 || lng > allgrid.header.lo2 || lat < allgrid.header.la1 || lat > allgrid.header.la2){
      // alert("暂无该区域风向数据！");
      return;
  }
  var xlength = Math.floor((lng-allgrid.header.lo1)/allgrid.header.dx);
  var ylength = Math.floor((allgrid.header.la2-lat)/allgrid.header.dy);
  var xdata,ydata;
  xdata = allgrid.data[ylength][xlength][0];
  ydata = allgrid.data[ylength][xlength][1];
  // console.log(xdata);
  // console.log(ydata);
  var v = Math.sqrt(Math.pow(xdata,2)+Math.pow(ydata,2));
  var angle = getWindyAngle(xdata,ydata);
  var result = {
      "direction":getWindyDirection(angle),
      "level":getWindyLevel(v),
      "speed":v.toFixed(2)
  };
  return result;
} 
// 获取风向
const getWindyDirection = (angle) => {
  if((angle >=0 && angle <= 22.5) || (angle <=360 && angle >337.5)){
    return "北风";
  }
  if(angle <=337.5 && angle >292.5){
      return "西北风";
  }
  if(angle <=292.5 && angle > 247.5){
      return "西风";
  }
  if(angle <=247.5 && angle > 202.5){
      return "西南风";
  }
  if(angle <= 202.5 && angle >157.5){
      return "南风";
  }
  if(angle <=157.5 && angle > 112.5){
      return "东南风";
  }
  if(angle <= 112.5 && angle >67.5){
      return "东风";
  }
  if(angle <= 67.5 && angle >22.5){
      return "东北风";
  }
}
// 获取风向角度
const getWindyAngle = (u, v) => {
  var fx = 0;
  if ((u > 0) & (v > 0)) {
    fx = 270 - (Math.atan(v / u) * 180) / Math.PI;
  } else if ((u < 0) & (v > 0)) {
    fx = 90 - (Math.atan(v / u) * 180) / Math.PI;
  } else if ((u < 0) & (v < 0)) {
    fx = 90 - (Math.atan(v / u) * 180) / Math.PI;
  } else if ((u > 0) & (v < 0)) {
    fx = 270 - (Math.atan(v / u) * 180) / Math.PI;
  } else if ((u == 0) & (v > 0)) {
    fx = 180;
  } else if ((u == 0) & (v < 0)) {
    fx = 0;
  } else if ((u > 0) & (v == 0)) {
    fx = 270;
  } else if ((u < 0) & (v == 0)) {
    fx = 90;
  } else if ((u == 0) & (v == 0)) {
    fx = 999.9;
  }
  return fx;
}
// 获取风力等级
const getWindyLevel = (v) => {
  if (v < 0.3) {
    return 0;
  }
  if (v >= 0.3 && v < 1.6) {
    return 1;
  }
  if (v >= 1.6 && v < 3.4) {
    return 2;
  }
  if (v >= 3.4 && v < 5.5) {
    return 3;
  }
  if (v >= 5.5 && v < 8.0) {
    return 4;
  }
  if (v >= 8.0 && v < 10.8) {
    return 5;
  }
  if (v >= 10.8 && v < 13.9) {
    return 6;
  }
  if (v >= 13.9 && v < 17.2) {
    return 7;
  }
  if (v >= 17.2 && v < 20.8) {
    return 8;
  }
  if (v >= 20.8 && v < 24.5) {
    return 9;
  }
  if (v >= 24.5 && v < 28.5) {
    return 10;
  }
  if (v >= 28.5 && v < 32.7) {
    return 11;
  }
  if (v >= 32.7 && v < 37.0) {
    return 12;
  }
  if (v >= 37.0 && v < 41.5) {
    return 13;
  }
  if (v >= 41.5 && v < 46.2) {
    return 14;
  }
  if (v >= 46.2 && v < 51.0) {
    return 15;
  }
  if (v >= 51.0 && v < 56.1) {
    return 16;
  }
  if (v >= 56.1 && v < 61.2) {
    return 17;
  }
  if (v >= 61.2) {
    return 18;
  }
}
// 等值面的填充样式
export const isoStyle = (feature, params) => {
  return new Style({
    fill: new Fill({
        color: params.colors[parseFloat(feature.get('value').split('-')[1]) * 10]
    })
  })
}
// 裁剪样式
export const clipStyle = new Style({
  fill: new Fill({
    color: 'black',
  }),
})
// kriging-counter等值面样式
export const krigingStyle = (color) => {
  return new Style({
    fill: new Fill({
      color: color
    }),
    stroke:new Stroke({
      color: color,
      width:3
    })
  })
}
// 格点等值面样式
const getRgb = (lvalue, tempIsosurfaceColor) => {
  for(let i=0; i<tempIsosurfaceColor.length; i++){
    if(lvalue>=tempIsosurfaceColor[i].valStart&&
        lvalue<tempIsosurfaceColor[i].valEnd){
        const val = tempIsosurfaceColor[i].colorR+','+tempIsosurfaceColor[i].colorG+','+tempIsosurfaceColor[i].colorB+',0.5' 
        // console.log('val', val)
        return val
    }
  }
}
export const gridIsoStyle = (features) => {
  return new Style({
    fill: new Fill({
      color: 'rgba('+getRgb(features.get('lvalue'),tempIsosurfaceColor)+')',
    }),
    stroke: new Stroke({
      color: 'rgba('+getRgb(features.get('lvalue'),tempIsosurfaceColor)+')',
      width: 0.1,
    }),
  })
}

export const style = new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.5)",
      lineDash: [10, 10],
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.7)",
      }),
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
    }),
  });

export const styleDrawTool = new Style({
    fill: new Fill({
      color: "rgba(0, 255, 255, 0.2)",
    }),
    stroke: new Stroke({
      color: "#ffcc33",
    //   lineDash: [10, 10],
      width: 2,
    }),
    image: new CircleStyle({
      radius: 7,
    //   stroke: new Stroke({
    //     color: "rgba(0, 0, 0, 0.7)",
    //   }),
      fill: new Fill({
        color: "#ffcc33",
      }),
    }),
  });

export const labelStyle = new Style({
    text: new Text({
      font: "14px Calibri,sans-serif",
      fill: new Fill({
        color: "rgba(255, 255, 255, 1)",
      }),
      backgroundFill: new Fill({
        color: "rgba(0, 0, 0, 0.7)",
      }),
      padding: [3, 3, 3, 3],
      textBaseline: "bottom",
      offsetY: -15,
    }),
    image: new RegularShape({
      radius: 8,
      points: 3,
      angle: Math.PI,
      displacement: [0, 10],
      fill: new Fill({
        color: "rgba(0, 0, 0, 0.7)",
      }),
    }),
  });

export const tipStyle = new Style({
    text: new Text({
      font: "12px Calibri,sans-serif",
      fill: new Fill({
        color: "rgba(255, 255, 255, 1)",
      }),
      backgroundFill: new Fill({
        color: "rgba(0, 0, 0, 0.4)",
      }),
      padding: [2, 2, 2, 2],
      textAlign: "left",
      offsetX: 15,
    }),
  });

export const modifyStyle = new Style({
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.7)",
      }),
      fill: new Fill({
        color: "rgba(0, 0, 0, 0.4)",
      }),
    }),
    text: new Text({
      text: "拖拽修改",
      font: "12px Calibri,sans-serif",
      fill: new Fill({
        color: "rgba(255, 255, 255, 1)",
      }),
      backgroundFill: new Fill({
        color: "rgba(0, 0, 0, 0.7)",
      }),
      padding: [2, 2, 2, 2],
      textAlign: "left",
      offsetX: 15,
    }),
  });

export const segmentStyle = new Style({
    text: new Text({
      font: "12px Calibri,sans-serif",
      fill: new Fill({
        color: "rgba(255, 255, 255, 1)",
      }),
      backgroundFill: new Fill({
        color: "rgba(0, 0, 0, 0.4)",
      }),
      padding: [2, 2, 2, 2],
      textBaseline: "bottom",
      offsetY: -12,
    }),
    image: new RegularShape({
      radius: 6,
      points: 3,
      angle: Math.PI,
      displacement: [0, 8],
      fill: new Fill({
        color: "rgba(0, 0, 0, 0.4)",
      }),
    }),
  });