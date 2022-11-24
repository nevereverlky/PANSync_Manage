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

export function utc2timestamp(utc_datetime) {
  // 转为正常的时间格式 年-月-日 时:分:秒
  var T_pos = utc_datetime.indexOf('T');
  var Z_pos = utc_datetime.indexOf('Z');
  var year_month_day = utc_datetime.substr(0,T_pos);
  var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
  var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
  // 处理成为时间戳
  var timestamp = new Date(Date.parse(new_datetime)).getTime() /1000;
  return timestamp;
}