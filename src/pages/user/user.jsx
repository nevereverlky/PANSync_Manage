import React, { useEffect, useState } from 'react';
import { Button, Table, notification, Tag, Modal, Form, Input, Radio } from 'antd';
import './user.less';
import { reqUserList, reqAddUser, reqUpdateUser, reqDeleteUser } from '../../api';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

function User() {

  //表格数据
  const [dataSource, setDataSource] = useState([]);
  const [userObj, setUserObj] = useState({});
  //表格加载
  const [loading, setLoading] = useState(false);
  //获取用户列表
  const getUserList = async() => {
      setLoading(true);
      const result = await reqUserList();
      console.log(result);
      setLoading(false);
      if (result.resultCode === '200') {
        const userList = result.resultObject;
        userList.forEach((item) => {
          item['key']=item.id;
        })
        setDataSource(userList);
      } else {
          notification.open({
              message: result.resultMsg,
              icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
          });
      }
  }
  //删除按钮
  const deleteConfirm = (item) => {
    console.log(item)
    confirm({
      title: `确认要删除[${item.username}]吗？`,
      icon: <ExclamationCircleFilled />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const result = await reqDeleteUser(item.id);
        console.log(result);
        if (result.resultCode === '200') {
          getUserList();
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
  //刷新列表
  const [loadings, setLoadings] = useState([]);
  const fresh = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    getUserList();
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  }
  const columns = [
     {
       title: '帐号',
       dataIndex: 'username',
       key: 'username',
       width: 50,
       ellipsis:true
     },
     {
      title: '用户名',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 50,
      ellipsis:true
    },
     {
       title: '角色',
       dataIndex: 'role',
       key: 'role',
       width: 50,
       ellipsis:true,
       render: (role) => {
        return(<Tag color={role === 0? 'purple':'default'} style={{fontWeight: 'bold'}}>{role === 0? 'ADMIN':'GUEST'}</Tag>)
       }
     },
     {
       title: '操作',
       width: 50,
       render: (userObj) => {
         return (
          <div className='user-table-button'>
            <Button size="large" className="user-table-edit" onClick={() => {setIsUpdateOpen(true);setUserObj(userObj)}}> 编辑 </Button>
            <Button size="large" className="user-table-delete" onClick={() => deleteConfirm(userObj)}> 删除 </Button>
          </div>
         )
       }
     },
  ];
  //添加用户
  const roleOptions = [
    {
      label: 'ADMIN',
      value: 0,
    },
    {
      label: 'GUEST',
      value: 1,
    }
  ];
  const [role, setrole] = useState('');
  const onRoleChange = ({ target: { value } }) => {
    setrole(value);
  };
  const [isAddOpen, setIsAddOpen] = useState(false);
  const handleAddOk = async(values) => {
    const nickname = values.nickname;
    const password = values.password;
    const username = values.username;
    const result = await reqAddUser(nickname, password, role, username);
    // console.log(result);
    if (result.resultCode === '200') {
      getUserList();
      notification.open({
        message: '添加成功',
        icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
      });
      setIsAddOpen(false);
    } else {
      notification.open({
          message: result.resultMsg,
          icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
      });
    }
  };
  const handleAddCancel = () => {
    setIsAddOpen(false);
  };
  //编辑用户
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const handleUpdateOk = async(values) => {
    const id = userObj.id;
    const nickname = values.nickname;
    const password = values.password;
    const username = values.username;
    const result = await reqUpdateUser(id, nickname, password, role, username);
    // console.log(result);
    if (result.resultCode === '200') {
      getUserList();
      notification.open({
        message: '编辑成功',
        icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
      });
      setIsUpdateOpen(false);
    } else {
      notification.open({
          message: result.resultMsg,
          icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
      });
    }
  };
  const handleUpdateCancel = () => {
    setIsUpdateOpen(false);
    setUserObj({});
  };
  //仅第一次 render 后执行
  useEffect(() => {
    getUserList()
  },[])

  return (
    <div className="user">
        <div className='user-button'>
          <Button size="large" className="user-fresh" loading={loadings[0]} onClick={() => fresh(0)}> 刷新 </Button>
          <Button size="large" className="user-add" onClick={() => setIsAddOpen(true)}> 添加 </Button>
        </div>
        <div className='user-content'>
          <Table 
            dataSource={dataSource} 
            columns={columns}
            pagination={false}
            rowClassName='user-table'
            loading={loading}
          />
        </div>
        <Modal title="添加" open={isAddOpen} onCancel={handleAddCancel} footer={[]}>
            <Form
              name="normal_user"
              className="user-form"
              layout='vertical'
              onFinish={handleAddOk}>
                <Form.Item
                    label="用户名"
                    name="nickname"
                    rules={[
                      {
                        required: true,
                        whitespace: true,//空格
                        message: '请填写用户名',
                      },
                    ]}
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="帐号"
                    name="username"
                    rules={[
                      {
                        required: true,
                        whitespace: true,//空格
                        message: '请填写帐号',
                      },
                    ]}
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                      {
                        required: true,
                        whitespace: true,//空格
                        message: '请填写密码',
                      },
                    ]}
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="角色"
                    name="role"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                >
                  <Radio.Group size="large" options={roleOptions} onChange={onRoleChange} value={role} optionType="button" />
                </Form.Item>
                <Form.Item className='user-form-button'>
                  <Button type="primary" size="large" htmlType="submit" className="user-form-submit"> 提交 </Button>
                </Form.Item>
            </Form>
        </Modal>
        <Modal title="编辑" open={isUpdateOpen} onCancel={handleUpdateCancel} footer={[]}>
            <Form
              name="normal_user"
              className="user-form"
              layout='vertical'
              onFinish={handleUpdateOk}>
                <Form.Item
                    label="用户名"
                    name="nickname"
                    rules={[
                      {
                        required: true,
                        whitespace: true,//空格
                        message: '请填写用户名',
                      },
                    ]}
                    initialValue={userObj.nickname}
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="帐号"
                    name="username"
                    rules={[
                      {
                        required: true,
                        whitespace: true,//空格
                        message: '请填写帐号',
                      },
                    ]}
                    initialValue={userObj.username}
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="角色"
                    name="role"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    initialValue={userObj.role}
                >
                  <Radio.Group size="large" options={roleOptions} onChange={onRoleChange} value={role} optionType="button" />
                </Form.Item>
                <Form.Item className='user-form-button'>
                  <Button type="primary" size="large" htmlType="submit" className="user-form-submit"> 提交 </Button>
                </Form.Item>
            </Form>
        </Modal>
      </div>
  );
}

export default User;
