import { Col, Container, Row, Stack } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorPage from '../../components/Layout/ErrorPage';
import Loading from '../../components/Layout/Loading';
import { getDateInLocal, getUrl, meterToKm, secondsToHour } from '../../utils';
import { useGetSingleJourneyQuery } from './journeyApiSlice';

const SingleJourney = () => {
  const navigate = useNavigate();
  const { journeyId } = useParams() as { journeyId: string };

  const {
    data: journey,
    isError,
    isLoading,
    error,
  } = useGetSingleJourneyQuery(journeyId);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage error={error} />;
  }

  if (!journey?.data) {
    return <div>No data </div>;
  }

  return (
    <Container>
      <Stack direction="horizontal" className="justify-content-between">
        <div className="page-header">Journey detail</div>
        <div onClick={() => navigate(-1)} className="go-back">
          &#8249; Go back
        </div>
      </Stack>

      <br />
      <Row>
        <Col xs={3}>
          <b>Departure from :</b>
        </Col>
        <Col>
          <Link
            to={getUrl('station', journey.data.departureStationId.toString())}
          >
            {journey.data.departureStationName}
          </Link>
          <span className="px-3">at</span>
          {getDateInLocal(journey.data.departureDateTime)}
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <b>Return to :</b>
        </Col>
        <Col>
          <Link to={getUrl('station', journey.data.returnStationId.toString())}>
            {journey.data.returnStationName}
          </Link>
          <span className="px-3">at</span>
          {getDateInLocal(journey.data.returnDateTime)}
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <b>Distance covered :</b>
        </Col>
        <Col>{meterToKm(journey.data.distanceCovered)}</Col>
      </Row>

      <Row>
        <Col xs={3}>
          <b>Duration :</b>
        </Col>
        <Col>{secondsToHour(Number(journey.data.duration))}</Col>
      </Row>
    </Container>
  );
};

export default SingleJourney;
