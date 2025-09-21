# Airbotix 网站 GA4 最小集成 PRD（按老师要求）

## 1. 概述

仅为营销站点接入 Google Analytics 4 的 Measurement ID，做到“能统计基础流量”。不做路由监听、事件埋点、同意弹窗等扩展功能。

## 2. 目标与验收

- 目标：最小实现 GA4，首屏加载后即能在 GA DebugView 看到基础 `page_view`。
- 验收：
  - 页面加载后网络面板可见 `https://www.googletagmanager.com/gtag/js?id=G-XXXX` 请求
  - GA DebugView 能收到一次 `page_view`
  - 构建和部署不报错

## 3. 范围

- 仅根站点（React + Vite）
- 不包含：路由变更上报、任何自定义事件、认证流程埋点、Cookie 同意

## 4. 实现方案（最多改动 3-4 个文件）

- 环境变量（构建时注入）
  - `VITE_GA4_MEASUREMENT_ID`（例如 `G-0GZNJGRQRB`）
  - 为避免遗漏，代码内提供兜底 Measurement ID（同上），优先读取环境变量

- 代码改动
  1) `src/utils/analytics.ts`
     - 动态插入 `gtag.js`，并执行 `gtag('js', new Date())` 与 `gtag('config', GA_ID)`
     - 仅此两步；不配置 send_page_view=false、不加自定义参数
  2) `src/main.tsx`
     - 应用启动时调用 `initAnalytics()`
  3) 移除多余集成
     - 不使用路由监听组件
     - 不引入 Cookie 同意组件

## 5. 配置与部署

- 本地：在 `.env.local` 或构建环境设置 `VITE_GA4_MEASUREMENT_ID=G-0GZNJGRQRB`
- 若未设置，代码将使用兜底 ID，确保最小功能可用

## 6. 不做的内容（本期明确排除）

- 路由变更 `page_view` 上报
- 自定义事件（登录/验证/CTA 点击等）
- Cookie 同意弹窗与 PII 清洗

## 7. 风险与对策

- 风险：未配置环境变量导致 GA 不生效
  - 对策：代码兜底 + 文档补充 `VITE_GA4_MEASUREMENT_ID`
- 风险：SPA 路由切换不统计
  - 对策：本期不做，后续按需补增路由监听

## 8. 里程碑

- 当天完成：提交最小改动 PR、附部署验证截图（Network 请求 + DebugView）

---

文档版本：v1.1  
创建日期：2025-09-19  
维护团队：Airbotix 产品与前端团队  
最后更新：2025-09-21


