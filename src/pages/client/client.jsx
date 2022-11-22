/**
 * 后台管理主路由组件
*/
import React, { useEffect, useState } from 'react';
import './client.less';
import { useNavigate } from 'react-router-dom';
import storageUtils from '../../utils/storageUtils';
import { Card, Button, Layout, Breadcrumb, Table, notification, Popover, List, Modal, Input, Form, TreeSelect, Upload } from 'antd';
import { EditOutlined, HomeTwoTone, FolderFilled, SyncOutlined, FolderAddOutlined, CloudUploadOutlined, ExclamationCircleFilled, InboxOutlined, CopyOutlined, DeleteOutlined, CloudDownloadOutlined, CheckCircleFilled } from '@ant-design/icons';
import { reqFileList, reqManageFile, reqDownloadFile, reqCreateFile, reqUploadFile,reqFileTree } from '../../api';
import { formateDate } from '../../utils/dateUtils';
import { b2ValueUnit } from '../../utils/BtoMBUtils';
import SparkMD5 from 'spark-md5';
const { Header, Footer, Content } = Layout;
const { confirm } = Modal;
const { Dragger } = Upload;

function Client() {

    const accessToken = '123.c1c352e8742a42213a6124c012e4f0a9.YnW-tUTzotuvhcJS8GuHp5y9T4ETKiSu9VBns_-.RKipLQ';//网盘token
    const navigate = useNavigate();
    //当前路径
    const [dir, setDir] = useState('');
    //当前文件名
    const [fileName, setFileName] = useState('');
    //当前fsId
    const [fsId, setFsId] = useState(0);
    //表格加载
    const [loading, setLoading] = useState(false);
    //操作弹框
    const data = [
      {
        icon: <EditOutlined style={{fontSize: '18px', color: 'rgb(110,86,207)', marginRight: '10px'}}/>,
        text: '重命名'
      },
      {
        icon: <InboxOutlined style={{fontSize: '18px', color: 'rgb(255,178,36)', marginRight: '10px'}}/>,
        text: '移动'
      },
      {
        icon: <CopyOutlined style={{fontSize: '18px', color: 'rgb(48,164,108)', marginRight: '10px'}}/>,
        text: '复制'
      },
      {
        icon: <DeleteOutlined style={{fontSize: '18px', color: 'rgb(229,72,77)', marginRight: '10px'}}/>,
        text: '删除'
      },
      {
        icon: <CloudDownloadOutlined style={{fontSize: '18px', color: 'rgb(5,162,194)', marginRight: '10px'}}/>,
        text: '下载'
      }
    ];
    const content = (
      <List
        size="small"
        split={false}
        dataSource={data}
        renderItem={item => (
          <List.Item className="client-listitem" onClick={() => {manageFile(item.text)}}>
            {item.icon}{item.text}
          </List.Item>
        )}
      />
    );
    //表格数据
    const [dataSource, setDataSource] = useState([
      {
        key: '1',
        serverFilename: '百度云盘',
        size: 0,
        serverMtime: '1970-1-20 15:32:33',
        path: '/'
      },
      {
        key: '2',
        serverFilename: '阿里云盘',
        size: 0,
        serverMtime: '1970-1-20 15:32:33',
        path: '/'
      },
    ]);
    const columns = [
      {
        render: () => <FolderFilled style={{color: 'rgb(24,144,255)', fontSize: '25px'}}/>,
        width: 15
      },
      {
        title: '名称',
        dataIndex: 'serverFilename',
        key: 'serverFilename',
        width: 150,
        ellipsis:true
      },
      {
        title: '大小',
        dataIndex: 'size',
        key: 'size',
        width: 50,
        ellipsis:true,
        align: 'right',
        render: (size) => {
          if(size === 0) {
            return "-"
          } else {
            return b2ValueUnit(size)
          }
        }
      },
      {
        title: '修改时间',
        dataIndex: 'serverMtime',
        key: 'serverMtime',
        width: 100,
        ellipsis:true,
        align: 'right',
        render: (serverMtime) => formateDate(serverMtime)
      },
      {
        width: 50,
        align: 'right',
        render: () => {
          return (
            <Popover placement="right" content={content} trigger="click">
              <Button type='dashed'>操作</Button>
            </Popover>
          )
        }
      },
    ];
    //面包屑
    const [extraBreadcrumbItems, setExtraBreadcrumbItems] = useState([]);
    const breadcrumbItems = [
      <Breadcrumb.Item key="home" className="client-breadcrumbItem" style={{margin: '0 5px 0 5px'}} onClick={()=> setDir('/')}>
        <HomeTwoTone style={{marginRight: '10px', fontSize: '20px' }}/>主页
      </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);
    //跳转到管理端
    const toManage = () => {
      navigate('/admin/home', {replace: true});
    }
    //获取百度网盘文件列表
    const getFileList = async(dir) => {
      if(dir) {
        setLoading(true);
        const result = await reqFileList(accessToken, dir);
        setLoading(false);
        const url = dir.split('/');
        url.shift();
        setExtraBreadcrumbItems(url.map((item) => {
            return (
              <Breadcrumb.Item key={item} className="client-breadcrumbItem" style={{margin: '0 5px 0 5px'}} onClick={()=> {
                let toItem = '/';
                url.forEach((t) => {
                  if(t !== item){
                    toItem = toItem + t + '/';
                  } else {
                    toItem = toItem + item;
                    setDir(toItem);
                  }
                }) 
              }}>
                {item}
              </Breadcrumb.Item>
            )
        }))
        if (result.resultCode === '200') {
            const fileList = result.resultObject.list;
            fileList.forEach((item) => {
              item['key']=item.serverFilename
            })
            setDataSource(fileList);
            console.log(fileList);
        } else {
            notification.open({
                message: result.resultMsg,
                icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
            });
        }
      }
    }
    //操作弹框
    //重命名
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const handleRenameOk = async(value) => {
      const async = 1;
      const opear = 'rename';
      const filelist = [{path: dir+"/"+fileName, newname: value.newname}];
      const result = await reqManageFile(accessToken, async, filelist, opear);
      // console.log(result);
      if (result.resultCode === '200') {
        getFileList(dir);
        notification.open({
          message: '重命名成功',
          icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
        });
        setIsRenameOpen(false);
      } else {
        notification.open({
            message: result.resultMsg,
            icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
        });
      }
    };
    const handleRenameCancel = () => {
      setIsRenameOpen(false);
      setFileName('');
    };
    //创建文件夹
    const [isCreateFileOpen, setIsCreateFileOpen] = useState(false);
    const handleCreateFileOk = async(value) => {
      const isdir = "1";
      const size = "0";
      const blockList = [];
      const uploadid = "";
      const path = dir + "/" + value.filename;
      const result = await reqCreateFile(accessToken, isdir, path, size, blockList, uploadid);
      // console.log(result);
      if (result.resultCode === '200') {
        getFileList(dir);
        notification.open({
          message: '创建文件夹成功',
          icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
        });
        setIsCreateFileOpen(false);
      } else {
        notification.open({
            message: result.resultMsg,
            icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
        });
      }
    };
    const handleCreateFileCancel = () => {
      setIsCreateFileOpen(false);
    };
    //移动
    const [treeData, setTreeData] = useState([]);
    // const treeData = [
    //   {
    //     title: 'pansync',
    //     key: 'pansync',
    //     icon: <CarryOutOutlined />,
    //     children: [
    //       {
    //         title: 'test1',
    //         key: 'test1',
    //         icon: <CarryOutOutlined />,
    //         children: [
    //           {
    //             title: 'test1-1',
    //             key: 'test1-1',
    //             icon: <CarryOutOutlined />,
    //           },
    //           {
    //             title: 'test1-2',
    //             key: 'test1-2',
    //             icon: <CarryOutOutlined />,
    //           },
    //         ],
    //       },
    //       {
    //         title: 'test2',
    //         key: 'test2',
    //         icon: <CarryOutOutlined />,
    //         children: [
    //           {
    //             title: 'test2-1',
    //             key: 'test2-1',
    //             icon: <CarryOutOutlined />,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     title: '我的资源',
    //     key: '我的资源',
    //     icon: <CarryOutOutlined />,
    //     children: [
    //       {
    //         title: 'test3',
    //         key: 'test3',
    //         icon: <CarryOutOutlined />,
    //         children: [
    //           {
    //             title: 'test3-1',
    //             key: 'test3-1',
    //             icon: <CarryOutOutlined />,
    //           },
    //           {
    //             title: 'test3-2',
    //             key: '0test3-2',
    //             icon: <CarryOutOutlined />,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ];
    const [moveValue, setMoveValue] = useState('');
    const onMoveChange = (newValue) => {
      setMoveValue(newValue);
    };
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const handleMoveOk = async() => {
      const async = 1;
      const opear = 'move';
      const dest = moveValue;
      const filelist = [{path: dir+"/"+fileName, dest: dest, newname: fileName, ondup: 'fail'}];
      const result = await reqManageFile(accessToken, async, filelist, opear);
      // console.log(result);
      if (result.resultCode === '200') {
        getFileList(dir);
        notification.open({
          message: '移动成功',
          icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
        });
        setIsMoveOpen(false);
      } else {
        notification.open({
            message: result.resultMsg,
            icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
        });
      }
    };
    const handleMoveCancel = () => {
      setIsMoveOpen(false);
      setFileName('');
    };
    //复制
    const [copyValue, setCopyValue] = useState('');
    const onCopyChange = (newValue) => {
      setCopyValue(newValue);
    };
    const [isCopyOpen, setIsCopyOpen] = useState(false);
    const handleCopyOk = async() => {
      const async = 1;
      const opear = 'copy';
      const dest = copyValue;
      const filelist = [{path: dir+"/"+fileName, dest: dest, newname: fileName, ondup: 'fail'}];
      const result = await reqManageFile(accessToken, async, filelist, opear);
      // console.log(result);
      if (result.resultCode === '200') {
        getFileList(dir);
        notification.open({
          message: '复制成功',
          icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
        });
        setIsCopyOpen(false);
      } else {
        notification.open({
            message: result.resultMsg,
            icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
        });
      }
    };
    const handleCopyCancel = () => {
      setIsCopyOpen(false);
      setFileName('');
    };
    //删除
    const showDeleteConfirm = () => {
      confirm({
        title: '删除',
        icon: <ExclamationCircleFilled />,
        content: '确定要删除所选对象吗？',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const async = 1;
          const opear = 'delete';
          const filelist = ["\"" + dir+"/"+fileName + "\""];
          const result = await reqManageFile(accessToken, async, filelist, opear);
          // console.log(result);
          if (result.resultCode === '200') {
            getFileList(dir);
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
    //下载
    const download= (url, filename) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
    }
    const downloadFile = async() => {
      // console.log(fsId);
      const fsids = [fsId];
      const result = await reqDownloadFile(accessToken, fsids);
      // console.log(result);
      if (result.resultCode === '200') {
        download(result.resultObject[0], fileName);
        notification.open({
          message: '下载成功',
          icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
        });
      } else {
        notification.open({
            message: result.resultMsg,
            icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
        });
      }
    }
    //上传
    const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
    const [fileList, setFileList] = useState(undefined);
    //获取已经上传文件的列表
    const uploadChange = (info) => {
        // console.log(info)
        setFileList(info.file)
        return false;
    }
    const beforeUpload = (file) => {
      // console.log(file)
        if(fileList){
          notification.open({
            message: '只能上传一个文件',
            icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
          });
          setFileList(fileList);
        }else{
          setFileList(file)
        }
        return false;
    }
    //获取文件md5码
    const chunkSize = 1024 * 1024 * 2
    const getFileMd5 = (file) => {
      return new Promise((resolve, reject) => {
        const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
        const chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        const spark = new SparkMD5.ArrayBuffer()
        const fileReader = new FileReader()
        fileReader.onload = function (e) {
          spark.append(e.target.result)
          currentChunk++
          if (currentChunk < chunks) {
            loadNext()
          } else {
            const _md5 = spark.end()
            resolve(_md5)
          }
        }
        function loadNext () {
          const start = currentChunk * chunkSize
          const end = start + chunkSize
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
        }
        loadNext()
      })
    }
    const props = {
      name: 'file',
      multiple: true,
      action: null,
      onChange: uploadChange,
      beforeUpload: beforeUpload,
      showUploadList: true
    };
    //文件发送请求事件
    const uploadFile = async() => {
      if(fileList) {
        const md5 = await getFileMd5(fileList);
        const isdir = "0";
        const file = fileList;
        const size = file.size;
        const path = dir;
        const blockList = md5;
        // console.log(accessToken, isdir, path, size, blockList, file)
        const formData = new FormData();
        formData.append("accessToken", accessToken);
        formData.append("isdir", isdir);
        formData.append("file", file);
        formData.append("size", size);
        formData.append("path", path);
        formData.append("blockList", blockList);
        // console.log(formData)
        const result = await reqUploadFile(formData);
        // console.log(result);
        if (result.resultCode === '200') {
          getFileList(dir);
          notification.open({
            message: '上传文件成功',
            icon: <CheckCircleFilled style={{ color: 'rgb(48,164,108)' }} />,
          });
          setIsUploadFileOpen(false);
        } else {
          notification.open({
              message: result.resultMsg,
              icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
          });
        }
      } else {
        notification.open({
          message: '请上传文件',
          icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
        });
      }
    }
    const handleUploadFileCancel = () => {
      setIsUploadFileOpen(false);
    };
    //操作-管理文件，复制，移动，重命名，删除
    const manageFile = async(action) => {
      if(action === '重命名') {
        setIsRenameOpen(true);
      } else if (action === '删除') {
        showDeleteConfirm();
      } else if (action === '复制') {
        setIsCopyOpen(true);
        getFileTree();
      } else if (action === '移动') {
        setIsMoveOpen(true);
        getFileTree();
      } else if (action === '下载') {
        downloadFile();
      }
    }
    const getFileTree = async() => {
        const path = '/apps/pansync';
        const result = await reqFileTree(accessToken, path);
        // console.log(result);
        if (result.resultCode === '200') {
          setTreeData(result.resultObject);
        } else {
          notification.open({
              message: result.resultMsg,
              icon: <ExclamationCircleFilled style={{ color: 'rgb(229,72,77)' }} />,
          });
        }
    }
    //每次 render 后执行
    useEffect(() => {
        const user = storageUtils.getUser();
        //如果内存中没有存储user，则说明当前没登录
        //console.log('client', user, JSON.stringify(user) === '{}')
        if (JSON.stringify(user) === '{}') {
        //自动跳转到登录页面（在render()中）
            navigate('/login', {replace: true});
        }
    })
    //第一次以及依赖项发生变化后执行
    useEffect(() => {
      getFileList(dir)
    },[dir])

        return (
            <Layout className='client'>
                <Header className='client-header'>PANSync</Header>
                <Content className='client-content'>
                    <Breadcrumb className='client-breadcrumb'>
                      {breadcrumbItems}
                    </Breadcrumb>
                    <Card className='client-card' bordered={false} hoverable={true}>
                        <Table 
                          dataSource={dataSource} 
                          columns={columns}
                          pagination={false}
                          rowClassName='client-table'
                          onRow={record => {
                            return {
                              onDoubleClick: event => {setDir(record.path)},// 双击行
                              onClick: event => { setFileName(record.serverFilename); setFsId(record.fsId);}//单击行
                            };
                          }}
                          loading={loading}
                        />
                    </Card>
                    <div className='client-toolbar'>
                      <Button type="text" icon={<SyncOutlined style={{fontSize: '20px'}}/>} style={{width: '40px', height: '40px'}} onClick={() => {getFileList(dir)}}/>
                      {/* <Button type="text" icon={<FileAddOutlined style={{fontSize: '20px'}}/>} style={{width: '40px', height: '40px'}}/> */}
                      <Button type="text" icon={<FolderAddOutlined style={{fontSize: '20px'}}/>} style={{width: '40px', height: '40px'}} onClick={() => {setIsCreateFileOpen(true)}}/>
                      <Button type="text" icon={<CloudUploadOutlined style={{fontSize: '20px'}}/>} style={{width: '40px', height: '40px'}} onClick={() => {setIsUploadFileOpen(true)}}/>
                    </div>
                </Content>
                <Modal title="输入一个新名称" open={isRenameOpen} onCancel={handleRenameCancel} footer={[]}>
                  <Form
                      name="normal_client"
                      className="client-form"
                      initialValues={{
                          remember: true,
                      }}
                      onFinish={handleRenameOk}>
                        <Form.Item name="newname" initialValue={fileName}>
                          <Input placeholder="请输入新名称" size="large"/>
                        </Form.Item>
                        <Form.Item className='client-form-button'>
                          <Button type="primary" size="large" htmlType="submit" className="client-form-submit"> 提交 </Button>
                        </Form.Item>
                  </Form>
                </Modal>
                <Modal title="输入文件夹名称" open={isCreateFileOpen} onCancel={handleCreateFileCancel} footer={[]}>
                  <Form
                      name="normal_client"
                      className="client-form"
                      initialValues={{
                          remember: true,
                      }}
                      onFinish={handleCreateFileOk}>
                        <Form.Item name="filename">
                          <Input placeholder="请输入新名称" size="large"/>
                        </Form.Item>
                        <Form.Item className='client-form-button'>
                          <Button type="primary" size="large" htmlType="submit" className="client-form-submit"> 提交 </Button>
                        </Form.Item>
                  </Form>
                </Modal>
                <Modal title="选择目标文件夹" open={isMoveOpen} onOk={handleMoveOk} onCancel={handleMoveCancel}>
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    value={moveValue}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    treeDefaultExpandAll
                    onChange={onMoveChange}
                    treeData={treeData}
                  />
                </Modal>
                <Modal title="选择目标文件夹" open={isCopyOpen} onOk={handleCopyOk} onCancel={handleCopyCancel}>
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    value={copyValue}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    treeDefaultExpandAll
                    onChange={onCopyChange}
                    treeData={treeData}
                  />
                </Modal>
                <Modal title="上传" open={isUploadFileOpen} onCancel={handleUploadFileCancel} footer={[]}>
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖动文件到此处以上传</p>
                    <p className="ant-upload-hint">
                      仅支持单个文件上传
                    </p>
                  </Dragger>
                  <div className='client-form-button'>
                    <Button type="primary" size="large" htmlType="submit" className="client-form-submit" onClick={() => {uploadFile()}}> 提交 </Button>
                  </div>
                </Modal>
                <Footer className='client-footer'><Button type="link" size="large" style={{color: '#cccccc', fontWeight: 'bold'}} onClick={() => toManage()}>管理</Button></Footer>
            </Layout>
        )
}

export default Client;