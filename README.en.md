# Kuma Mieru :traffic_light:

**Kuma Mieru - A Modern Third-Party Monitoring Dashboard for Uptime Kuma**  
Built with Next.js 15, TypeScript, and Recharts, this project enhances Uptime Kuma's public status pages with intuitive visualizations and latency charts.

[中文版](README.md) | [English Version](README.en.md)

> [!NOTE]
> This project has enabled the automatic synchronization of the upstream repository function,
>
> you can manually enable the `Auto Update from Upstream` workflow in the `Actions` page of your forked repository.

## Key Features :sparkles:

- **Real-Time Monitoring & Auto-Refresh** :arrows_clockwise: Live status updates without manual refreshing.
- **Elegant Responsive UI** :art: Modern interface powered by **HeroUI components**, optimized for all devices.
- **Interactive Analytics** :chart_with_upwards_trend: Explore node latency/status data through **Recharts-powered visualizations**.
- **Multi-Theme Support** :bulb: Dark/Light/System themes with automatic detection.
- **Maintenance Announcements**: Native support for Uptime Kuma's **incident updates** and **status events**.

## Preview :camera:

| Dark Mode                            | Light Mode                             |
| ------------------------------------ | -------------------------------------- |
| ![Dark Mode](./docs/v1.0.0-dark.png) | ![Light Mode](./docs/v1.0.0-light.png) |

## Deployment :star:

### Vercel Deployment (Recommended)

#### 1. Fork Repository

1. Click [Fork](https://github.com/Alice39s/kuma-mieru/fork) button to fork this repository to your GitHub account.
2. Click `Create fork` button to create a new fork.

> [!NOTE]
> Please ensure your forked repository is public, otherwise you may encounter issues when synchronizing updates.

#### 2. Import to Vercel

Go to https://vercel.com/new, select **Import** to import the repository you just forked.

#### 3. Configure Environment Variables

1. Click `Environment Variables` to add the following two environment variables:  
   `UPTIME_KUMA_BASE_URL` and `PAGE_ID`.

2. Click the `Deploy` button to deploy instantly on Vercel.

#### 4. Update Repository

1. Enter your forked GitHub repository, click the `Sync fork` button.
2. Click the `Update branch` button, and follow the prompts to automatically synchronize the latest code from this repository.

### Local Installation

1. **Clone Repository**

   ```bash
   git clone https://github.com/Alice39s/kuma-mieru.git
   cd kuma-mieru
   ```

2. **Install Dependencies**

   Kuma Mieru uses [Bun](https://bun.sh/) as its package manager, please install Bun first:

   ```bash
   # Linux/macOS
   curl -fsSL https://bun.sh/install | bash
   # Windows
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```

   Then install the dependencies:

   ```bash
   bun install
   ```

3. **Configure Environment**  
   Copy `.env.example` to `.env` and modify:

   ```bash
   UPTIME_KUMA_BASE_URL=https://your-kuma-instance.com
   PAGE_ID=your_status_page_id
   ```

   _Example: For URL `https://status.kuma-mieru.invalid/status/prod`, set:  
   `UPTIME_KUMA_BASE_URL=https://status.kuma-mieru.invalid`  
   `PAGE_ID=prod`_

4. **Start Development Server**

   ```bash
   bun run dev
   ```

   Access at: [http://localhost:3883](http://localhost:3883)

5. **Production Build**
   ```bash
   bun run build
   bun run start
   ```

## Docker Deployment :whale: (Beta)

### Using Docker Compose (Recommended)

1. **Clone Repository**

   ```bash
   git clone https://github.com/Alice39s/kuma-mieru.git
   cd kuma-mieru
   ```

2. **Configure Environment Variables**  
   Duplicate the `.env.example` file to create your `.env` file:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with required configurations:

   ```
   UPTIME_KUMA_BASE_URL=https://example.kuma-mieru.invalid
   PAGE_ID=your-status-page-id
   ```

3. **Start Services**

   ```bash
   docker compose up -d
   ```

   Add `--build` flag to bypass build cache if needed:

   ```bash
   docker compose up -d --build
   ```

   Service will be available at `http://0.0.0.0:3883`.

4. **View Logs**

   ```bash
   docker compose logs -f
   ```

### Manual Docker Deployment

1. **Build Image**

   ```bash
   docker build -t kuma-mieru .
   ```

2. **Modify Environment Variables**

   ```bash
   cp .env.example .env
   ```

   Please refer to the [Environment Variables](#environment-variables) section for more details.

3. **Run Container**

   ```bash
   docker run -d \
     --name kuma-mieru \
     -p 3883:3000 \
     -e UPTIME_KUMA_BASE_URL=https://example.kuma-mieru.invalid \
     -e PAGE_ID=your-status-page-id \
     kuma-mieru
   ```

### Environment Variables

| Variable Name        | Required | Description                      | Example                            |
| -------------------- | -------- | -------------------------------- | ---------------------------------- |
| UPTIME_KUMA_BASE_URL | Yes      | Base URL of Uptime Kuma instance | https://example.kuma-mieru.invalid |
| PAGE_ID              | Yes      | Status page path of Uptime Kuma  | test1                              |

### Health Check

The Docker container includes a built-in health check mechanism that verifies service status every 30 seconds. The health check API endpoint is `/api/health`, returning:

```json
{
  "status": "ok",
  "timestamp": "2024-03-20T12:34:56.789Z",
  "uptime": 123.456
}
```

Check container health status using:

```bash
docker ps
```

Or via Docker Compose:

```bash
docker compose ps
```

Directly access the health check API:

```bash
curl http://localhost:3883/api/health
```

## Architecture :file_folder:

Built with Next.js 15 (App Router):

```
kuma-mieru/
├── app/                   # Next.js core
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
├── config/                # App configurations
├── public/                # Static assets
├── services/              # Data services
├── styles/                # Global CSS
├── types/                 # TypeScript types
├── utils/                 # Helper functions
└── ...                    # Config files
```

## Integration with Uptime Kuma :link:

Seamlessly works with the popular self-hosted monitoring tool:  
[Uptime Kuma](https://github.com/louislam/uptime-kuma)

**Prerequisites**:

1. A running Uptime Kuma instance
2. Created status page in Uptime Kuma
3. Correct environment variables configuration

## Contribution Guide :handshake:

We welcome contributions! Please review:  
[CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License :lock:

Open-sourced under [MPL-2.0](LICENSE) (Mozilla Public License 2.0).
