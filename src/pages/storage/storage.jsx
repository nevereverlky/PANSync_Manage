import { Button, Card, Tag } from 'antd';
import './storage.less'

function Storage() {

    return (
      <div className="storage">
        <div className='storage-button'>
          <Button size="large" className="storage-fresh"> 刷新 </Button>
          <Button size="large" className="storage-add"> 添加 </Button>
        </div>
        <div className='storage-card'>
          <Card className="storage-cardItem" hoverable={true}>
            <div className='storage-card-title'>/阿里云盘<Tag color="blue" style={{fontWeight: 'bold', marginLeft: '10px'}}>阿里云盘</Tag></div>
            <div className='storage-card-status'>状态：work</div>
            <div className='storage-card-button'>
              <Button size="large" className="storage-card-edit"> 编辑 </Button>
              <Button size="large" className="storage-card-isWork"> 禁用 </Button>
              <Button size="large" className="storage-card-delete"> 删除 </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  export default Storage;
  