import { useState } from 'react';
import ErrorPage from '../../components/Layout/ErrorPage';
import Loading from '../../components/Layout/Loading';
import { useSearchQuery } from '../../hooks/useSearchQuery';
import AppPagination from '../Pagination';
import { useGetJourneyQuery } from './journeyApiSlice';
import JourneyFilter from './JourneyFilter';
import JourneyList from './JourneyList';

const Journey = () => {
  const { pageNumber, filterName, filterValue, orderBy, orderDir } =
    useSearchQuery({ filterName: 'departure_station_name' });

  const [page, setPage] = useState<number>(Number(pageNumber));
  const [filterColumn, setFilterColumn] = useState<string>(filterName);
  const [filterText, setFilterText] = useState<string>(filterValue);

  const {
    data: journeyData,
    isLoading,
    isError,
    error,
  } = useGetJourneyQuery({
    page,
    filterName: filterColumn,
    filterValue,
    orderBy,
    orderDir,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    <ErrorPage error={error} />;
  }

  if (!journeyData?.data) {
    return <div>No data </div>;
  }

  return (
    <>
      <div className="page-header">Journey List</div>
      <JourneyFilter
        filterText={filterText}
        filterColumn={filterColumn}
        setFilterColumn={setFilterColumn}
        setFilterText={setFilterText}
        setPage={setPage}
      />

      <AppPagination
        pageType="journey"
        totalPage={journeyData.totalPage}
        currentPage={journeyData.currentPage}
        setPage={setPage}
      />

      <JourneyList data={journeyData.data} />

      <AppPagination
        pageType="journey"
        totalPage={journeyData.totalPage}
        currentPage={journeyData.currentPage}
        setPage={setPage}
      />
    </>
  );
};

export default Journey;
