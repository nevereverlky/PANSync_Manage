/**
 * 安卓路由组件
*/
import React from 'react';
import './android.less';
import { Button, Modal, List } from 'antd';
import { reqAndroid } from '../../api';

function Android() {

        //获取列表
        const getAndroid = async(title, content) => {
            const result = await reqAndroid(content);
            Modal.info({
                title: title,
                width: "50vw",
                content: (
                    <List
                        size="small"
                        bordered
                        dataSource={result}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                ),
                onOk() {},
            });
        }

        return (
            <div className='android'>
                <Button type="primary" className="android-user" size="large" onClick={() => {getAndroid('用户列表','/user')}}>用户列表</Button>
                <Button type="primary" className="android-store" size="large" onClick={() => {getAndroid('存储列表', '/store')}}>存储列表</Button>
                <Button type="primary" className="android-notice" size="large" onClick={() => {getAndroid('最新公告', '/notice')}}>最新公告</Button>
                <Button type="primary" className="android-inform" size="large" onClick={() => {getAndroid('通知配置', '/inform')}}>通知配置</Button>
            </div>
        )
}

export default Android;