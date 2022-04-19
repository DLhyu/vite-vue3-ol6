/*
 * @Description: 
 * @Author: huyong
 * @Date: 2021-10-13 16:19:44
 * @LastEditTime: 2021-10-13 17:15:44
 * @LastEditors:  
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import("@/views/index.vue")
  },
]

export default createRouter({
  history: createWebHistory(),
  routes
})