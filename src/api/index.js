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
/**客户端 */
//获取可见的存储列表
export const reqVisibleStoreList = () => ajax(BASE + '/store/getStoreListVisible', {}, 'POST')
//获取百度网盘文件列表
export const reqFileList = (accessToken, dir) => ajax2(BASE + '/pan/baidu/getFileList', {accessToken, dir}, 'POST')
//管理百度网盘文件，复制，移动，重命名，删除
export const reqManageFile = (accessToken, async, filelist, opear) => ajax2(BASE + '/pan/baidu/manageFile', {accessToken, async, filelist, opear}, 'POST')
//获取百度网盘的文件树状结构
export const reqFileTree = (accessToken, path) => ajax2(BASE + '/pan/baidu/getFileListAll', {accessToken, path}, 'POST')
//百度网盘文件下载
export const reqDownloadFile = (accessToken, fsids) => ajax2(BASE + '/pan/baidu/downFile', {accessToken, fsids}, 'POST')
//新增百度网盘文件夹
export const reqCreateFile = (accessToken, isdir, path, size, blockList, uploadid) => ajax2(BASE + '/pan/baidu/createFileUp', {accessToken, isdir, path, size, blockList, uploadid}, 'POST')
//上传百度网盘文件
export const reqUploadFile = (formDate) => ajax3(BASE + '/pan/baidu/upFile', formDate, {}, 'POST')
//获取WebDav文件列表
export const reqWebDavFileList = (storeId, filepath) => ajax(BASE + '/pan/webdav/getFileList', {storeId, filepath}, 'POST')
//WebDav文件下载
export const reqDownloadWebDavFile = (storeId, filepath) => ajax2(BASE + '/pan/webdav/download', {storeId, filepath}, 'POST')
//WebDav文件删除 
export const reqDeleteWebDavFile = (storeId, filepath) => ajax(BASE + '/pan/webdav/delete', {storeId, filepath}, 'POST')

/**管理端 */
//获取存储列表
export const reqStoreList = () => ajax2(BASE + '/store/getStoreList', {}, 'POST')
//根据id获取存储列表
export const reqStoreListById = (id) => ajax(BASE + '/store/getStoreListById', {id}, 'POST')
//删除存储
export const reqDeleteStore = (id) => ajax(BASE + '/store/deleteStore', {id}, 'POST')
//新增存储
export const reqAddStore = (storeName, storePassword, storeSort, storeToken, storeUrl, storeUsername, visible) => ajax(BASE + '/store/addStore', {storeName, storePassword, storeSort, storeToken, storeUrl, storeUsername, visible}, 'POST')
//更新存储
export const reqUpdateStore = (id, storeName, storePassword, storeToken, storeUrl, storeUsername, visible) => ajax(BASE + '/store/updateStore', {id, storeName, storePassword, storeToken, storeUrl, storeUsername, visible}, 'POST')
//获取存储分类
export const reqStoreType = () => ajax(BASE + '/store/getStoreSortList', {}, 'POST')
//获取所有用户
export const reqUserList = () => ajax(BASE + '/user/getAllUsers', {}, 'POST')
//添加帐号
export const reqAddUser = (nickname, password, role, username) => ajax2(BASE + '/user/addUser', {nickname, password, role, username}, 'POST')
//更新帐号
export const reqUpdateUser = (id, nickname, password, role, username) => ajax(BASE + '/user/updateUser', {id, nickname, password, role, username}, 'POST')
//删除帐号
export const reqDeleteUser = (id) => ajax(BASE + '/user/delUser', {id}, 'POST')