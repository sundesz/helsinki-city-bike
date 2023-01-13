import { Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSearchQuery } from '../hooks/useSearchQuery';
import { OrderDir, PageType } from '../types';
import { JourneyOrder } from '../types/journey';
import { StationOrder } from '../types/station';

/**
 *
 * @param colSpan
 * @returns
 */
export const tableNoDataFound = (colSpan: number): JSX.Element => {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center">
        No Data found
      </td>
    </tr>
  );
};

/**
 *
 * @param columnName
 * @returns
 */
export const tableHeaderData = (pageType: PageType, columnName: string) => {
  const { pageNumber, filterName, filterValue, orderBy, orderDir } =
    useSearchQuery({});

  const realTableColumnName: string =
    pageType === 'journey'
      ? JourneyOrder[columnName as keyof typeof JourneyOrder]
      : StationOrder[columnName as keyof typeof StationOrder];

  const generateLinkForOrder = (orderBy: string, orderDir: OrderDir) => {
    return `/${pageType}/?page=${pageNumber}&name=${filterName}&value=${filterValue}&orderBy=${realTableColumnName}&orderDir=${orderDir}`;
  };

  const isActive = orderBy === realTableColumnName;

  return (
    <Stack direction="horizontal" gap={2}>
      {columnName}
      <Stack direction="vertical">
        <span
          className={`orderby-up ${
            orderDir === 'asc' && isActive ? 'active' : ''
          }`}
          title="order asc"
        >
          <Link to={generateLinkForOrder(columnName, 'asc')}>&#9652;</Link>
        </span>
        <span
          className={`orderby-down ${
            orderDir === 'desc' && isActive ? 'active' : ''
          }`}
          title="order desc"
        >
          <Link to={generateLinkForOrder(columnName, 'desc')}>&#9662;</Link>
        </span>
      </Stack>
    </Stack>
  );
};
