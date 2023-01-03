import DisplayData from '../DisplayData';
import AppPagination from '../Pagination';
import JourneyFilter from './JourneyFilter';

const JourneyList = () => {
  return (
    <>
      <JourneyFilter />
      {/* <div>Journey List</div> */}
      <DisplayData />

      <AppPagination />
    </>
  );
};

export default JourneyList;
