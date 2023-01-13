import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IJourney } from '../../types/journey';
import { getDateInLocal, meterToKm, secondsToHour } from '../../utils';
import { tableHeaderData, tableNoDataFound } from '../../utils/table';

interface IJourneyListProps {
  data: IJourney[];
}

const JourneyList = ({ data }: IJourneyListProps) => {
  const navigate = useNavigate();

  const tableRowClickHandler = (journeyId: string) => {
    navigate(`/journey/${journeyId}`);
  };

  const listJourneyTableData = (journey: IJourney) => {
    return (
      <tr
        className="t-row"
        key={journey.journeyId}
        onClick={() => tableRowClickHandler(journey.journeyId)}
      >
        <td>{journey.departureStationName}</td>
        <td>{getDateInLocal(journey.departureDateTime)}</td>
        <td>{journey.returnStationName}</td>
        <td>{getDateInLocal(journey.returnDateTime)}</td>
        <td>{meterToKm(journey.distanceCovered)}</td>
        <td>{secondsToHour(Number(journey.duration))}</td>
      </tr>
    );
  };

  return (
    <Table striped className="my-4">
      <thead>
        <tr>
          <th>{tableHeaderData('journey', 'Departure station')}</th>
          <th>{tableHeaderData('journey', 'Departure datetime')}</th>
          <th>{tableHeaderData('journey', 'Return station')}</th>
          <th>{tableHeaderData('journey', 'Return datetime')}</th>
          <th>{tableHeaderData('journey', 'Distance')}</th>
          <th>{tableHeaderData('journey', 'Duration')}</th>
        </tr>
      </thead>
      <tbody>
        {data.length
          ? data.map((journey) => listJourneyTableData(journey))
          : tableNoDataFound(6)}
      </tbody>
    </Table>
  );
};

export default JourneyList;
