import { NextResponse } from 'next/server';
import { getConfig } from '@/config/api';

export async function GET() {
  try {
    const config = getConfig();

    return NextResponse.json({
      data: config,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '获取配置信息失败',
      },
      { status: 500 },
    );
  }
}
