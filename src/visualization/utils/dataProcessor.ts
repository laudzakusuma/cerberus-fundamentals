import type { ChartDataPoint, AggregatedStats, TimeSeriesData, DataAggregation } from '../types';

export class DataProcessor {
  static calculateStats(data: ChartDataPoint[]): AggregatedStats {
    if (data.length === 0) {
      return {
        mean: 0,
        median: 0,
        min: 0,
        max: 0,
        sum: 0,
        stdDev: 0,
        variance: 0,
        count: 0,
      };
    }

    const values = data.map(d => d.value).sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;

    const median = values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];

    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean,
      median,
      min: values[0],
      max: values[values.length - 1],
      sum,
      stdDev,
      variance,
      count: values.length,
    };
  }

  static normalizeData(data: ChartDataPoint[], min: number = 0, max: number = 1): ChartDataPoint[] {
    const values = data.map(d => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin;

    if (range === 0) return data;

    return data.map(point => ({
      ...point,
      value: min + ((point.value - dataMin) / range) * (max - min),
    }));
  }

  static smoothData(data: ChartDataPoint[], windowSize: number = 5): ChartDataPoint[] {
    if (data.length < windowSize) return data;

    const smoothed: ChartDataPoint[] = [];
    const halfWindow = Math.floor(windowSize / 2);

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - halfWindow);
      const end = Math.min(data.length, i + halfWindow + 1);
      const window = data.slice(start, end);
      const avg = window.reduce((sum, point) => sum + point.value, 0) / window.length;

      smoothed.push({
        ...data[i],
        value: avg,
      });
    }

    return smoothed;
  }

  static aggregateByTime(
    data: ChartDataPoint[],
    aggregation: DataAggregation
  ): ChartDataPoint[] {
    if (data.length === 0) return [];

    const grouped = new Map<number, ChartDataPoint[]>();

    data.forEach(point => {
      const bucket = Math.floor(point.timestamp / aggregation.timeWindow) * aggregation.timeWindow;
      if (!grouped.has(bucket)) {
        grouped.set(bucket, []);
      }
      grouped.get(bucket)!.push(point);
    });

    const aggregated: ChartDataPoint[] = [];

    grouped.forEach((points, timestamp) => {
      const values = points.map(p => p.value);
      let aggregatedValue: number;

      switch (aggregation.function) {
        case 'sum':
          aggregatedValue = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'avg':
          aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case 'min':
          aggregatedValue = Math.min(...values);
          break;
        case 'max':
          aggregatedValue = Math.max(...values);
          break;
        case 'count':
          aggregatedValue = values.length;
          break;
        case 'median':
          const sorted = [...values].sort((a, b) => a - b);
          aggregatedValue = sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];
          break;
        default:
          aggregatedValue = values[0];
      }

      aggregated.push({
        timestamp,
        value: aggregatedValue,
        label: points[0].label,
      });
    });

    return aggregated.sort((a, b) => a.timestamp - b.timestamp);
  }

  static detectAnomalies(data: ChartDataPoint[], threshold: number = 2): ChartDataPoint[] {
    const stats = this.calculateStats(data);
    const anomalies: ChartDataPoint[] = [];

    data.forEach(point => {
      const zScore = Math.abs((point.value - stats.mean) / stats.stdDev);
      if (zScore > threshold) {
        anomalies.push(point);
      }
    });

    return anomalies;
  }

  static calculateMovingAverage(data: ChartDataPoint[], window: number): ChartDataPoint[] {
    if (data.length < window) return data;

    const result: ChartDataPoint[] = [];

    for (let i = window - 1; i < data.length; i++) {
      const windowData = data.slice(i - window + 1, i + 1);
      const avg = windowData.reduce((sum, point) => sum + point.value, 0) / window;

      result.push({
        timestamp: data[i].timestamp,
        value: avg,
        label: data[i].label,
      });
    }

    return result;
  }

  static interpolateMissingData(
    data: ChartDataPoint[],
    interval: number
  ): ChartDataPoint[] {
    if (data.length < 2) return data;

    const result: ChartDataPoint[] = [];
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

    for (let i = 0; i < sortedData.length - 1; i++) {
      result.push(sortedData[i]);

      const current = sortedData[i];
      const next = sortedData[i + 1];
      const gap = next.timestamp - current.timestamp;

      if (gap > interval) {
        const steps = Math.floor(gap / interval);
        const valueStep = (next.value - current.value) / (steps + 1);

        for (let j = 1; j <= steps; j++) {
          result.push({
            timestamp: current.timestamp + j * interval,
            value: current.value + j * valueStep,
          });
        }
      }
    }

    result.push(sortedData[sortedData.length - 1]);
    return result;
  }

  static downsample(data: ChartDataPoint[], targetPoints: number): ChartDataPoint[] {
    if (data.length <= targetPoints) return data;

    const bucketSize = Math.ceil(data.length / targetPoints);
    const downsampled: ChartDataPoint[] = [];

    for (let i = 0; i < data.length; i += bucketSize) {
      const bucket = data.slice(i, i + bucketSize);
      const avg = bucket.reduce((sum, point) => sum + point.value, 0) / bucket.length;

      downsampled.push({
        timestamp: bucket[Math.floor(bucket.length / 2)].timestamp,
        value: avg,
        label: bucket[0].label,
      });
    }

    return downsampled;
  }
}