import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { apiConfig } from '../config/api';

interface ImageDomainsConfig {
    timestamp: string;
    domains: string[];
}

const getHostnameFromUrl = (url: string | null): string | null => {
    if (!url) return null;
    try {
        return new URL(url).hostname;
    } catch (e) {
        return null;
    }
};

const generateImageDomains = (): void => {
    const baseUrlHostname = getHostnameFromUrl(apiConfig.baseUrl);

    const domainsConfig: ImageDomainsConfig = {
        timestamp: new Date().toISOString(),
        domains: [baseUrlHostname || '*'].filter(Boolean)
    };

    const outputPath = join(process.cwd(), 'config', 'generated-image-domains.json');

    mkdirSync(dirname(outputPath), { recursive: true });

    writeFileSync(outputPath, JSON.stringify(domainsConfig, null, 2));

    console.log('✨ Generated image domains configuration:', domainsConfig);
};

generateImageDomains()