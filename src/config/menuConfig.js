const menuList = [
    { 
        title: '个人资料', // 菜单标题名称 
        key: '/home', // 对应的 path 
        icon: 'HomeOutlined', // 图标名称 
        isPublic: true, //公开的
    },
    { 
        title: '设置', 
        key: '/setup',
        icon: 'AppstoreOutlined',
        children: [ // 子菜单列表 
            { 
                title: '站点',
                key: '/setup1',
                icon: 'BarsOutlined' 
            },
            { 
                title: '样式',
                key: '/setup2',
                icon: 'ToolOutlined'
            }, 
            { 
                title: '预览',
                key: '/setup3',
                icon: 'BarsOutlined' 
            },
            { 
                title: '全局',
                key: '/setup4',
                icon: 'ToolOutlined'
            },
            { 
                title: '其他',
                key: '/setup5',
                icon: 'BarsOutlined' 
            }
        ] 
    },
    { 
        title: '任务', 
        key: '/task',
        icon: 'AppstoreOutlined',
        children: [ // 子菜单列表 
            { 
                title: 'Aria2',
                key: '/task1',
                icon: 'BarsOutlined' 
            },
            { 
                title: '上传',
                key: '/task2',
                icon: 'ToolOutlined'
            }, 
            { 
                title: '复制',
                key: '/task3',
                icon: 'BarsOutlined' 
            }
        ] 
    },
    { 
        title: '用户',
        key: '/user',
        icon: 'UserOutlined' 
    },
    { 
        title: '存储', 
        key: '/storage', 
        icon: 'SafetyOutlined'
    },
    { 
        title: '元信息', 
        key: '/Information', 
        icon: 'SafetyOutlined'
    },
    { 
        title: '关于', 
        key: '/about', 
        icon: 'SafetyOutlined'
    },
]

export default menuList;