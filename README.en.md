# Kuma Mieru :traffic_light:

**Kuma Mieru - A Modern Third-Party Monitoring Dashboard for Uptime Kuma**  
Built with Next.js 15, TypeScript, and Recharts, this project enhances Uptime Kuma's public status pages with intuitive visualizations and latency charts.

[中文版](README.md) | [English Version](README.en.md)

## Key Features :sparkles:

- **Real-Time Monitoring & Auto-Refresh** :arrows_clockwise: Live status updates without manual refreshing.
- **Elegant Responsive UI** :art: Modern interface powered by **HeroUI components**, optimized for all devices.
- **Interactive Analytics** :chart_with_upwards_trend: Explore node latency/status data through **Recharts-powered visualizations**.
- **Multi-Theme Support** :bulb: Dark/Light/System themes with automatic detection.
- **Maintenance Announcements**: Native support for Uptime Kuma's **incident updates** and **status events**.

## Preview :camera:

| Dark Mode                           | Light Mode                            |
| ----------------------------------- | ------------------------------------- |
| ![Dark Mode](./docs/v1.0.0-dark.png) | ![Light Mode](./docs/v1.0.0-light.png) |

## Deployment :star:

### One-Click Vercel Deployment (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falice39s%2Fkuma-mieru.git&env=UPTIME_KUMA_BASE_URL,PAGE_ID)

1. Click the button above
2. Configure environment variables:
   - `UPTIME_KUMA_BASE_URL`: Your Uptime Kuma instance URL (e.g., `https://status.example.com`)
   - `PAGE_ID`: Status page ID from Uptime Kuma (found in your status page URL)
3. Click **Deploy**

### Local Installation

1. **Clone Repository**

   ```bash
   git clone https://github.com/Alice39s/kuma-mieru.git
   cd kuma-mieru
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Configure Environment**  
   Copy `.env.example` to `.env.local` and modify:

   ```bash
   UPTIME_KUMA_BASE_URL=https://your-kuma-instance.com
   PAGE_ID=your_status_page_id
   ```

   _Example: For URL `https://status.example.com/status/prod`, set:  
   `UPTIME_KUMA_BASE_URL=https://status.example.com`  
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
