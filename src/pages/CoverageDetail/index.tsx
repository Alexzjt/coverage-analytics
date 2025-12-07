import {
  ActionType,
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import React, { useRef } from 'react';

const TableList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      formItemProps: {
        label: '项目名称(关键字)',
      },
    },
    {
      title: '所属一级分类',
      dataIndex: 'firstLevel',
      valueType: 'select',
    },
    {
      title: '所属二级分类',
      dataIndex: 'secondLevel',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '行覆盖率',
      dataIndex: 'lineCoverage',
      hideInSearch: true,
    },
    {
      title: '分支覆盖率',
      dataIndex: 'branchCoverage',
      hideInSearch: true,
    },
  ];

  return (
    <PageContainer
      header={{
        title: '覆盖率详情',
      }}
    >
      <ProTable<API.UserInfo>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        request={async (params, sorter, filter) => {
          console.log(params, sorter, filter);
          // const { data, success } = await queryUserList({
          //   ...params,
          //   // FIXME: remove @ts-ignore
          //   // @ts-ignore
          //   sorter,
          //   filter,
          // });
          // return {
          //   data: data?.list || [],
          //   success,
          // };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
