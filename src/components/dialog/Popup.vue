<!--
 * @Description: 
 * @Author: huyong
 * @Date: 2021-11-25 16:47:38
 * @LastEditTime: 2021-11-25 16:58:32
 * @LastEditors:  
-->
<template>
    <div class="popup">    <!-- 封装弹框 -->
        <el-dialog
                :title="title"
                v-model="visible"
                :width="width"
                :before-close="handleClose">
            <slot>
                <p>弹框自定义的内容</p>
            </slot>
            <span slot="footer" class="dialog-footer">
                <el-button @click="Cancel">取 消</el-button>
                <el-button type="primary" @click="Save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { defineComponent, ref } from "vue";
    export default defineComponent({
        name: 'popup',
        props: {
            title: {
                type: String,
                default: '标题'
            },
            visible: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: '550px'
            }
        },
        setup(props) {
            return {
                title: props.title,
                width: props.width,
                visible: props.visible,
            };
        },
        computed: {
            visible: {
                get() {
                    return this.visible
                },
            }
        },
        methods: {
            Cancel() {
                this.$emit('resetPopupData')
            },
            Save() {
                this.$emit('submitPopupData')
            },
            handleClose() {
                this.$emit('handleClose')
            }
        }
    })
</script>

<style lang="scss">
    .popup {
        width: 550px;

        .el-dialog {
            z-index: 9;
            background-color: #fff;
            border-radius: 5px;
            margin-top: 10% !important;
        }

        .el-dialog__header {
            width: 100%;
            height: 40px;
            line-height: 38px;
            border-bottom: 1px solid #f6f7f9;
            box-sizing: border-box;
            padding: 0 20px;
            font-size: 16px;
        }

        .el-dialog__close.el-icon.el-icon-close {
            font-size: 20px;
            width: 17px;
            height: 17px;
        }

        .el-button.el-button--default {
            width: 88px;
            color: #1182fb;
            border: 1px solid #1182fb;
        }

        .el-button.el-button--primary {
            width: 88px;
        }

        .el-dialog__body {
            padding: 24px 32px;
            box-sizing: border-box;
        }

        .el-dialog__headerbtn {
            top: 4px;
        }

        .el-dialog__title {
            color: #3c4354;
            font-size: 16px;
            line-height: 16px;
        }

        .el-dialog__footer {
            text-align: center;
        }
    }
</style>