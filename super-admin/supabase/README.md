# Supabase Production部署指南

## 📁 目录说明

```
supabase/
├── migrations/           # 数据库migration文件（版本控制）
│   ├── 20250909010959_create_profiles_table.sql
│   ├── ...（18个历史migrations）
│   └── 20251001024519_create_initial_super_admin.sql  # 新增：Super Admin
├── config.toml          # Supabase CLI配置
├── PRODUCTION_DEPLOYMENT.md   # 详细部署指南
├── DEPLOY_CHECKLIST.md        # 部署检查清单
└── README.md            # 本文件
```

---

## ⚡ 快速开始（3步）

### 1️⃣ Link到Production
```bash
cd /Users/liuyanzhuo/airbotix/super-admin
supabase link --project-ref xotjuqywguybyjpmfhrt
```

### 2️⃣ 推送Migrations
```bash
supabase db push --linked
```

这会自动按顺序执行所有19个migrations：
- ✅ 前18个：建表、RLS、安全加固等
- ✅ 最后1个：创建super admin（需先在应用注册）

### 3️⃣ 验证
```bash
supabase migration list --linked
# 应显示19个migrations全部成功
```

---

## 🎯 Production信息

- **Project URL:** https://xotjuqywguybyjpmfhrt.supabase.co
- **Project Ref:** `xotjuqywguybyjpmfhrt`
- **Super Admin:** alexlyz1124@gmail.com

---

## 📋 Migration历史

### 已有Migrations（18个）
所有本地开发期间的migrations，**不要修改**：

1. `20250909010959` - 创建profiles表
2. `20250910063044` - 空占位符
3. `20250910063129` - RBAC系统
4. `20250910071320` - Students表
5. `20250910073114` - Dashboard访问策略
6. `20250910120007` - Workshops系统
7. `20250911030000` - 安全加固
8. `20250911072000` - 视图安全
9. `20250911090050` - Audit log FK修复
10. `20250911094000` - 添加parent_name
11. `20250925000001` - 简化数据库（移除workshops）
12. `20250925000002` - 回滚脚本（已注释）
13. `20250925010000` - Auth冲突修复
14. `20250925010500` - 视图security_invoker
15. `20250925011000` - 邮箱冲突解决
16. `20250925011500` - 移除last_login触发器
17. `20250925011600` - 放松约束
18. `20250925012000` - 修复RLS递归

### 新增Migration（1个）
19. `20251001024519` - **创建初始Super Admin** ⭐

---

## ⚠️ 重要原则

### ✅ 正确做法
- ✅ 使用 `supabase db push` 部署
- ✅ 所有变更通过migration管理
- ✅ 保持migration文件不可变
- ✅ 新变更创建新migration

### ❌ 错误做法
- ❌ 直接在Dashboard执行SQL
- ❌ 修改已存在的migration文件
- ❌ 手动修改表结构
- ❌ 删除已应用的migration

---

## 🔐 Super Admin设置

### 前置条件
**必须先在应用注册账户！**

```bash
# 1. 访问应用登录页
# 2. 注册账号：alexlyz1124@gmail.com
# 3. 完成邮箱验证
```

### 自动创建
执行 `supabase db push` 时会自动运行最后一个migration：
- 检查用户是否存在于auth.users
- 创建或更新profile为super_admin
- 验证权限设置

### 验证
```sql
-- 在Supabase Dashboard SQL Editor
SELECT email, role, is_active 
FROM profiles 
WHERE email = 'alexlyz1124@gmail.com';
-- 应返回：role='super_admin', is_active=true
```

---

## 📚 详细文档

- **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - 完整部署指南
  - CLI使用详解
  - CI/CD自动化
  - 故障排查
  - 最佳实践

- **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - 部署检查清单
  - 逐步操作指南
  - 验证清单
  - 安全检查
  - 回滚计划

- **[supabase_remote_guide.md](../doc/supabase_remote_guide.md)** - 团队协作流程
  - 多人开发workflow
  - Migration管理
  - 冲突解决

---

## 🔄 未来修改数据库

```bash
# 1. 创建新migration
supabase migration new describe_your_change

# 2. 编辑生成的SQL文件
# 3. 本地测试
supabase db reset

# 4. 提交到Git
git add supabase/migrations/YYYYMMDDHHMMSS_*.sql
git commit -m "feat: describe your change"
git push

# 5. 部署到production
supabase db push --linked
```

---

## ✅ 数据库结构概览

### 核心表（5个）
- **profiles** - 用户认证与角色（super_admin, admin, teacher, student）
- **students** - 学生信息（包含parent_name, skill_level, status）
- **profiles_audit_log** - 用户变更审计
- **students_audit_log** - 学生变更审计
- **role_permissions** - 细粒度权限控制

### 关键功能
- ✅ Row Level Security (RLS) 全表启用
- ✅ 审计日志自动记录
- ✅ 邮箱冲突自动解决
- ✅ 函数search_path安全加固
- ✅ 视图security_invoker设置

---

## 🚀 立即开始

```bash
# 一键部署
cd super-admin
supabase link --project-ref xotjuqywguybyjpmfhrt
supabase db push --linked

# 等待完成（约1-2分钟）
# 然后访问应用测试登录
```

---

## 📞 需要帮助？

- 查看 `PRODUCTION_DEPLOYMENT.md` 获取详细指南
- 查看 `DEPLOY_CHECKLIST.md` 获取步骤清单
- 执行 `supabase db push --linked --debug` 查看详细错误

---

**版本：** v1.0  
**最后更新：** 2025-10-01  
**维护者：** Development Team

🎉 祝部署顺利！
