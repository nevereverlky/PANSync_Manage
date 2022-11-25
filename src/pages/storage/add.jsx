import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, notification } from 'antd';
import {  useNavigate } from "react-router-dom";
import { reqStoreType, reqAddStore } from '../../api';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import './add.less';

function StorageAdd() {

    const navigate = useNavigate();
    const [form] = Form.useForm();
    //获取存储分类列表
    const [selectList, setSelectList] = useState([]);
    const getStoreList = async() => {
        const result = await reqStoreType();
        console.log(result);
        if (result.resultCode === '200') {
            setSelectList(result.resultObject);
            form.setFieldsValue({storeUrl: storeSort === '百度网盘'? "/" : ""})
        } else {
            notification.open({
                message: result.resultMsg,
                icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
            });
        }
    }
    const [storeSort, setStoreSort] = useState('');
    const selectChange = (value) => {
        setStoreSort(value);
    };
    //表单提交
    const onFinish = async(values) => {
        const storeName = values.storeName;
        const storePassword = values.storePassword;
        const storeSort = values.storeSort;
        const storeToken = values.storeToken;
        const storeUrl = values.storeUrl;
        const storeUsername = values.storeUsername;
        const visible = 1;
        const result = await reqAddStore(storeName, storePassword, storeSort, storeToken, storeUrl, storeUsername, visible);
        console.log(result);
        if (result.resultCode === '200') {
            notification.open({
                message: '添加成功',
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
        getStoreList()
    },[storeSort])

    return (
        <div className='storage-add'>
            <div className='storage-add-title'>添加</div>
            <div className='storage-add-form'>
                <Form
                    name="basic_form"
                    className='add-form'
                    form={form}
                    layout='vertical'
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 10 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    >
                    <Form.Item
                        label="驱动"
                        name="storeSort"
                        rules={[
                            {
                                required: true,
                                whitespace: true,//空格
                                message: '请选择驱动',
                            },
                        ]}
                    >
                        <Select
                            className='add-form-select'
                            bordered={false}
                            onChange={selectChange}
                            options={selectList}
                        />
                    </Form.Item>
                    {storeSort && <Form.Item
                        label="挂载路径"
                        name="storeName"
                        rules={[
                            {
                                required: true,
                                whitespace: true,//空格
                                message: '请填写挂载路径',
                            },
                        ]}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    {storeSort && storeSort === '百度网盘' && <Form.Item
                        label="刷新令牌"
                        name="storeToken"
                        rules={[
                        {
                            required: true,
                            whitespace: true,//空格
                            message: '请填写刷新令牌',
                        },
                        ]}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    {storeSort && <Form.Item
                        label={storeSort === '百度网盘'? "根文件夹路径" : "地址" }
                        name="storeUrl"
                        rules={[
                            {
                                required: true,
                                whitespace: true,//空格
                                message: storeSort === '百度网盘'? "请填写根文件夹路径" : "请填写地址" ,
                            },
                        ]}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    {storeSort && storeSort !== '百度网盘' && <Form.Item
                        label="存储帐号"
                        name="storeUsername"
                        rules={[
                        {
                            required: true,
                            whitespace: true,//空格
                            message: '请填写存储帐号',
                        },
                        ]}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    {storeSort && storeSort !== '百度网盘' && <Form.Item
                        label="存储密码"
                        name="storePassword"
                        rules={[
                        {
                            required: true,
                            whitespace: true,//空格
                            message: '请填写存储密码',
                        },
                        ]}
                    >
                        <Input bordered={false} size="large"/>
                    </Form.Item>}
                    <Form.Item className='add-form-button'>
                        <Button type="primary" htmlType="submit" className="add-form-submit"> 添加 </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
  
  export default StorageAdd;
  