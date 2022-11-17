import React from 'react';
import './index.less';
import { ExportOutlined } from '@ant-design/icons';
import { Button } from 'antd';

//头部的组件
class Header extends React.Component {

  render(){

    return (
      <div className="header">
        <div className="header-left">
            PANSync 管理
        </div>
        <div className="header-right">
          <Button type="primary" size="large" icon={<ExportOutlined />} />
        </div>
      </div>
    );
  }                       
}

export default Header;
