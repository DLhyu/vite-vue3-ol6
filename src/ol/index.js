/*
 * @Description: 
 * @Author: huyong
 * @Date: 2021-12-31 14:41:55
 * @LastEditTime: 2022-04-18 19:59:46
 * @LastEditors:  
 */
import * as station from './realWeather/station'
import * as grid from './realWeather/grid'
import * as pArrowAnimate from './analysis/pArrowAnimate'

const ol = {
    ...station,
    ...grid,
    ...pArrowAnimate
}

export default ol