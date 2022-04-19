/*
 * @Description: 
 * @Author: huyong
 * @Date: 2021-12-09 11:04:40
 * @LastEditTime: 2022-01-05 17:31:35
 * @LastEditors:  
 */
// 将el-icon的组件名称AbbbCddd转化为i-abbb-cddd形式
// 此前用switch做组件名时因关键字重复报错，所以格式统一加了前缀
// 例：Switch转换为i-switch，ArrowDownBold转换为i-arrow-down-bold
export function transElIconName(iconName){
    return 'i'+iconName.replace(/[A-Z]/g,(match)=>'-'+match.toLowerCase())
}
// 格点等值面色值范围
export const tempIsosurfaceColor =
[
    {'valStart':40,'valEnd':100,'colorR':138,'colorG':5,'colorB':25},
    {'valStart':30,'valEnd':40,'colorR':194,'colorG':0,'colorB':3},
    {'valStart':20,'valEnd':30,'colorR':231,'colorG':75,'colorB':26},
    {'valStart':10,'valEnd':20,'colorR':240,'colorG':132,'colorB':10},
    {'valStart':0,'valEnd':10,'colorR':244,'colorG':217,'colorB':99},
    {'valStart':-10,'valEnd':0,'colorR':135,'colorG':175,'colorB':229},
    {'valStart':-20,'valEnd':-10,'colorR':97,'colorG':150,'colorB':224},
    {'valStart':-30,'valEnd':-20,'colorR':38,'colorG':87,'colorB':179},
    {'valStart':-40,'valEnd':-30,'colorR':17,'colorG':49,'colorB':139},
    {'valStart':-100,'valEnd':-40,'colorR':2,'colorG':12,'colorB':100},
]
export const temperatureCor = [ {
    'r' : 0,
    'g' : 0,
    'b' : 255,
    'value' : "-40",
    'text' : "-40 -30.1"
  }, {
    'r' : 0,
    'g' : 0,
    'b' : 255,
    'value' : "-30",
    'text' : "-30~-20.1"
  }, {
    'r' : 0,
    'g' : 166,
    'b' : 255,
    'value' : "-20",
    'text' : "-20~-10.1"
  }, {
    'r' : 0,
    'g' : 255,
    'b' : 181,
    'value' : "-10",
    'text' : "-10~-0.1"
  }, {
    'r' : 0,
    'g' : 255,
    'b' : 8,
    'value' : "0",
    'text' : "0~9.9"
      
  }, {
    'r' : 148,
    'g' : 255,
    'b' : 0,
    'value' : "10",
    'text' : "10~19.9"
  }, {
    'r' : 255,
    'g' : 195,
    'b' : 0,
    'value' : "20",
    'text' : "20~29.9"
  }, {
    'r' : 255,
    'g' : 44,
    'b' : 0,
    'value' : "30",
    'text' : "30~39.9"
  }, {
    'r' : 255,
    'g' : 10,
    'b' : 0,
    'value' : "40",
    'text' : "40~44.9"
  }, {
    'r' : 255,
    'g' : 10,
    'b' : 0,
    'value' : "45",
    'text' : ">=45"
  } ]