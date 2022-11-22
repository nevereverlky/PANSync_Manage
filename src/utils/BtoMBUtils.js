/*
包含文件大小转换处理的工具函数模块 
*/
import numeral from 'numeral';
const unitsList = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB'];
export const b2ValueUnit = (val, fmt) => {
    let unit = 'B';
    let value = numeral(val);
    unitsList.forEach((item) => {
        if (value.value() >= 1024) {
            value = value.divide(1024);
            unit = item;
        }
    });
    return [numeral(value).format(fmt), unit];
};