# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://umijs.org/docs/max/introduce)

## 前置条件

- ✅ [Node.js](https://nodejs.org/) (v18 或更高版本)
- ✅ [Git](https://git-scm.com/)
- ✅ [pnpm](https://pnpm.io/) 包管理器

## 快速开始（5 分钟上手）

### 1. 安装 pnpm

```bash
npm install -g pnpm
```

### 2. 克隆项目

```bash
git clone [项目地址]
cd [项目文件夹]
```

### 3. 安装依赖

```bash
pnpm install
```

> ⚠️ 重要：此命令会自动执行 `max setup`（初始化项目）

### 4. 启动开发服务器

```bash
pnpm run dev
```

> 成功后访问：http://localhost:8000（或控制台显示的地址）

### 5. 构建生产版本

```bash
pnpm run build
```

> 构建结果在 `dist` 目录

## 常见问题解决

| 问题现象 | 解决方案 |
| --- | --- |
| `pnpm: command not found` | 重新打开终端或重启电脑 |
| 安装依赖卡住 | Windows：以管理员身份运行终端<br>Mac/Linux：使用 `sudo pnpm install` |
| 浏览器无法访问 | 确认终端显示 `Listening on port 8000`<br>检查防火墙设置 |
| 构建失败 | 删除 `node_modules` 和 `pnpm-lock.yaml` 后重新执行 `pnpm install` |

## 开发指南

### 修改代码

1. 在 `src` 目录修改 React 组件（如 `src/pages/index.tsx`）
2. 保存文件 → 浏览器自动刷新（热重载）

### 添加新页面

1. 在 `src/pages` 创建新文件（如 `About.tsx`）
2. 添加基础 React 组件：

```tsx
import React from 'react';

export default function About() {
  return (
    <div>
      <h1>关于页面</h1>
      <p>这是新添加的页面</p>
    </div>
  );
}
```

3. 重启开发服务器：`Ctrl+C` → `pnpm run dev`

### 添加依赖

```bash
# 开发依赖
pnpm add -D [依赖名]

# 生产依赖
pnpm add [依赖名]
```

## 项目结构说明

```
src/
├── pages/          # React 页面组件
├── components/     # 可复用组件
├── models/         # Umi 数据模型
├── services/       # API 服务
├── utils/          # 工具函数
└── assets/         # 静态资源
```

## 重要提醒

1. 永远不要手动修改 `node_modules`
2. 首次安装必须使用 `pnpm install`（会自动执行 `max setup`）
3. 修改配置文件请参考 `config/config.ts`
4. 使用 `pnpm run format` 格式化代码

## 学习资源

- [React 官方文档](https://react.dev/)
- [Umi 官方文档](https://umijs.org/)
- [React 基础教程](https://react-tutorial.app/)

> 💡 遇到问题？请查看 [Issues](https://github.com/your-repo/issues) 或提交新问题
