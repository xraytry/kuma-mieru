import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json(
            {
                status: "ok",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }
        );
    } catch (error) {
        console.error("健康检查失败:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "健康检查失败",
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
} 