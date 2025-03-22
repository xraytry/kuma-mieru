import { getMonitoringData } from '@/services/monitor.server';
import { createApiResponse } from '@/app/lib/api-utils';

export async function GET() {
  return createApiResponse(async () => getMonitoringData(), {
    maxAge: 60, // Cache for 1 minute
    revalidate: 30,
  });
}
