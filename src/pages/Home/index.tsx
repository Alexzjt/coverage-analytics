import AddProject from '@/components/AddProject';
import BarChart from '@/components/charts/BarChart';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import ProjectTree from '@/components/ProjectTree';
import { AddProjectParams, getChartData } from '@/services/business';
import React, { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import { history, useModel } from 'umi';
import styles from './index.less';

const HomePage: React.FC = () => {
  const [addProjectVisible, setAddProjectVisible] = useState(false);
  const [pieData, setPieData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<{
    data: number[];
    xAxisData: string[];
  }>({ data: [], xAxisData: [] });
  const [barData, setBarData] = useState<{
    data: { lineCoverage: number[]; branchCoverage: number[] };
    xAxisData: string[];
  }>({ data: { lineCoverage: [], branchCoverage: [] }, xAxisData: [] });
  const [hBarData, setHBarData] = useState<{
    data: { lineCoverage: number[]; branchCoverage: number[] };
    yAxisData: string[];
  }>({ data: { lineCoverage: [], branchCoverage: [] }, yAxisData: [] });
  const { refreshTree } = useModel('business');

  useEffect(() => {
    // 0. Tree Data is handled by model

    // 1. Pie Chart Data
    getChartData(1).then((res) => {
      if (res?.responseData?.data) {
        const map = res.responseData.data.map((item) => ({
          value: item.LEVEL3COUNT || 0,
          name: item.NAME || '',
        }));
        setPieData(map);
      }
    });

    // 2. Line Chart Data
    getChartData(2).then((res) => {
      if (res?.responseData?.data) {
        const xAxisData = res.responseData.data.map((item) => item.MONTH || '');
        const data = res.responseData.data.map((item) => item.COUNT || 0);
        setLineData({ xAxisData, data });
      }
    });

    // 3. Bar Chart Data (Time sorted)
    getChartData(3).then((res) => {
      if (res?.responseData?.data) {
        const xAxisData = res.responseData.data.map((item) => item.NAME || '');
        const lineCoverage = res.responseData.data.map((item) =>
          parseFloat(item.LINECOVERAGE || '0'),
        );
        const branchCoverage = res.responseData.data.map((item) =>
          parseFloat(item.BRANCHCOVERAGE || '0'),
        );
        setBarData({ xAxisData, data: { lineCoverage, branchCoverage } });
      }
    });

    // 4. Horizontal Bar Chart Data (Coverage sorted)
    getChartData(4).then((res) => {
      if (res?.responseData?.data) {
        // Sort ascending so largest is at the top in ECharts (index 0 is bottom)
        const sortedData = [...res.responseData.data].sort((a, b) => {
          return (
            parseFloat(a.LINECOVERAGE || '0') -
            parseFloat(b.LINECOVERAGE || '0')
          );
        });
        const yAxisData = sortedData.map((item) => item.NAME || '');
        const lineCoverage = sortedData.map((item) =>
          parseFloat(item.LINECOVERAGE || '0'),
        );
        const branchCoverage = sortedData.map((item) =>
          parseFloat(item.BRANCHCOVERAGE || '0'),
        );
        setHBarData({ yAxisData, data: { lineCoverage, branchCoverage } });
      }
    });
  }, []);

  const handleNewProject = () => {
    setAddProjectVisible(true);
  };

  const handleCancel = () => {
    setAddProjectVisible(false);
  };

  const handleSave = async (data: AddProjectParams) => {
    // AddProject component now handles the actual API calls (including chained calls).
    // This callback is just for successful completion cleanup.
    console.log('保存成功回调:', data);
    setAddProjectVisible(false);
    refreshTree();
  };

  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    console.log('选中的节点:', selectedKeys);
    // 这里可以根据选中的节点更新图表数据
  };

  return (
    <div className={styles.homePage}>
      <SplitPane
        split="vertical"
        defaultSize={'25vw'}
        primary="first"
        style={{
          top: 0,
        }}
        minSize={250}
      >
        {/* 左侧导航栏 */}
        <ProjectTree
          onNewProject={handleNewProject}
          onSelect={handleTreeSelect}
        />

        {/* 右侧内容区 */}
        <div className={styles.mainContent}>
          <div className={styles.chartsGrid}>
            {/* 左上：环形图 */}
            <PieChart
              data={pieData.length > 0 ? pieData : undefined}
              onClick={() => history.push('/coverage-detail?sortBy=firstLevel')}
            />

            {/* 右上：折线图 */}
            <LineChart
              data={lineData.data.length > 0 ? lineData.data : undefined}
              xAxisData={
                lineData.xAxisData.length > 0 ? lineData.xAxisData : undefined
              }
              onClick={() => history.push('/coverage-detail?sortBy=createTime')}
            />

            {/* 左下：垂直柱状图 */}
            <BarChart
              title={`最近录入${
                barData.xAxisData.length || 5
              }个项目的覆盖率指标`}
              data={
                barData.data.lineCoverage.length > 0 ? barData.data : undefined
              }
              xAxisData={
                barData.xAxisData.length > 0 ? barData.xAxisData : undefined
              }
              onClick={() => history.push('/coverage-detail?sortBy=createTime')}
            />

            {/* 右下：水平柱状图 */}
            <HorizontalBarChart
              title={`行覆盖率指标最高的${
                hBarData.yAxisData.length || 5
              }个项目统计`}
              data={
                hBarData.data.lineCoverage.length > 0
                  ? hBarData.data
                  : undefined
              }
              yAxisData={
                hBarData.yAxisData.length > 0 ? hBarData.yAxisData : undefined
              }
              onClick={() =>
                history.push('/coverage-detail?sortBy=lineCoverage')
              }
            />
          </div>
        </div>
      </SplitPane>

      {/* 新增项目弹窗 */}
      <AddProject
        open={addProjectVisible}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
};

export default HomePage;
