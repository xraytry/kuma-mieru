# Kuma Mieru :traffic_light:

**Kuma Mieru 是一款基于 Next.js 15、TypeScript 和 Recharts 构建的第三方 Uptime Kuma 监控仪表盘。** 本项目尝试使用 Recharts + Next.js 解决 Uptime Kuma 公开监控页面不够直观、没有延迟图表的缺点。

[中文版](README.md) | [English Version](README.en.md)

## 功能亮点 :sparkles:

- **实时监控，自动刷新** :arrows_clockwise:：状态显示**实时更新**，无需手动刷新，随时掌握最新动态。
- **美观响应式界面** :art:：采用 **HeroUI 组件** 构建，界面更加现代，**完美适配**各种设备屏幕。
- **交互式图表** :chart_with_upwards_trend:：利用 **Recharts** 图表库实现数据可视化，可以 **交互式** 地查看各节点的延迟、状态等数据。
- **多主题支持** :bulb:：提供 **暗色** / **亮色** / **系统** 多种主题，满足不同偏好。
- **维护公告**：支持 Uptime Kuma 的 **事件公告** 和 **状态更新** 特性，实时同步更高效。

## 测试截图 :camera:

| Dark Mode                            | Light Mode                             |
| ------------------------------------ | -------------------------------------- |
| ![Dark Mode](./docs/v1.0.0-dark.png) | ![Light Mode](./docs/v1.0.0-light.png) |

## 快速部署 :star:

### 使用 Vercel 部署 (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falice39s%2Fkuma-mieru.git&env=UPTIME_KUMA_BASE_URL,PAGE_ID)

- 点击按钮后，需要填写 `UPTIME_KUMA_BASE_URL` 和 `PAGE_ID` 两个环境变量
- 最后点击 `Deploy` 按钮即可一键部署到 Vercel。

### 本地部署

只需简单几步，即可快速启动 Kuma Mieru：

1. **克隆仓库**

   ```bash
   git clone https://github.com/Alice39s/kuma-mieru.git
   cd kuma-mieru
   ```

2. **安装依赖**

   ```bash
   bun install
   ```

3. **配置环境变量**
   复制 `.env.example` 文件并创建 `.env.local` 文件，然后根据您的 Uptime Kuma 实例配置以下环境变量：

   ```bash
   cp .env.example .env.local
   ```

   `.env.local` 文件中 **必填** 的环境变量：

   ```
   UPTIME_KUMA_BASE_URL=https://example.com
   PAGE_ID=your-status-page-id
   ```

   举个例子，如果您的 Uptime Kuma 公开状态页面的 URL 为
   `https://example.com/status/test1`

   那么您需要这么配置：

   - `UPTIME_KUMA_BASE_URL` 设置为 `https://example.com`
   - `PAGE_ID` 设置为 `test1`

4. **启动开发服务器**

   ```bash
   bun run dev
   ```

5. **访问仪表盘**
   打开浏览器，访问 [http://localhost:3883](http://localhost:3883) 即可查看您的 Kuma Mieru 监控仪表盘。

6. **部署上线**

   ```bash
   bun run build
   bun run start
   ```

## Docker 部署 :whale:

### 使用 Docker Compose（推荐）

1. **克隆仓库**

   ```bash
   git clone https://github.com/Alice39s/kuma-mieru.git
   cd kuma-mieru
   ```

2. **配置环境变量**
   复制 `.env.example` 文件并创建 `.env` 文件：

   ```bash
   cp .env.example .env
   ```

   编辑 `.env` 文件，设置必要的环境变量：

   ```
   UPTIME_KUMA_BASE_URL=https://example.com
   PAGE_ID=your-status-page-id
   ```

3. **启动服务**

   ```bash
   docker compose up -d
   ```

   如果需要绕过 build 缓存，可以添加 `--build` 参数：

   ```bash
   docker compose up -d --build
   ```

   服务将在 `http://0.0.0.0:3883` 上运行。

4. **查看日志**

   ```bash
   docker compose logs -f
   ```

### 使用 Docker 手动部署

1. **构建镜像**

   ```bash
   docker build -t kuma-mieru .
   ```

2. **运行容器**

   ```bash
   docker run -d \
     --name kuma-mieru \
     -p 3883:3000 \
     -e UPTIME_KUMA_BASE_URL=https://example.com \
     -e PAGE_ID=your-status-page-id \
     kuma-mieru
   ```

### 环境变量说明

| 变量名               | 必填 | 说明                       | 示例                |
| -------------------- | ---- | -------------------------- | ------------------- |
| UPTIME_KUMA_BASE_URL | 是   | Uptime Kuma 实例的基础 URL | https://example.com |
| PAGE_ID              | 是   | 状态页面 ID                | test1               |

### 健康检查

Docker 容器包含了内置的健康检查机制，每 30 秒会检查一次服务状态。健康检查 API 端点为 `/api/health`，返回以下信息：

```json
{
  "status": "ok",
  "timestamp": "2024-03-20T12:34:56.789Z",
  "uptime": 123.456
}
```

您可以通过以下命令查看容器的健康状态：

```bash
docker ps
```

或者使用 Docker Compose：

```bash
docker compose ps
```

您也可以直接访问健康检查 API：

```bash
curl http://localhost:3883/api/health
```

## 项目结构 :file_folder:

Kuma Mieru 使用 Next.js 15 (App Router) 构建，具体的项目结构如下：

```
kuma-mieru/
├── app/                   # Next.js 应用目录
│   ├── api/               # API 路由
│   ├── layout.tsx         # 主布局
│   └── page.tsx           # 主页
├── components/            # React 组件
│   ├── ...
├── config/                # 配置文件
│   ├── ...
├── public/                # 静态文件
├── services/              # 服务组件
├── styles/                # 全局样式
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数
├── tailwind.config.js     # Tailwind CSS 配置
├── next.config.js         # Next.js 配置
├── .env.example           # 配置文件示例
├── ...
```

## 与 Uptime Kuma 集成 :link:

Kuma Mieru 与备受好评的开源监控工具 [Uptime Kuma](https://github.com/louislam/uptime-kuma) 无缝集成，您只需要：

1. **安装并配置 Uptime Kuma**
2. **在 Uptime Kuma 中创建 "状态页面"**
3. **在 `.env.local` 文件中配置环境变量**

## 贡献指南 :handshake:

非常欢迎您为 Kuma Mieru 项目作出贡献！

如果您有任何想法或建议，请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细的贡献方式。

## 开源许可 :lock:

本项目采用 [MPL-2.0](LICENSE) (Mozilla Public License Version 2.0) 开源许可证。
