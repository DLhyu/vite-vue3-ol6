<!--
 * @Description: openlayer地图初始化
 * @Author: huyong
 * @Date: 2021-10-14 12:50:10
 * @LastEditTime: 2022-01-05 14:52:46
 * @LastEditors:  
-->
<template>
    <div>
        <!-- <h2 class="msg-h2">{{ msg }}</h2> -->
        <div id="map" ref="map" class="map-div"></div>
        <!-- <el-button @click="showRightPanle" type="primary" class="msg-h2">显隐右边面板</el-button> -->
        <!-- <layerGroup v-if="isRightMenu"></layerGroup> -->
        <div id="mouse-position" ref="mousePositionDom"></div>
        <div ref="popup" class="ol-popup">
            <a href="#" ref="popupCloser" class="ol-popup-closer"></a>
            <div id="popup-content"></div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, toRefs, onMounted, getCurrentInstance } from 'vue'    // vue相关方法
// import LayerGroup from '@/views/layers/LayerGroup.vue'
import mixins from '@/mixins'
import ol from '@/ol/'
import { initObjMap, getMapAll } from "./comMap.js";
import OlMap from "./map.js";
export default defineComponent({
    name: "Map",
    // components: { LayerGroup },
    props: { msg: { type: String, default: '欢迎来到vue3+ol+vite' } },
    setup(props) {
        // let isRightMenu = ref(false)
        // const showRightPanle = () => {
        //     isRightMenu.value = !isRightMenu.value;
        // };
        const { proxy, ctx } = getCurrentInstance()
        let _this = proxy
        let map = ref(null) // 存放地图实例，绑定OSM地图实例的变量
        let mousePositionDom = ref(null)
        let popup = ref(null)
        let popupCloser = ref(null)

        onMounted(() => {
            // 在元素加载完之后再执行地图初始化
            map = new OlMap(map.value)
            _this.map = map
            // const initOl = (olMap) => {
            //     for(const key in ol){
            //         ol[key].olMap = _this
            //         olMap.station = ol[key]
            //         // olMap[key] = options => new ol[key](options)
            //     }
            // }
            // initOl(_this)
            mixins.initOlApp(_this)
            // isRightMenu.value = !isRightMenu.value;
            initObjMap(map)
            // 添加地图控件
            map.initControl(mousePositionDom)
            const mapAll = getMapAll()
            mapAll.mousePositionDom = mousePositionDom.value
            mapAll.popup = popup.value
            mapAll.popupCloser = popupCloser 
        })
        return {
            msg: props.msg,
            // isRightMenu,
            // showRightPanle,
            mousePositionDom,
            popup,
            popupCloser,
            map
        }
    },
})
</script>

<style scoped>
.msg-h2{
    position: absolute;
    top: 0px; 
    left: 50px;
    z-index: 99;
}
.map-div{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
}
#mouse-position {
  position: fixed;
  bottom: 0px;
  left: 50%;
  /* right: 50%; */
  width: 200px;
  height: 20px;
  transform: translate(-50%, -50%);
  /* 将z-index设置为显示在地图上层 */
  z-index: 99;
}
/* 显示鼠标信息的自定义样式设置 */
:deep().custom-mouse-position {
  color: blue;
  font-size: 16px;
  font-family: "微软雅黑";
}
.ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 230px;
    z-index: -1;
}
.ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}
.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}
.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
}
.ol-popup-closer:after {
    content: "✖";
}
</style>