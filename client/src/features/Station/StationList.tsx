import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IStation } from '../../types/station';
import { tableHeaderData, tableNoDataFound } from '../../utils/table';

interface IStationListProps {
  data: IStation[];
}
const StationList = ({ data }: IStationListProps) => {
  const listStationTableData = (station: IStation) => {
    return (
      <tr key={station.stationId}>
        <td>
          <Link to={`/station/${station.stationId}`}>{station.stationId}</Link>
        </td>
        <td>{station.nameFi}</td>
        <td>{station.addressFi}</td>
        <td>{station.cityFi}</td>
      </tr>
    );
  };

  return (
    <Table striped className="my-4">
      <thead>
        <tr>
          <th>{tableHeaderData('station', 'Station id')}</th>
          <th>{tableHeaderData('station', 'Name')}</th>
          <th>{tableHeaderData('station', 'Address')}</th>
          <th>{tableHeaderData('station', 'City')}</th>
        </tr>
      </thead>
      <tbody>
        {data.length
          ? data.map((station) => listStationTableData(station))
          : tableNoDataFound(4)}
      </tbody>
    </Table>
  );
};

export default StationList;
