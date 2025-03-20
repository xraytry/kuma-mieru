import { NextResponse } from 'next/server';
import { getMonitoringData } from '@/services/monitor';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const monitorId = Number.parseInt(params.id, 10);
    const { monitorGroups, data } = await getMonitoringData();

    // 在所有监控组中查找指定 ID 的监控项
    const monitor = monitorGroups
      .flatMap(group => group.monitorList)
      .find(m => m.id === monitorId);

    if (!monitor) {
      return NextResponse.json(
        { error: '未找到监控项' },
        { status: 404 }
      );
    }

    // 提取该监控项的数据
    const monitorData = {
      heartbeatList: {
        [monitorId]: data.heartbeatList[monitorId] || [],
      },
      uptimeList: {
        [`${monitorId}_24`]: data.uptimeList[`${monitorId}_24`] || 0,
      },
    };

    return NextResponse.json({
      monitor,
      data: monitorData,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('获取监控项数据失败:', error);
    return NextResponse.json(
      { error: '获取监控项数据失败' },
      { status: 500 }
    );
  }
} 