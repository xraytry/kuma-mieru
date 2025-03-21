/** @type {import('next').NextConfig} */
const fs = require('node:fs');
const path = require('node:path');
const createNextIntlPlugin = require('next-intl/plugin');

const banner = `
██╗  ██╗██╗   ██╗███╗   ███╗ █████╗     ███╗   ███╗██╗███████╗██████╗ ██╗   ██╗
██║ ██╔╝██║   ██║████╗ ████║██╔══██╗    ████╗ ████║██║██╔════╝██╔══██╗██║   ██║
█████╔╝ ██║   ██║██╔████╔██║███████║    ██╔████╔██║██║█████╗  ██████╔╝██║   ██║
██╔═██╗ ██║   ██║██║╚██╔╝██║██╔══██║    ██║╚██╔╝██║██║██╔══╝  ██╔══██╗██║   ██║
██║  ██╗╚██████╔╝██║ ╚═╝ ██║██║  ██║    ██║ ╚═╝ ██║██║███████╗██║  ██║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ 
`;

console.log('\x1b[36m%s\x1b[0m', banner);
console.log('\x1b[32m%s\x1b[0m', '🚀 Kuma Mieru is starting...');
console.log('\x1b[33m%s\x1b[0m', `📡 Environment: ${process.env.NODE_ENV}`);
console.log('\x1b[34m%s\x1b[0m', `🌐 Uptime Kuma URL: ${process.env.BUILD_MODE === 'true' ? 'Build Mode' : process.env.UPTIME_KUMA_BASE_URL || 'Not configured'}`);
console.log('\n');

const getImageDomains = () => {
    try {
        const configPath = path.join(process.cwd(), 'config', 'generated', 'image-domains.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config.domains;
    } catch (e) {
        return ['*'];
    }
};

const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: getImageDomains().map(hostname => ({
            protocol: 'https',
            hostname,
        })),
    },
};

const withNextIntl = createNextIntlPlugin(
    './utils/i18n/request.ts'
);
module.exports = withNextIntl(nextConfig);
