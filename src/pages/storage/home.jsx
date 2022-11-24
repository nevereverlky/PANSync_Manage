import React, { useEffect, useState } from 'react';
import { Button, Card, Tag, notification, Modal } from 'antd';
import {  useNavigate } from "react-router-dom";
import './home.less';
import { reqStoreList, reqDeleteStore, reqUpdateStore } from '../../api';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

function StorageHome() {

    const navigate = useNavigate();

    //获取存储列表
    const [storeList, setStoreList] = useState([]);
    const getStoreList = async() => {
        const result = await reqStoreList();
        console.log(result);
        if (result.resultCode === '200') {
            setStoreList(result.resultObject);
        } else {
            notification.open({
                message: result.resultMsg,
                icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
            });
        }
    }
    //刷新列表
    const fresh = (index) => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
      });
      getStoreList();
      setTimeout(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      }, 1000);
    }
    //禁用、启用按钮
    const [loadings, setLoadings] = useState([]);
    const changeIsWork = async (item) => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[item.id] = true;
        return newLoadings;
      });
      const id = item.id;
      const storeName = item.storeName;
      const storePassword = item.storePassword;
      const storeToken = item.storeToken;
      const storeUrl = item.storeUrl;
      const storeUsername = item.storeUsername;
      const visible = item.visible === 0 ? 1: 0;
      const result = await reqUpdateStore(id, storeName, storePassword, storeToken, storeUrl, storeUsername, visible);
      console.log(result);
      if (result.resultCode === '200') {
          setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[item.id] = false;
            return newLoadings;
          });
          getStoreList();
          notification.open({
            message: '更新成功',
            icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
          });
      } else {
          notification.open({
              message: result.resultMsg,
              icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
          });
      }
    };
    //删除按钮
    const deleteConfirm = (item) => {
      confirm({
        title: `确认要删除[${item.storeName}]吗？`,
        icon: <ExclamationCircleFilled />,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await reqDeleteStore(item.id);
          console.log(result);
          if (result.resultCode === '200') {
            getStoreList();
            notification.open({
              message: '删除成功',
              icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
            });
          } else {
              notification.open({
                  message: result.resultMsg,
                  icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
              });
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
    //显示添加存储界面
    const showAdd = () => {
      navigate('/admin/storage/add');
    }
    //显示编辑存储界面
    const showUpdate = (item) => {
      navigate(`/admin/storage/update?id=${item.id}`);
    }
    //仅第一次 render 后执行
    useEffect(() => {
      getStoreList()
    },[])

    return (
      <div className="storage">
        <div className='storage-button'>
          <Button size="large" className="storage-fresh" loading={loadings[0]} onClick={() => fresh(0)}> 刷新 </Button>
          <Button size="large" className="storage-add" onClick={() => showAdd()}> 添加 </Button>
        </div>
        <div className='storage-card'>
          {storeList.map(item => (
            <Card className="storage-cardItem" hoverable={true} key={item.id}>
              <div className='storage-card-title'>{item.storeName}<Tag color="blue" style={{fontWeight: 'bold', marginLeft: '10px'}}>{item.storeSort}</Tag></div>
              <div className='storage-card-status'>状态：{item.visible === 0 ? '禁用':'启用'}</div>
              <div className='storage-card-button'>
                <Button size="large" className="storage-card-edit" onClick={() => showUpdate(item)}> 编辑 </Button>
                <Button size="large" className="storage-card-isWork" loading={loadings[item.id]} onClick={() => changeIsWork(item)}> {item.visible === 0 ? '启用':'禁用'} </Button>
                <Button size="large" className="storage-card-delete" onClick={() => deleteConfirm(item)}> 删除 </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  export default StorageHome;
  