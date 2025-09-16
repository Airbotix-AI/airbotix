# API 文档

## 概述

本目录包含 Airbotix 项目的所有 API 文档，包括接口规范、请求/响应格式、错误码定义等。

## 📁 文档列表

### 认证相关 API
- [教师认证 API](./teacher-auth-api.md) - 教师登录注册相关接口

### 用户管理 API
- [用户管理 API](./user-management-api.md) - 用户 CRUD 操作接口

### 工作坊管理 API
- [工作坊管理 API](./workshop-management-api.md) - 工作坊管理相关接口

## 📋 API 设计规范

### 基础信息
- **Base URL**: `https://api.airbotix.com/v1`
- **认证方式**: JWT Bearer Token
- **内容类型**: `application/json`
- **字符编码**: `UTF-8`

### 响应格式
```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 响应数据
  },
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 错误码规范
- **4xx**: 客户端错误
- **5xx**: 服务器错误
- **自定义错误码**: 使用大写字母和下划线

### 分页格式
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## 🔧 开发指南

### API 开发流程
1. 设计 API 接口规范
2. 编写 API 文档
3. 实现后端接口
4. 编写单元测试
5. 集成测试验证

### 文档维护
- 保持文档与代码同步
- 及时更新接口变更
- 提供完整的示例代码
- 记录版本变更历史

---

**维护团队**: Airbotix 后端团队  
**最后更新**: 2025-01-15
