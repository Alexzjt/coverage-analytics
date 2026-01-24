import { Button, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';
import { getBusinessTree } from '../../services/business';
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
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  const transformDataToTree = (data: any[]): DataNode[] => {
    const map: Record<string, any> = {};
    const roots: DataNode[] = [];

    // First pass: create nodes and map them
    data.forEach((item) => {
      map[item.ID] = {
        title: item.NAME,
        key: item.ID,
        jumpUrl: item.jumpUrl,
        children: [],
      };
    });

    // Second pass: link parents and children
    data.forEach((item) => {
      const node = map[item.ID];
      if (item.PARENTID && map[item.PARENTID]) {
        map[item.PARENTID].children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  useEffect(() => {
    getBusinessTree().then((res) => {
      if (res?.responseData) {
        const formattedData = transformDataToTree(res.responseData);
        setTreeData(formattedData);
      }
    });
  }, []);

  const handleSelect = (keys: React.Key[], info: any) => {
    setSelectedKeys(keys);
    onSelect?.(keys);

    // Check if the selected node has a jumpUrl
    const selectedNode = info.node;
    if (selectedNode?.jumpUrl) {
      window.open(selectedNode.jumpUrl, '_blank');
    }
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
