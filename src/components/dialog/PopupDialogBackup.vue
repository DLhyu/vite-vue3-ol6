<template>
    <el-dialog :width="width" :top="top" :height="height" :modal="false" :visible.sync="isVisible" class="tool-panel" 
        :close-on-press-escape="false" :close-on-click-modal="false" v-dialogDrag :before-close="beforeClose">
        <tool-title slot="title" :title="title" @toggle="toggle"></tool-title>
        <el-scrollbar :style="{height:height}">
            <component :is="component" ref="bodyComp"></component>
        </el-scrollbar>
    </el-dialog>
</template>

<script>
import ToolTitle from './ToolTitle.vue'
import mixins from '@/mixins'

export default {
    mixins: [mixins.dialogWin],
    components: {
        ToolTitle
    },
    data() {
        return {            
        }
    },
    props: {
        title: String,
        width: [String,Number],
        height: [String,Number],
        top: [String, Number],
        component: [Object,Function]
    },
    methods: {

    }
}
</script>