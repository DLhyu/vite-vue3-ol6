<!--
 * @Description: 
 * @Author: huyong
 * @Date: 2021-10-13 16:15:25
 * @LastEditTime: 2022-01-06 16:01:23
 * @LastEditors:  
-->
<template>
  <div class="container">
    <div class="map-left-panel">
      <component :is="leftMenu" @showDialog="showRightDialog"> </component>
    </div>
    <Map ref="mapRef"></Map>
    <MapToolbar></MapToolbar>
    <!-- <div class="map-right-panel tool-panel">
      <component :is="rightPanel"></component>
    </div>
    <PopupDialog
      v-for="item in dialogList"
      :key="item.id"
      :ref="item.id"
      @beforeClose="onCloseRightDialog"
      :title="item.title"
      top="10px"
      :width="item.width"
      :height="item.height"
      :component="item.component"
    ></PopupDialog> -->
    <PopupDialog ref="popupRef"
      :title="title"
      :append-to-body="true"
      width="28%"
      @handleDialogClose="handleDialogClose"></PopupDialog>
    <!-- <popup
          :title="title"
          @resetPopupData="resetPopupData"
          @submitPopupData="submitPopupData"
          @handleClose="handleClose"
          width="'550px'">
      <div>
          内容填充
      </div>
    </popup> -->
  </div>
</template>

<script>
// import HelloWorld from "@/views/HelloWorld.vue"
import LeftMenu from "@/components/navMenu/LeftMenu.vue";
import Map from "@/components/ol/Map.vue";
import MapToolbar from "@/components/ol/MapToolbar.vue";
import LayerGroup from '@/views/layers/LayerGroup.vue'
import RightMenu from "@/components/navMenu/RightMenu.vue";
// import ToolBox from "@/components/ToolBox.vue";
import PopupDialog from "@/components/dialog/PopupDialog.vue";
// import Popup from "@/components/dialog/Popup.vue";
import dialogdrag from "@/utils/dialogdrag.js"
import { defineComponent, ref, onMounted, computed } from "vue";
export default defineComponent({
  name: "index",
  components: { Map, MapToolbar, LeftMenu, RightMenu, PopupDialog },
  setup() {
    const dialogList = [];
    const popupRef = ref()
    const mapRef = ref()
    let title = ref('hello')
    let cb = ref(false)
    const showRightDialog = (tool) => {
      console.log("tool", tool);
      console.log("popupRef", popupRef.value)
      title.value = tool.label;
      console.log('title',title.value)
      const name = tool.action;
      console.log('name',name)
      // popupRef.value.changeVisible(true)
      if(name==='ningxiaReal'){
        popupRef.value.setComponent(LayerGroup)
      }else if(name==='gridReal'){
        popupRef.value.setComponent(RightMenu)
      }
      popupRef.value.changeVisible(true)
      popupRef.value.removeDom(tool.label)
      if(cb.value){
        handleDialogClose()
      }
      cb.value = true
    }
    const handleDialogClose = () => {
      console.log("关闭X")
      cb.value = false
      popupRef.value.bodyComp.clearData()
    }
    onMounted(()=>{
      dialogdrag.bind(popupRef.value.dialogRef.dialogRef)
    })
    return {
      title,
      dialogList,
      leftMenu: LeftMenu,
      rightPanel: null,
      showRightDialog,
      popupRef,
      handleDialogClose,
      mapRef
    };
  },
  data() {
    const dialogList = [];
    return {
      isRightMenu: false,
      leftMenu: null,
      rightPanel: null,
      rightBoxShow: false,
      dialogList,
    };
  },
  mounted() {
    this.leftMenu = LeftMenu;
  },
  methods: {
    // 点击取消的事件
            resetPopupData () {
                //  这里可重置数据
                console.log('点击取消')
            },
            // 点击确定的按钮
            async submitPopupData () {
                 console.log('点击确定')
            },
            // 关闭弹框（头部的X）
            handleClose () {
                console.log('头部的X')
            },
    showRightMenu() {
      this.isRightMenu = true;
    },
    closeRightMenu() {
      this.isRightMenu = false;
    },
    showRightTool(tool) {
      this.rightPanel = tool.component;
      this.rightBoxShow = true;
    },
    findChild(name, childObj) {
      // if (name == 'otherReal' || name == 'satelliteTest' || name == 'radarTest' || name == 'gridReal') {
      const lenLv1 = childObj.$children.length - 1;
      const childLv1 = childObj.$children[lenLv1];
      const lenLv2 = childLv1.$children.length - 1;
      const childLv2 = childLv1.$children[lenLv2];
      const lenLv3 = childLv2.$children.length - 1;
      const childLv3 = childLv2.$children[lenLv3];
      // console.log('dialog', name, childLv2, childLv1, childLv3)
      // childLv3.ready()
      // }
    },
    showRightDialog(tool) {
      console.log("tool", tool);
      const dialogList = this.dialogList;
      const name = tool.action;
      let info = dialogList.find((it) => it.id == name);
      if (info) {
        const dialog = this.$refs[name][0];

        this.findChild(name, dialog);
        return dialog.show();
      }
      let comp = tool.component;
      if (!comp) return false;
      const clientHeight = document.body.clientHeight;
      const compHeight = clientHeight
        ? clientHeight - 200 + "px"
        : clientHeight;
      dialogList.push({
        id: name,
        title: tool.title || tool.label,
        width: tool.width || "350px",
        height: tool.height || compHeight || "auto",
        component: comp,
      });
      // this.$nextTick(() => {
      //   debugger;
      //   const dialog = this.$refs[name][0];
        // this.findChild(name, dialog)
        // this.dialogTableVisible = true
      //   dialog.show();
      // });
    },
    onCloseRightDialog(dialog) {
      const comp = dialog.$refs.bodyComp;
      if (comp.close) {
        comp.close();
      }
    },
  },
});
</script>
<style scoped>
.container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: block;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}
</style>
