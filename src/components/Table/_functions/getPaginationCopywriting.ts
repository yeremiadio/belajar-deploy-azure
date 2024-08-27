type TPaginationCopywritingParams = {
    totalData: number;
    pageIndex: number;
    pageSize: number;
}

const getPaginationCopywriting = ({ totalData, pageIndex, pageSize }: TPaginationCopywritingParams): string => {
    const startIndex = (pageIndex - 1) * pageSize + 1;
    const endIndex = Math.min(pageIndex * pageSize, totalData);
    return `Showing ${startIndex}-${endIndex} of ${totalData}`;
};

export default getPaginationCopywriting