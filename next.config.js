/** @type {import('next').NextConfig} */
const fs = require('node:fs');
const path = require('node:path');

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

module.exports = nextConfig;
