import { Button, Form, Input, Modal, Select, Space } from 'antd';
import React, { useState } from 'react';
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
  const [level2Options, setLevel2Options] = useState<string[]>([]);

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value);
    setShowNewLevel1Input(false);
    setShowNewLevel2Input(false);
    form.setFieldsValue({
      level2Parent: undefined,
      projectParent1: undefined,
      projectParent2: undefined,
    });
    setLevel2Options([]);
  };

  const handleLevel1Change = (value: string) => {
    setShowNewLevel1Input(false);
    if (value) {
      // 根据一级分类更新二级分类选项
      const options: Record<string, string[]> = {
        基础运营: ['首页', '客群圈选'],
        金融中心: ['金融产品', '投资管理'],
        内容管理平台: ['内容编辑', '内容审核'],
      };
      setLevel2Options(options[value] || []);
    } else {
      setLevel2Options([]);
    }
  };

  const toggleNewLevel1Input = () => {
    setShowNewLevel1Input(!showNewLevel1Input);
    if (!showNewLevel1Input) {
      form.setFieldsValue({
        level2Parent: undefined,
        projectParent1: undefined,
      });
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
    setLevel2Options([]);
    onCancel();
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      let data: any = {};

      if (projectType === 'level1') {
        data = { type: 'level1', name: values.level1Name };
      } else if (projectType === 'level2') {
        const parent = showNewLevel1Input
          ? values.newLevel1Name
          : values.level2Parent;
        data = {
          type: 'level2',
          parent: parent,
          name: values.level2Name,
        };
      } else if (projectType === 'project') {
        const parent1 = showNewLevel1Input
          ? values.newProjectLevel1Name
          : values.projectParent1;
        const parent2 = showNewLevel2Input
          ? values.newProjectLevel2Name
          : values.projectParent2;
        data = {
          type: 'project',
          parent1: parent1,
          parent2: parent2,
          name: values.projectName,
          uuid: values.projectUuid || '',
        };
      }

      onSave(data);
      handleCancel();
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
                    <Option value="基础运营">基础运营</Option>
                    <Option value="金融中心">金融中心</Option>
                    <Option value="内容管理平台">内容管理平台</Option>
                  </Select>
                </Form.Item>
                <Button
                  onClick={toggleNewLevel1Input}
                  className={styles.btnInline}
                >
                  新增
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
                    <Option value="基础运营">基础运营</Option>
                    <Option value="金融中心">金融中心</Option>
                    <Option value="内容管理平台">内容管理平台</Option>
                  </Select>
                </Form.Item>
                <Button
                  onClick={toggleNewLevel1Input}
                  className={styles.btnInline}
                >
                  新增
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
                    disabled={showNewLevel2Input || !level2Options.length}
                    className={styles.formControl}
                  >
                    {level2Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  onClick={toggleNewLevel2Input}
                  className={styles.btnInline}
                >
                  新增
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
