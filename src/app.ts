// 运行时配置
import { RequestConfig } from '@umijs/max';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://www.hx168.com.cn/favicon.ico',
    pure: true,
  };
};

export const request: RequestConfig = {
  baseURL: process.env.UMI_APP_API_BASE || 'http://10.80.232.101:30875/web',
};
