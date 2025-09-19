# Frontend Documentation

## 概述

前端文档包含所有与用户界面、组件、页面、状态管理相关的技术文档。

## 📁 目录结构

```
frontend/
├── README.md              # 本文件 - 前端文档概览
├── components/            # 组件文档
│   ├── README.md         # 组件库概览
│   ├── ui/               # 基础 UI 组件
│   ├── layout/           # 布局组件
│   ├── forms/            # 表单组件
│   └── features/         # 功能组件
├── pages/                # 页面文档
│   ├── README.md         # 页面概览
│   ├── auth/             # 认证相关页面
│   ├── dashboard/        # 仪表板页面
│   └── public/           # 公开页面
├── hooks/                # 自定义 Hooks
│   ├── README.md         # Hooks 概览
│   ├── useAuth.ts        # 认证相关 Hooks
│   ├── useApi.ts         # API 相关 Hooks
│   └── useUI.ts          # UI 相关 Hooks
├── services/             # 前端服务
│   ├── README.md         # 服务概览
│   ├── api/              # API 服务
│   ├── auth/             # 认证服务
│   └── storage/          # 存储服务
├── types/                # TypeScript 类型定义
│   ├── README.md         # 类型概览
│   ├── api.ts            # API 类型
│   ├── auth.ts           # 认证类型
│   └── ui.ts             # UI 类型
└── utils/                # 工具函数
    ├── README.md         # 工具概览
    ├── validation.ts     # 验证工具
    ├── formatting.ts     # 格式化工具
    └── constants.ts      # 常量定义
```

## 🎯 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS + 自定义设计系统
- **路由**: React Router v6
- **状态管理**: React Context + useReducer
- **HTTP 客户端**: Axios
- **表单管理**: React Hook Form
- **图标**: Lucide React

## 📚 核心概念

### 组件设计原则
- **单一职责**: 每个组件只负责一个功能
- **可复用性**: 组件设计要考虑复用场景
- **可组合性**: 组件可以组合成更复杂的功能
- **可测试性**: 组件要易于单元测试

### 状态管理策略
- **本地状态**: 使用 useState 和 useReducer
- **全局状态**: 使用 Context API
- **服务端状态**: 使用自定义 Hooks 管理

### 类型安全
- **严格模式**: 启用 TypeScript 严格模式
- **类型定义**: 为所有 API 和组件定义类型
- **类型检查**: 在构建时进行类型检查

## 🔧 开发指南

### 组件开发
1. 在 `components/` 目录下创建组件
2. 编写 TypeScript 接口定义
3. 实现组件逻辑和样式
4. 编写单元测试
5. 更新组件文档

### 页面开发
1. 在 `pages/` 目录下创建页面
2. 使用布局组件包装页面内容
3. 集成必要的 Hooks 和服务
4. 处理路由和导航
5. 优化页面性能

### 服务集成
1. 在 `services/` 目录下创建服务
2. 定义 API 接口类型
3. 实现错误处理
4. 添加请求/响应拦截器
5. 编写服务测试

## 📖 相关文档

- [组件库文档](./components/README.md)
- [页面文档](./pages/README.md)
- [Hooks 文档](./hooks/README.md)
- [服务文档](./services/README.md)
- [类型定义](./types/README.md)
- [工具函数](./utils/README.md)

## 🤖 AI 助手提示

当 AI 助手需要了解前端相关功能时，请参考：

1. **组件开发**: 查看 `components/` 目录下的相关文档
2. **页面实现**: 查看 `pages/` 目录下的页面规范
3. **状态管理**: 查看 `hooks/` 目录下的状态管理 Hooks
4. **API 集成**: 查看 `services/` 目录下的服务实现
5. **类型定义**: 查看 `types/` 目录下的类型定义

---

**维护团队**: Airbotix 前端团队  
**最后更新**: 2025-01-15
