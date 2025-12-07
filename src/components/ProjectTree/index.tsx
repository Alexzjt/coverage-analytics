import { Button, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useState } from 'react';
import styles from './index.less';

interface ProjectTreeProps {
  onNewProject?: () => void;
  onSelect?: (selectedKeys: React.Key[]) => void;
}

const ProjectTree: React.FC<ProjectTreeProps> = ({
  onNewProject,
  onSelect,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['homepage']);

  // 树形数据
  const treeData: DataNode[] = [
    {
      title: '基础运营',
      key: 'basic-operation',
      children: [
        {
          title: '首页homepage',
          key: 'homepage',
        },
        {
          title: '客群圈选',
          key: 'customer-selection',
          children: [
            {
              title: '30056客群圈选模块测试',
              key: '30056-test',
            },
            {
              title: '.........',
              key: 'customer-selection-other',
            },
          ],
        },
      ],
    },
    {
      title: '内容管理平台',
      key: 'content-management',
      children: [
        {
          title: '.........',
          key: 'content-other',
        },
      ],
    },
    {
      title: '金融中心',
      key: 'finance-center',
      children: [
        {
          title: '.........',
          key: 'finance-other',
        },
      ],
    },
  ];

  const handleSelect = (keys: React.Key[]) => {
    setSelectedKeys(keys);
    onSelect?.(keys);
    window.open(`http://10.80.232.101:8899/${keys[0]}/index.html`, '_blank');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Button
          type="primary"
          block
          onClick={onNewProject}
          className={styles.btnNew}
        >
          新增
        </Button>
      </div>
      <div className={styles.treeMenu}>
        <Tree
          treeData={treeData}
          selectedKeys={selectedKeys}
          onSelect={handleSelect}
          defaultExpandAll
          blockNode
        />
      </div>
    </div>
  );
};

export default ProjectTree;
