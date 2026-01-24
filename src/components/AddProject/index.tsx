import { AddProjectParams, TreeData } from '@/services/business';
import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './index.less';

const { Option } = Select;

interface AddProjectProps {
  open: boolean;
  onCancel: () => void;
  onSave: (data: AddProjectParams) => void;
  treeData: TreeData[];
}

const AddProject: React.FC<AddProjectProps> = ({ open, onCancel, onSave, treeData }) => {
  const [form] = Form.useForm();
  const [projectType, setProjectType] = useState<string>('');
  const [currentLevel2Options, setCurrentLevel2Options] = useState<TreeData[]>([]);

  // Filter Level 1 Nodes
  const level1Nodes = treeData.filter((node) => !node.PARENTID);

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value);
    form.setFieldsValue({
      level2Parent: undefined,
      projectParent1: undefined,
      projectParent2: undefined,
    });
    setCurrentLevel2Options([]);
  };

  const handleLevel1Change = (value: string) => {
    // value is ID
    if (value) {
      const children = treeData.filter((node) => node.PARENTID === value);
      setCurrentLevel2Options(children);
    } else {
      setCurrentLevel2Options([]);
    }
    // Reset level 2 selection if level 1 changes
    form.setFieldsValue({
      projectParent2: undefined,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setProjectType('');
    setCurrentLevel2Options([]);
    onCancel();
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      let data: AddProjectParams | null = null;

      if (projectType === 'level1') {
        data = { level: 1, name: values.level1Name };
      } else if (projectType === 'level2') {
        data = {
          level: 2,
          upid: values.level2Parent,
          name: values.level2Name,
        };
      } else if (projectType === 'project') {
        data = {
          level: 3,
          upid: values.projectParent2,
          name: values.projectName,
          uuid: values.projectUuid || '',
        };
      }

      if (data) {
        onSave(data);
        handleCancel();
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
            <Form.Item
              label="所属一类项目"
              name="level2Parent"
              rules={[{ required: true, message: '请选择所属一类项目' }]}
            >
              <Select
                placeholder="请选择"
                className={styles.formControl}
              >
                {level1Nodes.map(node => (
                  <Option key={node.ID} value={node.ID}>{node.NAME}</Option>
                ))}
              </Select>
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
            <Form.Item
              label="所属一类项目"
              name="projectParent1"
              rules={[{ required: true, message: '请选择所属一类项目' }]}
            >
              <Select
                placeholder="请选择"
                onChange={handleLevel1Change}
                className={styles.formControl}
              >
                {level1Nodes.map(node => (
                  <Option key={node.ID} value={node.ID}>{node.NAME}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="所属二级分类"
              name="projectParent2"
              rules={[{ required: true, message: '请选择所属二级分类' }]}
            >
              <Select
                placeholder="请先选择一级项目"
                disabled={!currentLevel2Options.length}
                className={styles.formControl}
              >
                {currentLevel2Options.map((option) => (
                  <Option key={option.ID} value={option.ID}>
                    {option.NAME}
                  </Option>
                ))}
              </Select>
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
