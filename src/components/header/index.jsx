import React from 'react';
import './index.less';
import storageUtils from '../../utils/storageUtils';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png'
import { ExportOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';

const { confirm } = Modal;

//头部的组件
function Header(){

  const navigate = useNavigate();

  const logout = () => {
     //显示确认框
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '是否确认退出登录',
      onOk: () => {
        console.log('OK');
        //删除保存的user数据
        storageUtils.removeUser()
        //跳转到login
        navigate('/login', {replace: true});
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

    return (
      <div className="header">
        <div className="header-left">
          <img src={logo} alt="logo"/>PANSync 管理
        </div>
        <div className="header-right">
          <Button type="primary" size="large" icon={<ExportOutlined />} onClick={logout}/>
        </div>
      </div>
    );                 
}

export default Header;
