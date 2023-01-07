import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IStation } from '../../types/station';

interface IStationListProps {
  data: IStation[];
}
const StationList = ({ data }: IStationListProps) => {
  return (
    <Table striped className="my-4">
      <thead>
        <tr>
          <th>Station id</th>
          <th>name</th>
          <th>address</th>
          <th>city</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ stationId, name, address, city }) => (
          <tr key={stationId}>
            <td>
              <Link to={`/station/${stationId}`}>{stationId}</Link>
            </td>
            <td>{name}</td>
            <td>{address}</td>
            <td>{city}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StationList;
