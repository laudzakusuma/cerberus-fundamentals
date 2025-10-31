import { useRef, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@/styles/design-tokens';
import type { TimeSeriesData, ChartConfig } from '../types';

const ChartContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: '$bgCard',
  borderRadius: '$lg',
  border: '1px solid $border',
  padding: '$4',
});

const ChartSVG = styled('svg', {
  width: '100%',
  height: '100%',
  overflow: 'visible',
});

const Tooltip = styled(motion.div, {
  position: 'absolute',
  padding: '$2 $3',
  backgroundColor: 'rgba(11, 15, 20, 0.95)',
  backdropFilter: 'blur(12px)',
  border: '1px solid $border',
  borderRadius: '$sm',
  fontSize: '$xs',
  color: '$text',
  pointerEvents: 'none',
  zIndex: 1000,
  whiteSpace: 'nowrap',
});

interface LineChartProps {
  data: TimeSeriesData[];
  config?: Partial<ChartConfig>;
  onDataPointHover?: (point: any) => void;
}

export function LineChart({ data, config, onDataPointHover }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    content: string;
  }>({ show: false, x: 0, y: 0, content: '' });

  const defaultConfig: ChartConfig = {
    width: 800,
    height: 400,
    margin: { top: 20, right: 30, bottom: 40, left: 50 },
    xAxis: { show: true, tickCount: 8 },
    yAxis: { show: true, tickCount: 6 },
    grid: { show: true, strokeColor: '#1F2937', strokeWidth: 1 },
    tooltip: { show: true },
    animation: { duration: 1000, easing: 'easeInOut' },
  };

  const mergedConfig = { ...defaultConfig, ...config };

  const { width, height, margin } = mergedConfig;
  const chartWidth = width! - margin!.left - margin!.right;
  const chartHeight = height! - margin!.top - margin!.bottom;

  const scales = useMemo(() => {
    if (data.length === 0 || data[0].data.length === 0) {
      return { xScale: (x: number) => 0, yScale: (y: number) => 0, xDomain: [0, 1], yDomain: [0, 1] };
    }

    const allPoints = data.flatMap(series => series.data);
    const xDomain = [
      Math.min(...allPoints.map(d => d.timestamp)),
      Math.max(...allPoints.map(d => d.timestamp)),
    ];
    const yDomain = [
      Math.min(...allPoints.map(d => d.value)),
      Math.max(...allPoints.map(d => d.value)),
    ];

    const xPadding = (xDomain[1] - xDomain[0]) * 0.05;
    const yPadding = (yDomain[1] - yDomain[0]) * 0.1;

    const xScale = (x: number) =>
      ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * chartWidth;

    const yScale = (y: number) =>
      chartHeight - ((y - (yDomain[0] - yPadding)) / ((yDomain[1] + yPadding) - (yDomain[0] - yPadding))) * chartHeight;

    return { xScale, yScale, xDomain, yDomain };
  }, [data, chartWidth, chartHeight]);

  const pathData = useMemo(() => {
    return data.map(series => {
      if (series.data.length === 0) return '';

      const points = series.data.map(
        point => `${scales.xScale(point.timestamp)},${scales.yScale(point.value)}`
      );

      if (series.type === 'area') {
        const areaPoints = [
          ...points,
          `${scales.xScale(series.data[series.data.length - 1].timestamp)},${chartHeight}`,
          `${scales.xScale(series.data[0].timestamp)},${chartHeight}`,
        ];
        return `M ${areaPoints.join(' L ')} Z`;
      }

      return `M ${points.join(' L ')}`;
    });
  }, [data, scales, chartHeight]);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - margin!.left;
    const y = event.clientY - rect.top - margin!.top;

    const closestPoint = findClosestPoint(x, y);

    if (closestPoint) {
      setTooltip({
        show: true,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top - 40,
        content: `Value: ${closestPoint.value.toFixed(2)}`,
      });

      if (onDataPointHover) {
        onDataPointHover(closestPoint);
      }
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  const findClosestPoint = (x: number, y: number) => {
    let closest: any = null;
    let minDistance = Infinity;

    data.forEach(series => {
      series.data.forEach(point => {
        const px = scales.xScale(point.timestamp);
        const py = scales.yScale(point.value);
        const distance = Math.sqrt(Math.pow(px - x, 2) + Math.pow(py - y, 2));

        if (distance < minDistance && distance < 30) {
          minDistance = distance;
          closest = { ...point, series: series.label };
        }
      });
    });

    return closest;
  };

  return (
    <ChartContainer>
      <ChartSVG
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <g transform={`translate(${margin!.left},${margin!.top})`}>
          {mergedConfig.grid?.show && (
            <GridLines
              width={chartWidth}
              height={chartHeight}
              xTicks={mergedConfig.xAxis?.tickCount || 8}
              yTicks={mergedConfig.yAxis?.tickCount || 6}
              strokeColor={mergedConfig.grid.strokeColor}
            />
          )}

          {data.map((series, index) => (
            <g key={series.id}>
              <motion.path
                d={pathData[index]}
                fill={series.type === 'area' ? series.color : 'none'}
                fillOpacity={series.type === 'area' ? 0.2 : 0}
                stroke={series.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 1.5, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }}
              />

              {series.data.map((point, pointIndex) => (
                <motion.circle
                  key={pointIndex}
                  cx={scales.xScale(point.timestamp)}
                  cy={scales.yScale(point.value)}
                  r={3}
                  fill={series.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: (pointIndex / series.data.length) * 1.5,
                    duration: 0.3,
                  }}
                  whileHover={{ scale: 1.5 }}
                />
              ))}
            </g>
          ))}

          {mergedConfig.xAxis?.show && (
            <Axis
              type="x"
              position={chartHeight}
              length={chartWidth}
              ticks={mergedConfig.xAxis.tickCount || 8}
              domain={scales.xDomain as [number, number]}
            />
          )}

          {mergedConfig.yAxis?.show && (
            <Axis
              type="y"
              position={0}
              length={chartHeight}
              ticks={mergedConfig.yAxis.tickCount || 6}
              domain={scales.yDomain as [number, number]}
            />
          )}
        </g>
      </ChartSVG>

      {tooltip.show && (
        <Tooltip
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </Tooltip>
      )}
    </ChartContainer>
  );
}

function GridLines({
  width,
  height,
  xTicks,
  yTicks,
  strokeColor = '#1F2937',
}: {
  width: number;
  height: number;
  xTicks: number;
  yTicks: number;
  strokeColor?: string;
}) {
  const xLines = Array.from({ length: xTicks }, (_, i) => (i / (xTicks - 1)) * width);
  const yLines = Array.from({ length: yTicks }, (_, i) => (i / (yTicks - 1)) * height);

  return (
    <g opacity={0.3}>
      {xLines.map((x, i) => (
        <line key={`x-${i}`} x1={x} y1={0} x2={x} y2={height} stroke={strokeColor} strokeWidth={1} />
      ))}
      {yLines.map((y, i) => (
        <line key={`y-${i}`} x1={0} y1={y} x2={width} y2={y} stroke={strokeColor} strokeWidth={1} />
      ))}
    </g>
  );
}

function Axis({
  type,
  position,
  length,
  ticks,
  domain,
}: {
  type: 'x' | 'y';
  position: number;
  length: number;
  ticks: number;
  domain: [number, number];
}) {
  const tickValues = Array.from({ length: ticks }, (_, i) => {
    const t = i / (ticks - 1);
    return domain[0] + t * (domain[1] - domain[0]);
  });

  return (
    <g>
      {tickValues.map((value, i) => {
        const pos = (i / (ticks - 1)) * length;

        if (type === 'x') {
          return (
            <g key={i}>
              <line x1={pos} y1={position} x2={pos} y2={position + 6} stroke="#9AA4B2" strokeWidth={1} />
              <text
                x={pos}
                y={position + 20}
                textAnchor="middle"
                fill="#9AA4B2"
                fontSize={10}
              >
                {formatValue(value)}
              </text>
            </g>
          );
        } else {
          return (
            <g key={i}>
              <line x1={-6} y1={pos} x2={0} y2={pos} stroke="#9AA4B2" strokeWidth={1} />
              <text
                x={-10}
                y={pos + 4}
                textAnchor="end"
                fill="#9AA4B2"
                fontSize={10}
              >
                {formatValue(value)}
              </text>
            </g>
          );
        }
      })}
    </g>
  );
}

function formatValue(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}