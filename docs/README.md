# Airbotix 项目文档

欢迎来到 Airbotix 项目文档！这里包含了完整的技术文档、API 文档、产品需求和开发资源。

## 📚 文档结构

```
docs/
├── README.md                    # 本文件 - 文档概览
├── frontend/                    # 前端文档
│   ├── README.md               # 前端文档概览
│   ├── components/             # 组件文档
│   ├── pages/                  # 页面文档
│   ├── hooks/                  # Hooks 文档
│   ├── services/               # 前端服务文档
│   ├── types/                  # 类型定义文档
│   └── utils/                  # 工具函数文档
├── backend/                     # 后端文档
│   ├── README.md               # 后端文档概览
│   ├── api/                    # API 文档
│   ├── database/               # 数据库文档
│   ├── auth/                   # 认证系统文档
│   ├── services/               # 业务服务文档
│   └── middleware/             # 中间件文档
├── product/                     # 产品文档
│   ├── README.md               # 产品文档概览
│   ├── prd/                    # 产品需求文档
│   ├── specs/                  # 功能规格说明
│   ├── user-stories/           # 用户故事
│   └── acceptance-criteria/    # 验收标准
├── infrastructure/              # 基础设施文档
│   ├── README.md               # 基础设施文档概览
│   ├── deployment/             # 部署文档
│   ├── monitoring/             # 监控文档
│   ├── security/               # 安全文档
│   └── ci-cd/                  # CI/CD 文档
└── ai/                         # AI 助手文档
    ├── README.md               # AI 助手文档概览
    ├── prompts/                # 提示词模板
    ├── context/                # 上下文管理
    ├── guidelines/             # AI 使用指南
    └── examples/               # 示例和模板
```

## 🚀 快速导航

### 前端开发
- [前端文档概览](./frontend/README.md) - 前端技术文档和指南
- [组件库文档](./frontend/components/README.md) - 可复用组件文档
- [页面文档](./frontend/pages/README.md) - 页面组件文档
- [Hooks 文档](./frontend/hooks/README.md) - 自定义 Hooks 文档
- [服务文档](./frontend/services/README.md) - 前端服务文档

### 后端开发
- [后端文档概览](./backend/README.md) - 后端技术文档和指南
- [API 文档](./backend/api/README.md) - 后端 API 文档
- [数据库文档](./backend/database/README.md) - 数据库设计和操作
- [认证系统](./backend/auth/README.md) - 用户认证和授权
- [业务服务](./backend/services/README.md) - 业务逻辑服务

### 产品管理
- [产品文档概览](./product/README.md) - 产品需求和规格文档
- [产品需求文档](./product/prd/README.md) - PRD 文档集合
- [功能规格](./product/specs/README.md) - 功能规格说明
- [用户故事](./product/user-stories/README.md) - 用户故事和场景
- [验收标准](./product/acceptance-criteria/README.md) - 功能验收标准

### 基础设施
- [基础设施文档概览](./infrastructure/README.md) - 部署和运维文档
- [部署文档](./infrastructure/deployment/README.md) - 应用部署指南
- [监控文档](./infrastructure/monitoring/README.md) - 系统监控和日志
- [安全文档](./infrastructure/security/README.md) - 安全策略和配置
- [CI/CD 文档](./infrastructure/ci-cd/README.md) - 持续集成和部署

### AI 助手
- [AI 助手文档概览](./ai/README.md) - AI 编程助手使用指南
- [项目上下文](./ai/context/project-overview.md) - 项目整体概览
- [技术栈详解](./ai/context/tech-stack.md) - 技术选型和架构
- [编码标准](./ai/context/coding-standards.md) - 代码规范和最佳实践

## 🎯 项目目标

Airbotix 项目旨在：

1. **展示教育项目**: 突出我们的 AI 和机器人工作坊，面向 K-12 学生
2. **建立信任**: 展示推荐、媒体报道和教育成果
3. **支持预订**: 提供便捷的工作坊预订和咨询功能
4. **支持增长**: 扩展以支持多个项目和国际扩张
5. **社区参与**: 促进学生、教育工作者和家庭之间的联系

## 🛠️ 技术栈

### 前端技术
- **框架**: React 18 + TypeScript + Vite
- **样式**: TailwindCSS + 自定义设计系统
- **路由**: React Router v6
- **状态管理**: React Context + useReducer
- **HTTP 客户端**: Axios

### 后端技术
- **运行时**: Node.js 18+ + Express.js
- **数据库**: MongoDB + Mongoose
- **认证**: JWT + bcrypt
- **邮件**: Nodemailer + SendGrid
- **缓存**: Redis

### 部署和运维
- **容器化**: Docker
- **云平台**: AWS / 阿里云
- **CDN**: CloudFlare
- **监控**: Winston + ELK Stack
- **CI/CD**: GitHub Actions

## 📖 如何使用文档

### 新团队成员
1. 从 [项目上下文](./ai/context/project-overview.md) 开始了解项目
2. 阅读 [技术栈详解](./ai/context/tech-stack.md) 了解技术选型
3. 查看 [编码标准](./ai/context/coding-standards.md) 了解开发规范
4. 根据角色选择相应的技术文档

### 开发贡献
1. 查看 [开发规范](../rules/README.md) 了解代码标准
2. 阅读相关技术文档了解实现细节
3. 遵循 [Git 工作流](../rules/git-workflow.md) 进行代码提交
4. 编写测试用例确保代码质量

### AI 助手使用
1. 查看 [AI 助手文档概览](./ai/README.md) 了解使用方法
2. 参考 [项目上下文](./ai/context/project-overview.md) 提供项目背景
3. 使用 [编码标准](./ai/context/coding-standards.md) 确保代码质量
4. 遵循 [技术栈详解](./ai/context/tech-stack.md) 选择合适的技术方案

## 🔄 文档维护

这是一个持续更新的文档资源，请：

- **保持更新** - 功能变更时及时更新文档
- **保持清晰** - 为新加入的开发者编写清晰的文档
- **包含示例** - 提供代码示例和实际案例
- **获取反馈** - 请团队成员审查文档变更

## 📞 需要帮助？

- **技术问题**: 查看相关技术文档或联系开发团队
- **产品问题**: 查看产品文档或联系产品团队
- **部署问题**: 查看基础设施文档或联系运维团队
- **建议改进**: 欢迎提出文档改进建议！

## 🎉 贡献文档

我们鼓励所有团队成员贡献文档：

1. **发现不清楚的地方？** - 更新并提交 PR
2. **添加了新功能？** - 在这里记录它
3. **解决了棘手问题？** - 添加到相关文档
4. **有好的示例？** - 在相关章节中包含它们

---

**最后更新**: 2025-01-15  
**维护团队**: Airbotix 开发团队

*Happy coding! 🚀*