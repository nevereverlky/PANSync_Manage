import React, { useEffect, useState } from 'react'
import {Link, useLocation} from 'react-router-dom'
import './index.less'
import menuList from '../../config/menuConfig'
import { Menu } from 'antd';
import * as Icon from '@ant-design/icons'

const { SubMenu } = Menu;

//左侧导航的组件
function LeftNav() {

  //获取到location，从而得到当前请求的路由路径
  const location = useLocation();
  const path = location.pathname;
  const [openkey, setOpenkey] = useState('');
  const [menuNodes, setMenuNodes] = useState([]);

  //根据menu的数据数组生成对应的标签数组
  const getMenuNodes = (menuList) => {
    //得到当前请求的路由路径
    console.log(path)
    return menuList.reduce((pre, item) => {
      const icon = React.createElement(
        Icon[item.icon],
        {
          style:{ fontSize: '16px'}
        }
      )
        //向pre添加<Menu.Item>
        if(!item.children) {
          pre.push((
            <Menu.Item className="left-menuitem" key={item.key} icon={icon}>
              <Link className="left-menulink" to={item.key}>
                {item.title}
              </Link>
            </Menu.Item>
          ))
        } else {
          //查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          //如果存在，说明当前item的子列表需要打开
          if(cItem) {
            setOpenkey(item.key);
          } 
          
          //向pre添加<SubMenu>
          pre.push((
            <SubMenu className="left-submenu" key={item.key} icon={icon} title={item.title}>
              {getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      return pre;
    }, [])
  }

/**useEffect使用的四个场景
每次 render 后执行：不提供第二个依赖项参数。比如useEffect(() => {})。
仅第一次 render 后执行：提供一个空数组作为依赖项。比如useEffect(() => {}, [])。
第一次以及依赖项发生变化后执行：提供依赖项数组。比如useEffect(() => {}, [deps])。
组件 unmount 后执行：返回一个回调函数。比如useEffect() => { return () => {} }, [])。*/
  useEffect(() => {
    setMenuNodes(getMenuNodes(menuList));
  }, [])

    return (
      <div className="left-nav">
        <Menu
          mode="inline"
          className='left-menu'
          // items={menuNodes}
          //defaultSelectedKeys初始选中的菜单项 key 数组;selectedKeys当前需要展开的选中的菜单项 key 数组，更好用
          selectedKeys={[path]}
          defaultOpenKeys={[openkey]}
        >
          {menuNodes}
        </Menu>
      </div>
    );
}

export default LeftNav;
