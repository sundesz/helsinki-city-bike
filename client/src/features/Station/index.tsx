import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppPagination from '../Pagination';
import { useGetStationsQuery } from './stationApiSlice';
import StationList from './StationList';

const Station = () => {
  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get('page') ?? 1;

  const [page, setPage] = useState<number>(Number(pageNumber));
  const {
    data: stationData,
    isLoading,
    isError,
    error,
  } = useGetStationsQuery(page);

  if (isLoading) {
    return <div>Loading ....</div>;
  }

  if (isError) {
    console.log(error);
    return null;
  }

  if (!stationData?.data) {
    return <div>No data </div>;
  }

  return (
    <>
      {/* <JourneyFilter /> */}

      <AppPagination
        pageType="station"
        totalPage={stationData.totalPage}
        currentPage={stationData.currentPage}
        setPage={setPage}
      />

      <StationList data={stationData.data} />

      <AppPagination
        pageType="station"
        totalPage={stationData.totalPage}
        currentPage={stationData.currentPage}
        setPage={setPage}
      />
    </>
  );
};

export default Station;
