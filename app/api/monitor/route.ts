import { NextResponse } from "next/server";
import { getMonitoringData } from "@/services/monitor";

export async function GET() {
  try {
    const data = await getMonitoringData();
    return NextResponse.json(
      data,
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error("Next.js Edge Function 获取 Uptime Kuma 监控数据错误:", error);
    return NextResponse.json(
      { error: "获取 Uptime Kuma 监控数据失败" },
      { status: 500 }
    );
  }
} 