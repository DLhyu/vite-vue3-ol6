<!--
 * @Description: 地图工具条
 * @Author: huyong
 * @Date: 2021-11-27 11:25:15
 * @LastEditTime: 2021-12-18 16:17:17
 * @LastEditors:  
-->
<template>
    <div class="map_toolbar_container">
        <el-dropdown size="mini" :hide-on-click="hideOnClick">
            <span class="el-dropdown-link">
            {{basemaoControl}}
            <el-divider direction="vertical"></el-divider>
            </span>
            <template #dropdown>
            <el-dropdown-menu>
                <el-radio-group v-model="radio1" @change="changeRadio">
                <span v-for="item in basemapArr" :key="item.value">
                    <el-dropdown-item><el-radio size="mini" :label="item.value">{{item.name}}</el-radio></el-dropdown-item>
                </span>
                </el-radio-group>
            </el-dropdown-menu>
            </template>
        </el-dropdown>

        <el-dropdown size="mini" :hide-on-click="hideOnClick">
            <span class="el-dropdown-link">
            {{conControl}}
            <el-divider direction="vertical"></el-divider>
            </span>
            <template #dropdown>
            <el-dropdown-menu>
                <!-- <span v-for="item in controlArr" :key="item.value"> -->
                    <el-dropdown-item><el-checkbox v-model="checked1" size="mini" label="fullscreen" @change="changeCheck('fullscreen', checked1)">全屏</el-checkbox></el-dropdown-item>
                    <el-dropdown-item><el-checkbox v-model="checked2" size="mini" label="scaleline"  @change="changeCheck('scaleline', checked2)">比例尺</el-checkbox></el-dropdown-item>
                    <el-dropdown-item><el-checkbox v-model="checked3" size="mini" label="mousePosition"  @change="changeCheck('mousePosition', checked3)">鼠标位置</el-checkbox></el-dropdown-item>
                <!-- </span> -->
            </el-dropdown-menu>
            </template>
        </el-dropdown>

        <el-dropdown size="mini" :hide-on-click="hideOnClick">
            <span class="el-dropdown-link">
            {{measureTool}}
            <el-divider direction="vertical"></el-divider>
            </span>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item><el-button size="mini" @click="measure('LineString')">测距</el-button></el-dropdown-item>
                <el-dropdown-item><el-button size="mini" @click="measure('Polygon')">测面</el-button></el-dropdown-item>
            </el-dropdown-menu>
            </template>
        </el-dropdown>

        <el-dropdown size="mini" :hide-on-click="hideOnClick">
            <span class="el-dropdown-link">
            {{drawTool}}
            <el-divider direction="vertical"></el-divider>
            </span>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item><el-button size="mini" @click="drawHander('Point')">绘制点</el-button></el-dropdown-item>
                <el-dropdown-item><el-button size="mini" @click="drawHander('LineString')">绘制线</el-button></el-dropdown-item>
                <el-dropdown-item><el-button size="mini" @click="drawHander('Polygon')">绘制面</el-button></el-dropdown-item>
                <el-dropdown-item><el-button size="mini" @click="drawHander('Circle')">绘制圆</el-button></el-dropdown-item>
                <el-dropdown-item><el-button size="mini" @click="drawHander('Squre')">绘制矩形</el-button></el-dropdown-item>
                <el-dropdown-item><el-button size="mini" @click="drawHander('Hand')">手绘</el-button></el-dropdown-item>
            </el-dropdown-menu>
            </template>
        </el-dropdown>

        <el-dropdown size="mini" :hide-on-click="hideOnClick" disabled>
            <el-button size="mini" @click="clearLastDraw">{{revoke}}</el-button>
            <el-divider direction="vertical"></el-divider>
        </el-dropdown>
        <el-dropdown size="mini" :hide-on-click="hideOnClick" disabled>
            <el-button size="mini" @click="printMap">{{print}}</el-button>
            <el-divider direction="vertical"></el-divider>
        </el-dropdown>
        <el-dropdown size="mini" :hide-on-click="hideOnClick" disabled>
            <el-button size="mini" @click="clearMap">{{clear}}</el-button>
        </el-dropdown>
    </div>
    <PreviewModel ref="previewRef"/>
</template>
<script>
import { basemapArr, controlArr } from './localData'
import { getMap, getMapAll } from "@/components/ol/comMap.js";
import { defineComponent, ref, onMounted, reactive, toRefs } from 'vue'
import PreviewModel from "@/components/ol/previewModel.vue";
export default defineComponent({
    name: 'MapToolbar',
    components: { PreviewModel },
    props: reactive({ basemaoControl: {type: String, default: '底图控制'},
            conControl: {type: String, default: '控件控制'},
            measureTool: {type: String, default: '量测工具'},
            drawTool: {type: String, default: '绘制工具'},
            revoke: {type: String, default: '撤销'},
            print: {type: String, default: '打印'},
            clear: {type: String, default: '清除'},}),
    setup(props, {emit}){
        let map = ref(null)
        let previewRef = ref(null)
        const elementsControl = reactive({
            hideOnClick: ref(false),
            radio1: ref('arcgismap'),
            checked1: ref(true),
            checked2: ref(true),
            checked3: ref(true),
        })
        const mapTool = reactive({
            changeCheck: (val, item) => {
                map.changeControl(val, item)
            },
            changeRadio: (val) => {
                map.changeBaseMap(val)
            },
            measure: (type) => {
                // console.log('type', type)
                map.measureTool(type)
            },
            clearMap: () => {
                map.clearMap()
            },
            drawHander: (type) => {
                map.drawTool(type)
            },
            clearLastDraw: () => {
                map.clearLastDraw()
            },
            // printMap: () => {
            //     const {dataUrl} = new Promise((resolve) => {
            //         return resolve(map.printMap());
            //     });
            //     console.log('dataUrl', dataUrl)
            //     // map.printMap()
            //     // previewRef.value.filterData({dataUrl:'', picName:'打印'})
            // }
        })
        async function printMap(){
            const {dataUrl} = await map.printMap()
            const params = {dataUrl:dataUrl, picName:'打印'}
            // console.log('params', params)
            previewRef.value.filterData(params)
        }
        onMounted(()=>{
            map = getMap()
            console.log('map2', getMap())
            const mapAll = getMapAll()
            console.log('mousePositionDom', mapAll.mousePositionDom)
        })
        return{
            ...toRefs(props),
            ...toRefs(elementsControl),
            basemapArr,
            controlArr,
            ...toRefs(mapTool),
            previewRef,
            printMap
        }
    }
})
</script>
<style scoped>
.map_toolbar_container{
    position: absolute;
    top: 0;
    left: 200px;
    z-index: 99;
    width: 512px;
    height: 30px;
    border: 0px #cccccc solid;
    background-color: #ffffff;
    opacity: 0.8;
    padding: 0 5px;
    line-height: 28px;
}
.el-dropdown-link{
    cursor: pointer;
}
</style>