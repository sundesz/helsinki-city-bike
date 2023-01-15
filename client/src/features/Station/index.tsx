import { useState } from 'react';
import ErrorPage from '../../components/Layout/ErrorPage';
import Loading from '../../components/Layout/Loading';
import { useSearchQuery } from '../../hooks/useSearchQuery';
import AppPagination from '../Pagination';
import { useGetStationsQuery } from './stationApiSlice';
import StationFilter from './StationFilter';
import StationList from './StationList';

const Station = () => {
  const { pageNumber, filterName, filterValue, orderBy, orderDir } =
    useSearchQuery({ filterName: 'name_fi' });

  const [page, setPage] = useState<number>(Number(pageNumber));
  const [filterColumn, setFilterColumn] = useState<string>(filterName);
  const [filterText, setFilterText] = useState<string>(filterValue);
  const {
    data: stationData,
    isLoading,
    isError,
    error,
  } = useGetStationsQuery({ page, filterName, filterValue, orderBy, orderDir });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage error={error} />;
  }

  if (!stationData?.data) {
    return <div>No data </div>;
  }

  return (
    <>
      <div className="page-header">Station List</div>

      <StationFilter
        filterText={filterText}
        filterColumn={filterColumn}
        setFilterColumn={setFilterColumn}
        setFilterText={setFilterText}
        setPage={setPage}
      />

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
