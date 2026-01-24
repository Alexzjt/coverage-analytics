import {
  getProjectDetails,
  ProjectDetailItem,
} from '@/services/business';
import {
  ActionType,
  PageContainer,
  ProColumns, // 使用 ProColumns 类型定义更准确
  ProTable,
} from '@ant-design/pro-components';
import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams, useModel } from 'umi';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  let [searchParams] = useSearchParams();
  const [firstLevelOptions, setFirstLevelOptions] = useState<Record<string, { text: string }>>({});
  const { treeData } = useModel('business');

  useEffect(() => {
    if (treeData?.length > 0) {
      const options: Record<string, { text: string }> = {};
      treeData.forEach((item: any) => {
        if (!item.PARENTID) {
          options[item.NAME] = { text: item.NAME };
        }
      });
      setFirstLevelOptions(options);
    }
  }, [treeData]);


  const columns: ProColumns<ProjectDetailItem>[] = [
    {
      title: '项目名称',
      dataIndex: 'NAME',
      formItemProps: {
        label: '项目名称(关键字)',
      },
      sorter: true,
      defaultSortOrder: searchParams.get('sortBy') === 'name' ? 'descend' : undefined,
      render: (_, record) => {
        return record.jumpUrl ? <a href={record.jumpUrl} target="_blank" rel="noreferrer">{record.NAME}</a> : record.NAME;
      }
    },
    {
      title: '所属一级分类',
      dataIndex: 'GRANDPARENTNAME',
      valueType: 'select',
      valueEnum: firstLevelOptions,
      sorter: true, // 开启排序
      defaultSortOrder:
        searchParams.get('sortBy') === 'firstLevel' ? 'descend' : undefined,
    },
    {
      title: '所属二级分类',
      dataIndex: 'PARENTNAME',
      hideInSearch: true,
      sorter: true, // 开启排序
      defaultSortOrder: searchParams.get('sortBy') === 'parentName' ? 'descend' : undefined,
    },
    {
      title: '创建时间',
      dataIndex: 'CREATETIME',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true, // 开启排序
      width: 200,
      defaultSortOrder:
        searchParams.get('sortBy') === 'createTime' ? 'descend' : undefined,
    },
    {
      title: '行覆盖率',
      dataIndex: 'LINECOVERAGE',
      hideInSearch: true,
      sorter: true, // 开启排序
      width: 150,
      render: (_, record) => `${record.LINECOVERAGE}%`,
      defaultSortOrder:
        searchParams.get('sortBy') === 'lineCoverage' ? 'descend' : undefined,
    },
    {
      title: '分支覆盖率',
      dataIndex: 'BRANCHCOVERAGE',
      hideInSearch: true,
      sorter: true, // 开启排序
      width: 150,
      render: (_, record) => `${record.BRANCHCOVERAGE}%`,
      defaultSortOrder:
        searchParams.get('sortBy') === 'branchCoverage' ? 'descend' : undefined,
    },
  ];

  return (
    <PageContainer
      header={{
        title: '覆盖率详情',
      }}
    >
      <ProTable<ProjectDetailItem>
        actionRef={actionRef}
        rowKey="RN"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        request={async (params, sorter, filter) => {
          console.log('Request Params:', params, 'Sorter:', sorter, 'Filter:', filter);

          const apiParams: any = {
            projectName: params.NAME, // Use the correct dataIndex for search params? ProTable passes the key from columns.
            // Wait, dataIndex is NAME, but search param should be mapped.
            // ProTable uses the dataIndex as the key in 'params'. So params.NAME is the value.
            // But my API expects 'projectName'.
            // And params.GRANDPARENTNAME -> 'firstLevelCategory'.
          };

          // Map ProTable params to API params
          if (params.NAME) {
            apiParams.projectName = params.NAME;
          }
          if (params.GRANDPARENTNAME) {
            apiParams.firstLevelCategory = params.GRANDPARENTNAME;
          }

          // Handle Sorter
          // sorter can be {} or { field: 'ascend'/'descend' }
          const sortKeys = Object.keys(sorter);
          if (sortKeys.length > 0) {
            const key = sortKeys[0];
            const order = sorter[key];

            // Map column keys to API 'sortby' values
            const sortMap: Record<string, string> = {
              NAME: 'name',
              PARENTNAME: 'parentName',
              GRANDPARENTNAME: 'grandParentName',
              LINECOVERAGE: 'lineCoverage',
              BRANCHCOVERAGE: 'branchCoverage',
              CREATETIME: 'createtime'
            };

            apiParams.sortby = sortMap[key] || key;
            apiParams.order = order === 'ascend' ? 2 : 1; // 1 for desc (default? user said 1 or 2. "order(1或者2）". 
            // User said: "/api/business/project/details/all?sortby=name&order=1 - 按项目名称从高到低排序" -> 1 is DESC.
            // So ASC should be 2.
            // Default (no order param) is TGID ASC.
          }

          const res = await getProjectDetails(apiParams);
          let dataSource = res?.responseData || [];

          // Since API returns ALL data, we might need client-side pagination if standard Table pagination is expected.
          // Yet ProTable typically handles this if we return 'data' and 'total'. 
          // If we want client-side pagination with full data, we can slice it here.

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
