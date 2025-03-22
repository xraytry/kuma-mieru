import { createApiResponse } from '@/app/lib/api-utils';
import { getConfig } from '@/config/api';

export async function GET() {
  return createApiResponse(async () => getConfig(), {
    maxAge: 300, // Cache for 5 minutes
    revalidate: 60,
  });
}
