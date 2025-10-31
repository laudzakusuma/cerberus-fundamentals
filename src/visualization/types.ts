export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  id: string;
  label: string;
  data: ChartDataPoint[];
  color: string;
  type: 'line' | 'area' | 'bar';
}

export interface ChartConfig {
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  grid?: GridConfig;
  tooltip?: TooltipConfig;
  animation?: AnimationConfig;
}

export interface AxisConfig {
  show: boolean;
  label?: string;
  tickCount?: number;
  tickFormat?: (value: any) => string;
  domain?: [number, number] | 'auto';
}

export interface GridConfig {
  show: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface TooltipConfig {
  show: boolean;
  format?: (data: ChartDataPoint) => string;
  backgroundColor?: string;
  textColor?: string;
}

export interface AnimationConfig {
  duration: number;
  easing: 'linear' | 'easeInOut' | 'easeOut' | 'easeIn';
}

export interface AggregatedStats {
  mean: number;
  median: number;
  min: number;
  max: number;
  sum: number;
  stdDev: number;
  variance: number;
  count: number;
}

export type AggregationFunction = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'median';

export interface DataAggregation {
  timeWindow: number;
  function: AggregationFunction;
}