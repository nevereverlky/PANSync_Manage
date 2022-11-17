/*
包含 n 个接口请求函数的模块 
每个函数返回 promise 

基本要求：能根据接口文档定义接口请求函数
*/
import ajax from './ajax'
// const BASE = 'http://localhost:5000'
const BASE = '/api'

// 账号登录
export const reqLogin = (username, password) => ajax(BASE + '/user/login', {username, password}, 'POST')
//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})
//更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')
//获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
