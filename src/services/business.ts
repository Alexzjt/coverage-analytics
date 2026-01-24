import { request } from '@umijs/max';

export interface TreeData {
  ID: string;
  NAME: string;
  PARENTID?: string;
  UUID?: string;
  jumpUrl?: string;
}

export interface ChartData {
  LEVEL3COUNT?: number;
  NAME?: string;
  MONTH?: string;
  COUNT?: number;
  LINECOVERAGE?: string;
  BRANCHCOVERAGE?: string;
  CREATETIME?: string;
}

export async function getBusinessTree() {
  return request<{ responseData: TreeData[] }>('/api/business/tree', {
    method: 'GET',
  });
}

export async function getChartData(type: 1 | 2 | 3 | 4) {
  return request<{ responseData: { data: ChartData[] } }>(
    '/api/business/chart',
    {
      method: 'GET',
      params: { lx: type },
    },
  );
}

export interface AddProjectParams {
  level: number;
  name: string;
  upid?: string;
  uuid?: string;
}

export async function addProjectInfo(params: AddProjectParams) {
  return request<any>('/api/business/project/info', {
    method: 'GET',
    params,
  });
}

export interface ProjectDetailItem {
  RN: number;
  NAME: string;
  PARENTNAME: string;
  GRANDPARENTNAME: string;
  LINECOVERAGE: string;
  BRANCHCOVERAGE: string;
  CREATETIME: string;
  jumpUrl?: string;
}

export interface GetProjectDetailsParams {
  projectName?: string;
  firstLevelCategory?: string;
  sortby?: string;
  order?: number; // 1 or 2
}

export async function getProjectDetails(params: GetProjectDetailsParams) {
  return request<{ responseData: ProjectDetailItem[] }>(
    '/api/business/project/details/all',
    {
      method: 'GET',
      params,
    },
  );
}
