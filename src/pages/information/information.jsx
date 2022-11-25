import React, { useEffect, useState } from 'react';
import { Button, Table, notification, Tag, Modal, Form, Input } from 'antd';
import './information.less';
import { reqInformList, reqInformListById, reqAddInform, reqUpdateInform, reqDeleteInform } from '../../api';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;


function Information() {

    const [form] = Form.useForm();
    //表格数据
    const [dataSource, setDataSource] = useState([]);
    const [informObj, setInformObj] = useState({});
    //表格加载
    const [loading, setLoading] = useState(false);
    //获取用户列表
    const getInformList = async() => {
        setLoading(true);
        const result = await reqInformList();
        console.log(result);
        setLoading(false);
        if (result.resultCode === '200') {
          const informList = result.resultObject;
          informList.forEach((item) => {
            item['key']=item.id;
          })
          setDataSource(informList);
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
        title: `确认要删除[${item.name}]吗？`,
        icon: <ExclamationCircleFilled />,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await reqDeleteInform(item.id);
          console.log(result);
          if (result.resultCode === '200') {
            getInformList();
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
      getInformList();
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
         title: '名称',
         dataIndex: 'name',
         key: 'name',
         width: 15,
         ellipsis:true
       },
       {
        title: '凭证',
        dataIndex: 'token',
        key: 'token',
        width: 50,
        ellipsis:true
      },
       {
         title: '加签',
         dataIndex: 'sec',
         key: 'sec',
         width: 50,
         ellipsis:true
       },
       {
         title: '操作',
         width: 30,
         render: (informObj) => {
           return (
            <div className='information-table-button'>
              <Button className="information-table-edit" onClick={() => {setIsUpdateOpen(true);setInformObj(informObj);form.setFieldsValue({name: informObj.name, token: informObj.token, sec: informObj.sec})}}> 编辑 </Button>
              <Button className="information-table-delete" onClick={() => deleteConfirm(informObj)}> 删除 </Button>
            </div>
           )
         }
       },
    ];
    const [isAddOpen, setIsAddOpen] = useState(false);
    const handleAddOk = async(values) => {
      const name = values.name;
      const sec = values.sec;
      const token = values.token;
      const result = await reqAddInform(name, sec, token);
      // console.log(result);
      if (result.resultCode === '200') {
        getInformList();
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
      const id = informObj.id;
      const name = values.name;
      const sec = values.sec;
      const token = values.token;
      const result = await reqUpdateInform(id, name, sec, token);
      // console.log(result);
      if (result.resultCode === '200') {
        getInformList();
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
    };
    //仅第一次 render 后执行
    useEffect(() => {
      getInformList()
    },[])

    return (
      <div className="information">
        <div className='information-button'>
          <Button size="large" className="information-fresh" loading={loadings[0]} onClick={() => fresh(0)}> 刷新 </Button>
          <Button size="large" className="information-add" onClick={() => setIsAddOpen(true)}> 添加 </Button>
        </div>
        <div className='information-content'>
          <Table 
            dataSource={dataSource} 
            columns={columns}
            pagination={false}
            rowClassName='information-table'
            loading={loading}
          />
        </div>
        <Modal title="添加" open={isAddOpen} onCancel={handleAddCancel} footer={[]}>
            <Form
              name="information"
              className="information-form"
              layout='vertical'
              onFinish={handleAddOk}>
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[
                      {
                        required: true,
                        whitespace: true,//空格
                        message: '请填写名称',
                      },
                    ]}
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="凭证"
                    name="token"
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="加签"
                    name="sec"
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item className='information-form-button'>
                  <Button type="primary" size="large" htmlType="submit" className="information-form-submit"> 提交 </Button>
                </Form.Item>
            </Form>
        </Modal>
        <Modal title="编辑" open={isUpdateOpen} onCancel={handleUpdateCancel} footer={[]}>
            <Form
              name="normal_information"
              className="information-form"
              form={form}
              layout='vertical'
              onFinish={handleUpdateOk}>
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[
                      {
                        required: true,
                        whitespace: true,//空格
                        message: '请填写名称',
                      },
                    ]}
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="凭证"
                    name="token"
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item
                    label="加签"
                    name="sec"
                >
                  <Input bordered={false} size="large"/>
                </Form.Item>
                <Form.Item className='information-form-button'>
                  <Button type="primary" size="large" htmlType="submit" className="information-form-submit"> 提交 </Button>
                </Form.Item>
            </Form>
        </Modal>
      </div>
    );
  }
  
  export default Information;
  