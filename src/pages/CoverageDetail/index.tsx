import {
  ActionType,
  PageContainer,
  ProColumns, // 使用 ProColumns 类型定义更准确
  ProTable,
} from '@ant-design/pro-components';
import React, { useRef } from 'react';

// 1. 定义数据类型
interface DataItem {
  id: string;
  projectName: string;
  firstLevel: string;
  secondLevel: string;
  createTime: string;
  lineCoverage: number;
  branchCoverage: number;
}

// 2. 生成 20 条 Mock 数据
const MOCK_DATA: DataItem[] = Array.from({ length: 20 }).map((_, i) => {
  const categories = ['基础架构', '业务前端', '数据中台', 'AI 研发'];
  const subCategories = ['组件库', '营销活动', '数据大屏', '模型训练'];

  return {
    id: `${i + 1}`,
    projectName: `项目_${i + 1}`,
    firstLevel: categories[i % 4],
    secondLevel: subCategories[i % 4],
    // 模拟不同的时间
    createTime:
      new Date(new Date().getTime() - Math.floor(Math.random() * 10000000000))
        .toISOString()
        .split('T')[0] +
      ' ' +
      new Date().toTimeString().split(' ')[0],
    // 模拟不同的覆盖率 (0-100)
    lineCoverage: Number((Math.random() * 100).toFixed(2)),
    branchCoverage: Number((Math.random() * 100).toFixed(2)),
  };
});

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<DataItem>[] = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      formItemProps: {
        label: '项目名称(关键字)',
      },
      sorter: true,
    },
    {
      title: '所属一级分类',
      dataIndex: 'firstLevel',
      valueType: 'select',
      // 增加 valueEnum 以便搜索栏下拉选择
      valueEnum: {
        基础架构: { text: '基础架构' },
        业务前端: { text: '业务前端' },
        数据中台: { text: '数据中台' },
        'AI 研发': { text: 'AI 研发' },
      },
      sorter: true, // 开启排序
    },
    {
      title: '所属二级分类',
      dataIndex: 'secondLevel',
      hideInSearch: true,
      sorter: true, // 开启排序
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true, // 开启排序
      width: 200,
    },
    {
      title: '行覆盖率',
      dataIndex: 'lineCoverage',
      hideInSearch: true,
      sorter: true, // 开启排序
      width: 150,
      render: (_, record) => `${record.lineCoverage}%`,
    },
    {
      title: '分支覆盖率',
      dataIndex: 'branchCoverage',
      hideInSearch: true,
      sorter: true, // 开启排序
      width: 150,
      render: (_, record) => `${record.branchCoverage}%`,
    },
  ];

  return (
    <PageContainer
      header={{
        title: '覆盖率详情',
      }}
    >
      <ProTable<DataItem>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        request={async (params, sorter, filter) => {
          console.log(
            'Request Params:',
            params,
            'Sorter:',
            sorter,
            'Filter:',
            filter,
          );

          let dataSource = [...MOCK_DATA];

          // 1. 过滤逻辑 (Filter)
          if (params.projectName) {
            dataSource = dataSource.filter((item) =>
              item.projectName.includes(params.projectName!),
            );
          }
          if (params.firstLevel) {
            dataSource = dataSource.filter(
              (item) => item.firstLevel === params.firstLevel,
            );
          }

          // 2. 排序逻辑 (Sort)
          // sorter 格式通常为: { createTime: 'ascend' } 或 {}
          const sortKeys = Object.keys(sorter);
          if (sortKeys.length > 0) {
            const key = sortKeys[0]; // 获取排序字段，例如 'lineCoverage'
            const order = sorter[key]; // 获取排序方式 'ascend' | 'descend'

            dataSource.sort((a, b) => {
              const valueA = a[key as keyof DataItem];
              const valueB = b[key as keyof DataItem];

              // 处理数字类型
              if (typeof valueA === 'number' && typeof valueB === 'number') {
                return order === 'ascend' ? valueA - valueB : valueB - valueA;
              }

              // 处理字符串或日期字符串
              const strA = String(valueA);
              const strB = String(valueB);
              if (order === 'ascend') {
                return strA.localeCompare(strB);
              } else {
                return strB.localeCompare(strA);
              }
            });
          }

          // 3. 分页逻辑 (Pagination)
          const current = params.current || 1;
          const pageSize = params.pageSize || 20;
          const total = dataSource.length;
          const startIndex = (current - 1) * pageSize;
          const endIndex = startIndex + pageSize;

          const pageData = dataSource.slice(startIndex, endIndex);

          return {
            data: pageData,
            success: true,
            total: total,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
