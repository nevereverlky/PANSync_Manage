/**
 * 用户登陆的路由组件
*/
import React, { useEffect } from 'react';
import './login.less';
import { Card, Form, Input, Button, notification } from 'antd';
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'
import {reqLogin} from '../../api/index';
import storageUtils from '../../utils/storageUtils';
import { useNavigate } from 'react-router-dom';

//Hooks是一个新的React特性提案，组件尽量写成纯函数，如果需要外部React特性（比如状态管理，生命周期），就用钩子把外部特性"钩"进来，通常函数名字都是以use开头。
function Login() {
    
    const navigate = useNavigate();
    const [form] = Form.useForm();

    //提交表单且数据验证成功后回调事件
    const onFinish = async(values) => {
        //请求登录
        const {username, password} = values;
        const result = await reqLogin(username, password);
        console.log(result)
        if (result.resultCode === '200') {
            notification.open({
                message: '登录成功',
                icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
            });
            const user = result.resultObject;
            storageUtils.saveUser(user); //保存到local中
            //不需要再回退到登陆页面，则用replace，否则用push        
            navigate('/client', {replace: true});
        } else {
            notification.open({
                message: result.resultMsg,
                icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
            });
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    useEffect(() => {
        //如果用户已经登录，自动跳转到管理界面
        const user = storageUtils.getUser();
        console.log('login', user, JSON.stringify(user) !== '{}')
        if (JSON.stringify(user) !== '{}'){
            navigate('/client', {replace: true});
        }
    })

        return (
            <div className='login'>
                <Card 
                    title="登录到 PANSync" 
                    className='login-card' 
                    bordered={false} 
                    hoverable={true} 
                    headStyle={{color: 'rgb(0, 161, 191)', textAlign: 'center', fontSize:'20px', fontWeight: 'bold'}}
                >
                    <Form
                        name="normal_login"
                        className="login-form"
                        form={form}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            //声明式验证：直接使用定义好的验证规则进行验证
                            rules={[
                                {
                                required: true,
                                whitespace: true,//空格
                                message: '请输入用户名',
                                }
                            ]}
                            initialValue="admin"//指定初始值
                        >
                            <Input placeholder="请输入用户名" bordered={false} size="large"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            //自定义式验证
                            rules={[
                                {
                                validator: (rules, value) => {
                                    //value ? Promise.resolve() : Promise.reject(new Error('请输入密码')),
                                    if (!value) {
                                    return Promise.reject(new Error('请输入密码'))
                                    } else {
                                    return Promise.resolve()//验证通过
                                    }
                                }
                                }
                            ]}
                            initialValue="admin"
                        >
                            <Input type="password" placeholder="请输入密码" bordered={false} size="large" />
                        </Form.Item>
                        <Form.Item className='login-form-button'>
                            <Button type="primary" size="large"  
                            htmlType="button"
                            className="login-form-clear" onClick={onReset}> 清除 </Button>
                            <Button type="primary" size="large" htmlType="submit" className="login-form-submit"> 登录 </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
}

export default Login;