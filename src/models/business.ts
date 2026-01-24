
import { getBusinessTree, TreeData } from '@/services/business';
import { useState, useCallback, useEffect } from 'react';

export default () => {
    const [treeData, setTreeData] = useState<TreeData[]>([]);

    const refreshTree = useCallback(async () => {
        try {
            const res = await getBusinessTree();
            if (res?.responseData) {
                setTreeData(res.responseData);
            }
        } catch (error) {
            console.error('Failed to fetch tree data', error);
        }
    }, []);

    useEffect(() => {
        refreshTree();
    }, [refreshTree]);

    return {
        treeData,
        refreshTree,
    };
};
