import { Col, Container, Row, Stack, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { IStationExtraInfo, ITopStation } from '../../types/station';
import Map from './Map';
import { useGetSingleStationQuery } from './stationApiSlice';

const SingleStation = () => {
  const { stationId } = useParams();

  const {
    data: station,
    isError,
    isLoading,
    error,
  } = useGetSingleStationQuery(stationId);

  if (isLoading) {
    return <div>Loading ....</div>;
  }

  if (isError) {
    console.log(error);
    return null;
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
          {top5Destination?.map((station) => (
            <tr key={station.stationId}>
              <td>
                <Link to={`/station/${station.stationId}`}>{station.name}</Link>
              </td>
            </tr>
          ))}
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
            <th>{name} total journey</th>
            <td>{station?.totalJourney}</td>
          </tr>
          <tr>
            <th>{name} average distance</th>
            <td>{station?.avgDistance}</td>
          </tr>
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <h2>Station info</h2>
      <br />
      <Row>
        <Col xs={1}>
          <b>Name:</b>
        </Col>
        <Col>{station.data.name}</Col>
      </Row>
      <Row>
        <Col xs={1}>
          <b>Address:</b>
        </Col>
        <Col>{station.data.address}</Col>
      </Row>
      <Row>
        <Col xs={1}>
          <b>City:</b>
        </Col>
        <Col>{station.data.city}</Col>
      </Row>

      <br />
      <Stack direction="horizontal" gap={3}>
        {stationAvgJourney('Departure', station.data.departureStation)}

        <div className="vr" />
        {stationAvgJourney('Return', station.data.returnStation)}
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
