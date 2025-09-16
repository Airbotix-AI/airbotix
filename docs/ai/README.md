# AI Assistant Documentation

## 概述

AI 助手文档包含所有与 AI 编程助手、提示工程、上下文管理相关的文档，帮助 AI 工具更好地理解和协助开发工作。

## 📁 目录结构

```
ai/
├── README.md              # 本文件 - AI 助手文档概览
├── prompts/               # 提示词模板
│   ├── README.md         # 提示词概览
│   ├── code-review/      # 代码审查提示词
│   ├── feature-dev/      # 功能开发提示词
│   ├── bug-fix/          # 错误修复提示词
│   └── testing/          # 测试相关提示词
├── context/               # 上下文管理
│   ├── README.md         # 上下文概览
│   ├── project-overview/ # 项目概览上下文
│   ├── tech-stack/       # 技术栈上下文
│   └── coding-standards/ # 编码标准上下文
├── guidelines/            # AI 使用指南
│   ├── README.md         # 指南概览
│   ├── best-practices/   # 最佳实践
│   ├── limitations/      # 限制和注意事项
│   └── troubleshooting/  # 问题排查
└── examples/              # 示例和模板
    ├── README.md         # 示例概览
    ├── code-samples/     # 代码示例
    ├── prompts/          # 提示词示例
    └── workflows/        # 工作流程示例
```

## 🎯 目标

### 提高 AI 助手效率
- 提供清晰的项目上下文
- 标准化提示词模板
- 建立最佳实践指南
- 提供丰富的示例和模板

### 确保代码质量
- 遵循项目编码标准
- 保持代码风格一致性
- 实现最佳实践
- 避免常见错误

### 加速开发流程
- 快速理解项目结构
- 高效生成代码
- 自动化重复任务
- 提供智能建议

## 📚 核心概念

### 上下文管理
- **项目概览**: 整体架构和技术选型
- **代码结构**: 目录组织和文件关系
- **编码标准**: 代码风格和最佳实践
- **业务逻辑**: 功能需求和实现方式

### 提示词工程
- **角色定义**: 明确 AI 助手的角色和职责
- **任务描述**: 清晰描述需要完成的任务
- **约束条件**: 设定技术约束和限制
- **输出格式**: 定义期望的输出格式

### 最佳实践
- **代码审查**: 自动化代码质量检查
- **测试驱动**: 优先编写测试用例
- **文档优先**: 保持文档与代码同步
- **安全考虑**: 关注安全最佳实践

## 🔧 使用指南

### 项目初始化
1. 阅读项目概览文档
2. 了解技术栈和架构
3. 熟悉编码标准和规范
4. 查看相关示例和模板

### 功能开发
1. 使用功能开发提示词模板
2. 参考相关代码示例
3. 遵循编码标准和最佳实践
4. 编写测试用例和文档

### 代码审查
1. 使用代码审查提示词
2. 检查代码质量和规范
3. 验证测试覆盖率
4. 确保安全性

### 问题排查
1. 查看问题排查指南
2. 使用调试提示词
3. 参考常见问题解决方案
4. 寻求团队支持

## 📖 相关文档

- [提示词模板](./prompts/README.md)
- [上下文管理](./context/README.md)
- [使用指南](./guidelines/README.md)
- [示例和模板](./examples/README.md)

## 🤖 AI 助手使用提示

### 项目理解
- 首先阅读 `context/project-overview/` 了解项目整体情况
- 查看 `context/tech-stack/` 了解技术选型
- 参考 `context/coding-standards/` 了解编码规范

### 代码生成
- 使用 `prompts/feature-dev/` 中的提示词模板
- 参考 `examples/code-samples/` 中的代码示例
- 遵循 `guidelines/best-practices/` 中的最佳实践

### 代码审查
- 使用 `prompts/code-review/` 中的审查提示词
- 检查 `guidelines/limitations/` 中的注意事项
- 参考 `examples/workflows/` 中的审查流程

### 问题解决
- 查看 `guidelines/troubleshooting/` 中的问题排查指南
- 使用 `prompts/bug-fix/` 中的修复提示词
- 参考 `examples/` 中的解决方案示例

---

**维护团队**: Airbotix 开发团队  
**最后更新**: 2025-01-15
