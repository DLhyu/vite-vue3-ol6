<template>
    <div class="el-dialog__title">
        <span>{{title}}</span>
        <span class="dialog-title_tools">
            <el-button type="text" :icon="isCollapse? 'el-icon-arrow-right' : 'el-icon-arrow-down'" size="medium" @click="toggle"></el-button>
        </span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isCollapse: false
        }
    },
    props: {
        title: String
    },
    methods: {
        toggle() {
            this.$emit('toggle')
            this.isCollapse = !this.isCollapse
        }
    }
}
</script>