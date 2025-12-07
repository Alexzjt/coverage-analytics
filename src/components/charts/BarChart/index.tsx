import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import styles from './index.less';

interface BarChartProps {
  title?: string;
  data?: {
    lineCoverage: number[];
    instructionCoverage: number[];
  };
  xAxisData?: string[];
}

const BarChart: React.FC<BarChartProps> = ({
  title = '最近录入N个项目的覆盖率指标',
  data,
  xAxisData,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 默认数据
  const defaultXAxisData = ['XXX', 'XXX', '最近XX项目'];
  const defaultData = {
    lineCoverage: [56, 46, 41],
    instructionCoverage: [34, 29, 26],
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chartData = data || defaultData;

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['行覆盖率', '指令覆盖率'],
        top: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData || defaultXAxisData,
        axisLabel: {},
        axisLine: {
          lineStyle: {
            color: '#d9d9d9',
          },
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 60,
        interval: 10,
        axisLabel: {},
        axisLine: {
          lineStyle: {
            color: '#d9d9d9',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
          },
        },
      },
      series: [
        {
          name: '行覆盖率',
          type: 'bar',
          data: chartData.lineCoverage,
          itemStyle: {
            color: '#1890ff',
          },
        },
        {
          name: '指令覆盖率',
          type: 'bar',
          data: chartData.instructionCoverage,
          itemStyle: {
            color: '#36cfc9',
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // 响应式调整
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data, xAxisData]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>{title}</div>
      <div className={styles.chartContent}>
        <div ref={chartRef} className={styles.chart} />
      </div>
    </div>
  );
};

export default BarChart;
