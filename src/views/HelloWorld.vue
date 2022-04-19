<!--
 * @Description: 
 * @Author: huyong
 * @Date: 2021-10-13 16:17:11
 * @LastEditTime: 2021-10-14 11:24:32
 * @LastEditors:  
-->
<template>
  <h1>{{ msg }}</h1>
  <button @click="realTime.count++">count is: {{ realTime.count }}</button>
  <button @click="handleclick">点击跳转其它路由</button>
  <el-button type="primary">el-button</el-button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'helloWorld',
  props: { msg: { type: String, default: '欢迎来到vue3' } },
  setup(props) {
    const router = useRouter();
    let realTime = reactive({ count: 0 });

    function handleclick() {
      router.push({ path: '/other' })
    }
    return {
      msg: props.msg,
      realTime,
      handleclick
    }
  }
})
</script>