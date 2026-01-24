import { addProjectInfo, getBusinessTree, TreeData } from '@/services/business';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

const { Option } = Select;

interface AddProjectProps {
  open: boolean;
  onCancel: () => void;
  onSave: (data: any) => void;
}

const AddProject: React.FC<AddProjectProps> = ({ open, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [projectType, setProjectType] = useState<string>('');
  const [showNewLevel1Input, setShowNewLevel1Input] = useState(false);
  const [showNewLevel2Input, setShowNewLevel2Input] = useState(false);

  // Use global model for tree data
  const { treeData, refreshTree } = useModel('business');

  // Local state for filtered L2 options based on selected L1
  const [currentLevel2Options, setCurrentLevel2Options] = useState<TreeData[]>(
    [],
  );

  // Filter Level 1 Nodes
  const level1Nodes = treeData.filter((node: any) => !node.PARENTID);

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value);
    setShowNewLevel1Input(false);
    setShowNewLevel2Input(false);
    form.setFieldsValue({
      level2Parent: undefined,
      projectParent1: undefined,
      projectParent2: undefined,
    });
    setCurrentLevel2Options([]);
  };

  const handleLevel1Change = (value: string) => {
    // Value is ID
    setShowNewLevel1Input(false);
    if (value) {
      const children = treeData.filter((node: any) => node.PARENTID === value);
      setCurrentLevel2Options(children);
    } else {
      setCurrentLevel2Options([]);
    }
    // Reset L2 selection
    form.setFieldsValue({
      projectParent2: undefined,
    });
  };

  const toggleNewLevel1Input = () => {
    setShowNewLevel1Input(!showNewLevel1Input);
    if (!showNewLevel1Input) {
      // Switching TO Input mode
      form.setFieldsValue({
        level2Parent: undefined,
        projectParent1: undefined,
      });
      setCurrentLevel2Options([]); // Clear L2 options as L1 is now "new" (undefined ID so far)
    }
  };

  const toggleNewLevel2Input = () => {
    setShowNewLevel2Input(!showNewLevel2Input);
    if (!showNewLevel2Input) {
      form.setFieldsValue({
        projectParent2: undefined,
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setProjectType('');
    setShowNewLevel1Input(false);
    setShowNewLevel2Input(false);
    setCurrentLevel2Options([]);
    onCancel();
  };

  // Helper to find ID by Name and ParentID (from fresh data)
  const findNodeId = (
    data: TreeData[],
    name: string,
    parentId?: string,
  ): string | undefined => {
    return data.find((node) => node.NAME === name && node.PARENTID === parentId)
      ?.ID;
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      try {
        if (projectType === 'level1') {
          await addProjectInfo({ level: 1, name: values.level1Name });
        } else if (projectType === 'level2') {
          let parentId = values.level2Parent;

          // If new L1, create it first
          if (showNewLevel1Input) {
            const l1Name = values.newLevel1Name;
            await addProjectInfo({ level: 1, name: l1Name });
            // We must fetch latest tree to get the new ID
            const res = await getBusinessTree();
            const freshTree = res?.responseData || [];
            parentId = findNodeId(freshTree, l1Name); // Top level has no parentId
            if (!parentId) throw new Error('Failed to retrieve new Level 1 ID');
          }

          if (!parentId) throw new Error('一级分类ID缺失');

          await addProjectInfo({
            level: 2,
            upid: parentId,
            name: values.level2Name,
          });
        } else if (projectType === 'project') {
          let l1Id = values.projectParent1;

          // Step 1: L1
          if (showNewLevel1Input) {
            const l1Name = values.newProjectLevel1Name;
            await addProjectInfo({ level: 1, name: l1Name });
            const res = await getBusinessTree();
            const freshTree = res?.responseData || [];
            l1Id = findNodeId(freshTree, l1Name);
            if (!l1Id) throw new Error('Failed to retrieve new Level 1 ID');
          }

          if (!l1Id) throw new Error('一级分类ID缺失');

          let l2Id = values.projectParent2;

          // Step 2: L2
          if (showNewLevel2Input) {
            const l2Name = values.newProjectLevel2Name;
            // Note: If we just created L1, l1Id is valid. If we picked existing, l1Id is valid.
            await addProjectInfo({ level: 2, upid: l1Id, name: l2Name });

            const res = await getBusinessTree();
            const freshTree = res?.responseData || [];
            l2Id = findNodeId(freshTree, l2Name, l1Id);
            if (!l2Id) throw new Error('Failed to retrieve new Level 2 ID');
          }

          if (!l2Id) throw new Error('二级分类ID缺失');

          // Step 3: Project
          await addProjectInfo({
            level: 3,
            upid: l2Id,
            name: values.projectName,
            uuid: values.projectUuid || '',
          });
        }

        message.success('保存成功！');
        onSave({});
        handleCancel();
      } catch (error: any) {
        console.error(error);
        if (
          error?.response?.data === '服务器内部错误: 项目信息已存在' ||
          error?.message?.includes('项目信息已存在')
        ) {
          message.error('项目信息已存在');
        } else {
          message.error(error.message || '保存失败');
        }
      } finally {
        await refreshTree();
      }
    });
  };

  return (
    <Modal
      title="新增项目"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={900}
      className={styles.addProjectModal}
    >
      <Form form={form} layout="vertical" className={styles.formContainer}>
        <Form.Item
          label="新增项目类型"
          name="projectType"
          rules={[{ required: true, message: '请选择新增项目类型' }]}
        >
          <Select
            placeholder="请选择"
            onChange={handleProjectTypeChange}
            className={styles.formControl}
          >
            <Option value="level1">一级分类</Option>
            <Option value="level2">二级分类</Option>
            <Option value="project">项目</Option>
          </Select>
        </Form.Item>

        {/* 一级分类表单 */}
        {projectType === 'level1' && (
          <Form.Item
            label="一级分类名称"
            name="level1Name"
            rules={[{ required: true, message: '请输入一级分类名称' }]}
          >
            <Input
              placeholder="请输入一级分类名称"
              className={styles.formControl}
            />
          </Form.Item>
        )}

        {/* 二级分类表单 */}
        {projectType === 'level2' && (
          <>
            <Form.Item label="所属一类项目" required>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  name="level2Parent"
                  noStyle
                  rules={[
                    {
                      required: !showNewLevel1Input,
                      message: '请选择或输入所属一类项目',
                    },
                  ]}
                >
                  <Select
                    placeholder="请选择"
                    onChange={handleLevel1Change}
                    disabled={showNewLevel1Input}
                    className={styles.formControl}
                  >
                    {level1Nodes.map((node: any) => (
                      <Option key={node.ID} value={node.ID}>
                        {node.NAME}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  onClick={toggleNewLevel1Input}
                  className={styles.btnInline}
                >
                  {showNewLevel1Input ? '取消' : '新增'}
                </Button>
              </Space.Compact>
              {showNewLevel1Input && (
                <Form.Item
                  name="newLevel1Name"
                  style={{ marginTop: 8 }}
                  rules={[
                    { required: true, message: '请输入新的一级分类名称' },
                  ]}
                >
                  <Input
                    placeholder="请输入新的一级分类名称"
                    className={styles.formControl}
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item
              label="二级分类名称"
              name="level2Name"
              rules={[{ required: true, message: '请输入二级分类名称' }]}
            >
              <Input
                placeholder="请输入二级分类名称"
                className={styles.formControl}
              />
            </Form.Item>
          </>
        )}

        {/* 项目表单 */}
        {projectType === 'project' && (
          <>
            <Form.Item label="所属一类项目" required>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  name="projectParent1"
                  noStyle
                  rules={[
                    {
                      required: !showNewLevel1Input,
                      message: '请选择或输入所属一类项目',
                    },
                  ]}
                >
                  <Select
                    placeholder="请选择"
                    onChange={handleLevel1Change}
                    disabled={showNewLevel1Input}
                    className={styles.formControl}
                  >
                    {level1Nodes.map((node: any) => (
                      <Option key={node.ID} value={node.ID}>
                        {node.NAME}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  onClick={toggleNewLevel1Input}
                  className={styles.btnInline}
                >
                  {showNewLevel1Input ? '取消' : '新增'}
                </Button>
              </Space.Compact>
              {showNewLevel1Input && (
                <Form.Item
                  name="newProjectLevel1Name"
                  style={{ marginTop: 8 }}
                  rules={[
                    { required: true, message: '请输入新的一级分类名称' },
                  ]}
                >
                  <Input
                    placeholder="请输入新的一级分类名称"
                    className={styles.formControl}
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item label="所属二级分类" required>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  name="projectParent2"
                  noStyle
                  rules={[
                    {
                      required: !showNewLevel2Input,
                      message: '请选择或输入所属二级分类',
                    },
                  ]}
                >
                  <Select
                    placeholder="请先选择一级项目"
                    disabled={
                      showNewLevel2Input ||
                      (!currentLevel2Options.length && !showNewLevel1Input)
                    }
                    className={styles.formControl}
                  >
                    {currentLevel2Options.map((option) => (
                      <Option key={option.ID} value={option.ID}>
                        {option.NAME}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  onClick={toggleNewLevel2Input}
                  className={styles.btnInline}
                  disabled={
                    !showNewLevel1Input && !form.getFieldValue('projectParent1')
                  } // Disable if L1 not selected (unless L1 is new)
                >
                  {showNewLevel2Input ? '取消' : '新增'}
                </Button>
              </Space.Compact>
              {showNewLevel2Input && (
                <Form.Item
                  name="newProjectLevel2Name"
                  style={{ marginTop: 8 }}
                  rules={[
                    { required: true, message: '请输入新的二级分类名称' },
                  ]}
                >
                  <Input
                    placeholder="请输入新的二级分类名称"
                    className={styles.formControl}
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item
              label="项目名称"
              name="projectName"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="XXXXX" className={styles.formControl} />
            </Form.Item>
            <Form.Item label="项目uuid" name="projectUuid">
              <Input
                placeholder="yy0911-zuizhong"
                className={styles.formControl}
              />
            </Form.Item>
          </>
        )}

        <div className={styles.formActions}>
          <Button
            type="primary"
            onClick={handleSave}
            className={styles.btnSave}
          >
            保存
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddProject;
