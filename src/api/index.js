/*
包含 n 个接口请求函数的模块 
每个函数返回 promise 

基本要求：能根据接口文档定义接口请求函数
*/
import ajax from './ajax'
import ajax2 from './ajax2'
import ajax3 from './ajax-file'
// const BASE = 'http://localhost:5000'
const BASE = '/api'

// 账号登录
export const reqLogin = (username, password) => ajax(BASE + '/user/login', {username, password}, 'POST')
//获取百度网盘文件列表
export const reqFileList = (accessToken, dir) => ajax2(BASE + '/pan/baidu/getFileList', {accessToken, dir}, 'POST')
//管理文件，复制，移动，重命名，删除
export const reqManageFile = (accessToken, async, filelist, opear) => ajax2(BASE + '/pan/baidu/manageFile', {accessToken, async, filelist, opear}, 'POST')
//获取百度网盘的文件树状结构
export const reqFileTree = (accessToken, path) => ajax2(BASE + '/pan/baidu/getFileListAll', {accessToken, path}, 'POST')
//文件下载
export const reqDownloadFile = (accessToken, fsids) => ajax2(BASE + '/pan/baidu/downFile', {accessToken, fsids}, 'POST')
//新增文件夹
export const reqCreateFile = (accessToken, isdir, path, size, blockList, uploadid) => ajax2(BASE + '/pan/baidu/createFileUp', {accessToken, isdir, path, size, blockList, uploadid}, 'POST')
//上传文件
export const reqUploadFile = (formDate) => ajax3(BASE + '/pan/baidu/upFile', formDate, {}, 'POST')

//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})
//更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')
//获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
