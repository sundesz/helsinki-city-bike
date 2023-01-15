import { Col, Container, Row, Stack, Table } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorPage from '../../components/Layout/ErrorPage';
import Loading from '../../components/Layout/Loading';
import {
  IStationExtraInfo,
  IStationReport,
  ITopStation,
} from '../../types/station';
import { meterToKm } from '../../utils';
import Map from './Map';
import { useGetSingleStationQuery } from './stationApiSlice';

const SingleStation = () => {
  const navigate = useNavigate();
  const { stationId } = useParams() as { stationId: string };

  const {
    data: station,
    isError,
    isLoading,
    error,
  } = useGetSingleStationQuery(stationId);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage error={error} />;
  }

  if (!station?.data) {
    return <div>No data </div>;
  }

  const topDestination = (
    name: string,
    top5Destination: ITopStation[] | undefined
  ) => {
    return (
      <Table striped>
        <thead>
          <tr>
            <th>Top 5 {name} Station</th>
          </tr>
        </thead>
        <tbody>
          {top5Destination !== undefined && top5Destination.length ? (
            top5Destination.map((station) => (
              <tr key={station.stationId}>
                <td>
                  <Link to={`/station/${station.stationId}`}>
                    {station.nameFi}
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No data found</td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  const stationReport = (
    name: string,
    stationReport: IStationReport[] | undefined
  ) => {
    return (
      <Table striped>
        <thead>
          <tr>
            <th colSpan={3}>{name} report</th>
          </tr>
          <tr>
            <th>Year</th>
            <th>Month</th>
            <th>Total journey</th>
          </tr>
        </thead>
        <tbody>
          {stationReport !== undefined && stationReport.length ? (
            stationReport.map((station) => (
              <tr key={`${station.year}-${station.month}`}>
                <td>{station.year}</td>
                <td>{station.month}</td>
                <td>{station.totalJourney}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No data found</td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  const stationAvgJourney = (
    name: string,
    station: IStationExtraInfo | undefined
  ) => {
    return (
      <Table striped>
        <thead>
          <tr>
            <th>{name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Total journey</th>
            <td>{station?.totalJourney}</td>
          </tr>
          <tr>
            <th>Average distance</th>
            <td>{station ? meterToKm(station.avgDistance) : ''}</td>
          </tr>
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Stack direction="horizontal" className="justify-content-between">
        <div className="page-header">Station info</div>
        <div onClick={() => navigate(-1)} className="go-back">
          &#8249; Go back
        </div>
      </Stack>

      <br />
      <Row>
        <Col xs={1}>
          <b>Name:</b>
        </Col>
        <Col>{station.data.nameFi}</Col>
      </Row>
      <Row>
        <Col xs={1}>
          <b>Address:</b>
        </Col>
        <Col>{station.data.addressFi}</Col>
      </Row>
      <Row>
        <Col xs={1}>
          <b>City:</b>
        </Col>
        <Col>{station.data.cityFi}</Col>
      </Row>

      <br />
      <Stack direction="horizontal" gap={3}>
        {stationAvgJourney('Departure detail', station.data.departureStation)}

        <div className="vr" />
        {stationAvgJourney('Return detail', station.data.returnStation)}
      </Stack>

      <Stack direction="horizontal" gap={3}>
        {stationReport('Departure', station.data.departureStationReport)}

        <div className="vr" />

        {stationReport('Return', station.data.returnStationReport)}
      </Stack>
      <br />
      <Stack direction="horizontal" gap={3}>
        {topDestination('Departure', station.data.top5Departure)}

        <div className="vr" />

        {topDestination('Return', station.data.top5Return)}
      </Stack>

      <br />
      <Map posX={Number(station.data.posX)} posY={Number(station.data.posY)} />
    </Container>
  );
};

export default SingleStation;
