import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import styles from './index.less';

interface HorizontalBarChartProps {
  title?: string;
  data?: {
    lineCoverage: number[];
    branchCoverage: number[];
  };
  yAxisData?: string[];
  onClick?: (e: any) => void;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title = '行覆盖率指标最高的N个项目统计',
  data,
  yAxisData,
  onClick,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chartData = data || { lineCoverage: [], branchCoverage: [] };

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          let res = params[0].name + '<br/>';
          params.forEach((item: any) => {
            res +=
              item.marker +
              ' ' +
              item.seriesName +
              ': ' +
              item.value +
              ' %<br/>';
          });
          return res;
        },
      },
      legend: {
        data: ['行覆盖率', '分支覆盖率'],
        top: 10,
      },
      grid: {
        left: '20%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: false,
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          formatter: '{value} %',
        },
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
      yAxis: {
        type: 'category',
        data: yAxisData || [],
        axisLabel: {},
        axisLine: {
          lineStyle: {
            color: '#d9d9d9',
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
          name: '分支覆盖率',
          type: 'bar',
          data: chartData.branchCoverage,
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
  }, [data, yAxisData]);

  return (
    <div className={styles.chartContainer} onClick={onClick}>
      <div className={styles.chartTitle}>{title}</div>
      <div className={styles.chartContent}>
        <div ref={chartRef} className={styles.chart} />
      </div>
    </div>
  );
};

export default HorizontalBarChart;
