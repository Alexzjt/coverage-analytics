import AddProject from '@/components/AddProject';
import BarChart from '@/components/charts/BarChart';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import ProjectTree from '@/components/ProjectTree';
import { message } from 'antd';
import React, { useState } from 'react';
import SplitPane from 'react-split-pane';
import styles from './index.less';

const HomePage: React.FC = () => {
  const [addProjectVisible, setAddProjectVisible] = useState(false);

  const handleNewProject = () => {
    setAddProjectVisible(true);
  };

  const handleCancel = () => {
    setAddProjectVisible(false);
  };

  const handleSave = (data: any) => {
    console.log('保存数据:', data);
    message.success('保存成功！');
    // 这里可以添加实际的保存逻辑，比如发送到服务器
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
            <PieChart />

            {/* 右上：折线图 */}
            <LineChart />

            {/* 左下：垂直柱状图 */}
            <BarChart />

            {/* 右下：水平柱状图 */}
            <HorizontalBarChart />
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
