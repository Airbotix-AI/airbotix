# Production部署检查清单 ✅

## 🎯 目标

将本地的18个migration文件推送到production Supabase，符合version control规范。

**Production URL:** https://xotjuqywguybyjpmfhrt.supabase.co  
**Project Ref:** `xotjuqywguybyjpmfhrt`

---

## 📋 部署前检查

- [ ] Supabase CLI已安装并登录
  ```bash
  supabase --version
  supabase login
  ```

- [ ] 确认本地有18个migration文件
  ```bash
  ls supabase/migrations/ | wc -l
  # 应显示 18
  ```

- [ ] Git状态干净（所有改动已提交）
  ```bash
  git status
  ```

- [ ] 本地database测试通过
  ```bash
  supabase db reset
  npm run dev  # 确认应用正常运行
  ```

---

## 🚀 部署步骤（3步）

### Step 1: Link Production项目
```bash
cd /Users/liuyanzhuo/airbotix/super-admin

supabase link --project-ref xotjuqywguybyjpmfhrt
```

**预期输出：**
```
Linked to project: xotjuqywguybyjpmfhrt
```

- [ ] ✅ Link成功

---

### Step 2: 推送Migrations
```bash
supabase db push --linked
```

**预期输出：**
```
Applying migration 20250909010959_create_profiles_table.sql...
Applying migration 20250910063044_create_students_table.sql...
...（18个migrations）
Applying migration 20250925012000_fix_profiles_rls_recursion.sql...

Successfully applied 18 migrations.
```

**⏱️ 执行时间：** 1-2分钟

- [ ] ✅ 所有18个migrations执行成功
- [ ] ✅ 无错误输出

---

### Step 3: 验证部署
```bash
# 查看migration历史
supabase migration list --linked
```

**预期显示：**
```
✓ 20250909010959_create_profiles_table.sql
✓ 20250910063044_create_students_table.sql
...（18个全部打勾）
```

**在Dashboard验证：**
```sql
-- Supabase Dashboard → SQL Editor
SELECT * FROM supabase_migrations.schema_migrations 
ORDER BY version;
-- 应显示18条记录

-- 检查表
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
-- 应显示：profiles, students, profiles_audit_log, students_audit_log, role_permissions
```

- [ ] ✅ 18个migrations都在历史中
- [ ] ✅ 5个表都已创建
- [ ] ✅ 视图和函数都存在

---

## 👤 创建Super Admin

### 前置：用户注册
**先在应用中注册账户！**

1. 访问Super Admin登录页
2. 注册账号：`alexlyz1124@gmail.com`
3. 完成邮箱验证

- [ ] ✅ 用户已在auth.users中

### 创建Migration
```bash
supabase migration new create_initial_super_admin
```

编辑生成的文件：
```sql
-- supabase/migrations/YYYYMMDDHHMMSS_create_initial_super_admin.sql

DO $$
DECLARE
  admin_user_id UUID;
  admin_email TEXT := 'alexlyz1124@gmail.com';
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = admin_email;
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: %. Please signup first!', admin_email;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, is_active, created_at, updated_at)
  VALUES (admin_user_id, admin_email, 'Alex Liu', 'super_admin', true, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE
    SET role = 'super_admin', is_active = true, updated_at = NOW();

  RAISE NOTICE '✅ Super admin created: %', admin_email;
END $$;
```

推送：
```bash
supabase db push --linked
```

验证：
```sql
SELECT email, role, is_active FROM profiles WHERE email = 'alexlyz1124@gmail.com';
-- 应显示：role = 'super_admin', is_active = true
```

- [ ] ✅ Super admin migration创建
- [ ] ✅ Migration已推送
- [ ] ✅ 可以用super admin登录

---

## 🔍 验证清单

### 数据库结构
- [ ] profiles表存在（id, email, role等字段）
- [ ] students表存在（包含parent_name字段）
- [ ] profiles_audit_log表存在（无FK到profiles）
- [ ] students_audit_log表存在（无FK到students）
- [ ] role_permissions表存在并有数据

### 函数和触发器
- [ ] `get_user_role()` 函数存在
- [ ] `is_super_admin()` 函数存在
- [ ] `is_admin_or_above()` 函数存在
- [ ] `handle_new_user()` 触发器存在
- [ ] 所有函数的search_path = public

### RLS策略
- [ ] profiles表启用RLS
- [ ] students表启用RLS
- [ ] Super admin可以访问所有数据
- [ ] Teacher只能读取students
- [ ] 未认证用户无法访问数据

### 视图
- [ ] dashboard_metrics视图存在
- [ ] student_summary视图存在
- [ ] active_students视图存在
- [ ] active_users_by_role视图存在

### 应用功能
- [ ] Super admin可以登录
- [ ] Dashboard显示正确
- [ ] 可以创建学生记录
- [ ] 可以编辑学生记录
- [ ] Audit log正常记录
- [ ] 权限系统工作正常

---

## 🛡️ 安全检查

- [ ] 所有敏感函数使用SECURITY DEFINER
- [ ] 所有SECURITY DEFINER函数设置search_path
- [ ] 视图使用security_invoker=true
- [ ] RLS在所有表上启用
- [ ] 无SQL注入风险
- [ ] 邮箱唯一性约束存在

---

## 📊 性能检查

```sql
-- 检查索引
SELECT tablename, indexname FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename;
-- 应有多个索引（email, role, status等）

-- 检查表大小
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public';
```

- [ ] ✅ 关键字段都有索引
- [ ] ✅ 表大小合理

---

## 🔄 回滚计划（如需要）

**如果部署失败，可以回滚：**

```bash
# 查看最后应用的migration
supabase migration list --linked

# 创建回滚migration
supabase migration new rollback_production_deployment

# 在migration中写入回滚SQL
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
...

# 推送回滚
supabase db push --linked
```

---

## ✅ 完成标志

全部完成后：

- [ ] ✅ 18个migrations全部推送成功
- [ ] ✅ Super admin可以登录使用
- [ ] ✅ 所有功能测试通过
- [ ] ✅ 安全检查全部通过
- [ ] ✅ Git提交了新的super admin migration
- [ ] ✅ 团队成员已通知

---

## 📝 后续维护

**未来修改数据库时：**

```bash
# 1. 创建新migration
supabase migration new add_new_feature

# 2. 编辑SQL文件
# 3. 本地测试
supabase db reset

# 4. 提交代码
git add supabase/migrations/YYYYMMDDHHMMSS_add_new_feature.sql
git commit -m "feat: add new feature migration"
git push

# 5. 部署到production
supabase db push --linked
```

**记住：**
- ✅ 永远不要修改已存在的migration文件
- ✅ 所有数据库变更都通过migration
- ✅ 先在本地测试，再推送到production
- ✅ 保持Git和Supabase migration历史同步

---

## 📞 遇到问题？

参考完整文档：
- `PRODUCTION_DEPLOYMENT.md` - 详细部署指南
- `supabase_remote_guide.md` - 团队协作流程

或执行：
```bash
supabase db push --linked --debug
```
查看详细错误信息。

---

**预计总时间：** 10-15分钟  
**难度：** ⭐⭐☆☆☆（简单，跟着步骤走）

祝部署顺利！🚀

