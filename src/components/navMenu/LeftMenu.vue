<!--
 * @Description: 
 * @Author: huyong
 * @Date: 2021-09-17 21:25:08
 * @LastEditTime: 2021-11-24 15:04:56
 * @LastEditors:  
-->
<template>
  <div class="leftMenu">
    <el-header :style="{ height: screenHeight + 'px' }">
      <el-container>
        <el-header>
          <div class="icons" @click="toggleCollapse">
            <i class="el-icon-s-unfold" v-if="isCollapse"></i>
            <i class="el-icon-s-fold"></i>
          </div>
        </el-header>
      </el-container>
      <el-menu
        background-color="#2e353e"
        text-color="#ffffff"
        active-text-color="#409eff"
        default-active="ningxiaReal"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
      >
        <el-sub-menu index="realWeather">
          <template #title>
            <i class="el-icon-menu"></i>
            <span>天气实况</span>
          </template>
          <el-menu-item-group v-for="item in realtime" :key="item.action">
            <el-menu-item :index="item.action" @click="showTool(item)">{{
              item.label
            }}</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="spatialAnalysis">
          <template #title>
            <i class="el-icon-menu"></i>
            <span>空间分析</span>
          </template>
          <el-menu-item-group
            v-for="item in spatialAnalysis"
            :key="item.action"
          >
            <el-menu-item :index="item.action" @click="showTool(item)">{{
              item.label
            }}</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="3">
          <i class="el-icon-menu"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-document"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
        <el-menu-item index="5">
          <i class="el-icon-setting"></i>
          <span slot="title">导航五</span>
        </el-menu-item>
      </el-menu>
    </el-header>
  </div>
</template>

<script>
import { realtime, spatialAnalysis } from "./localData";
export default {
  name: "leftMenu",
  setup() {},
  data() {
    return {
      isCollapse: false,
      screenHeight: "auto",
      realtime,
      spatialAnalysis,
    };
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    this.showDefaultTool();
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    showTool(tool) {
      this.activedTool = tool.action;
      this.$emit("showDialog", tool);
    },
    showDefaultTool() {
      // console.log('showDefaultTool')
      this.realtime.length && this.showTool(this.realtime[0]);
    },
  },
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
  min-height: 400px;
}
.el-sub-menu .el-menu-item {
  min-width: 160px;
}
.leftMenu {
  position: absolute;
  /* top: 15px;
  left: 15px; */
  display: block;
  width: auto;
  height: auto;
}
.el-menu {
  border: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
  min-height: 400px;
  text-align: left;
}
.el-header,
.el-footer {
  background-color: rgb(255, 255, 255);
  color: #333;
  line-height: 40px;
  padding: 0 !important;
  height: 40px !important;
}
.el-header i {
  font-size: 18px;
}
.el-aside {
  background-color: rgb(61, 61, 61);
  color: #333;
  text-align: center;
  /* line-height: 200px; */
}
body > .el-container {
  margin-bottom: 40px;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}
.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.icons {
  width: 25px;
  height: 40px;
  padding: 0 20px;
  text-align: center;
}
.icons:hover {
  background: rgb(248, 248, 248);
  transition: 1s;
  cursor: pointer;
}
</style>
