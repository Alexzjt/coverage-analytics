import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import styles from './index.less';

interface PieChartProps {
  title?: string;
  data?: Array<{ value: number; name: string; itemStyle?: { color: string } }>;
  onClick?: (e: any) => void;
}

const PieChart: React.FC<PieChartProps> = ({
  title = '各系统已录入项目数量统计',
  data,
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

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        itemWidth: 16,
        itemHeight: 16,
      },
      series: [
        {
          name: '项目数量',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}',
          },
          emphasis: {
            label: {
              show: true,
            },
          },
          data: data || [],
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
  }, [data]);

  return (
    <div className={styles.chartContainer} onClick={onClick}>
      <div className={styles.chartTitle}>{title}</div>
      <div className={styles.chartContent}>
        <div ref={chartRef} className={styles.chart} />
      </div>
    </div>
  );
};

export default PieChart;
