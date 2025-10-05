# Production部署指南 - 符合Version Control规范

## ⚠️ 重要原则

1. **✅ 保持本地migration文件不变** - 这些是版本历史，不应修改
2. **✅ 使用Supabase CLI部署** - 通过 `supabase db push` 推送到production
3. **✅ 所有变更都通过migration管理** - 符合version control规范
4. **❌ 不要直接在Dashboard执行SQL** - 会破坏migration追踪

---

## 📋 前置条件

```bash
# 1. 确保已安装Supabase CLI
supabase --version

# 2. 登录Supabase
supabase login

# 3. 检查当前项目配置
cat supabase/config.toml | grep project_id
```

---

## 🚀 部署流程（推荐方式）

### Step 1: Link到Production项目

```bash
# 进入super-admin目录
cd /Users/liuyanzhuo/airbotix/super-admin

# Link到production Supabase项目
supabase link --project-ref xotjuqywguybyjpmfhrt

# 验证连接
supabase projects list
```

**📝 说明：**
- `xotjuqywguybyjpmfhrt` 是你的production项目ref（从URL提取）
- Link后会更新 `supabase/config.toml`

---

### Step 2: 检查待推送的Migrations

```bash
# 查看所有本地migrations
ls -la supabase/migrations/

# 检查remote和local的差异
supabase db diff --linked

# 或者查看将要应用的migrations
supabase migration list
```

**预期输出：**
```
Local migrations (18 files):
  20250909010959_create_profiles_table.sql
  20250910063044_create_students_table.sql
  20250910063129_create_user_profiles_and_roles.sql
  ...（其他15个）
  20250925012000_fix_profiles_rls_recursion.sql

Remote migrations (0 files):
  (empty - 新数据库)
```

---

### Step 3: 推送Migrations到Production

```bash
# 🚀 将所有本地migrations推送到production
supabase db push --linked

# 带详细输出
supabase db push --linked --debug
```

**执行过程：**
1. CLI会读取 `supabase/migrations/` 下的所有SQL文件
2. 按时间戳顺序执行（18个migration）
3. 在remote创建 `supabase_migrations.schema_migrations` 表追踪
4. 每个migration执行成功后记录到tracking表

**⏱️ 预计时间：** 1-2分钟

---

### Step 4: 验证部署结果

```bash
# 查看remote数据库状态
supabase db remote commit

# 列出remote的migrations历史
supabase migration list --linked

# 或通过Dashboard检查
# Dashboard → Database → Schema Migrations
```

**验证检查：**
```sql
-- 在Supabase Dashboard SQL Editor执行
SELECT * FROM supabase_migrations.schema_migrations 
ORDER BY version;
-- 应显示18条记录

-- 检查表
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
-- 应显示：profiles, students, audit logs, role_permissions
```

---

### Step 5: 创建Super Admin用户

**方式A：通过Migration（推荐）** ✅

创建新的migration：
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
  -- 查找auth.users中的用户
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email
  LIMIT 1;

  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User % not found. Please signup first.', admin_email;
  END IF;

  -- 更新或插入profile
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (admin_user_id, admin_email, 'Alex Liu', 'super_admin', true)
  ON CONFLICT (id) DO UPDATE
    SET role = 'super_admin',
        is_active = true,
        updated_at = NOW();

  RAISE NOTICE 'Super admin created: %', admin_email;
END $$;
```

然后推送：
```bash
supabase db push --linked
```

**方式B：手动在Dashboard执行（临时用）** ⚠️

如果急需，可以在SQL Editor手动执行一次性SQL（但不推荐作为常规流程）

---

## 🔄 CI/CD自动化（可选）

### GitHub Actions示例

创建 `.github/workflows/deploy-db.yml`:

```yaml
name: Deploy Database Migrations

on:
  push:
    branches: [main]
    paths:
      - 'super-admin/supabase/migrations/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Link to Production
        run: |
          cd super-admin
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      
      - name: Push Migrations
        run: |
          cd super-admin
          supabase db push --linked
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

**配置Secrets：**
- `SUPABASE_PROJECT_REF`: `xotjuqywguybyjpmfhrt`
- `SUPABASE_ACCESS_TOKEN`: 从Dashboard获取

---

## 📊 Migration管理最佳实践

### ✅ 正确做法

1. **本地开发：**
   ```bash
   supabase migration new add_student_status_field
   # 编辑生成的SQL文件
   supabase db reset  # 测试migration
   ```

2. **提交代码：**
   ```bash
   git add supabase/migrations/YYYYMMDDHHMMSS_*.sql
   git commit -m "feat: add student status field migration"
   git push
   ```

3. **部署到production：**
   ```bash
   supabase db push --linked
   ```

### ❌ 错误做法

- ❌ 修改已存在的migration文件
- ❌ 直接在Dashboard手动修改表结构
- ❌ 复制粘贴SQL到Dashboard执行
- ❌ 删除已应用的migration文件

---

## 🔍 故障排查

### 问题1: Migration推送失败

```bash
# 检查remote状态
supabase db remote commit

# 强制重新sync（小心使用）
supabase db reset --linked

# 查看详细错误
supabase db push --linked --debug
```

### 问题2: Migration顺序冲突

```bash
# 查看migration历史
supabase migration list --linked

# 如果有冲突，创建新的fix migration
supabase migration new fix_migration_conflict
```

### 问题3: Local和Remote不同步

```bash
# 拉取remote的schema到local
supabase db pull --linked

# 或重置local到remote状态
supabase db reset --linked
```

---

## 📝 当前项目Migration清单

你的项目现有18个migrations需要推送到production：

| # | Migration | 状态 |
|---|-----------|------|
| 1 | `20250909010959_create_profiles_table.sql` | ✅ 保持不变 |
| 2 | `20250910063044_create_students_table.sql` | ✅ 保持不变 |
| 3 | `20250910063129_create_user_profiles_and_roles.sql` | ✅ 保持不变 |
| 4 | `20250910071320_fix_create_students_table.sql` | ✅ 保持不变 |
| 5 | `20250910073114_add_dashboard_access_policy.sql` | ✅ 保持不变 |
| 6 | `20250910120007_create_courses_workshops_enrollments.sql` | ✅ 保持不变 |
| 7 | `20250911030000_fix_security_issues.sql` | ✅ 保持不变 |
| 8 | `20250911072000_harden_views_and_search_path.sql` | ✅ 保持不变 |
| 9 | `20250911090050_fix_students_audit_log_fk.sql` | ✅ 保持不变 |
| 10 | `20250911094000_add_parent_name_to_students.sql` | ✅ 保持不变 |
| 11 | `20250925000001_simplify_database_structure.sql` | ✅ 保持不变 |
| 12 | `20250925000002_rollback_simplification.sql` | ✅ 保持不变 |
| 13 | `20250925010000_fix_handle_new_user_upsert.sql` | ✅ 保持不变 |
| 14 | `20250925010500_fix_views_security_invoker.sql` | ✅ 保持不变 |
| 15 | `20250925011000_fix_handle_new_user_resolve_email_conflict.sql` | ✅ 保持不变 |
| 16 | `20250925011500_remove_last_login_trigger.sql` | ✅ 保持不变 |
| 17 | `20250925011600_relax_profiles_constraints.sql` | ✅ 保持不变 |
| 18 | `20250925012000_fix_profiles_rls_recursion.sql` | ✅ 保持不变 |

**新增（可选）：**
- `20251001XXXXXX_create_initial_super_admin.sql` - 创建super admin的migration

---

## ⚡ 快速部署命令

```bash
# 一键部署到production
cd /Users/liuyanzhuo/airbotix/super-admin
supabase link --project-ref xotjuqywguybyjpmfhrt
supabase db push --linked

# 验证
supabase migration list --linked
```

---

## ✅ 总结

**符合Version Control的正确流程：**

1. ✅ 保持所有18个本地migration文件不变
2. ✅ 使用 `supabase link` 连接到production
3. ✅ 使用 `supabase db push` 推送migrations
4. ✅ Migration历史完整记录在Git和Supabase中
5. ✅ 未来的变更都通过新的migration文件

**与之前方案的区别：**
- ❌ 之前：手动在Dashboard执行consolidated SQL
- ✅ 现在：CLI自动按顺序执行所有migrations
- ✅ 优势：完整的版本控制、可追溯、可回滚

**下次修改数据库时：**
```bash
supabase migration new describe_your_change
# 编辑SQL
git add + commit + push
supabase db push --linked
```

这才是真正的"Infrastructure as Code"！🎯

