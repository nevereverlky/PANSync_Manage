/*
包含 n 个日期时间处理的工具函数模块 
*/
import Moment from "moment";
/*格式化日期 */
export function formateDate(time) { 
    if (!time) return '' 
    let date = new Date(time * 1000); ////注意，毫秒的话就不用乘以1000了，秒才要乘以1000
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
     + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() 
}

export function tsFormat(ts) {
  return Moment(ts).format("YYYY-MM-DD HH:mm:ss");
}