/*
 * @Description: 
 * @Author: huyong
 * @Date: 2021-11-03 16:03:10
 * @LastEditTime: 2021-11-03 16:50:01
 * @LastEditors:  
 */
const mapApp = {
    olObj: null
}

export function initOlApp(olObj){
    mapApp.olObj = olObj
}

export const olMixin = {
    data(){
        const olObj = mapApp.olObj
        return{
            olObj
        }
    }
}