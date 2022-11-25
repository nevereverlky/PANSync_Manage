import React, { useEffect, useState } from 'react';
import { Button, Form, Input, notification } from 'antd';
import './notice.less';
import { reqNotice, reqAddNotice } from '../../api';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { formateDate, utc2timestamp } from '../../utils/dateUtils';


function Notice() {

  const [form] = Form.useForm();
  const [notice, setNotice] = useState("");
  const [date, setDate] = useState("");
  //获取公告
  const getNotice = async() => {
    const result = await reqNotice();
    console.log(result);
    if (result.resultCode === '200') {
      setNotice(result.resultObject.content);
      setDate(formateDate(utc2timestamp(result.resultObject.date)));
      form.setFieldsValue({content: notice});
    } else {
      notification.open({
          message: result.resultMsg,
          icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
      });
    }
  }
  const [loadings, setLoadings] = useState([]);
  //刷新列表
  const fresh = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    getNotice();
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  }
  //保存公告
  const onFinish = async(values) => {
    const content = values.content;
    const result = await reqAddNotice(content);
    console.log(result);
    if (result.resultCode === '200') {
      getNotice();
      notification.open({
        message: '保存成功',
        icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
      });
    } else {
      notification.open({
          message: result.resultMsg,
          icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
      });
    }
  };
  //仅第一次 render 后执行
  useEffect(() => {
    getNotice();
  },[notice])

    return (
      <div className="notice">
        <div className='notice-title'>站点公告</div>
          <Form form={form} name="notice-form" className='notice-form' layout='vertical' onFinish={onFinish} labelCol={{ span: 10 }} wrapperCol={{ span: 10 }}>
            <Form.Item name="content">
              <Input.TextArea className='notice-textarea'/>
            </Form.Item>
            <div className='notice-tag'>最近更新时间：{date}</div>
            <Form.Item className='notice-button'>
              <Button size="large" className="notice-fresh" htmlType="button" loading={loadings[0]} onClick={() => fresh(0)}> 刷新 </Button>
              <Button size="large" className="notice-save" htmlType="submit"> 保存 </Button>
            </Form.Item>
          </Form>
      </div>
    );
  }
  
  export default Notice;
  