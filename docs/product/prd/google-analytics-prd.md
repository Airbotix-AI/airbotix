# Airbotix 网站 Google Analytics 4（GA4）集成 PRD

## 1. 产品概述

为 Airbotix 营销站点与教师认证流程集成 Google Analytics 4（以下简称 GA4），统一采集站点流量、主要转化漏斗与教师登录/注册关键行为数据，用于市场投放评估、内容优化与产品决策。

## 2. 目标与成功指标

- 目标
  - 构建稳定、合规的 GA4 埋点方案，覆盖核心页面与教师认证全流程
  - 支持路由级 PV/UV 统计、事件级转化追踪与基础用户属性上报
  - 保持前端实现解耦、可开关和可配置（通过环境变量）

- 成功指标（验收）
  - 页面浏览事件（page_view）100% 触发并正确记录路由路径与来源
  - 教师登录注册漏斗关键事件事件命中率 ≥ 95%
  - 数据延迟 ≤ 60 秒（以 GA4 DebugView 观测）
  - 开关关闭时不加载任何 GA 脚本且不发任何事件

## 3. 范围

- 站点范围（根网站，React + Vite）：`src/pages` 下所有公共页面与博客详情页
- 认证范围（教师登录注册）：`src/auth/pages` 中 `Login`, `Verify`, `Dashboard` 以及相关调用在 `store/authStore.ts`
- 本次不包含：Super Admin 与 Auth Backend 的后端埋点（后续如需以 BigQuery/Server events 方案扩展）

## 4. 关键用户旅程与事件

### 4.1 路由浏览（所有公开页面）
- 触发时机：React Router 路由变更后
- 事件：`page_view`
- 参数：
  - `page_location`: 完整 URL
  - `page_path`: hash 路由路径（如 `/workshops/123`）
  - `page_title`: 当前文档标题
  - `referrer`: document.referrer（首次）

### 4.2 教师认证漏斗
1) 进入登录页
  - 事件：`teacher_auth_login_view`
  - 参数：`language`, `ab_variant?`

2) 请求验证码（点击发送）
  - 成功事件：`teacher_auth_otp_request_success`
    - 参数：`cooldown_seconds`（60）、`email_domain`（屏蔽用户名，仅域名）
  - 失败事件：`teacher_auth_otp_request_fail`
    - 参数：`error_code`（来自 `src/constants/auth.ts` 的 `ERROR_CODES`）

3) 进入验证码验证页
  - 事件：`teacher_auth_verify_view`

4) 验证码提交
  - 成功事件：`teacher_auth_login_success`
    - 参数：`role`（固定 `teacher`）、`has_avatar`、`first_login`（可由后端返回/前端推断）
  - 失败事件：`teacher_auth_login_fail`
    - 参数：`error_code`

5) 登出
  - 事件：`teacher_auth_logout`

### 4.3 次要交互（可选）
- 顶部导航点击：`nav_click`（`item`, `to_path`）
- 内容按钮 CTA 点击（如 Book）：`cta_click`（`cta_name`, `to_path`）

## 5. 数据点与参数规范

- 通用上下文
  - `app_name`: `airbotix-web`
  - `env`: `development|staging|production`（取自 `import.meta.env.MODE`）
  - `language`: i18n 当前语言

- PII 规范
  - 不上传邮箱原文、不上传姓名等可识别信息
  - 仅上传邮箱域名（如 `example.com`）用于渠道分析

## 6. 技术实现与开关

- 配置
  - `VITE_GA4_MEASUREMENT_ID`：GA4 ID（如 `G-XXXXXXX`），缺失则禁用
  - `VITE_ENABLE_GA`：`'true'|'false'`，默认 `'false'`

- 集成点
  1) 在 `index.html` 动态注入 GA4 脚本（运行时条件：开关生效且 GA ID 存在）或通过 `gtag.js` 懒加载模块
  2) 新增 `src/utils/analytics.ts`：
     - `initAnalytics()`: 初始化并设置基础维度
     - `trackPageView(location)`: 路由变化时触发
     - `trackEvent(name, params)`: 通用事件
  3) 新增 `src/components/AnalyticsListener.tsx`：监听 React Router 路由变化，触发 `trackPageView`
  4) 在认证相关动作处调用事件：
     - `Login.tsx` 进入时触发 `teacher_auth_login_view`
     - `useAuthStore.requestOtp` 成功/失败触发对应事件
     - `Verify.tsx` 进入时触发 `teacher_auth_verify_view`
     - `useAuthStore.login` 成功/失败触发对应事件
     - `useAuthStore.logout` 触发 `teacher_auth_logout`

- 加载策略
  - 仅在浏览器端加载，不影响 SSR（当前无 SSR）
  - 开关关闭：不注入脚本、不初始化、不发送事件

## 7. 隐私、合规与同意

- 若后续启用 Cookie 同意弹窗，则在同意前不加载 GA4
- 遵循公司隐私策略：不上传 PII，不与个人身份直接关联
- 若部署到欧盟地区，需评估 GDPR 要求（本期不在范围）

## 8. 验收标准（清单）

- [ ] 本地 `VITE_ENABLE_GA='true'` + `VITE_GA4_MEASUREMENT_ID` 配置后，GA DebugView 可见路由 `page_view`
- [ ] 登录页进入触发 `teacher_auth_login_view`
- [ ] 请求验证码成功/失败分别触发成功/失败事件
- [ ] 验证页进入触发 `teacher_auth_verify_view`
- [ ] 登录成功/失败分别触发对应事件
- [ ] 登出触发 `teacher_auth_logout`
- [ ] 关闭开关后页面不加载 `gtag.js` 且无事件发送

## 9. 埋点字典（事件与参数）

| 事件名 | 描述 | 参数 |
| --- | --- | --- |
| page_view | 路由浏览 | page_location, page_path, page_title, referrer |
| teacher_auth_login_view | 登录页曝光 | language, ab_variant? |
| teacher_auth_otp_request_success | 请求验证码成功 | cooldown_seconds, email_domain |
| teacher_auth_otp_request_fail | 请求验证码失败 | error_code, email_domain? |
| teacher_auth_verify_view | 验证码页曝光 | language |
| teacher_auth_login_success | 登录成功 | role, first_login, has_avatar |
| teacher_auth_login_fail | 登录失败 | error_code |
| teacher_auth_logout | 登出 | - |
| nav_click | 导航点击 | item, to_path |
| cta_click | 重要按钮点击 | cta_name, to_path |

## 10. 实施计划与里程碑

1) 第 1 天：PRD 确认与评审、创建分支（已创建 `feature/google-analytics`）
2) 第 2 天：基础 SDK 集成与路由 PV 上报（`AnalyticsListener`）
3) 第 3 天：认证事件埋点（`Login`, `Verify`, `authStore`）
4) 第 4 天：DebugView 验证与 QA 用例通过，完善文档
5) 第 5 天：上线开关与回滚机制验证

## 11. 风险与对策

- HashRouter 导致 `page_path` 包含 hash，需统一解析：在 `trackPageView` 中截取 `location.hash`
- 本地 MSW（mock）可能拦截请求：埋点与 MSW 无冲突，但需避免测试误判
- 多语言切换影响标题与文案：事件参数中记录 `language`
- PII 风险：仅上报域名，严禁上传完整邮箱和姓名

---

文档版本：v1.0  
创建日期：2025-09-19  
维护团队：Airbotix 产品与前端团队  
最后更新：2025-09-19


