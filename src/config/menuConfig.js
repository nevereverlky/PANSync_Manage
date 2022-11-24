const menuList = [
    { 
        title: '个人资料', // 菜单标题名称 
        key: '/admin/home', // 对应的 path 
        icon: 'IdcardOutlined', // 图标名称 
        isPublic: true, //公开的
    },
    { 
        title: '设置', 
        key: '/admin/setup',
        icon: 'SettingOutlined',
        children: [ // 子菜单列表 
            { 
                title: '站点',
                key: '/admin/notice',
                icon: 'CreditCardOutlined' 
            },
            { 
                title: '样式',
                key: '/admin/setup2',
                icon: 'FormatPainterOutlined'
            }, 
            { 
                title: '预览',
                key: '/admin/setup3',
                icon: 'CameraOutlined' 
            },
            { 
                title: '全局',
                key: '/admin/setup4',
                icon: 'GlobalOutlined'
            },
            { 
                title: '其他',
                key: '/admin/setup5',
                icon: 'BarsOutlined' 
            }
        ] 
    },
    { 
        title: '任务', 
        key: '/admin/task',
        icon: 'ApartmentOutlined',
        children: [ // 子菜单列表 
            { 
                title: 'Aria2',
                key: '/admin/task1',
                icon: 'CloudDownloadOutlined' 
            },
            { 
                title: '上传',
                key: '/admin/task2',
                icon: 'CloudUploadOutlined'
            }, 
            { 
                title: '复制',
                key: '/admin/task3',
                icon: 'CopyOutlined' 
            }
        ] 
    },
    { 
        title: '用户',
        key: '/admin/user',
        icon: 'UserOutlined' 
    },
    { 
        title: '存储', 
        key: '/admin/storage', 
        icon: 'DatabaseOutlined'
    },
    { 
        title: '元信息', 
        key: '/admin/Information', 
        icon: 'BuildOutlined'
    },
    { 
        title: '关于', 
        key: '/admin/about', 
        icon: 'BlockOutlined'
    },
    { 
        title: '主页', 
        key: '/client', 
        icon: 'HomeOutlined'
    },
]

export default menuList;