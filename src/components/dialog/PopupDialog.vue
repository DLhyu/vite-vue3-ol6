<!--
 * @Description: 
 * @Author: huyong
 * @Date: 2021-11-24 16:45:20
 * @LastEditTime: 2022-01-06 16:01:59
 * @LastEditors:  
-->
<template>
    <div>
    <el-dialog
        ref="dialogRef"
        v-model="centerDialogVisible"
        :title="title"
        :width="width"
        :center="true"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal="false"
        :destroy-on-close="true"
        :append-to-body="false"
        custom-class="tool-panel"
        @close="handleDialogClose"
    >
        <!-- 插槽 -->
        <slot>
            <el-scrollbar height="500px" max-height="800px" view-class="scrollbar_view_class">
                <component :is="component.comp" ref="bodyComp"></component>
            </el-scrollbar>
        </slot>
    </el-dialog>
    </div>
</template>

<script>
import { defineComponent, ref, shallowRef, markRaw, toRaw, toRefs } from "vue";
export default defineComponent({
  name: "PopupDialog",
  props: { title: { type: String, default: "hello world" }, width: {
      type: String || Number,
      default: '30%'
    } },
  setup(props, {emit}) {
    const component = shallowRef({
        comp: null
    })
    const dialogRef = ref('')
    const bodyComp = ref('')
    const centerDialogVisible = ref(false);
    const changeVisible = (vis) => {
        centerDialogVisible.value = vis;
    };
    const setComponent = (com) => {
        component.value.comp = com
    }
    const removeDom = (name) => {
        // debugger
        const dialogDom = dialogRef.value.$el.parentNode
        const childDom = dialogDom.childNodes
        const elDom = dialogDom.querySelector('.el-dialog')
        const title = elDom.querySelector('.el-dialog__title')
        title.innerHTML = name
        elDom.style.display = 'block'             
        dialogDom.appendChild(elDom)
        if(childDom.length>2){
            dialogDom.removeChild(childDom[1]);
        }
        // const parentEl = dialogRef.value.$el.parentNode
        // parentEl.removeChild(elDom)
        // console.log("dialogRef", dialogRef.value)
    }
    const handleDialogClose = ()=> {
        const dialogDom = dialogRef.value.$el.parentNode.querySelector('.el-dialog')
        dialogDom.style.display = 'none'             
        emit('handleDialogClose')
    }
    return {
      title: props.title,
      width: props.width,
      centerDialogVisible,
      changeVisible,
      dialogRef,
      component,
      setComponent,
      removeDom,
      handleDialogClose,
      bodyComp
    };
  },
});
</script>
<style scoped>
.dialo-modal {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 600px;
  width: 500px;
  border: 1px #030303 solid;
}
.scrollbar_view_class{
    border: 1px #cccccc solid;
}
</style>
