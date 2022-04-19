import { createApp } from 'vue'
import router from './router/index.js'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import vuedraggable from 'vuedraggable'
import dialogDrag from './directives'
import './assets/style/main.css'
// 统一导入el-icon图标
import * as ElIconModules from '@element-plus/icons'
// 导入转换图标名称的函数
import { transElIconName } from './utils/utils.js' 

const app = createApp(App)
// 统一注册el-icon图标
for(let iconName in ElIconModules){
  app.component(transElIconName(iconName),ElIconModules[iconName])
}

app.use(ElementPlus, {
    locale: zhCn,
    size: 'small',
    menuType: 'text'
  })
app.use(router)
app.use(dialogDrag)
app.mount('#app')
app.component('vuedraggable', vuedraggable) // 注册全局组件
