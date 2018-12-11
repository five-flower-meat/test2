import axios from 'axios';
import store from '../../store/index.js';
import { Message } from 'element-ui';
import { toTrim } from '../common.js';

export default (url, params, method, config) => {
  // 去掉首尾空格
  toTrim(params);
  // 当异步事件通过async，await阻塞发生时，loading会在第一次后失效
  // 原因，后续SHOW_PAGE_LOADING并没有触发视图的变更，采用再按钮上加v-loading.fullscreen.lock，再创建一个loading实例
  store.commit('SHOW_PAGE_LOADING');
  return new Promise((resolve, reject) => {
    let ajx;
    if (method === 'get') {
      ajx = axios.get(url, params, config);
    } else if (method === 'delete') {
      ajx = axios.delete(url, params, config);
    } else if (method === 'put') {
      ajx = axios.put(url, params, config);
    } else {
      ajx = axios.post(url, params, config);
    }

    ajx.then(res => {
      if (res.data.errorInfo.code === '401') {
        store.commit('ROUTE_CHANGE', { path: '/login' });
      } else if (String(res.data.errorInfo.code) === '200') {
        resolve(res.data);
      } else {
        // 防止防止多次执行Message，需要加一个全局message的状态
        Message({
          showClose: true,
          message: res.data.errorInfo.message,
          type: 'error'
        });
        reject(res.data);
      }
      // 处理完事件后，再关闭加载图标
      store.commit('HIDE_PAGE_LOADING');
    }).catch((err) => {
      store.commit('HIDE_PAGE_LOADING');
      reject(err);
      // 出现400+，500+错误
      errorHandle(err);
    });
  });
};

// 错误码处理

function errorHandle(err) {
  const _Message = msg => Message({
    showClose: true,
    message: msg,
    type: 'error'
  });
  switch (err.response.status) {
    case 400:
      _Message('请求错误');
      break;

    case 401:
      _Message('未授权，请登录');
      break;

    case 403:
      // 跳转到权限提示页面
      _Message('拒绝访问');
      break;

    case 404:
      _Message(`请求地址出错: ${err.config.url}`);

      // store.commit('ROUTE_CHANGE', { path: '/404' });
      break;

    case 408:
      _Message('请求超时');
      break;

    case 500:
      _Message('服务器内部错误');

      // 登录之后才能跳转
      if (store.state.root.currentUser.menuList.length) {
        store.commit('ROUTE_CHANGE', { path: '/500' });
      }

      break;

    case 501:
      _Message('服务未实现');
      break;

    case 502:
      _Message('网关错误');
      break;

    case 503:
      _Message('服务不可用');
      break;

    case 504:
      _Message('网关超时');
      break;

    case 505:
      _Message('HTTP版本不受支持');
      break;

    default:
      _Message('未知错误');
  }
};
