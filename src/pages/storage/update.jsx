import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, notification } from 'antd';
import { useSearchParams, useNavigate } from "react-router-dom";
import { reqStoreListById, reqUpdateStore } from '../../api';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import './update.less';

function StorageUpdate() {

    const navigate = useNavigate();
    //接收路由携带的参数
    const [searchParams, setSearchParams] = useSearchParams();
    const [storeDetail, setStoreDetail] = useState({});
    
    //获取存储详情
    const getStoreDetail = async(id) => {
        const result = await reqStoreListById(id);
        console.log(result);
        if (result.resultCode === '200') {
            setStoreDetail(result.resultObject);
        } else {
            notification.open({
                message: result.resultMsg,
                icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
            });
        }
    }

    //表单提交
    const onFinish = async(values) => {
        const id = searchParams.get("id");
        const storeName = values.storeName;
        const storePassword = values.storePassword;
        const storeSort = values.storeSort;
        const storeToken = values.storeToken;
        const storeUrl = values.storeUrl;
        const storeUsername = values.storeUsername;
        const visible = 1;
        const result = await reqUpdateStore(id, storeName, storePassword, storeToken, storeUrl, storeUsername, visible);
        console.log(result);
        if (result.resultCode === '200') {
            notification.open({
                message: '保存成功',
                icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
            });
            navigate(-1);
        } else {
            notification.open({
                message: result.resultMsg,
                icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
            });
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //仅第一次 render 后执行
    useEffect(() => {
        const id = searchParams.get("id");
        getStoreDetail(id);
    },[])

    return (
        <div className='storage-update'>
            <div className='storage-update-title'>编辑</div>
            <div className='storage-update-form'>
                <Form
                    name="basic_form"
                    className='update-form'
                    layout='vertical'
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 10 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    >
                    {storeDetail.storeSort && <Form.Item
                        label="驱动"
                        name="storeSort"
                        rules={[
                            {
                                required: true,
                                whitespace: true,//空格
                                message: '请选择驱动',
                            },
                        ]}
                        initialValue={storeDetail.storeSort}
                    >
                        <Select
                            className='update-form-select'
                            bordered={false}
                            disabled
                        />
                    </Form.Item>}
                    {storeDetail.storeSort && <Form.Item
                        label="挂载路径"
                        name="storeName"
                        rules={[
                            {
                                required: true,
                                whitespace: true,//空格
                                message: '请填写挂载路径',
                            },
                        ]}
                        initialValue={storeDetail.storeName}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    {storeDetail.storeSort && storeDetail.storeSort === '百度网盘' && <Form.Item
                        label="刷新令牌"
                        name="storeToken"
                        rules={[
                        {
                            required: true,
                            whitespace: true,//空格
                            message: '请填写刷新令牌',
                        },
                        ]}
                        initialValue={storeDetail.storeToken}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    {storeDetail.storeSort && <Form.Item
                        label={storeDetail.storeSort === '百度网盘'? "根文件夹路径" : "地址" }
                        name="storeUrl"
                        rules={[
                        {
                            required: true,
                            whitespace: true,//空格
                            message: storeDetail.storeSort === '百度网盘'? "请填写根文件夹路径" : "请填写地址" ,
                        },
                        ]}
                        initialValue={storeDetail.storeUrl}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    {storeDetail.storeSort && storeDetail.storeSort !== '百度网盘' && <Form.Item
                        label="存储帐号"
                        name="storeUsername"
                        rules={[
                        {
                            required: true,
                            whitespace: true,//空格
                            message: '请填写存储帐号',
                        },
                        ]}
                        initialValue={storeDetail.storeUsername}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    {storeDetail.storeSort && storeDetail.storeSort!== '百度网盘' && <Form.Item
                        label="存储密码"
                        name="storePassword"
                        rules={[
                        {
                            required: true,
                            whitespace: true,//空格
                            message: '请填写存储密码',
                        },
                        ]}
                        initialValue={storeDetail.storePassword}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    <Form.Item className='update-form-button'>
                        <Button type="primary" htmlType="submit" className="update-form-submit"> 保存 </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
  
  export default StorageUpdate;