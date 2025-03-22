import { getGlobalConfig } from '@/services/config.server';
import { createApiResponse } from '@/app/lib/api-utils';

export async function GET() {
  return createApiResponse(() => getGlobalConfig(), {
    maxAge: 60,
    revalidate: 30,
  });
}
