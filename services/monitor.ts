import type { MonitorGroup, MonitoringData } from "@/types/monitor";
import { apiConfig } from "@/config/api";
import { getPreloadData } from "./config";

class MonitorDataError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'MonitorDataError';
  }
}

export async function getMonitoringData(): Promise<{
  monitorGroups: MonitorGroup[];
  data: MonitoringData;
}> {
  try {
    // 使用共享的预加载数据获取函数
    const preloadData = await getPreloadData();

    // 验证监控组数据
    if (!Array.isArray(preloadData.publicGroupList)) {
      throw new MonitorDataError('监控组数据必须是数组类型');
    }

    // 获取监控数据
    const apiResponse = await fetch(apiConfig.apiEndpoint);
    
    if (!apiResponse.ok) {
      throw new MonitorDataError(
        `API 请求失败: ${apiResponse.status} ${apiResponse.statusText}`
      );
    }

    let monitoringData: MonitoringData;
    try {
      const rawData = await apiResponse.json();
      
      // 验证监控数据结构
      if (!rawData || typeof rawData !== 'object') {
        throw new MonitorDataError('监控数据必须是一个对象');
      }
      
      if (!('heartbeatList' in rawData) || !('uptimeList' in rawData)) {
        throw new MonitorDataError('监控数据缺少必要的字段');
      }

      // 验证心跳列表和正常运行时间列表的数据类型
      if (typeof rawData.heartbeatList !== 'object' || typeof rawData.uptimeList !== 'object') {
        throw new MonitorDataError('心跳列表和正常运行时间列表必须是对象类型');
      }
      
      monitoringData = rawData;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new MonitorDataError('监控数据 JSON 解析失败', error);
      }
      throw new MonitorDataError('监控数据解析失败', error);
    }

    return {
      monitorGroups: preloadData.publicGroupList,
      data: monitoringData,
    };
  } catch (error) {
    console.error(
      '获取监控数据失败:',
      error instanceof MonitorDataError ? error.message : '未知错误',
      error
    );
    
    // 返回默认值
    return {
      monitorGroups: [],
      data: { heartbeatList: {}, uptimeList: {} },
    };
  }
} 