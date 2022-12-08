/**
 * 后台管理路由组件
*/
import React, { useEffect } from 'react';
import './admin.less';
import { Layout } from 'antd';
import { Route, Navigate, Routes, useNavigate } from 'react-router-dom';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Home from '../home/home';
import User from '../user/user';
import Storage from '../storage/storage';
import Notice from '../notice/notice';
import Information from '../information/information';
import storageUtils from '../../utils/storageUtils';
const { Content, Footer, Sider } = Layout;

function Admin() {
    
    const navigate = useNavigate();

    useEffect(() => {
        const user = storageUtils.getUser();
        //如果内存中没有存储user，则说明当前没登录
        console.log('admin', user, JSON.stringify(user) === '{}')
        if (JSON.stringify(user) === '{}') {
        //自动跳转到登录页面（在render()中）
            navigate('/login', {replace: true});
        }
    })

        return (
            <Layout className='admin'>
                <Header className='admin-header'/>
                <Layout>
                    <Sider className='admin-sider'>
                        <LeftNav/>
                    </Sider>
                    <Content className='admin-content'>
                        <Routes>
                            <Route path='/home' element={<Home/>} exact/>
                            <Route path='/notice' element={<Notice/>} exact/>
                            <Route path='/user' element={<User/>} exact/>
                            <Route path='/storage/*' element={<Storage/>} exact/>
                            <Route path='/information' element={<Information/>} exact/>
                            <Route element={<notFound/>}/>{/**上面没有一个匹配的，直接显示 */}
                            <Route path="/*" element={<Navigate to="/admin/storage" />} />
                        </Routes>
                    </Content>
                </Layout>
                <Footer className='admin-footer'>PANSync Website ©2022 Created by llcc</Footer>
            </Layout>
        )
}

export default Admin;