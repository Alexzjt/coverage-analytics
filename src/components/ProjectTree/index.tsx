import { Button, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
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
  const [formattedTreeData, setFormattedTreeData] = useState<DataNode[]>([]);

  const { treeData } = useModel('business');

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
    if (treeData && treeData.length > 0) {
      const formattedData = transformDataToTree(treeData);
      setFormattedTreeData(formattedData);
    }
  }, [treeData]);

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
        {formattedTreeData.length > 0 && (
          <Tree
            treeData={formattedTreeData}
            selectedKeys={selectedKeys}
            onSelect={handleSelect}
            defaultExpandAll
            blockNode
          />
        )}
      </div>
    </div>
  );
};

export default ProjectTree;
