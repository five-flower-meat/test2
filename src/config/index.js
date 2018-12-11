
/**
 * 请求的根路径
 */
export const BASE_URL = 'http://localhost:3618';

/**
 * session持续时间。单位：天
 */
export const SESSION_DURATION = 1 / 72;

// 目前menuId递增到47，每次新增或者删除都需要修改这里的递增值！！！
// 如果menudId没有同步的后台，可以将enable: true，本地先展示
export const MENU_PERMISSIONS = [
  {
    menuId: 1,
    name: '首页',
    url: '/dashboard',
    icon: 'icon-home',
    enable: false
  },
  {
    menuId: 35,
    name: '数据提取管理',
    url: '/data-extraction',
    icon: 'icon-shujuku',
    enable: false,
    children: [
      {
        menuId: 36,
        parentId: 35,
        name: '明细数据下载',
        url: '/data-extraction/data-download',
        enable: false
      },
      {
        menuId: 37,
        parentId: 35,
        name: '数据审核管理',
        url: '/data-extraction/data-audit',
        enable: false
      }
    ]
  },
  {
    menuId: 2,
    name: '数据分析',
    url: '/analysis',
    icon: 'icon-data',
    enable: false,
    children: [
      {
        menuId: 3,
        parentId: 2,
        name: '活跃度分析',
        url: '/analysis/active',
        enable: false
      },
      {
        menuId: 38,
        parentId: 2,
        name: '新增用户分析',
        url: '/analysis/adduser',
        enable: false
      },
      {
        menuId: 4,
        parentId: 2,
        name: '留存流失分析',
        url: '/analysis/retention-loss',
        enable: false
      }
    ]
  },
  {
    menuId: 23,
    name: '集团客户管理',
    url: '/group-customer',
    icon: 'icon-client',
    enable: false,
    children: [
      {
        menuId: 24,
        parentId: 23,
        name: '集团客户总览',
        url: '/group-customer/overview',
        enable: false
      },
      {
        menuId: 25,
        parentId: 23,
        name: '集团客户创建',
        url: '/group-customer/create-manage',
        enable: false
      },
      {
        menuId: 26,
        parentId: 23,
        name: '集团客户审核',
        url: '/group-customer/audit-manage',
        enable: false
      }
    ]
  },
  {
    menuId: 27,
    name: '客户需求管理',
    url: '/requirement',
    icon: 'icon-kehuxuqiu',
    enable: false,
    children: [
      {
        menuId: 28,
        parentId: 27,
        name: '需求创建管理',
        url: '/requirement/manage',
        enable: false
      },
      {
        menuId: 29,
        parentId: 27,
        name: '需求任务处理',
        url: '/requirement/list',
        enable: false
      }
    ]
  },
  {
    menuId: 16,
    name: '产品管理',
    icon: 'icon-product',
    url: '/product',
    enable: false,
    children: [
      {
        menuId: 17,
        parentId: 16,
        name: '销售产品库',
        url: '/product/sales-product-store',
        enable: false
      },
      {
        menuId: 18,
        parentId: 16,
        name: '产品创建管理',
        url: '/product/product-creat-manage',
        enable: false
      },
      {
        menuId: 39,
        parentId: 16,
        name: '产品审核管理',
        url: '/product/product-audit-manage',
        enable: false
      }
    ]
  },
  {
    menuId: 19,
    name: '商机管理',
    url: '/business',
    icon: 'icon-business',
    enable: false,
    children: [
      {
        menuId: 20,
        parentId: 19,
        name: '商机总览',
        url: '/business-manage/business',
        enable: false
      },
      {
        menuId: 21,
        parentId: 19,
        name: '商机创建管理',
        url: '/business-manage/business-create-manage',
        enable: false
      },
      {
        menuId: 22,
        parentId: 19,
        name: '商机处理任务',
        url: '/business-manage/business-task',
        enable: false
      }
    ]
  },
  {
    menuId: 12,
    name: '订单管理',
    url: '/order',
    icon: 'icon-order',
    enable: false,
    children: [
      {
        menuId: 13,
        parentId: 12,
        name: '订单总览',
        url: '/order/overview',
        enable: false
      },
      {
        menuId: 14,
        parentId: 12,
        name: '订单创建管理',
        url: '/order/create-manage',
        enable: false
      },
      {
        menuId: 15,
        parentId: 12,
        name: '订单处理任务',
        url: '/order/handle-task',
        enable: false
      }
    ]
  },
  {
    menuId: 30,
    name: '走访管理',
    url: '/visit',
    icon: 'icon-zoufangguanli',
    enable: false,
    children: [
      {
        menuId: 31,
        parentId: 30,
        name: '我的走访管理',
        url: '/visit/my-visit-manage',
        enable: false
      },
      {
        menuId: 32,
        parentId: 30,
        name: '走访指派',
        url: '/visit/visit-appoint',
        enable: false
      }
    ]
  },
  {
    menuId: 40,
    name: '培训管理',
    url: '/train',
    icon: 'icon-Shape',
    enable: false,
    children: [
      {
        menuId: 41,
        parentId: 40,
        name: '培训创建管理',
        url: '/train/create-management',
        enable: false
      },
      {
        menuId: 42,
        parentId: 40,
        name: '培训报名中心',
        url: '/train/apply-center',
        enable: false
      },
      {
        menuId: 43,
        parentId: 40,
        name: '我的培训',
        url: '/train/my',
        enable: false
      }
    ]
  },
  {
    menuId: 44,
    name: '营销方案管理',
    url: '/market-program',
    icon: 'icon-laba',
    enable: false,
    children: [
      {
        menuId: 45,
        parentId: 44,
        name: '评级活动',
        url: '/market-program/rate-activity',
        enable: false
      },
      {
        menuId: 46,
        parentId: 44,
        name: '评级任务',
        url: '/market-program/rate-task',
        enable: false
      }
    ]
  },
  {
    menuId: 9,
    name: '系统配置',
    url: '/system',
    icon: 'el-icon-setting',
    enable: false,
    children: [
      {
        menuId: 10,
        parentId: 9,
        name: '角色管理',
        url: '/system/role/management',
        enable: false
      },
      {
        menuId: 11,
        parentId: 9,
        name: '用户管理',
        url: '/system/user/management',
        enable: false
      },
      {
        menuId: 34,
        parentId: 9,
        name: '全局配置',
        url: '/system/config',
        enable: false
      }
    ]
  }
];

export const PAGE_NO = 1;
export const PAGE_SIZE = 20;

// 最大添加行数为10
export const MAX_ADD_LINE = 10;

export const TREND_RADIO = {
  0: '活跃用户',
  1: '手机账号登录用户',
  2: '移动IP用户',
  3: '非移动IP用户'
};

export const TREND_RADIO_PROPERTY = {
  0: 'activeNum',
  1: 'msisdnNum',
  2: 'chinaMobileIpNum',
  3: 'otherIpNum'
};

export const ADDUSER_TREND_RADIO = {
  0: '新增用户',
  1: '新增手机用户',
  2: '新增游客用户',
  3: '新增会员活跃用户',
};

export const ADDUSER_TREND_COUNTRY_RADIO = {
  0: '新增用户',
  1: '新增手机用户',
  2: '新增会员活跃用户',
};

export const RETENTION_TREND_RADIO = {
  0: '新增用户留存率',
  1: '留存用户流失率'
};

export const RETENTION_TREND_RADIO_PORPERTY = {
  0: 'newUserRetPer',
  1: 'retLossPer'
};

/* rules 限制 */
// 时间限制
export const INPUT_TEXT_NAEM_LIMIT = 6;
export const WEEK_LIMIT = 7;
export const DATE_LIMIT = 31;
export const MONTH_LIMIT = 12;
export const INPUT_BIG_WORD_MAX = 2000;
export const INPUT_ACCOUNT_LIMIT = 25;
// export const INPUT_GROUP_NAME_LIMIT = 25;
export const INPUT_TEXT_LIMIT = 30;
export const INPUT_TEXTAREA_LIMIT = 50;
export const INPUT_TEXTAREA_MAX_LIMIT = 500;
export const EMAIL_MAX_LENGTH = 35;
export const INPUT_LENGTH_TWENTY = 20;
export const INPUT_NUMBER_LIMIT = 100000000;
export const INPUT_MONTH_MAX_LIMIT = 100;

// 上传文件支持类型
export const FILE_ACCEPT = [
  '.ppt',
  '.pptx',
  '.xlsx',
  '.xls',
  '.doc',
  '.docx',
  '.pdf',
  '.rar'
];
export const FILE_ACCEPT_USED_PDF = [
  '.ppt',
  '.pptx',
  '.xlsx',
  '.xls',
  '.doc',
  '.docx',
  '.pdf',
];

export const FILE_ACCEPT_ONLY_EXCEL = [
  '.xlsx',
  '.xls',
];
export const FILE_TIP = [
  '1、附件格式支持word、excel、ppt、pdf、rar格式',
  '2、附件大小不超过20M。'
];

// 文件上传的最大个数
// export const FILE_MAX_COUNT = 5;
// 20180829修改上传文件，最多只能上传一个
export const FILE_MAX_COUNT = 1;

export const FILE_ERROR_TIP = '只支持word、excel、ppt、pdf、rar格式';
export const FILE_ERROR_TIP_USED_PDF = '只支持word、excel、ppt、pdf格式';

export const FILE_ERROR_ONLY_EXCEL_TIP = '只支持excel格式';

// 20M
export const FILE_MAX_SIZE = 20;

export const CLIENT = [
  {
    'key': 1,
    'value': '咪咕视频'
  },
  {
    'key': 2,
    'value': '咪咕直播'
  },
  {
    'key': 3,
    'value': '咪咕影院'
  }
  // 20180705，暂时屏蔽，客户端渠道还没开通
  // {
  //   'key': 4,
  //   'value': '咪咕阅读'
  // },
  // {
  //   'key': 5,
  //   'value': '咪咕音乐'
  // },
  // {
  //   'key': 6,
  //   'value': '咪咕游戏'
  // },
  // {
  //   'key': 7,
  //   'value': '咪咕圈圈'
  // },
  // {
  //   'key': 8,
  //   'value': '咪咕善跑'
  // },
  // {
  //   'key': 9,
  //   'value': '咪咕灵犀'
  // }
];

export const REQUIREMENT_TYPE = [
  {
    'value': '0',
    'label': '日常需求'
  },
  {
    'value': '1',
    'label': '投诉需求'
  },
  {
    'value': '2',
    'label': '物料需求'
  }
];

export const VISIT_FIST_VISIT = [
  {
    'value': '0',
    'label': '否'
  },
  {
    'value': '1',
    'label': '是'
  }
];

export const ORDER_STATUS = {
  1: '草稿',
  2: '待签约',
  3: '待付款',
  4: '已完成',
  5: '已取消'
};

export const FILE_TYPE_ID = {
  order: 501,
  product: 502,
  requirement: 503,
  visit: 504,
  business: 506,
  marketSpecific: 601,
  marketCustomerService: 602,
  marketEarn: 603,
  marketManagement: 604,
  trainConfirmList: 701,
  trainClassSchedule: 702,
  trainCourseware: 703,
};

export const ADD_USER_TREND_DIMENSION = {
  0: '全国',
  1: '大区'
};

export const TRAIN_STATIS_COLOR = {
  '草稿': '#FCBE38',
  '未开始': '#FF8337',
  '进行中': '#B0B0B0',
  '已结束': '#3778FF'
};

export const TRAIN_STATUS = [
  {
    value: 0,
    key: '草稿',
    color: '#3778FF',
  },
  {
    value: 1,
    key: '未开始',
    color: '#FCBE38',
  },
  {
    value: 2,
    key: '进行中',
    color: '#FF8337',
  },
  {
    value: 3,
    key: '已结束',
    color: '#B0B0B0',
  },
];

export const CODE_TYPE_LIST = [
  'ORGANIZE_TYPE',
  'ORG_INDUSTRY_TYPE',
  'INDUSTRY_TYPE',
  'MEMBER_NUM',
  'CERTIFICATE_TYPE',
  'CM_MONEY_TYPE',
  'SEX',
  'AGE',
  'MARITAL_STATUS',
  // 订单模块
  'ORD_STATUS',
  'PROJECT_INVITATION',
  'PREDICT_AGREEMENT_TIME',
  // 商机模块
  'WEATHER', // 是否
  'BIZ_OPPOR_TYPE', // 商机类别
  'BIZ_OPPOR_STATUS', // 商机状态
  'PREDICT_AGREEMENT_TIME', // 预计协议期
  // 数据提取管理
  'CLIENT_TYPE',
  'CHANNEL_TYPE',
  'MEMBER_TYPE',
  'EXTRACT_AGE',
  'NET_TYPE',
  'CONTENT',
  'REGION',
  'TRAIN_SUB_COMPANY',
];

export const ADMIN_ROLES = [37, 114];
